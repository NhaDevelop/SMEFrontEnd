import { DashboardRepository } from './dashboard.repository'

export class DashboardService {
  private repo = new DashboardRepository()

  async getDashboardData(smeId: string | number) {
    return await this.repo.getDashboardData(smeId)
  }
}
