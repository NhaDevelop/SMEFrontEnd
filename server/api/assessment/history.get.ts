import { defineEventHandler, getQuery } from 'h3'
import { storage } from '~/server/utils/storage'
import { getPillarScores } from '~/utils/mock-data/assessments'
import { templateQuestions } from '~/utils/mock-data/template-questions'

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
    // Note: getPillarScores uses latest templateQuestions by default
    // In a real app we'd want the questions at time of assessment
    const pillarScores = getPillarScores(assessment.id, assessment.questions || templateQuestions, mergedResponses, uniqueAssessments)
    
    // Get previous assessment for change calculation
    const prevAssessment = smeAssessments[index + 1]
    const change = prevAssessment ? (assessment.total_score - prevAssessment.total_score) : null

    return {
      id: assessment.id,
      name: `Assessment #${smeAssessments.length - index}`,
      date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      score: assessment.total_score || 0,
      change,
      isLatest: index === 0,
      topPillars: pillarScores.slice(0, 4).map(p => ({
        name: p.pillar_name.split(' ')[0], // Shorten name for UI
        score: p.score
      })),
      pillars: pillarScores.map(p => ({
        name: p.pillar_name,
        score: p.score
      }))
    }
  })

  return history
})
