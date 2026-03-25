export interface Template {
  id: number
  name: string
  industry: string
  status: 'Active' | 'Draft' | 'Archived'
  version?: string
  description?: string
  duration?: number
}

export interface Question {
  id: number
  pillar_id: number
  text: string
  type: 'Yes/No' | 'Scale (1-10)'
  weight: number
  options?: any
  helper_text?: string
}

export interface AssessmentResponse {
  template: Template
  questions: Question[]
}

export interface AssessmentHistoryItem {
  id: number
  sme_id: number
  template_id: number
  status: string
  total_score: string | number
  started_at: string
  completed_at?: string
  template: {
    id: number
    name: string
  }
}

export interface AssessmentSubmitPayload {
  answers: {
    question_id: number
    value: any
  }[]
}
