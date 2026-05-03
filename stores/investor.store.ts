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

interface TrendPoint {
  month: string
  score: number
  ready: number
}

interface PillarRisk {
  name: string
  min: number
  avg: number
  max: number
}

interface InvestorState {
  dealFlow: SME[]
  goals: Goal[]
  programs: any[]
  programStats: any | null
  programParticipants: any[]
  watchlist: (string | number)[]
  filters: FilterState
  lastDealFlowFetch: number | null
  lastProgramsFetch: number | null
  lastAnalyticsFetch: number | null
  loading: boolean
  trendData: TrendPoint[]
  pillarRiskData: PillarRisk[]
}

export const useInvestorStore = defineStore('investor', {
  state: (): InvestorState => ({
    dealFlow: [],
    goals: [],
    programs: [],
    programStats: null,
    programParticipants: [],
    watchlist: [],
    filters: {
      search: '',
      industry: 'All Sectors',
      stage: 'All Stages',
      minScore: 0,
      risk: 'All Risks'
    },
    lastDealFlowFetch: null,
    lastProgramsFetch: null,
    lastAnalyticsFetch: null,
    loading: false,
    trendData: [],
    pillarRiskData: []
  }),

  getters: {
    filteredDealFlow: (state) => {
      if (!Array.isArray(state.dealFlow)) return []
      
      return state.dealFlow.filter(sme => {
        const matchesSearch = (sme.name || '').toLowerCase().includes(state.filters.search.toLowerCase()) || 
                              (sme.description || '').toLowerCase().includes(state.filters.search.toLowerCase())
        
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
        if (!Array.isArray(state.dealFlow)) return []
        return state.dealFlow.filter(sme => state.watchlist.includes(sme.id))
    },

    stats: (state) => {
        const dealFlow = Array.isArray(state.dealFlow) ? state.dealFlow : []
        const goals = Array.isArray(state.goals) ? state.goals : []

        return {
            totalDeals: dealFlow.length,
            readyToInvest: dealFlow.filter(s => s.score >= 80).length,
            highRisk: dealFlow.filter(s => s.score < 60).length,
            totalFunding: dealFlow.reduce((sum, s) => sum + (s.fundingNeeded || 0), 0),
            avgScore: dealFlow.length ? Math.round(dealFlow.reduce((sum, s) => sum + s.score, 0) / dealFlow.length) : 0,
            activeGoals: goals.filter(g => g.status === 'Active').length,
            achievedGoals: goals.filter(g => g.status === 'Achieved').length
        }
    }
  },

  actions: {
    async fetchDealFlow(force = false, programId?: string | number) {
        // Cache for 2 minutes unless forced
        if (!force && this.lastDealFlowFetch && (Date.now() - this.lastDealFlowFetch < 120000)) {
            return
        }

        this.loading = true
        const api = useApi()
        try {
            const [data, goalsRes] = await Promise.all([
                api<any>('/investor/dealflow', {
                    params: {
                        industry: this.filters.industry !== 'All Sectors' ? this.filters.industry : undefined,
                        stage: this.filters.stage !== 'All Stages' ? this.filters.stage : undefined,
                        minScore: this.filters.minScore > 0 ? this.filters.minScore : undefined,
                        program_id: programId
                    }
                }),
                api<any>('/sme/goals')
            ])
            // Correctly parse data array from Laravel response wrapping
            if (data.data && Array.isArray(data.data)) {
                this.dealFlow = data.data
            } else if (data.dealFlow && Array.isArray(data.dealFlow)) {
                this.dealFlow = data.dealFlow
            } else if (Array.isArray(data)) {
                this.dealFlow = data
            } else {
                this.dealFlow = []
            }
            
            const rawGoals = goalsRes.data || goalsRes || []
            this.goals = rawGoals.map((g: any) => {
                const dueDate = g.due_date ? new Date(g.due_date) : null
                const now = new Date()
                let overdue = false
                let overdueDays = ''
                let daysLeft = ''
                let formattedDate = 'No date'

                if (dueDate) {
                    formattedDate = dueDate.toLocaleDateString()
                    const diffTime = dueDate.getTime() - now.getTime()
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    if (diffDays < 0) {
                        overdue = true
                        overdueDays = `${Math.abs(diffDays)}d`
                    } else {
                        daysLeft = `${diffDays}d left`
                    }
                }

                let status = g.status || 'Active'
                if (status === 'Not Started') status = 'Active'

                const progress = (status.toLowerCase() === 'achieved' || status.toLowerCase() === 'completed') ? 100 : (g.progress_percentage || 0)
                const progressColor = progress >= 100 ? 'text-emerald-600' : 'text-teal-600'
                const barColor = progress >= 100 ? 'bg-emerald-500' : 'bg-teal-500'

                return {
                    id: g.id,
                    smeId: g.sme_id,
                    smeName: g.sme_name,
                    sector: g.industry,
                    location: g.location,
                    title: g.title,
                    description: g.description,
                    status,
                    isOffTrack: progress < 50 && overdue,
                    progress,
                    progressColor,
                    barColor,
                    targetScore: parseFloat(g.target_score) || 0,
                    currentScore: parseFloat(g.current_score) || parseFloat(g.sme_profile?.readiness_score) || 0,
                    expectedScore: parseFloat(g.expected_score) || parseFloat(g.target_score) || 0,
                    overdue,
                    overdueDays,
                    daysLeft,
                    dueDate: formattedDate,
                    profilePillars: g.sme_profile?.pillars || [],
                    goalPillars: g.pillar_targets || [],
                    proofNote: g.proof_note || '',
                    proofDocument: g.proof_document || '',
                    rejectionNote: g.rejection_note,
                    createdByRole: g.created_by_role,
                    readinessHistory: g.readiness_history || []
                }
            })
            this.lastDealFlowFetch = Date.now()
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
    },

    async createGoal(goalData: any) {
      const authStore = useAuthStore()
      const api = useApi()
      try {
        await api('/sme/goals', {
          method: 'POST',
          body: {
            smeId: goalData.smeId,
            title: goalData.title || goalData.name, 
            description: goalData.description,
            target_score: goalData.targetScore,
            due_date: goalData.dueDate || goalData.targetDate,
            pillar_targets: goalData.pillarTargets || [],
            createdBy: 'investor',
            investorName: authStore.user?.name,
            investorCompany: authStore.user?.company?.name
          }
        })
        await this.fetchDealFlow(true)
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
        }
      }
      
      const api = useApi()
      try {
        // ✅ Fixed: use /{id} in path, not body — matches backend PATCH sme/goals/{id}
        await api(`/sme/goals/${id}`, {
          method: 'PATCH',
          body: {
            status: status === 'Achieved' ? 'COMPLETED' : status.toUpperCase()
          }
        })
        await this.fetchDealFlow(true)
      } catch (error) {
        console.error('Failed to update goal status:', error)
      }
    },

    async deleteGoal(id: number) {
      const api = useApi()
      try {
        // ✅ Fixed: use /{id} in path — matches backend DELETE sme/goals/{id}
        await api(`/sme/goals/${id}`, {
          method: 'DELETE'
        })
        await this.fetchDealFlow(true)
      } catch (error) {
        console.error('Failed to delete goal:', error)
      }
    },

    async fetchPrograms(force = false) {
        if (!force && this.lastProgramsFetch && (Date.now() - this.lastProgramsFetch < 300000)) {
            return
        }

        this.loading = true
        const api = useApi()
        try {
            const data = await api<any>('/investor/programs')
            this.programs = data.programs || []
            this.programStats = data.stats || null
            this.lastProgramsFetch = Date.now()
        } catch (error) {
            console.error('Failed to fetch investor programs:', error)
        } finally {
            this.loading = false
        }
    },

    async fetchAnalytics(force = false, programId?: string | number, startDate?: Date, endDate?: Date) {
        if (!force && this.lastAnalyticsFetch && (Date.now() - this.lastAnalyticsFetch < 300000)) {
            return
        }

        this.loading = true
        const api = useApi()
        try {
            const params: Record<string, any> = {}
            if (programId) params.program_id = programId
            if (startDate) params.start_date = startDate.toISOString().slice(0, 10)
            if (endDate) params.end_date = endDate.toISOString().slice(0, 10)

            const data = await api<any>('/investor/analytics', { params })
            if (data.smes) {
                this.dealFlow = data.smes
            }
            if (data.historical_trend && Array.isArray(data.historical_trend)) {
                this.trendData = data.historical_trend
            }
            if (data.pillar_risk && Array.isArray(data.pillar_risk)) {
                this.pillarRiskData = data.pillar_risk
            }
            this.lastAnalyticsFetch = Date.now()
            return data
        } catch (error) {
            console.error('Failed to fetch investor analytics:', error)
            throw error
        } finally {
            this.loading = false
        }
    },

    async enrollInProgram(programId: number | string) {
        this.loading = true
        const api = useApi()
        try {
            await api(`/investor/programs/${programId}/enroll`, {
                method: 'POST'
            })
            await this.fetchPrograms(true)
        } catch (error) {
            console.error('Failed to enroll in program:', error)
            throw error
        } finally {
            this.loading = false
        }
    },

    async fetchParticipants(programId: number | string) {
        this.loading = true
        this.programParticipants = []
        const api = useApi()
        try {
            const response = await api<any>(`/programs/${programId}/participants`)
            this.programParticipants = response.data || response || []
        } catch (error) {
            console.error('Failed to fetch participants:', error)
        } finally {
            this.loading = false
        }
    }
  }
})
