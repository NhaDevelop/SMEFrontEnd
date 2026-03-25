import { AssessmentRepository } from './assessment.repository'
import type { AssessmentResponse, AssessmentHistoryItem, AssessmentSubmitPayload } from './assessment.types'

export class AssessmentService {
  private repository: AssessmentRepository

  constructor() {
    this.repository = new AssessmentRepository()
  }

  async fetchQuestions(): Promise<AssessmentResponse> {
    return this.repository.getQuestions()
  }

  async start(templateId: number): Promise<number> {
    const res = await this.repository.startAssessment(templateId)
    return res.assessment_id
  }

  async submit(assessmentId: number, answers: any[]): Promise<any> {
    const payload: AssessmentSubmitPayload = {
      answers: answers.map(a => ({
        question_id: a.question_id,
        value: a.value
      }))
    }
    return this.repository.submitAnswers(assessmentId, payload)
  }

  async fetchHistory(): Promise<AssessmentHistoryItem[]> {
    return this.repository.getHistory()
  }
}

export const assessmentService = new AssessmentService()
