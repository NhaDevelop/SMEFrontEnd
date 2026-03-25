/**
 * admin.reports.store.ts — ViewModel for Admin Reports, SME Directory & Audit Logs
 *
 * MVVM Layer: ViewModel
 * Handles: dashboard stats, SME directory, audit logs, verification requests
 * Extracted from the monolithic admin.store.ts
 */
import { defineStore } from 'pinia'
import { adminService } from '~/modules/admin/admin.service'
import { smeService } from '~/modules/sme/sme.service'

interface AuditLog {
  id: number | string
  admin: string
  action: string
  target: string
  timestamp: string
  details: string
}

interface VerificationRequest {
  id: number | string
  smeName: string
  documentType: string
  submissionDate: string
  status: 'Pending' | 'Approved' | 'Rejected'
  evidenceLink: string
  notes?: string
}

interface SmeProfile {
  id: number | string
  name: string
  industry: string
  location: string
  lastAssessed: string
  riskLevel: string
  readinessStatus: string
  score: number
  growthPotential: number
  programIds: (number | string)[]
  pillars?: any[]
  assessments?: any[]
  programEnrollments?: any[]
  [key: string]: any
}

interface AdminReportsState {
  dashboardStats: any | null
  smes: SmeProfile[]
  selectedSme: SmeProfile | null
  smeDashboard: any | null
  auditLogs: AuditLog[]
  auditLogsMeta: { total: number; currentPage: number; lastPage: number }
  verificationRequests: VerificationRequest[]
  loading: boolean
  error: string | null
}

export const useAdminReportsStore = defineStore('adminReports', {
  state: (): AdminReportsState => ({
    dashboardStats: null,
    smes: [],
    selectedSme: null,
    smeDashboard: null,
    auditLogs: [],
    auditLogsMeta: { total: 0, currentPage: 1, lastPage: 1 },
    verificationRequests: [],
    loading: false,
    error: null,
  }),

  getters: {
    getSmeById: (state) => (id: string | number) => state.smes.find(s => s.id == id),
    pendingVerificationCount: (state) => state.verificationRequests.filter(r => r.status === 'Pending').length,
  },

  actions: {
    // ── Dashboard Stats ─────────────────────────────────────────────────────
    async fetchDashboardStats() {
      this.loading = true
      this.error = null
      try {
        const response = await adminService.fetchStats() as any
        if (response) this.dashboardStats = response
      } catch (err: any) {
        this.error = err.message
        console.error('[AdminReportsStore] fetchDashboardStats error:', err)
      } finally {
        this.loading = false
      }
    },

    // ── SME Directory ───────────────────────────────────────────────────────
    async fetchSmesData(programId?: string | number) {
      try {
        const response = await adminService.fetchSmes(programId) as any[]
        if (response) this.smes = response
      } catch (err: any) {
        console.error('[AdminReportsStore] fetchSmesData error:', err)
      }
    },

    async fetchSmeDetails(id: string | number) {
      this.loading = true
      this.error = null
      try {
        const data = await smeService.fetchSmeDetails(id)
        this.selectedSme = data
        return data
      } catch (e: any) {
        this.error = e.message || 'Failed to fetch SME details'
        throw e
      } finally {
        this.loading = false
      }
    },

    async fetchSmeDashboard(id: string | number) {
      this.loading = true
      this.error = null
      try {
        const data = await smeService.fetchSmeDashboard(id)
        this.smeDashboard = data
        return data
      } catch (e: any) {
        this.error = e.message || 'Failed to fetch SME dashboard'
        throw e
      } finally {
        this.loading = false
      }
    },

    // ── Audit Logs ──────────────────────────────────────────────────────────
    /**
     * Parse log details JSON string into a human-readable sentence.
     */
    parseLogDetails(detailsStr: string): string {
      try {
        const details = JSON.parse(detailsStr)
        if (details.old_status && details.new_status) {
          return `Changed status from ${details.old_status} to ${details.new_status}`
        }
        if (details.old_role && details.new_role) {
          return `Changed role from ${details.old_role} to ${details.new_role}`
        }
        return detailsStr
      } catch {
        return detailsStr
      }
    },

    async fetchAuditLogs(page: number = 1) {
      this.loading = true
      try {
        const response = await adminService.fetchLogs(page) as any
        const logData = response.data || (Array.isArray(response) ? response : [])
        const total = response.total || (Array.isArray(response) ? response.length : 0)
        const currentPage = response.current_page || page
        const lastPage = response.last_page || 1

        this.auditLogs = logData.map((log: any) => ({
          id: log.id,
          admin: log.user?.full_name || 'System',
          action: log.action
            ? log.action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())
            : 'Unknown Action',
          target: `${log.target_entity || 'System'} #${log.target_id || ''}`,
          timestamp: log.created_at ? new Date(log.created_at).toLocaleString() : new Date().toLocaleString(),
          details: typeof log.details === 'string'
            ? this.parseLogDetails(log.details)
            : (log.details ? JSON.stringify(log.details) : 'Activity logged'),
        }))

        this.auditLogsMeta = { total, currentPage, lastPage }
      } catch (err: any) {
        console.error('[AdminReportsStore] fetchAuditLogs error:', err)
      } finally {
        this.loading = false
      }
    },

    // ── Verification Requests ───────────────────────────────────────────────
    async fetchVerifications() {
      try {
        const response = await adminService.fetchVerifications() as any[]
        this.verificationRequests = response || []
      } catch (err) {
        console.error('[AdminReportsStore] fetchVerifications error:', err)
      }
    },

    async verifyDocument(requestId: number | string, isApproved: boolean, notes?: string) {
      this.loading = true
      try {
        await adminService.setVerificationStatus(requestId, isApproved ? 'Approved' : 'Rejected')
        const request = this.verificationRequests.find(r => r.id === requestId)
        if (request) {
          request.status = isApproved ? 'Approved' : 'Rejected'
          if (notes) request.notes = notes
        }
      } catch (err: any) {
        console.error('[AdminReportsStore] verifyDocument error:', err)
      } finally {
        this.loading = false
      }
    },
  },
})
