import { defineStore } from 'pinia'
import { DashboardService } from '~/modules/dashboard/dashboard.service'
import { calculateOverallScore, calculateGrowthPotential, getRiskLevel } from '~/utils/helpers'

interface Pillar {
  id: string | number
  name: string
  score: number
  weight?: number
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
  priority?: string
  pillarRisk?: string
  pillar: string
  impact: number
  description?: string
  userAnswer?: string
  bestOption?: string
}

interface DashboardState {
  company: any | null
  pillars: Pillar[]
  progressData: ProgressData[]
  actions: Action[]
  primaryGoal: any | null
  goalsStats: { active: number, achieved: number, progress: number } | null
  frameworkThresholds: any[]
  isAssessmentActive: boolean
  loading: boolean
  error: string | null
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    company: null,
    pillars: [],
    progressData: [],
    actions: [],
    primaryGoal: null,
    goalsStats: null,
    frameworkThresholds: [],
    isAssessmentActive: false,
    loading: false,
    error: null
  }),

  getters: {
    overallScore: (state) => state.company?.overallScore ?? calculateOverallScore(state.pillars),
    growthPotential: (state) => {
      // Calculate growth potential strictly based on the recommended actions
      const sum = state.actions.reduce((acc, a) => acc + (a.impact || 0), 0)
      return parseFloat(sum.toFixed(2))
    },
    overallRiskLevel(): string {
      return getRiskLevel(this.overallScore, this.frameworkThresholds)
    },
    latestAssessmentDate: (state) => {
      const data = state.progressData || []
      const lastItem = data[data.length - 1]
      return lastItem ? lastItem.month : null
    },
    scoreChange: (state) => {
      const data = state.progressData || []
      if (data.length < 2) return 0
      const current = data[data.length - 1]
      const previous = data[data.length - 2]
      
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
        // Backend now uses the authenticated user's SME profile automatically
        const response = await dashboardService.getDashboardData('me') 
        const { company, pillars, progress, actions, primaryGoal, goalsStats, thresholds } = response
        
        this.company = company
        this.pillars = pillars
        this.progressData = progress
        this.actions = actions
        this.primaryGoal = primaryGoal
        this.goalsStats = goalsStats || { active: 0, achieved: 0, progress: 0 }
        this.frameworkThresholds = thresholds || []
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
