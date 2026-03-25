import { useApi } from '~/composables/useApi'

export class DashboardRepository {
  async getDashboardData(smeId: string | number): Promise<any> {
    const api = useApi()
    return await api(`/sme/dashboard`)
  }
}
