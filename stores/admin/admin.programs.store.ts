/**
 * admin.programs.store.ts — ViewModel for Admin Program Management
 *
 * MVVM Layer: ViewModel
 * Handles: program list, CRUD, status changes, enrollments
 * Extracted from the monolithic admin.store.ts
 */
import { defineStore } from 'pinia'
import { adminService } from '~/modules/admin/admin.service'

interface ProgramStats {
  total: number
  active: number
  enrolled: number
  avgScore: number
}

interface Program {
  id: number | string
  name: string
  status: string
  description: string
  template: string
  templateId: string | null
  pillarCount?: number
  questionCount?: number
  smesCount: number
  avgScore: number
  progress: number
  startDate?: string
  endDate?: string
  sector?: string
  duration?: string
  investmentAmount?: string
  benefits?: string[]
  enrolledSMEs?: number[]
  createdAt?: string
  createdBy?: string
}

interface AdminProgramsState {
  programs: Program[]
  programStats: ProgramStats | null
  loading: boolean
  error: string | null
  notification: { message: string; type: 'success' | 'error' }
}

export const useAdminProgramsStore = defineStore('adminPrograms', {
  state: (): AdminProgramsState => ({
    programs: [],
    programStats: null,
    loading: false,
    error: null,
    notification: { message: '', type: 'success' },
  }),

  getters: {
    filteredPrograms: (state) => (query: string) => {
      if (!query) return state.programs
      const lq = query.toLowerCase()
      return state.programs.filter(
        p => p.name.toLowerCase().includes(lq) || p.description?.toLowerCase().includes(lq)
      )
    },
  },

  actions: {
    showNotification(message: string, type: 'success' | 'error' = 'success') {
      this.notification = { message, type }
      setTimeout(() => { this.notification.message = '' }, 3500)
    },

    async fetchProgramsData() {
      this.loading = true
      this.error = null
      try {
        const response = await adminService.fetchPrograms() as any
        this.programs = response.programs || []

        // Compute stats locally for accuracy
        const total = this.programs.length
        const active = this.programs.filter(p => p.status === 'Published').length
        const enrolled = this.programs.reduce((sum, p) => sum + (p.smesCount || 0), 0)
        const avgScore = total
          ? Math.round(this.programs.reduce((sum, p) => sum + (p.avgScore || 0), 0) / total)
          : 0
        this.programStats = { total, active, enrolled, avgScore }
      } catch (err: any) {
        if (err.status === 404) {
          console.warn('[AdminProgramsStore] Programs endpoint not found (404).')
        } else {
          this.error = err.message
          console.error('[AdminProgramsStore] fetchProgramsData error:', err)
        }
      } finally {
        this.loading = false
      }
    },

    async createProgram(programData: any) {
      this.loading = true
      try {
        const newProgram = await adminService.addProgram(programData)
        this.programs.unshift(newProgram as Program)
        this.showNotification('Program created successfully')
      } catch (err: any) {
        this.error = err.message
        this.showNotification(err.message || 'Failed to create program', 'error')
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateProgram(programData: any) {
      this.loading = true
      try {
        const updatedData = await adminService.updateProgram(programData.id, programData)
        const index = this.programs.findIndex(p => String(p.id) === String(updatedData.id))
        if (index !== -1) {
          const cleanUpdate = Object.fromEntries(
            Object.entries(updatedData).filter(([_, v]) => v !== undefined && v !== null && v !== '')
          )
          this.programs[index] = { ...this.programs[index], ...cleanUpdate } as Program
        }
        this.showNotification('Program updated successfully')
      } catch (err: any) {
        this.error = err.message
        this.showNotification(err.message || 'Failed to update program', 'error')
        throw err
      } finally {
        this.loading = false
      }
    },

    async changeProgramStatus(id: number | string, status: string) {
      this.loading = true
      try {
        const updatedData = await adminService.setProgramStatus(id, status)
        const index = this.programs.findIndex(p => String(p.id) === String(id))
        if (index !== -1) {
          const cleanUpdate = Object.fromEntries(
            Object.entries(updatedData).filter(([_, v]) => v !== undefined && v !== null && v !== '')
          )
          this.programs[index] = { ...this.programs[index], ...cleanUpdate } as Program
        }
        this.showNotification(`Program ${status.toLowerCase()} successfully`)
      } catch (err: any) {
        this.error = err.message
        this.showNotification(err.message || 'Failed to update program status', 'error')
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteProgram(id: number | string) {
      this.loading = true
      try {
        await adminService.deleteProgram(id)
        await this.fetchProgramsData()
        this.showNotification('Program deleted')
      } catch (err: any) {
        this.error = err.message
        this.showNotification(err.message || 'Failed to delete program', 'error')
        throw err
      } finally {
        this.loading = false
      }
    },

    async enrollSmes(programId: number | string, smeIds: (number | string)[]) {
      this.loading = true
      try {
        await adminService.enroll(programId, smeIds)
        await this.fetchProgramsData()
        this.showNotification('SMEs enrolled successfully')
      } catch (err: any) {
        this.error = err.message
        this.showNotification(err.message || 'Failed to enroll SMEs', 'error')
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateEnrollmentStatus(programId: number | string, smeId: number | string, status: string) {
      try {
        await adminService.updateEnrollmentStatus(programId, smeId, status)
        await this.fetchProgramsData()
        this.showNotification('Enrollment status updated')
      } catch (err: any) {
        this.error = err.message
        this.showNotification(err.message || 'Failed to update enrollment', 'error')
        throw err
      }
    },
  },
})
