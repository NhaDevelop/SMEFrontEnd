export class AdminRepository {
  async getUsersData(): Promise<any> {
    return await $fetch('/api/admin/users')
  }

  async getProgramsData(): Promise<any> {
    return await $fetch('/api/admin/programs')
  }

  async getSMEsData(): Promise<any> {
    return await $fetch('/api/admin/smes')
  }

  async createProgram(programData: any): Promise<any> {
    return await $fetch('/api/admin/programs', {
      method: 'POST',
      body: programData
    })
  }
  async getTemplatesData(): Promise<any> {
    return await $fetch('/api/admin/templates')
  }

  async createTemplate(templateData: any): Promise<any> {
    return await $fetch('/api/admin/templates', {
        method: 'POST',
        body: templateData
    })
  }

  async getQuestionsData(): Promise<any> {
    return await $fetch('/api/admin/questions')
  }

  async saveQuestion(questionData: any): Promise<any> {
    return await $fetch('/api/admin/questions', {
      method: 'POST',
      body: questionData
    })
  }

  async deleteQuestion(id: string): Promise<any> {
    return await $fetch('/api/admin/questions', {
      method: 'DELETE',
      params: { id }
    })
  }
  async enrollSmesToProgram(programId: number | string, smeIds: (number | string)[]): Promise<any> {
    return await $fetch('/api/admin/programs/enroll', {
      method: 'POST',
      body: { programId, smeIds }
    })
  }

  async getDashboardData(): Promise<any> {
    return await $fetch('/api/admin/dashboard')
  }
}
