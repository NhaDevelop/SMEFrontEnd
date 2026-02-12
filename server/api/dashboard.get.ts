import { defineEventHandler } from 'h3'
import { getSMEData, mockPillars, mockAssessments, mockGoals } from '~/utils/mock-data'

// Helper to get risk level based on score
function getRiskLevel(score: number): string {
  if (score >= 70) return 'low'
  if (score >= 50) return 'medium'
  return 'high'
}

// Helper to calculate improvement potential
function getImprovementPotential(score: number): number {
  return Math.max(0, 100 - score)
}

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

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

  // Transform pillar scores to match dashboard format
  const pillars = smeData.pillarScores.map(pillar => {
    const pillarInfo = mockPillars.find(p => p.id === pillar.pillar_id)
    return {
      id: pillar.pillar_id,
      name: pillarInfo?.name || pillar.pillar_name,
      score: pillar.score,
      riskLevel: getRiskLevel(pillar.score),
      improvementPotential: getImprovementPotential(pillar.score)
    }
  })

  // Get assessment history for progress chart
  const assessmentHistory = smeData.assessmentHistory || []
  const progress = assessmentHistory.map((assessment, index) => {
    const date = new Date(assessment.completed_at!)
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      score: assessment.total_score || 0
    }
  })

  // If only one assessment, create a simple progress history
  if (progress.length === 1 && progress[0]) {
    const currentScore = progress[0].score
    progress.unshift(
      { month: 'Jan', score: Math.max(0, currentScore - 20) },
      { month: 'Feb', score: Math.max(0, currentScore - 15) },
      { month: 'Mar', score: Math.max(0, currentScore - 10) },
      { month: 'Apr', score: Math.max(0, currentScore - 5) }
    )
  }

  // Transform goals into recommended actions
  const activeGoals = smeData.goals.filter(g => g.status === 'ACTIVE')
  const actions = activeGoals.map(goal => {
    const pillarInfo = mockPillars.find(p => p.id === goal.pillar_id)
    const pillarScore = smeData.pillarScores.find(ps => ps.pillar_id === goal.pillar_id)
    
    return {
      id: goal.id,
      title: goal.title,
      description: goal.description,
      priority: goal.progress_percentage < 30 ? 'high' : goal.progress_percentage < 70 ? 'medium' : 'low',
      pillar: pillarInfo?.name || 'General',
      impact: pillarScore ? Math.round(100 - pillarScore.score) : 10,
      status: goal.progress_percentage === 0 ? 'pending' : 'in_progress'
    }
  })

  return {
    pillars,
    progress,
    actions
  }
})
