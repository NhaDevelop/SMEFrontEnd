import { AdminRepository } from './user.repository'

export class AdminService {
  private repo = new AdminRepository()

  async getUsersData() {
    return await this.repo.getUsersData()
  }

  async getProgramsData() {
    return await this.repo.getProgramsData()
  }

  async createProgram(data: any) {
    return await this.repo.createProgram(data)
  }
}
