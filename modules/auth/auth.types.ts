export interface SmeProfile {
  id: number
  company_name: string
  industry: string
  address?: string
  registration_number?: string
  readiness_score?: number
}

export interface InvestorProfile {
  id: number
  organization_name: string
  industry: string
  investment_focus?: string[]
}

export interface User {
  id: string
  email: string
  name: string
  full_name?: string
  role: 'ADMIN' | 'INVESTOR' | 'SME'
  avatar?: string
  sme_profile?: SmeProfile
  investor_profile?: InvestorProfile
  company?: {
    id: number
    name: string
    industry: string
    size: string
    founded: string
    lastAssessed: string
  }
}


export interface AuthResponse {
  access_token: string
  token_type: string
  expires_in: number
}
