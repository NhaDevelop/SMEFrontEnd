import { defineStore } from 'pinia'
import { mockUser } from '@/utils/mockData'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    selectedRole: null
  }),

  getters: {
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.role,
    companyInfo: (state) => state.user?.company
  },

  actions: {
    setUser(userData) {
      this.user = userData
      this.isAuthenticated = true
    },

    setRole(role) {
      this.selectedRole = role
    },

    login(role) {
      // Mock login - will be replaced with actual API call
      this.selectedRole = role
      this.setUser(mockUser)
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      this.selectedRole = null
    },

    updateProfile(profileData) {
      if (this.user) {
        this.user = { ...this.user, ...profileData }
      }
    },

    updateCompany(companyData) {
      if (this.user?.company) {
        this.user.company = { ...this.user.company, ...companyData }
      }
    }
  }
})
