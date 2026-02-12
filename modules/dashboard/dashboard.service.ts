import { DashboardRepository } from './dashboard.repository'

export class DashboardService {
  private repo = new DashboardRepository()

  async getDashboardData() {
    return await this.repo.getDashboardData()
  }
}
