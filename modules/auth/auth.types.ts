export interface SmeProfile {
  id: number
  user_id: number
  company_name: string
  registration_number?: string | null
  industry: string
  stage?: string | null
  years_in_business?: string | null
  team_size?: number | null
  address?: string | null
  readiness_score?: number | null
  risk_level?: string | null
  founding_date?: string | null
  website_url?: string | null
}

export interface InvestorProfile {
  id: number
  user_id: number
  organization_name: string
  registration_number?: string | null
  investor_type?: string | null
  industry: string
  investment_focus?: string[] | null
  min_ticket_size?: number | null
  max_ticket_size?: number | null
  years_in_business?: string | null
  team_size?: number | null
  address?: string | null
}

export interface User {
  id: string | number
  email: string
  name: string
  full_name?: string
  phone?: string
  role: 'ADMIN' | 'INVESTOR' | 'SME'
  status?: string
  is_verified?: number
  avatar?: string
  last_login_at?: string
  created_at?: string
  updated_at?: string
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
