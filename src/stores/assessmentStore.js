import { defineStore } from 'pinia'
import { 
  mockPillars, 
  mockProgressData, 
  mockAssessmentHistory,
  calculateOverallScore,
  calculateGrowthPotential,
  getRiskLevel
} from '@/utils/mockData'

export const useAssessmentStore = defineStore('assessment', {
  state: () => ({
    pillars: mockPillars,
    progressData: mockProgressData,
    assessmentHistory: mockAssessmentHistory,
    currentAssessment: null,
    isLoading: false
  }),

  getters: {
    overallScore: (state) => calculateOverallScore(state.pillars),
    
    growthPotential: (state) => calculateGrowthPotential(state.pillars),
    
    overallRiskLevel: (state) => {
      const score = calculateOverallScore(state.pillars)
      return getRiskLevel(score)
    },
    
    latestAssessmentDate: (state) => {
      if (state.assessmentHistory.length === 0) return null
      return state.assessmentHistory[0].date
    },
    
    scoreChange: (state) => {
      if (state.progressData.length < 2) return 0
      const current = state.progressData[state.progressData.length - 1].score
      const previous = state.progressData[state.progressData.length - 2].score
      return current - previous
    },

    pillarsByRisk: (state) => {
      return {
        high: state.pillars.filter(p => p.riskLevel === 'high'),
        medium: state.pillars.filter(p => p.riskLevel === 'medium'),
        low: state.pillars.filter(p => p.riskLevel === 'low')
      }
    }
  },

  actions: {
    async fetchAssessmentData() {
      this.isLoading = true
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      // Data is already loaded from mockData
      this.isLoading = false
    },

    updatePillarScore(pillarId, newScore) {
      const pillar = this.pillars.find(p => p.id === pillarId)
      if (pillar) {
        pillar.score = newScore
        pillar.riskLevel = getRiskLevel(newScore)
      }
    },

    startNewAssessment() {
      this.currentAssessment = {
        id: Date.now(),
        startDate: new Date().toISOString(),
        status: 'in_progress',
        responses: {}
      }
    },

    saveAssessmentResponse(pillarId, questionId, response) {
      if (this.currentAssessment) {
        if (!this.currentAssessment.responses[pillarId]) {
          this.currentAssessment.responses[pillarId] = {}
        }
        this.currentAssessment.responses[pillarId][questionId] = response
      }
    },

    async submitAssessment() {
      if (!this.currentAssessment) return

      this.isLoading = true
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add to history
      this.assessmentHistory.unshift({
        id: this.currentAssessment.id,
        date: new Date().toISOString().split('T')[0],
        overallScore: this.overallScore,
        status: 'completed'
      })

      this.currentAssessment = null
      this.isLoading = false
    }
  }
})
