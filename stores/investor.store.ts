import { defineStore } from 'pinia'
import { useAuthStore } from '~/stores/auth.store'

export interface SME {
  id: string | number
  name: string
  industry: string
  location: string
  stage: string
  score: number
  keyStrength: string
  fundingNeeded: number
  description: string
  logo?: string
  financials: {
    revenue: string
    profit: string
    growth: string
  }
  financialRisk: 'Low' | 'Medium' | 'High'
  growthRate: number // maps to "Growth" column
  status: string
  lastUpdated: string
  lastAssessedDate: string // Added for filtering
  readinessHistory: number[]
  readinessProgress: number
  programIds?: (string | number)[]
  pillars?: any[]
}

export interface Goal {
  id: number
  smeId?: string | number
  smeName: string
  sector: string
  location: string
  title: string
  description: string
  status: string
  isOffTrack: boolean
  progress: number
  progressColor: string
  barColor: string
  targetScore: number
  currentScore: number
  expectedScore: number
  overdue: boolean
  overdueDays?: string
  daysLeft?: string
  dueDate: string
  profilePillars?: any[]
  goalPillars?: any[]
  readinessHistory?: number[]
  proofNote?: string
  proofDocument?: string
}

interface FilterState {
  search: string
  industry: string
  stage: string
  minScore: number
  risk: string
}

interface InvestorState {
  dealFlow: SME[]
  goals: Goal[]
  watchlist: (string | number)[]
  filters: FilterState
  loading: boolean
}

export const useInvestorStore = defineStore('investor', {
  state: (): InvestorState => ({
    dealFlow: [],
    goals: [],
    watchlist: [],
    filters: {
      search: '',
      industry: 'All Sectors',
      stage: 'All Stages',
      minScore: 0,
      risk: 'All Risks'
    },
    loading: false
  }),

  getters: {
    filteredDealFlow: (state) => {
      return state.dealFlow.filter(sme => {
        const matchesSearch = sme.name.toLowerCase().includes(state.filters.search.toLowerCase()) || 
                              sme.description.toLowerCase().includes(state.filters.search.toLowerCase())
        
        const matchesIndustry = state.filters.industry === 'All Sectors' || sme.industry === state.filters.industry
        
        const matchesStage = state.filters.stage === 'All Stages' || sme.stage === state.filters.stage
        
        const matchesScore = sme.score >= state.filters.minScore

        // Risk Filter Logic
        let matchesRisk = true
        if (state.filters.risk && state.filters.risk !== 'All Risks') {
            const targetRisk = state.filters.risk.replace(' Risk', '') // 'Low Risk' -> 'Low'
            matchesRisk = sme.financialRisk === targetRisk
        }

        return matchesSearch && matchesIndustry && matchesStage && matchesScore && matchesRisk
      })
    },
    
    watchlistItems: (state) => {
        return state.dealFlow.filter(sme => state.watchlist.includes(sme.id))
    },

    stats: (state) => {
        return {
            totalDeals: state.dealFlow.length,
            readyToInvest: state.dealFlow.filter(s => s.score >= 80).length,
            highRisk: state.dealFlow.filter(s => s.score < 60).length,
            totalFunding: state.dealFlow.reduce((sum, s) => sum + s.fundingNeeded, 0),
            avgScore: state.dealFlow.length ? Math.round(state.dealFlow.reduce((sum, s) => sum + s.score, 0) / state.dealFlow.length) : 0,
            activeGoals: state.goals.filter(g => g.status === 'Active').length,
            achievedGoals: state.goals.filter(g => g.status === 'Achieved').length
        }
    }
  },

  actions: {
    async fetchDealFlow() {
        this.loading = true
        const api = useApi()
        try {
            const data = await api<any>('/investor/dealflow', {
                params: {
                    industry: this.filters.industry !== 'All Sectors' ? this.filters.industry : undefined,
                    stage: this.filters.stage !== 'All Stages' ? this.filters.stage : undefined,
                    minScore: this.filters.minScore > 0 ? this.filters.minScore : undefined
                }
            })
            // Handle unwrapped data or original structure
            this.dealFlow = data.dealFlow || data
            this.goals = data.goals || []
        } catch (error) {
            console.error('Failed to fetch deal flow:', error)
        } finally {
            this.loading = false
        }
    },

    toggleWatchlist(id: string | number) {
      const index = this.watchlist.indexOf(id)
      if (index === -1) {
        this.watchlist.push(id)
      } else {
        this.watchlist.splice(index, 1)
      }
    },
    
    setFilters(filters: Partial<FilterState>) {
        this.filters = { ...this.filters, ...filters }
        // We could trigger a fetch here if we want server-side filtering, 
        // but for now we are doing client-side filtering on the fetched set.
    },

    async createGoal(goalData: any) {
      const authStore = useAuthStore()
      const api = useApi()
      try {
        await api('/sme/goals', {
          method: 'POST',
          body: {
            smeId: goalData.smeId,
            title: goalData.title || goalData.name, // handle mapping from UI
            description: goalData.description,
            targetScore: goalData.targetScore,
            deadline: goalData.dueDate || goalData.targetDate,
            pillars: goalData.pillarTargets || [],
            createdBy: 'investor',
            investorName: authStore.user?.name,
            investorCompany: authStore.user?.company?.name
          }
        })
        await this.fetchDealFlow()
      } catch (error) {
        console.error('Failed to create goal:', error)
      }
    },

    async updateGoalStatus(id: number, status: string) {
      // Optimistically update UI
      const goal = this.goals.find(g => g.id === id)
      if (goal) {
        goal.status = status
        if (status === 'Achieved') {
          goal.progress = 100
          goal.progressColor = 'text-green-600'
          goal.barColor = 'bg-green-600'
          goal.isOffTrack = false
          goal.daysLeft = undefined
          goal.dueDate = 'Completed'
        }
      }
      
      const api = useApi()
      try {
        await api('/sme/goals', {
          method: 'PATCH',
          body: {
            id,
            status: status === 'Achieved' ? 'COMPLETED' : status.toUpperCase()
          }
        })
        // Refresh to guarantee sync
        await this.fetchDealFlow()
      } catch (error) {
        console.error('Failed to update goal status:', error)
      }
    },

    async deleteGoal(id: number) {
      const api = useApi()
      try {
        await api(`/sme/goals?id=${id}`, {
          method: 'DELETE'
        })
        await this.fetchDealFlow()
      } catch (error) {
        console.error('Failed to delete goal:', error)
      }
    }
  }
})
