export interface User {
  id: number | string
  full_name: string
  email: string
  role: 'ADMIN' | 'INVESTOR' | 'SME'
  status: 'ACTIVE' | 'PENDING' | 'REJECTED'
  created_at?: string
  sme_profile?: any
  investor_profile?: any
}

export interface Program {
  id: number | string
  name: string
  description: string
  status: string
  sector?: string
  start_date?: string
  end_date?: string
  investment_amount?: string
  benefits?: string[]
}

export interface Sector {
  id: number
  name: string
  color: string
  description?: string
}

export interface Template {
  id: number
  name: string
  industry: string
  status: string
  version?: string
}

export interface Pillar {
  id: number
  name: string
  weight: number
}

export interface Question {
  id: number
  template_id: number
  pillar_id: number
  text: string
  type: string
  weight: number
  helper_text?: string
  options?: any
}

export interface AuditLog {
  id: number
  user_id: number
  action: string
  target_entity: string
  target_id: number
  details: string
  ip_address: string
  created_at: string
}
