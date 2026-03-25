export interface SME {
  id: number
  name: string
  industry: string
  location: string
  readiness_score: string | number
  risk_level: string
  last_assessed: string
  stage?: string
  fundingNeeded?: number
}

export interface InvestorAnalytics {
  total_portfolio: number
  average_readiness: number
  sector_distribution: { industry: string, count: number }[]
  risk_metrics: {
    low: number
    medium: number
    high: number
  }
}
