export interface Program {
  id: number
  name: string
  description: string
  status: 'Draft' | 'Active' | 'Archived'
  sector?: string
  startDate?: string
  endDate?: string
  investmentAmount?: string
  benefits?: string[]
  smesCount?: number
}

export interface ProgramComment {
  id: number
  program_id: number
  user_id: number
  content: string
  created_at: string
  user: {
    id: number
    full_name: string
    role: string
  }
}
