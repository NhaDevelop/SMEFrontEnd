export interface Goal {
  id: number
  sme_id: number
  title: string
  description?: string
  pillar_id?: number
  status: 'Not Started' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  due_date?: string
  progress_percentage: number
  target_score?: number | string
}

export interface GoalCreatePayload {
  title: string
  description?: string
  pillar_id?: number
  due_date?: string
  target_score?: number
}

export interface GoalUpdatePayload extends Partial<GoalCreatePayload> {
  status?: 'Not Started' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  progress_percentage?: number
}
