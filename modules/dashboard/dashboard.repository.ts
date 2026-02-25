export class DashboardRepository {
  async getDashboardData(smeId: string | number): Promise<any> {
    return await $fetch(`/api/dashboard?smeId=${smeId}&_t=${Date.now()}`)
  }
}
