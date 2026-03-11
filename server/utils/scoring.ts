import { db } from '~/server/utils/db'

export function getPillarScores(
  assessmentId: number | string,
  providedQuestions: any[] | undefined,
  allResponses: any[],
  allAssessments: any[]
) {
  // 1. Filter responses for this assessment
  const responses = allResponses.filter((r: any) => String(r.assessment_id) === String(assessmentId))
  
  // 2. Find the assessment to see if it has overridden questions mapped to it
  const assessment = allAssessments.find((a: any) => String(a.id) === String(assessmentId))
  
  const liveSettings = db.settings.get()
  const livePillars = liveSettings.pillars || []
  
  // Try to use assessment questions, fallback to provided admin questions, fallback to DB
  const allQuestions = (assessment as any)?.questions || (providedQuestions && providedQuestions.length > 0 ? providedQuestions : db.questions.findAll())
  
  const pillarScores: Record<string, { total: number, max: number }> = {}
  
  // Initialize all pillars with 0 to ensure they appear even if empty
  livePillars.forEach((p: any) => {
      pillarScores[p.id] = { total: 0, max: 0 }
  })

  responses.forEach(response => {
    const question = allQuestions.find((q: any) => q.id === response.question_id)
    if (!question) return
    
    // Map pillarId from question securely against live database strings
    let derivedPillarId = ''
    
    if (typeof question.pillar_id === 'string' || typeof question.pillarId === 'string') {
      const rawStr = String(question.pillar_id || question.pillarId || '')
      const cleanInput = rawStr.toLowerCase().replace(/[\s\-_]/g, '')
      
      // 1. Try mapping legacy shortcodes
      const pillarMap: Record<string, string> = {
        'team': 'team', 'business': 'business_model', 'market': 'market', 'finance': 'financials',
        'ops': 'operations', 'legal': 'legal', 'data': 'data', 'growth': 'growth'
      }
      const shortcodeMatch = pillarMap[cleanInput.replace(/model|readiness|maturity|governance|scalability|traction|leadership/g, '').trim()]
      
      // 2. Aggressively fuzzy match against active DB dictionary IDs and Names
      const fuzzyMatch = livePillars.find((p: any) => {
        const cleanDbId = String(p.id).toLowerCase().replace(/[\s\-_]/g, '')
        const cleanDbName = String(p.name).toLowerCase().replace(/[\s\-_&]/g, '')
        return cleanDbId === cleanInput || cleanDbName === cleanInput || cleanDbId.includes(cleanInput) || cleanDbName.includes(cleanInput)
      })

      derivedPillarId = fuzzyMatch ? fuzzyMatch.id : (shortcodeMatch || rawStr)
    } else {
      derivedPillarId = question.pillar_id || question.pillarId || 'team'
    }
    
    // Final safety validation
    const matchingPillar = livePillars.find((p: any) => String(p.id).toLowerCase() === String(derivedPillarId).toLowerCase())
    const targetId = matchingPillar ? matchingPillar.id : (livePillars.length > 0 ? livePillars[0].id : derivedPillarId)

    if (!pillarScores[targetId]) {
      pillarScores[targetId] = { total: 0, max: 0 }
    }
    
    const pillarScore = pillarScores[targetId]!
    const weight = question.weight || 10
    pillarScore.total += response.score_awarded * weight
    pillarScore.max += 10 * weight
  })
  
  return Object.entries(pillarScores).map(([pillarId, scores]) => {
    const pillar = livePillars.find((p: any) => String(p.id) === String(pillarId))
    const calculatedScore = scores.max > 0 ? Math.round((scores.total / scores.max) * 100) : 0
    return {
      pillar_id: pillarId,
      pillar_name: pillar?.name || pillarId,
      score: calculatedScore,
      weight: pillar?.weight || 0
    }
  })
}
