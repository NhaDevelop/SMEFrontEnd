export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'INVESTOR' | 'SME'
  avatar?: string
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
  token: string
  user: User
}
