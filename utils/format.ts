/**
 * Utility functions for formatting data in the UI
 */

/**
 * Format a date string into a readable format (e.g., Mar 17, 2026)
 */
export const formatDate = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return 'Never'
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  
  // Check for invalid date
  if (isNaN(date.getTime())) return 'Invalid date'
  
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

/**
 * Format a date string into a relative "time ago" string
 */
export const formatTimeAgo = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return ''
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return ''
  
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'Just now'
  
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  
  return '' // Return empty for older dates to avoid redundancy when used with formatDate
}

/**
 * Formats a date string or Date object into a human-readable format including time.
 * Example: "Mar 17, 2026, 02:45 PM"
 */
export const formatDateTime = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '—'

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

/**
 * Combined date and relative time formatting (e.g., "Mar 17, 2026 (2h ago)")
 */
export const formatDateWithRelative = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return 'Never'
  const date = formatDate(dateString)
  const relative = formatTimeAgo(dateString)
  return relative ? `${date} (${relative})` : date
}

/**
 * Format a number as a currency string (USD)
 */
export const formatCurrency = (value: number | string | null | undefined): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (num === null || num === undefined || isNaN(num)) return '$0'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(num)
}

/**
 * Format a number to remove unnecessary decimal places
 * Shows decimals only when needed, max 2 decimal places
 */
export const formatNumber = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return '0'
  
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) return '0'
  
  // If the number is an integer, show no decimal places
  if (Number.isInteger(num)) return num.toString()
  
  // Otherwise, show up to 2 decimal places, removing trailing zeros
  return parseFloat(num.toFixed(2)).toString()
}

/**
 * Format a number as a percentage with proper decimal handling
 */
export const formatPercentage = (value: number | string | null | undefined): string => {
  const formatted = formatNumber(value)
  return `${formatted}%`
}

/**
 * Enhanced relative time formatter for discussions
 */
export const formatRelativeTime = (dateString: string | Date | null | undefined): string => {
  if (!dateString) return ''
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  
  return `${Math.floor(diffInSeconds / 31536000)}y ago`
}
