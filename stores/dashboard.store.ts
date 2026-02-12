import { defineStore } from 'pinia'
import { DashboardService } from '~/modules/dashboard/dashboard.service'
import { calculateOverallScore, calculateGrowthPotential, getRiskLevel } from '~/utils/helpers'

interface Pillar {
  id: string | number
  name: string
  score: number
  improvementPotential?: number
}

interface ProgressData {
  month: string
  score: number
}

interface Action {
  id: string | number
  title: string
  status: 'pending' | 'in_progress' | 'completed'
}

interface DashboardState {
  pillars: Pillar[]
  progressData: ProgressData[]
  actions: Action[]
  loading: boolean
  error: string | null
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    pillars: [],
    progressData: [],
    actions: [],
    loading: false,
    error: null
  }),

  getters: {
    overallScore: (state) => calculateOverallScore(state.pillars),
    growthPotential: (state) => calculateGrowthPotential(state.pillars),
    overallRiskLevel: (state) => {
      const score = calculateOverallScore(state.pillars)
      return getRiskLevel(score)
    },
    latestAssessmentDate: (state) => {
      const lastItem = state.progressData[state.progressData.length - 1]
      return lastItem ? lastItem.month : null
    },
    scoreChange: (state) => {
      if (state.progressData.length < 2) return 0
      const current = state.progressData[state.progressData.length - 1]
      const previous = state.progressData[state.progressData.length - 2]
      
      const currentScore = current ? current.score : 0
      const previousScore = previous ? previous.score : 0
      
      return currentScore - previousScore
    },
    actionsCount: (state): number => {
      return state.actions.filter(a => a.status !== 'completed').length
    }
  },

  actions: {
    async fetchDashboardData() {
      this.loading = true
      this.error = null
      const dashboardService = new DashboardService()
      
      try {
        const response = await dashboardService.getDashboardData()
        const { pillars, progress, actions } = response
        
        this.pillars = pillars
        this.progressData = progress
        this.actions = actions
      } catch (error: any) {
        this.error = error.message
        console.error('Dashboard data fetch error:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
