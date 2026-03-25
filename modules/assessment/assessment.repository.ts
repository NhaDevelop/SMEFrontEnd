import { useApi } from '~/composables/useApi'
import type { AssessmentResponse, AssessmentHistoryItem, AssessmentSubmitPayload } from './assessment.types'

export class AssessmentRepository {
  async getQuestions(): Promise<AssessmentResponse> {
    const api = useApi()
    return await api<AssessmentResponse>('/assessment/questions')
  }

  async startAssessment(templateId: number): Promise<{ assessment_id: number }> {
    const api = useApi()
    return await api<{ assessment_id: number }>('/assessment/start', {
      method: 'POST',
      body: { template_id: templateId }
    })
  }

  async submitAnswers(assessmentId: number, payload: AssessmentSubmitPayload): Promise<any> {
    const api = useApi()
    return await api(`/assessment/${assessmentId}/submit`, {
      method: 'POST',
      body: payload
    })
  }

  async getHistory(): Promise<AssessmentHistoryItem[]> {
    const api = useApi()
    return await api<AssessmentHistoryItem[]>('/assessment/history')
  }
}
