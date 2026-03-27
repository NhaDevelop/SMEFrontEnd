/**
 * Centralized SME data utilities and global color system
 * This ensures consistent pillar scores, colors, and styling across all views
 */

// ============================================================================
// GLOBAL COLOR SYSTEM
// ============================================================================

/**
 * Risk Level Colors
 * Used for: Risk badges, scatter plot dots, risk indicators
 */
export const RISK_COLORS = {
  Low: {
    bg: 'bg-emerald-500',
    bgLight: 'bg-emerald-50',
    text: 'text-emerald-700',
    textDark: 'text-emerald-600',
    border: 'border-emerald-100',
    borderDark: 'border-emerald-200',
    dot: 'bg-emerald-500',
    chart: '#10b981', // emerald-500
  },
  Medium: {
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-50',
    text: 'text-amber-700',
    textDark: 'text-amber-600',
    border: 'border-amber-100',
    borderDark: 'border-amber-200',
    dot: 'bg-amber-500',
    chart: '#f59e0b', // amber-500
  },
  High: {
    bg: 'bg-rose-500',
    bgLight: 'bg-rose-50',
    text: 'text-rose-700',
    textDark: 'text-rose-600',
    border: 'border-rose-100',
    borderDark: 'border-rose-200',
    dot: 'bg-rose-500',
    chart: '#f43f5e', // rose-500
  }
} as const

/**
 * Readiness Score Colors
 * Used for: Score badges, progress bars, readiness indicators
 */
export const READINESS_COLORS = {
  'Investment Ready': { // 80-100
    bg: 'bg-emerald-100',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    progress: 'bg-emerald-600',
    chart: '#059669', // emerald-600
  },
  'Near Ready': { // 60-79
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-200',
    progress: 'bg-amber-500',
    chart: '#f59e0b', // amber-500
  },
  'Early Stage': { // 40-59
    bg: 'bg-amber-100', // Same as Near Ready
    text: 'text-amber-800',
    border: 'border-amber-200',
    progress: 'bg-amber-500',
    chart: '#f59e0b', // amber-500
  },
  'Pre-Investment': { // 0-39
    bg: 'bg-rose-100',
    text: 'text-rose-800',
    border: 'border-rose-200',
    progress: 'bg-rose-600',
    chart: '#e11d48', // rose-600
  }
} as const

/**
 * Status Colors
 * Used for: Goal status, action status, general status indicators
 */
export const STATUS_COLORS = {
  active: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
    dot: 'bg-cyan-500',
  },
  completed: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  achieved: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  pending: {
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  overdue: {
    bg: 'bg-rose-100',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
  },
  cancelled: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    dot: 'bg-gray-500',
  }
} as const

/**
 * Priority Colors
 * Used for: Action priorities, task priorities
 */
export const PRIORITY_COLORS = {
  high: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-100',
  },
  medium: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-100',
  },
  low: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100',
  }
} as const

/**
 * Primary Action Colors
 * Used for: Primary buttons, CTAs, success indicators
 */
export const PRIMARY_COLORS = {
  primary: 'bg-[#198754]', // Green primary
  primaryHover: 'hover:bg-[#157347]',
  primaryText: 'text-white',
  success: 'bg-emerald-600',
  successHover: 'hover:bg-emerald-700',
  successText: 'text-white',
} as const

/**
 * Chart Colors for Data Visualization
 * Used for: All charts, graphs, and data visualizations
 */
export const CHART_COLORS = {
  risk: {
    low: '#10b981',      // emerald-500
    medium: '#f59e0b',   // amber-500
    high: '#f43f5e',     // rose-500
  },
  readiness: {
    investmentReady: '#059669',  // emerald-600
    nearReady: '#f59e0b',        // amber-500 (Yellow)
    earlyStage: '#f59e0b',       // amber-500 (Yellow)
    preInvestment: '#e11d48',    // rose-600 (Red)
  },
  pillar: {
    excellent: '#10b981',  // 80-100: emerald-500
    good: '#f59e0b',       // 60-79: amber-500 (Yellow)
    fair: '#f59e0b',       // 40-59: amber-500 (Yellow)
    poor: '#f43f5e',       // 0-39: rose-500 (Red)
  },
  growth: {
    high: '#10b981',      // emerald-500
    medium: '#0891b2',    // cyan-600
    low: '#f59e0b',       // amber-500
  }
} as const

// ============================================================================
// HELPER FUNCTIONS FOR COLORS
// ============================================================================

/**
 * Get risk level color classes
 */
export const getRiskColors = (risk: string) => {
  return RISK_COLORS[risk as keyof typeof RISK_COLORS] || RISK_COLORS.Medium
}

/**
 * Get readiness level from score
 */
export const getReadinessLevel = (score: number, thresholds?: any[]): string => {
  if (thresholds && thresholds.length > 0) {
    const sorted = [...thresholds].sort((a, b) => b.min - a.min)
    for (const t of sorted) {
      if (score >= t.min) return t.label
    }
  }
  if (score >= 70) return 'Investment Ready'
  if (score >= 60) return 'Near Ready'
  if (score >= 40) return 'Early Stage'
  return 'Pre-Investment'
}

/**
 * Get readiness color classes
 */
export const getReadinessColors = (score: number, thresholds?: any[]) => {
  const level = getReadinessLevel(score, thresholds)
  
  if (READINESS_COLORS[level as keyof typeof READINESS_COLORS]) {
    return READINESS_COLORS[level as keyof typeof READINESS_COLORS]
  }

  // Fallbacks for common mismatches (e.g., "Investor Ready" vs "Investment Ready")
  const lowerLevel = level.toLowerCase()
  if (lowerLevel.includes('invest')) return READINESS_COLORS['Investment Ready']
  if (lowerLevel.includes('near')) return READINESS_COLORS['Near Ready']
  if (lowerLevel.includes('early')) return READINESS_COLORS['Early Stage']
  
  return READINESS_COLORS['Pre-Investment']
}

/**
 * Get status color classes
 */
export const getStatusColors = (status: string) => {
  return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.pending
}

/**
 * Get priority color classes
 */
export const getPriorityColors = (priority: string) => {
  return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.medium
}

/**
 * Get pillar color based on score
 */
export const getPillarChartColor = (score: number, thresholds?: any[]): string => {
  if (thresholds && thresholds.length > 0) {
    const sorted = [...thresholds].sort((a, b) => b.min - a.min)
    if (score >= sorted[0]?.min) return CHART_COLORS.pillar.excellent
    if (sorted.length > 1 && score >= sorted[1]?.min) return CHART_COLORS.pillar.good
    if (sorted.length > 2 && score >= sorted[2]?.min) return CHART_COLORS.pillar.fair
    return CHART_COLORS.pillar.poor
  }
  if (score >= 70) return CHART_COLORS.pillar.excellent
  if (score >= 60) return CHART_COLORS.pillar.good
  if (score >= 40) return CHART_COLORS.pillar.fair
  return CHART_COLORS.pillar.poor
}

// ============================================================================
// SME DATA GENERATION
// ============================================================================

// Standard pillar names in consistent order
export const PILLAR_NAMES = [
  'Team & Leadership',
  'Business Model',
  'Market & Traction',
  'Financial Readiness',
  'Operations',
  'Legal & Governance',
  'Data & Digital Maturity',
  'Growth & Scalability'
]

export interface PillarScore {
  name: string
  score: number
  potential: number
}

/**
 * Generate consistent pillar scores for an SME
 * DEPRECATED: Returns empty/zero data. Use real API data instead.
 * 
 * @param smeId - The unique ID of the SME
 * @param baseScore - The overall readiness score of the SME
 * @returns Array of pillar scores with zeros (no fake data)
 */
export const generatePillarScores = (smeId: string | number, baseScore: number): PillarScore[] => {
  // Return zeros only - no fake data generation
  return PILLAR_NAMES.map(name => ({
    name,
    score: 0,
    potential: 0
  }))
}

/**
 * Generate progress/history data for an SME
 * DEPRECATED: Returns empty array or maps real data only. No fake generation.
 * 
 * @param smeId - The unique ID of the SME
 * @param currentScore - Current readiness score
 * @param readinessHistory - Optional existing history array
 * @returns Array of historical data points or empty array
 */
export const generateProgressData = (
  smeId: string | number,
  currentScore: number,
  readinessHistory?: number[]
): { date: string; score: number }[] => {
  // If real history exists, use it
  if (readinessHistory && readinessHistory.length > 0) {
    return readinessHistory.map((score, index) => ({
      date: `Month ${index + 1}`,
      score
    }))
  }
  
  // Return empty - no fake data generation
  return []
}

/**
 * Get risk level from score
 */
export const getRiskFromScore = (score: number, thresholds?: any[]): string => {
  if (thresholds && thresholds.length > 0) {
    const sorted = [...thresholds].sort((a, b) => b.min - a.min)
    if (score >= sorted[0]?.min) return 'Low'
    if (sorted.length >= 3 && score >= sorted[sorted.length - 2]?.min) return 'Medium'
    return 'High'
  }
  if (score >= 70) return 'Low'
  if (score >= 50) return 'Medium'
  return 'High'
}

/**
 * Get pillar color class based on score (for progress bars)
 */
export const getPillarColor = (score: number, thresholds?: any[]): string => {
  if (thresholds && thresholds.length > 0) {
    const sorted = [...thresholds].sort((a, b) => b.min - a.min)
    const matched = sorted.find(t => score >= t.min)
    if (matched && matched.colorBg) {
      return matched.colorBg
    }
  }

  const colors = getReadinessColors(score, thresholds)
  return colors.progress || 'bg-gray-500'
}

/**
 * Get risk badge styles (DEPRECATED - use getRiskColors instead)
 */
export const getRiskBadgeStyles = (risk: string): string => {
  const colors = getRiskColors(risk as 'Low' | 'Medium' | 'High')
  return `${colors.bgLight} ${colors.textDark} ${colors.border}`
}

/**
 * Get risk dot styles (DEPRECATED - use getRiskColors instead)
 */
export const getRiskDotStyles = (risk: string): string => {
  const colors = getRiskColors(risk as 'Low' | 'Medium' | 'High')
  return colors.dot
}
