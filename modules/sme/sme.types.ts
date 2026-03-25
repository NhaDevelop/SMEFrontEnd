export interface SME {
  id: string
  name: string
  industry: string
  location: string
  lastAssessed: string
  riskLevel: 'Low' | 'Medium' | 'High'
  readinessStatus: string
  score: number
  growthPotential: number
  programIds: (string | number)[]
  readinessHistory: number[]
  pillars: any[]
  assessments: any[]
  registrationNumber?: string
  teamSize?: string
  yearsInBusiness?: string
  address?: string
  websiteUrl?: string
  description?: string
  logoUrl?: string
}

export interface SmeDashboard {
  company: {
    name: string
    industry: string
    location: string
    lastAssessed: string
    overallScore: number
  }
  pillars: any[]
  progress: any[]
  actions: SmeAction[]
  primaryGoal?: any
  thresholds: any[]
}

export interface SmeAction {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  pillar: string
  impact: number
  status: 'pending' | 'completed' | 'in_progress'
}
