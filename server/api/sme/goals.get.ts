import { defineEventHandler } from 'h3'
import { getSMEData, mockPillars } from '~/utils/mock-data'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))

  // TODO: Get actual user from session/auth
  // For now, default to SME ID 1 (Angkor Tech)
  const smeId = 1
  
  const smeData = getSMEData(smeId)
  
  if (!smeData) {
    throw createError({
      statusCode: 404,
      message: 'SME not found'
    })
  }

  // Return goals with pillar information
  const goalsWithPillars = smeData.goals.map(goal => {
    const pillar = mockPillars.find(p => p.id === goal.pillar_id)
    const pillarScore = smeData.pillarScores.find(ps => ps.pillar_id === goal.pillar_id)
    
    return {
      ...goal,
      pillar_name: pillar?.name || 'Unknown',
      current_score: pillarScore?.score || 0,
      target_score: 80, // Default target
      gap: pillarScore ? Math.max(0, 80 - pillarScore.score) : 0
    }
  })

  return {
    goals: goalsWithPillars,
    pillarScores: smeData.pillarScores,
    latestAssessment: smeData.latestAssessment
  }
})
