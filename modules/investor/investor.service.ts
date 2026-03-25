import { InvestorRepository } from './investor.repository'
import type { SME, InvestorAnalytics } from './investor.types'

export class InvestorService {
  private repository: InvestorRepository

  constructor() {
    this.repository = new InvestorRepository()
  }

  async fetchDealflow(filters?: any): Promise<SME[]> {
    return this.repository.getDealflow(filters)
  }

  async fetchAnalytics(): Promise<InvestorAnalytics> {
    return this.repository.getAnalytics()
  }
}

export const investorService = new InvestorService()
