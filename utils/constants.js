export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SELECTED_ROLE: 'selected_role'
}

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    USER: '/auth/user'
  },
  DASHBOARD: {
    DATA: '/dashboard',
    PILLARS: '/dashboard/pillars',
    PROGRESS: '/dashboard/progress',
    ACTIONS: '/dashboard/actions'
  }
}

export const PILLARS = [
  { name: 'Financial Management', id: 'financial' },
  { name: 'Market Potential', id: 'market' },
  { name: 'Business Model', id: 'business_model' },
  { name: 'Team & Governance', id: 'team' },
  { name: 'Product & Technology', id: 'product' },
  { name: 'Legal & Compliance', id: 'legal' },
  { name: 'Operations', id: 'operations' },
  { name: 'Impact', id: 'impact' }
]

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
}

export const RISK_THRESHOLDS = {
  LOW: 70,
  MEDIUM: 50
}
