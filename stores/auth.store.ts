import { defineStore } from 'pinia'
import { authService } from '~/modules/auth/auth.service'
import type { User } from '~/modules/auth/auth.types'
import { useDashboardStore } from '~/stores/dashboard.store'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    role: (state) => state.user?.role,
    userRole: (state) => state.user?.role,
    companyInfo: (state) => {
      if (!state.user) return null
      
      if (state.user.role === 'SME' && state.user.sme_profile) {
        return {
          id: state.user.sme_profile.id,
          name: state.user.sme_profile.company_name,
          industry: state.user.sme_profile.industry,
          readinessScore: state.user.sme_profile.readiness_score
        }
      }
      
      if (state.user.role === 'INVESTOR' && state.user.investor_profile) {
        return {
          id: state.user.investor_profile.id,
          name: state.user.investor_profile.organization_name,
          industry: state.user.investor_profile.industry
        }
      }
      
      return state.user.company || null
    }
  },


  actions: {
    async login(credentials: any) {
      this.loading = true
      this.error = null
      try {
        const response = await authService.login(credentials)
        
        // Persist token for session restoration
        const token = response.access_token
        const tokenCookie = useCookie('irip_access_token', { maxAge: 60 * 60 * 24 * 7 }) // 7 days
        tokenCookie.value = token
        
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('irip_access_token', token)
        }

        // Now fetch the user profile since it's not in the login response
        await this.fetchUser()
        
        if (this.user && typeof localStorage !== 'undefined') {
          localStorage.setItem('irip_user_data', JSON.stringify(this.user))
        }

        return response
      } catch (e: any) {
        this.error = e.message || 'Login failed'
        throw e
      } finally {
        this.loading = false
      }
    },

    async logout() {
      const authCookie = useCookie('irip_auth_user')
      const tokenCookie = useCookie('irip_access_token')
      
      try {
        await authService.logout()
      } finally {
        // Clear all cached store data so the next account starts fresh
        const dashboardStore = useDashboardStore()
        dashboardStore.$reset()
        this.user = null
        authCookie.value = null
        tokenCookie.value = null
        
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('irip_access_token')
          localStorage.removeItem('irip_user_data')
          localStorage.removeItem('irip_auth_user')
        }
        
        navigateTo('/')
      }
    },

    async fetchUser() {
      if (this.user) return
      
      this.loading = true
      try {
        this.user = await authService.getCurrentUser()
      } catch (e) {
        this.user = null
      } finally {
        this.loading = false
      }
    },

    async restoreSession() {
      await this.fetchUser()
    }
  }
})
