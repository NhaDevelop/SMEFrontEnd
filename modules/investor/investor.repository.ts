import { useApi } from '~/composables/useApi'
import type { SME, InvestorAnalytics } from './investor.types'

export class InvestorRepository {
  async getDealflow(params?: any): Promise<SME[]> {
    const api = useApi()
    return await api<SME[]>('/investor/dealflow', { params })
  }

  async getAnalytics(): Promise<InvestorAnalytics> {
    const api = useApi()
    return await api<InvestorAnalytics>('/investor/analytics')
  }
}
