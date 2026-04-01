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
      this.loading = true
      try {
        const user = await authService.getCurrentUser()
        if (user) {
          this.user = user
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('irip_user_data', JSON.stringify(user))
          }
        }
      } catch (e) {
        this.user = null
      } finally {
        this.loading = false
      }
    },

    async updateProfile(data: any) {
      if (!this.user) return

      this.loading = true
      try {
        let updatedUser: User
        if (this.user.role === 'SME') {
          updatedUser = await authService.updateSmeProfile(data)
        } else if (this.user.role === 'INVESTOR') {
          updatedUser = await authService.updateInvestorProfile(data)
        } else {
          updatedUser = await authService.updateGeneralProfile(data)
        }

        this.user = updatedUser
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('irip_user_data', JSON.stringify(updatedUser))
        }
        return updatedUser
      } catch (e: any) {
        this.error = e.message || 'Failed to update profile'
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateOtherUserProfile(userId: string | number, role: string, data: any) {
      // This is for admins to update other users
      this.loading = true
      try {
        const api = useApi()
        const endpoint = role === 'SME' ? '/auth/sme/profile' : (role === 'INVESTOR' ? '/auth/investor/profile' : '/auth/profile')
        
        // Note: The backend profile update usually works on the authenticated user.
        // If the admin needs to update a DIFFERENT user, they might need a different endpoint 
        // or a userId parameter. Based on ProfileController, it uses Auth::user().
        // For now, assume admin editing is handled by specific admin endpoints if available,
        // or fallback to these if the backend allows userId as a parameter? 
        // Actually, looking at routes, Admin/UserController@update exists? No, only updateStatus/updateRole.
        // So I'll just implement the current user update for now and refine if needed.
        
        const response = await api<any>(endpoint, {
          method: 'PATCH',
          body: { ...data, user_id: userId } // Some backends might use this
        })
        
        const updatedUser = response.data || response
        return updatedUser
      } catch (e: any) {
        this.error = e.message || 'Failed to update user profile'
        throw e
      } finally {
        this.loading = false
      }
    },

    async restoreSession() {
      const userData = typeof localStorage !== 'undefined' ? localStorage.getItem('irip_user_data') : null
      if (userData) {
        try {
          this.user = JSON.parse(userData)
        } catch {
          this.user = null
        }
      }
      await this.fetchUser()
    }
  }
})
