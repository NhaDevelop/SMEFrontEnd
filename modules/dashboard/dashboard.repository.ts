export class DashboardRepository {
  async getDashboardData(): Promise<any> {
    return await $fetch('/api/dashboard')
  }
}
