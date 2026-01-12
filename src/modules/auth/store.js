import { defineStore } from 'pinia'
import { mockLoginApi, logoutApi } from './service'
import { STORAGE_KEYS } from '@/shared/constants'

/**
 * Auth Store - Manages authentication state and logic
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    selectedRole: null,
    loading: false,
    error: null
  }),

  getters: {
    /**
     * Get current user
     */
    currentUser: (state) => state.user,
    
    /**
     * Get user role
     */
    userRole: (state) => state.user?.role,
    
    /**
     * Get company information
     */
    companyInfo: (state) => state.user?.company,
    
    /**
     * Check if user is authenticated
     */
    isLoggedIn: (state) => state.isAuthenticated && !!state.user
  },

  actions: {
    /**
     * Login user with role selection
     * @param {string} role - Selected user role
     */
    async login(role) {
      this.loading = true
      this.error = null
      
      try {
        // Using mock API for now - replace with real API when Laravel is ready
        const response = await mockLoginApi(role)
        const { user, token } = response.data
        
        this.user = user
        this.token = token
        this.selectedRole = role
        this.isAuthenticated = true
        
        // Store in localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user))
        localStorage.setItem(STORAGE_KEYS.SELECTED_ROLE, role)
        
        return user
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Logout current user
     */
    async logout() {
      this.loading = true
      
      try {
        // Call logout API (commented out for mock)
        // await logoutApi()
        
        // Clear state
        this.user = null
        this.token = null
        this.selectedRole = null
        this.isAuthenticated = false
        
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER_DATA)
        localStorage.removeItem(STORAGE_KEYS.SELECTED_ROLE)
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * Set user role
     * @param {string} role - User role
     */
    setRole(role) {
      this.selectedRole = role
      localStorage.setItem(STORAGE_KEYS.SELECTED_ROLE, role)
    },

    /**
     * Update user profile
     * @param {Object} profileData - Profile data to update
     */
    updateProfile(profileData) {
      if (this.user) {
        this.user = { ...this.user, ...profileData }
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(this.user))
      }
    },

    /**
     * Update company information
     * @param {Object} companyData - Company data to update
     */
    updateCompany(companyData) {
      if (this.user?.company) {
        this.user.company = { ...this.user.company, ...companyData }
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(this.user))
      }
    },

    /**
     * Restore session from localStorage
     */
    restoreSession() {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
      const role = localStorage.getItem(STORAGE_KEYS.SELECTED_ROLE)
      
      if (token && userData) {
        this.token = token
        this.user = JSON.parse(userData)
        this.selectedRole = role
        this.isAuthenticated = true
      }
    }
  }
})
