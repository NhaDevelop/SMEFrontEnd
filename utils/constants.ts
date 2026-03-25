/**
 * constants.ts — Application-wide constants (typed version of constants.js)
 *
 * MVVM Layer: utility (no Vue, no Pinia dependencies)
 */

// ─── Storage ─────────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'irip_access_token',    // keep in sync with auth.store.ts
  USER_DATA: 'irip_user_data',
  SELECTED_ROLE: 'selected_role',
} as const

// ─── API Endpoint Groups ──────────────────────────────────────────────────────
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  DASHBOARD: {
    SME: '/sme/dashboard',
    ADMIN: '/admin/dashboard',
  },
  GOALS: '/sme/goals',
  INVESTOR: {
    DEALFLOW: '/investor/dealflow',
    ANALYTICS: '/investor/analytics',
    PROGRAMS: '/investor/programs',
  },
} as const

// ─── Default 8-Pillar Framework ───────────────────────────────────────────────
export const DEFAULT_PILLARS = [
  { name: 'Team & Leadership', id: 'team' },
  { name: 'Business Model', id: 'business' },
  { name: 'Market & Traction', id: 'market' },
  { name: 'Financial Readiness', id: 'finance' },
  { name: 'Operations', id: 'ops' },
  { name: 'Legal & Governance', id: 'legal' },
  { name: 'Data & Digital Maturity', id: 'data' },
  { name: 'Growth & Scalability', id: 'growth' },
] as const

// ─── Score Thresholds (fallback — real values come from FrameworkSettings API) ──
export const DEFAULT_SCORE_THRESHOLDS = [
  { id: 'investor', label: 'Investor Ready', min: 80, max: 100, color: '#10b981' },
  { id: 'near',     label: 'Near Ready',     min: 60, max: 79,  color: '#f59e0b' },
  { id: 'early',    label: 'Early Stage',    min: 40, max: 59,  color: '#0d9488' },
  { id: 'pre',      label: 'Pre-Investment', min: 0,  max: 39,  color: '#e11d48' },
] as const

// ─── Goal Status Sets ─────────────────────────────────────────────────────────
export const GOAL_ACTIVE_STATUSES = ['Active', 'ACTIVE', 'Paused', 'PAUSED', 'Not Started'] as const
export const GOAL_ACHIEVED_STATUSES = ['Achieved', 'COMPLETED'] as const

// ─── User Roles ───────────────────────────────────────────────────────────────
export const USER_ROLES = {
  SME: 'SME',
  INVESTOR: 'INVESTOR',
  ADMIN: 'ADMIN',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]
