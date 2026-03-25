/**
 * admin.users.store.ts — ViewModel for Admin User Management
 *
 * MVVM Layer: ViewModel
 * Handles: user list, pending approvals, role changes, password resets
 * Extracted from the monolithic admin.store.ts
 */
import { defineStore } from 'pinia'
import { adminService } from '~/modules/admin/admin.service'

interface UserStats {
  total: number
  pending: number
  smes: number
  investors: number
  admins: number
}

interface User {
  id: number | string
  name: string
  full_name?: string
  email: string
  phone?: string
  role: 'admin' | 'sme' | 'investor' | 'SME' | 'INVESTOR' | 'ADMIN'
  status: 'active' | 'pending' | 'rejected' | 'ACTIVE' | 'PENDING' | 'REJECTED'
  department?: string
  lastActive?: string
  registered?: string
  created_at?: string
  company?: string
  industry?: string
  sme_profile?: any
  investor_profile?: any
}

interface AdminUsersState {
  users: User[]
  pendingUsers: User[]
  userStats: UserStats | null
  loading: boolean
  error: string | null
  notification: { message: string; type: 'success' | 'error' }
}

export const useAdminUsersStore = defineStore('adminUsers', {
  state: (): AdminUsersState => ({
    users: [],
    pendingUsers: [],
    userStats: null,
    loading: false,
    error: null,
    notification: { message: '', type: 'success' },
  }),

  getters: {
    pendingUsersList: (state) => state.users.filter(u => u.status?.toLowerCase() === 'pending'),
    approvedUsersList: (state) => state.users.filter(u => u.status?.toLowerCase() === 'active'),
  },

  actions: {
    showNotification(message: string, type: 'success' | 'error' = 'success') {
      this.notification = { message, type }
      setTimeout(() => { this.notification.message = '' }, 3500)
    },

    async fetchUsersData() {
      this.loading = true
      this.error = null
      try {
        const response = await adminService.fetchUsers() as any
        const userList = Array.isArray(response) ? response : (response?.users || [])
        this.users = userList

        if (response?.stats) {
          this.userStats = response.stats
        } else {
          this.userStats = {
            total: this.users.length,
            pending: this.users.filter((u: any) => u.status?.toLowerCase() === 'pending').length,
            smes: this.users.filter((u: any) => u.role?.toLowerCase() === 'sme').length,
            investors: this.users.filter((u: any) => u.role?.toLowerCase() === 'investor').length,
            admins: this.users.filter((u: any) => u.role?.toLowerCase() === 'admin').length,
          }
        }
        if (!Array.isArray(response) && response?.pendingUsers) {
          this.pendingUsers = response.pendingUsers
        }
      } catch (err: any) {
        this.error = err.message
        console.error('[AdminUsersStore] fetchUsersData error:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchPendingUsers() {
      this.loading = true
      this.error = null
      try {
        const response = await adminService.fetchPendingUsers() as any
        this.pendingUsers = response || []
      } catch (err: any) {
        this.error = err.message
        console.error('[AdminUsersStore] fetchPendingUsers error:', err)
      } finally {
        this.loading = false
      }
    },

    async createUser(userData: any) {
      this.loading = true
      this.error = null
      try {
        await adminService.createUser(userData)
        await this.fetchUsersData()
        this.showNotification('User created with profile successfully')
      } catch (e: any) {
        this.error = e.message
        this.showNotification(e.message || 'Failed to create user', 'error')
        throw e
      } finally {
        this.loading = false
      }
    },

    async approveUser(id: number | string) {
      this.loading = true
      try {
        await adminService.setStatus(id, 'approve')
        await this.fetchUsersData()
        await this.fetchPendingUsers()
        this.showNotification('User approved successfully')
      } catch (e: any) {
        this.error = e.message
        this.showNotification(e.message || 'Failed to approve user', 'error')
      } finally {
        this.loading = false
      }
    },

    async rejectUser(id: number | string) {
      this.loading = true
      try {
        await adminService.setStatus(id, 'reject')
        await this.fetchUsersData()
        await this.fetchPendingUsers()
        this.showNotification('User rejected')
      } catch (e: any) {
        this.error = e.message
        this.showNotification(e.message || 'Failed to reject user', 'error')
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id: number | string) {
      this.loading = true
      try {
        await adminService.removeUser(id)
        await this.fetchUsersData()
        this.showNotification('User deleted')
      } catch (e: any) {
        this.error = e.message
        this.showNotification(e.message || 'Failed to delete user', 'error')
      } finally {
        this.loading = false
      }
    },

    async changeUserRole(id: number | string, role: string) {
      this.loading = true
      try {
        await adminService.setRole(id, role.toUpperCase())
        await this.fetchUsersData()
        this.showNotification('User role updated')
      } catch (e: any) {
        this.error = e.message
        this.showNotification(e.message || 'Failed to update role', 'error')
      } finally {
        this.loading = false
      }
    },

    async resetUserPassword(id: number | string, password?: string) {
      this.loading = true
      try {
        await adminService.resetUserPassword(id, password)
        this.showNotification('Password updated successfully')
      } catch (e: any) {
        this.error = e.message
        this.showNotification(e.message || 'Failed to update password', 'error')
      } finally {
        this.loading = false
      }
    },
  },
})
