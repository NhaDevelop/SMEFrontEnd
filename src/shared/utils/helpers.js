import { RISK_LEVELS, RISK_THRESHOLDS } from '@/shared/constants'

/**
 * Calculate overall investment readiness score from pillars
 * @param {Array} pillars - Array of pillar objects with scores
 * @returns {number} Average score rounded to nearest integer
 */
export function calculateOverallScore(pillars) {
  if (!pillars || pillars.length === 0) return 0
  const sum = pillars.reduce((acc, pillar) => acc + pillar.score, 0)
  return Math.round(sum / pillars.length)
}

/**
 * Calculate growth potential from pillars
 * @param {Array} pillars - Array of pillar objects
 * @returns {number} Average improvement potential
 */
export function calculateGrowthPotential(pillars) {
  if (!pillars || pillars.length === 0) return 0
  const sum = pillars.reduce((acc, pillar) => acc + pillar.improvementPotential, 0)
  return Math.round(sum / pillars.length)
}

/**
 * Get risk level based on score
 * @param {number} score - Score value (0-100)
 * @returns {string} Risk level (low, medium, high)
 */
export function getRiskLevel(score) {
  if (score >= RISK_THRESHOLDS.LOW) return RISK_LEVELS.LOW
  if (score >= RISK_THRESHOLDS.MEDIUM) return RISK_LEVELS.MEDIUM
  return RISK_LEVELS.HIGH
}

/**
 * Get risk level color class
 * @param {string} riskLevel - Risk level (low, medium, high)
 * @returns {string} Color name
 */
export function getRiskColor(riskLevel) {
  const colors = {
    [RISK_LEVELS.LOW]: 'green',
    [RISK_LEVELS.MEDIUM]: 'orange',
    [RISK_LEVELS.HIGH]: 'red'
  }
  return colors[riskLevel] || 'gray'
}

/**
 * Get priority color class
 * @param {string} priority - Priority level (high, medium, low)
 * @returns {string} Color name
 */
export function getPriorityColor(priority) {
  const colors = {
    high: 'red',
    medium: 'orange',
    low: 'yellow'
  }
  return colors[priority] || 'gray'
}

/**
 * Get readiness status label based on score
 * @param {number} score - Overall score (0-100)
 * @returns {string} Status label
 */
export function getReadinessStatus(score) {
  if (score >= 85) return 'Investment Ready'
  if (score >= 76) return 'Near Ready'
  if (score >= 61) return 'Developing'
  return 'Early Stage'
}

/**
 * Calculate score change between two values
 * @param {number} currentScore - Current score
 * @param {number} previousScore - Previous score
 * @returns {number} Score difference
 */
export function calculateScoreChange(currentScore, previousScore) {
  return currentScore - previousScore
}

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
