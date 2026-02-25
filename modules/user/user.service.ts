import { AdminRepository } from './user.repository'

export class AdminService {
  private repo = new AdminRepository()

  async getUsersData() {
    return await this.repo.getUsersData()
  }

  async getProgramsData() {
    return await this.repo.getProgramsData()
  }

  async getSMEsData() {
    return await this.repo.getSMEsData()
  }

  async createProgram(data: any) {
    return await this.repo.createProgram(data)
  }

  async getTemplatesData() {
      return await this.repo.getTemplatesData()
  }

  async createTemplate(data: any) {
      return await this.repo.createTemplate(data)
  }

  async getQuestionsData() {
    return await this.repo.getQuestionsData()
  }

  async saveQuestion(data: any) {
    return await this.repo.saveQuestion(data)
  }

  async deleteQuestion(id: string) {
    return await this.repo.deleteQuestion(id)
  }
  async enrollSmesToProgram(programId: number | string, smeIds: (number | string)[]) {
    return await this.repo.enrollSmesToProgram(programId, smeIds)
  }

  async getDashboardData() {
    return await this.repo.getDashboardData()
  }
}
