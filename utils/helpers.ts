/**
 * helpers.ts — Shared utility functions (typed version of helpers.js)
 *
 * MVVM Layer: utility (no Vue, no Pinia dependencies)
 */

export interface ScoreThreshold {
  id: string
  label: string
  min: number
  max?: number
  color?: string
}

/**
 * Input shape for pillar calculation helpers.
 * (Named PillarInput to avoid conflict with PillarScore in sme-data.ts)
 */
export interface PillarInput {
  id?: string | number
  name?: string
  score?: number
  weight?: number
  improvementPotential?: number
}

// ─── Score / Risk Helpers ────────────────────────────────────────────────────

/**
 * Map a numeric score to the matching threshold label.
 * Falls back to hard-coded defaults if no thresholds are provided.
 */
export const getRiskLevel = (score: number, thresholds?: ScoreThreshold[]): string => {
  if (thresholds && thresholds.length > 0) {
    const sorted = [...thresholds].sort((a, b) => b.min - a.min)
    for (const t of sorted) {
      if (score >= t.min) return t.label
    }
  }
  if (score >= 80) return 'Investor Ready'
  if (score >= 60) return 'Near Ready'
  if (score >= 40) return 'Early Stage'
  return 'Pre-Investment'
}

/** Alias for getRiskLevel — used in some places as "readiness status". */
export const getReadinessStatus = (score: number, thresholds?: ScoreThreshold[]): string =>
  getRiskLevel(score, thresholds)

/**
 * Maps a numeric score or a standard framework readiness status string to Financial Risk (Safe, Low, Medium, High).
 * It dynamically maps to the sorted framework thresholds (e.g. 1st threshold = Safe, 4th = High)
 */
export const getFinancialRiskLevel = (scoreOrStatus: number | string, thresholds?: ScoreThreshold[]): string => {
  if (typeof scoreOrStatus === 'string') {
    const l = scoreOrStatus.toLowerCase()
    if (l.includes('investor ready') || l.includes('safe')) return 'Safe to Invest'
    if (l.includes('near ready') || l.includes('low')) return 'Low Risk'
    if (l.includes('early stage') || l.includes('medium')) return 'Medium Risk'
    return 'High Risk'
  }

  const score = scoreOrStatus
  if (thresholds && thresholds.length >= 4) {
    const sorted = [...thresholds].sort((a, b) => b.min - a.min)
    if (score >= (sorted[0]?.min ?? 80)) return 'Safe to Invest'
    if (score >= (sorted[1]?.min ?? 60)) return 'Low Risk'
    if (score >= (sorted[2]?.min ?? 40)) return 'Medium Risk'
    return 'High Risk'
  }
  // Fallbacks if no thresholds provided
  if (score >= 80) return 'Safe to Invest'
  if (score >= 60) return 'Low Risk'
  if (score >= 40) return 'Medium Risk'
  return 'High Risk'
}

/**
 * Calculate overall score from an array of pillar objects.
 * Uses weighted average when weight is available, otherwise simple average.
 */
export const calculateOverallScore = (pillars: PillarInput[]): number => {
  if (!pillars || pillars.length === 0) return 0

  const hasWeights = pillars.some(p => p.weight !== undefined && p.weight !== null)

  if (hasWeights) {
    let weightedSum = 0
    let totalWeight = 0
    pillars.forEach(p => {
      const w = p.weight ?? 0
      weightedSum += (p.score ?? 0) * w
      totalWeight += w
    })
    if (totalWeight > 0) return Math.round(weightedSum / totalWeight)
  }

  const total = pillars.reduce((sum, p) => sum + (p.score ?? 0), 0)
  return Math.round(total / pillars.length)
}

/**
 * Sum up all improvementPotential values across pillars.
 * Represents the total points that could be gained.
 */
export const calculateGrowthPotential = (pillars: PillarInput[]): number => {
  if (!pillars || pillars.length === 0) return 0
  return pillars.reduce((sum, p) => sum + (p.improvementPotential ?? 0), 0)
}
