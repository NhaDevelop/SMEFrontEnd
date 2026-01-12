import api from '@/shared/services/api'
import { API_ENDPOINTS } from '@/shared/constants'

/**
 * Dashboard Service - Handles all dashboard-related API calls
 */

/**
 * Get complete dashboard data
 * @returns {Promise} API response with dashboard data
 */
export const getDashboardDataApi = () => {
  return api.get(API_ENDPOINTS.DASHBOARD.DATA)
}

/**
 * Get all pillar scores
 * @returns {Promise} API response with pillar data
 */
export const getPillarsApi = () => {
  return api.get(API_ENDPOINTS.DASHBOARD.PILLARS)
}

/**
 * Get progress data over time
 * @returns {Promise} API response with progress data
 */
export const getProgressApi = () => {
  return api.get(API_ENDPOINTS.DASHBOARD.PROGRESS)
}

/**
 * Get recommended actions
 * @returns {Promise} API response with actions
 */
export const getActionsApi = () => {
  return api.get(API_ENDPOINTS.DASHBOARD.ACTIONS)
}

/**
 * Update action status
 * @param {number} actionId - Action ID
 * @param {string} status - New status
 * @returns {Promise} API response
 */
export const updateActionStatusApi = (actionId, status) => {
  return api.put(`${API_ENDPOINTS.DASHBOARD.ACTIONS}/${actionId}`, { status })
}

/**
 * Mock dashboard data for development
 * @returns {Promise} Mock data
 */
import { mockPillars, mockProgressData, mockRecommendedActions } from '@/shared/utils/mockData'

export const mockDashboardDataApi = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          pillars: mockPillars,
          progress: mockProgressData,
          actions: mockRecommendedActions
        }
      })
    }, 300)
  })
}
