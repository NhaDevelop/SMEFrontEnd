import { RISK_LEVELS, RISK_THRESHOLDS } from './constants'

export const getRiskLevel = (score) => {
  if (score >= RISK_THRESHOLDS.LOW) return RISK_LEVELS.LOW
  if (score >= RISK_THRESHOLDS.MEDIUM) return RISK_LEVELS.MEDIUM
  return RISK_LEVELS.HIGH
}

export const calculateOverallScore = (pillars) => {
  if (!pillars || pillars.length === 0) return 0
  const total = pillars.reduce((sum, p) => sum + p.score, 0)
  return Math.round(total / pillars.length)
}

export const calculateGrowthPotential = (pillars) => {
  if (!pillars || pillars.length === 0) return 0
  const total = pillars.reduce((sum, p) => sum + (p.improvementPotential || 0), 0)
  return Math.round(total / pillars.length)
}

export const getReadinessStatus = (score) => {
  if (score >= 70) return 'Investment Ready'
  if (score >= 50) return 'Developing'
  return 'Needs Improvement'
}
