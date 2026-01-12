// App constants
export const APP_NAME = 'IRIP'
export const APP_FULL_NAME = 'Investment Readiness Intelligence Platform'

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    USER: '/auth/user'
  },
  DASHBOARD: {
    DATA: '/dashboard',
    PILLARS: '/pillars',
    PROGRESS: '/progress',
    ACTIONS: '/actions'
  },
  ASSESSMENT: {
    LIST: '/assessments',
    CREATE: '/assessments',
    SUBMIT: '/assessments/:id/submit'
  },
  REPORTS: {
    LIST: '/reports',
    GENERATE: '/reports/generate',
    EXPORT: '/reports/:id/export'
  },
  SETTINGS: {
    PROFILE: '/settings/profile',
    COMPANY: '/settings/company'
  }
}

// User roles
export const USER_ROLES = {
  SME_USER: 'sme_user',
  INVESTOR: 'investor',
  ADMINISTRATOR: 'administrator'
}

// Risk levels
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
}

// Risk level thresholds
export const RISK_THRESHOLDS = {
  LOW: 76,
  MEDIUM: 61,
  HIGH: 0
}

// Priority levels
export const PRIORITY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
}

// Action statuses
export const ACTION_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
}

// Assessment statuses
export const ASSESSMENT_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
}

// 8 Pillars
export const PILLARS = [
  { id: 1, name: 'Team & Leadership', key: 'team_leadership' },
  { id: 2, name: 'Market & Traction', key: 'market_traction' },
  { id: 3, name: 'Operations', key: 'operations' },
  { id: 4, name: 'Digital Maturity', key: 'digital_maturity' },
  { id: 5, name: 'Business Model', key: 'business_model' },
  { id: 6, name: 'Financial Readiness', key: 'financial_readiness' },
  { id: 7, name: 'Legal & Governance', key: 'legal_governance' },
  { id: 8, name: 'Growth & Scalability', key: 'growth_scalability' }
]

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SELECTED_ROLE: 'selected_role'
}
