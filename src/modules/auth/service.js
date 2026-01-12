import api from '@/shared/services/api'
import { API_ENDPOINTS } from '@/shared/constants'

/**
 * Auth Service - Handles all authentication-related API calls
 */

/**
 * Login user with credentials
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise} API response
 */
export const loginApi = (credentials) => {
  return api.post(API_ENDPOINTS.AUTH.LOGIN, credentials)
}

/**
 * Logout current user
 * @returns {Promise} API response
 */
export const logoutApi = () => {
  return api.post(API_ENDPOINTS.AUTH.LOGOUT)
}

/**
 * Get current authenticated user
 * @returns {Promise} API response with user data
 */
export const getUserApi = () => {
  return api.get(API_ENDPOINTS.AUTH.USER)
}

/**
 * Mock login for development (remove when Laravel API is ready)
 * @param {string} role - Selected user role
 * @returns {Promise} Mock user data
 */
export const mockLoginApi = (role) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          user: {
            id: 1,
            name: 'Sokha Chan',
            email: 'sokha@angkortech.com',
            role: role,
            avatar: 'S',
            company: {
              id: 1,
              name: 'Angkor Tech',
              industry: 'Technology',
              size: '10-50 employees',
              founded: '2020',
              lastAssessed: 'Aug 3, 2024'
            }
          },
          token: 'mock-jwt-token-' + Date.now()
        }
      })
    }, 500)
  })
}
