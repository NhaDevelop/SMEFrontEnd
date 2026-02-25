import { defineStore } from 'pinia'
import { authService } from '~/modules/auth/auth.service'
import type { User } from '~/modules/auth/auth.types'

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
    companyInfo: (state) => state.user?.company
  },

  actions: {
    async login(credentials: any) {
      this.loading = true
      this.error = null
      try {
        const response = await authService.login(credentials)
        this.user = response.user
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
      try {
        await authService.logout()
      } finally {
        this.user = null
        authCookie.value = null
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
