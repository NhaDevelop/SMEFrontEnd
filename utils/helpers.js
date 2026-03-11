import { RISK_LEVELS, RISK_THRESHOLDS } from './constants.js'

export const getRiskLevel = (score, thresholds) => {
  if (thresholds && thresholds.length > 0) {
    const sorted = [...thresholds].sort((a, b) => b.min - a.min)
    if (score >= sorted[0]?.min) return RISK_LEVELS.LOW
    if (sorted.length >= 3 && score >= sorted[sorted.length - 2]?.min) return RISK_LEVELS.MEDIUM
    return RISK_LEVELS.HIGH
  }
  if (score >= RISK_THRESHOLDS.LOW) return RISK_LEVELS.LOW
  if (score >= RISK_THRESHOLDS.MEDIUM) return RISK_LEVELS.MEDIUM
  return RISK_LEVELS.HIGH
}

export const calculateOverallScore = (pillars) => {
  if (!pillars || pillars.length === 0) return 0
  
  // Check if we should use weighted average
  const hasWeights = pillars.some(p => p.weight !== undefined && p.weight !== null)
  
  if (hasWeights) {
    let weightedSum = 0
    let totalWeight = 0
    pillars.forEach(p => {
      // Use weight if available, otherwise 0
      const w = p.weight !== undefined ? p.weight : 0
      const score = p.score || 0
      weightedSum += score * w
      totalWeight += w
    })
    
    // If we have total weight > 0, return weighted average
    // Weights are usually items like 0.15, 0.10, etc. or points. 
    // Either way, SUM(score * weight) / SUM(weight) works.
    if (totalWeight > 0) {
      return Math.round(weightedSum / totalWeight)
    }
  }

  // Fallback to simple average
  const total = pillars.reduce((sum, p) => sum + (p.score || 0), 0)
  return Math.round(total / pillars.length)
}

export const calculateGrowthPotential = (pillars) => {
  if (!pillars || pillars.length === 0) return 0
  // Sum up all improvement potential points to show total target increase available
  const total = pillars.reduce((sum, p) => sum + (p.improvementPotential || 0), 0)
  return total
}

export const getReadinessStatus = (score, thresholds) => {
  if (thresholds && thresholds.length > 0) {
    const sorted = [...thresholds].sort((a, b) => b.min - a.min)
    for (const t of sorted) {
      if (score >= t.min) return t.label
    }
  }
  if (score >= 70) return 'Investment Ready'
  if (score >= 50) return 'Developing'
  return 'Needs Improvement'
}
