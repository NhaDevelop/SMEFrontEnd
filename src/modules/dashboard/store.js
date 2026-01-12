import { defineStore } from 'pinia'
import { mockDashboardDataApi } from './service'
import { calculateOverallScore, calculateGrowthPotential, getRiskLevel } from '@/shared/utils/helpers'

/**
 * Dashboard Store - Manages dashboard state and business logic
 */
export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    pillars: [],
    progressData: [],
    actions: [],
    loading: false,
    error: null
  }),

  getters: {
    /**
     * Calculate overall investment readiness score
     */
    overallScore: (state) => calculateOverallScore(state.pillars),
    
    /**
     * Calculate average growth potential
     */
    growthPotential: (state) => calculateGrowthPotential(state.pillars),
    
    /**
     * Get overall risk level based on score
     */
    overallRiskLevel: (state) => {
      const score = calculateOverallScore(state.pillars)
      return getRiskLevel(score)
    },
    
    /**
     * Get latest assessment date
     */
    latestAssessmentDate: (state) => {
      if (state.progressData.length === 0) return null
      return state.progressData[state.progressData.length - 1].month
    },
    
    /**
     * Calculate score change from previous period
     */
    scoreChange: (state) => {
      if (state.progressData.length < 2) return 0
      const current = state.progressData[state.progressData.length - 1].score
      const previous = state.progressData[state.progressData.length - 2].score
      return current - previous
    },

    /**
     * Group pillars by risk level
     */
    pillarsByRisk: (state) => {
      return {
        high: state.pillars.filter(p => p.riskLevel === 'high'),
        medium: state.pillars.filter(p => p.riskLevel === 'medium'),
        low: state.pillars.filter(p => p.riskLevel === 'low')
      }
    },

    /**
     * Get pending actions count
     */
    actionsCount: (state) => {
      return state.actions.filter(a => a.status !== 'completed').length
    },

    /**
     * Group actions by priority
     */
    actionsByPriority: (state) => {
      return {
        high: state.actions.filter(a => a.priority === 'high'),
        medium: state.actions.filter(a => a.priority === 'medium'),
        low: state.actions.filter(a => a.priority === 'low')
      }
    }
  },

  actions: {
    /**
     * Fetch all dashboard data
     */
    async fetchDashboardData() {
      this.loading = true
      this.error = null
      
      try {
        // Using mock API for now - replace with real API when Laravel is ready
        const response = await mockDashboardDataApi()
        const { pillars, progress, actions } = response.data
        
        this.pillars = pillars
        this.progressData = progress
        this.actions = actions
      } catch (error) {
        this.error = error.message
        console.error('Dashboard data fetch error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Update pillar score
     * @param {number} pillarId - Pillar ID
     * @param {number} newScore - New score value
     */
    updatePillarScore(pillarId, newScore) {
      const pillar = this.pillars.find(p => p.id === pillarId)
      if (pillar) {
        pillar.score = newScore
        pillar.riskLevel = getRiskLevel(newScore)
      }
    },

    /**
     * Update action status
     * @param {number} actionId - Action ID
     * @param {string} newStatus - New status
     */
    updateActionStatus(actionId, newStatus) {
      const action = this.actions.find(a => a.id === actionId)
      if (action) {
        action.status = newStatus
      }
    },

    /**
     * Add new action
     * @param {Object} actionData - Action data
     */
    addAction(actionData) {
      this.actions.push({
        id: Date.now(),
        ...actionData,
        status: 'pending'
      })
    },

    /**
     * Remove action
     * @param {number} actionId - Action ID
     */
    removeAction(actionId) {
      const index = this.actions.findIndex(a => a.id === actionId)
      if (index !== -1) {
        this.actions.splice(index, 1)
      }
    }
  }
})
