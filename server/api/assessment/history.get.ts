import { defineEventHandler, getQuery } from 'h3'
import { storage } from '~/server/utils/storage'
import { db } from '~/server/utils/db'
import { getPillarScores } from '~/server/utils/scoring'
import { calculateOverallScore } from '~/utils/helpers.js'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const smeId = query.smeId || 3

  const storageData = await storage.get()
  
  const uniqueAssessments = storageData.assessments || []
  const mergedResponses = storageData.responses || []

  // Filter for this SME
  const smeAssessments = uniqueAssessments
    .filter((a: any) => String(a.sme_id) === String(smeId))
    .sort((a: any, b: any) => new Date(b.completed_at || b.started_at).getTime() - new Date(a.completed_at || a.started_at).getTime())

  // Format the history for the frontend
  const history = smeAssessments.map((assessment: any, index: number) => {
    const date = new Date(assessment.completed_at || assessment.started_at)
    
    // Calculate pillar scores for each assessment
    // Note: getPillarScores uses latest DB questions by default
    const currentQuestions = db.questions.findAll()
    const pillarScores = getPillarScores(assessment.id, assessment.questions || currentQuestions, mergedResponses, uniqueAssessments)
    
    // Get previous assessment for change calculation
    const prevAssessment = smeAssessments[index + 1]
    const currentTrueScore = calculateOverallScore(pillarScores)
    
    let change = null
    if (prevAssessment) {
      const prevScores = getPillarScores(prevAssessment.id, prevAssessment.questions || currentQuestions, mergedResponses, uniqueAssessments)
      change = currentTrueScore - calculateOverallScore(prevScores)
    }

    return {
      id: assessment.id,
      name: `Assessment #${smeAssessments.length - index}`,
      date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      score: currentTrueScore,
      change,
      isLatest: index === 0,
      topPillars: pillarScores.slice(0, 4).map((p: any) => ({
        name: p.pillar_name.split(' ')[0], // Shorten name for UI
        score: p.score
      })),
      pillars: pillarScores.map((p: any) => ({
        name: p.pillar_name,
        score: p.score
      }))
    }
  })

  return history
})
