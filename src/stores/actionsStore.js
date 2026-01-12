import { defineStore } from 'pinia'
import { mockRecommendedActions } from '@/utils/mockData'

export const useActionsStore = defineStore('actions', {
  state: () => ({
    actions: mockRecommendedActions,
    isLoading: false
  }),

  getters: {
    actionsByPriority: (state) => {
      return {
        high: state.actions.filter(a => a.priority === 'high'),
        medium: state.actions.filter(a => a.priority === 'medium'),
        low: state.actions.filter(a => a.priority === 'low')
      }
    },

    actionsByStatus: (state) => {
      return {
        pending: state.actions.filter(a => a.status === 'pending'),
        in_progress: state.actions.filter(a => a.status === 'in_progress'),
        completed: state.actions.filter(a => a.status === 'completed')
      }
    },

    actionsCount: (state) => state.actions.filter(a => a.status !== 'completed').length,

    totalImpact: (state) => {
      return state.actions
        .filter(a => a.status !== 'completed')
        .reduce((sum, action) => sum + action.impact, 0)
    }
  },

  actions: {
    async fetchActions() {
      this.isLoading = true
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      this.isLoading = false
    },

    updateActionStatus(actionId, newStatus) {
      const action = this.actions.find(a => a.id === actionId)
      if (action) {
        action.status = newStatus
      }
    },

    addAction(actionData) {
      this.actions.push({
        id: Date.now(),
        ...actionData,
        status: 'pending'
      })
    },

    removeAction(actionId) {
      const index = this.actions.findIndex(a => a.id === actionId)
      if (index !== -1) {
        this.actions.splice(index, 1)
      }
    }
  }
})
