import { useApi } from '~/composables/useApi'

export class AdminRepository {
  async getUsersData(): Promise<any> {
    const api = useApi()
    return await api('/admin/users')
  }

  async getProgramsData(): Promise<any> {
    const api = useApi()
    return await api('/admin/programs')
  }

  async getSMEsData(): Promise<any> {
    const api = useApi()
    return await api('/admin/smes')
  }

  async createProgram(programData: any): Promise<any> {
    const api = useApi()
    return await api('/admin/programs', {
      method: 'POST',
      body: programData
    })
  }

  async getTemplatesData(): Promise<any> {
    const api = useApi()
    return await api('/admin/templates')
  }

  async createTemplate(templateData: any): Promise<any> {
    const api = useApi()
    return await api('/admin/templates', {
      method: 'POST',
      body: templateData
    })
  }

  async getQuestionsData(): Promise<any> {
    const api = useApi()
    return await api('/admin/questions')
  }

  async saveQuestion(questionData: any): Promise<any> {
    const api = useApi()
    return await api('/admin/questions', {
      method: 'POST',
      body: questionData
    })
  }

  async deleteQuestion(id: string): Promise<any> {
    const api = useApi()
    return await api('/admin/questions', {
      method: 'DELETE',
      params: { id }
    })
  }

  async enrollSmesToProgram(programId: number | string, smeIds: (number | string)[]): Promise<any> {
    const api = useApi()
    return await api('/admin/programs/enroll', {
      method: 'POST',
      body: { programId, smeIds }
    })
  }

  async getDashboardData(): Promise<any> {
    const api = useApi()
    return await api('/admin/dashboard')
  }
}
