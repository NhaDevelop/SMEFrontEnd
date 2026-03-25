/**
 * admin.framework.store.ts — ViewModel for Framework Management
 *
 * MVVM Layer: ViewModel
 * Handles: pillars, templates, questions, sectors, scoring rules, framework settings
 * Extracted from the monolithic admin.store.ts
 */
import { defineStore } from 'pinia'
import { adminService } from '~/modules/admin/admin.service'

interface PillarWeight {
  id: string
  name: string
  weight: number
  indicators?: string[]
}

interface Template {
  id: string
  name: string
  version: string
  pillarCount: number
  questionCount: number
  usageCount: number
  description: string
  status?: 'Active' | 'Draft' | 'Archived'
  updatedAt?: string
  updatedBy?: string
}

interface Question {
  id: string
  pillarId: string
  templateId?: string
  text: string
  type: string
  weight: number
  required: boolean
  helperText?: string
  options?: string[]
}

interface ScoringRule {
  id: string
  name: string
  condition: string
  modifier: number
  isActive: boolean
}

interface AdminFrameworkState {
  frameworkSettings: PillarWeight[]
  frameworkThresholds: any[]
  templates: Template[]
  activeTemplates: Template[]
  questions: Question[]
  sectors: any[]
  scoringRules: ScoringRule[]
  loading: boolean
  error: string | null
  notification: { message: string; type: 'success' | 'error' }
}

export const useAdminFrameworkStore = defineStore('adminFramework', {
  state: (): AdminFrameworkState => ({
    frameworkSettings: [
      { id: 'team',     name: 'Team & Leadership',      weight: 12.5 },
      { id: 'business', name: 'Business Model',          weight: 12.5 },
      { id: 'market',   name: 'Market & Traction',       weight: 12.5 },
      { id: 'finance',  name: 'Financial Readiness',     weight: 12.5 },
      { id: 'ops',      name: 'Operations',              weight: 12.5 },
      { id: 'legal',    name: 'Legal & Governance',      weight: 12.5 },
      { id: 'data',     name: 'Data & Digital Maturity', weight: 12.5 },
      { id: 'growth',   name: 'Growth & Scalability',    weight: 12.5 },
    ],
    frameworkThresholds: [],
    templates: [],
    activeTemplates: [],
    questions: [],
    sectors: [],
    scoringRules: [],
    loading: false,
    error: null,
    notification: { message: '', type: 'success' },
  }),

  actions: {
    showNotification(message: string, type: 'success' | 'error' = 'success') {
      this.notification = { message, type }
      setTimeout(() => { this.notification.message = '' }, 3500)
    },

    // ── Framework Settings ──────────────────────────────────────────────────
    async fetchFrameworkSettings() {
      this.loading = true
      try {
        const response: any = await adminService.fetchFrameworkSettings().catch(() => null)
        if (response) {
          const pillars = response.settings?.pillars || response.pillars || response.data?.pillars
          const thresholds = response.settings?.thresholds || response.thresholds || response.data?.thresholds

          if (pillars && Array.isArray(pillars)) {
            this.frameworkSettings = pillars.map((p: any) => ({
              id: String(p.id),
              name: p.name,
              weight: Number(p.weight),
              indicators: p.indicators || [],
            }))
          }
          if (thresholds && Array.isArray(thresholds)) {
            this.frameworkThresholds = thresholds
          }

          // Fallback: fetch pillars directly
          if (!this.frameworkSettings.length) {
            const rawPillars = await adminService.fetchPillars() as any[]
            if (rawPillars?.length > 0) this.frameworkSettings = rawPillars
          }
        }
      } catch (err: any) {
        console.error('[AdminFrameworkStore] fetchFrameworkSettings error:', err)
      } finally {
        this.loading = false
      }
    },

    async updateFrameworkSettings(payloadData: { pillars: PillarWeight[]; thresholds?: any[] }) {
      this.loading = true
      try {
        const currentData = await adminService.fetchFrameworkSettings() as any
        const payload = {
          pillars: payloadData.pillars,
          thresholds: payloadData.thresholds || currentData?.thresholds || [],
        }
        const response = await adminService.saveFrameworkSettings(payload) as any
        if (response) {
          this.frameworkSettings = response.settings?.pillars || response.pillars || []
          if (response.settings?.thresholds || response.thresholds) {
            this.frameworkThresholds = response.settings?.thresholds || response.thresholds
          }
          this.showNotification('Framework settings saved successfully')
        }
      } catch (err) {
        console.error('[AdminFrameworkStore] updateFrameworkSettings error:', err)
        this.showNotification('Failed to save framework settings', 'error')
      } finally {
        this.loading = false
      }
    },

    async updatePillarWeight(id: string, weight: number) {
      this.loading = true
      try {
        await adminService.updatePillar(id, { weight })
        const idx = this.frameworkSettings.findIndex(p => p.id === id)
        if (idx !== -1 && this.frameworkSettings[idx]) {
          this.frameworkSettings[idx].weight = weight
        }
        this.showNotification('Pillar weight updated')
      } catch (e: any) {
        this.error = e.message
        this.showNotification(e.message || 'Failed to update pillar weight', 'error')
      } finally {
        this.loading = false
      }
    },

    // ── Templates ───────────────────────────────────────────────────────────
    async fetchTemplatesData() {
      this.loading = true
      this.error = null
      try {
        const response = await adminService.fetchTemplates() as any[]
        this.templates = response
        await this.fetchQuestionsData()
      } catch (err: any) {
        if (err.status !== 404) {
          this.error = err.message
          console.error('[AdminFrameworkStore] fetchTemplatesData error:', err)
        }
      } finally {
        this.loading = false
      }
    },

    async fetchActiveTemplates(programId?: number | string) {
      this.loading = true
      try {
        this.activeTemplates = await adminService.fetchActiveTemplates(programId) as any[]
      } catch (err: any) {
        console.error('[AdminFrameworkStore] fetchActiveTemplates error:', err)
      } finally {
        this.loading = false
      }
    },

    async createTemplate(data: any) {
      this.loading = true
      try {
        const t = await adminService.createTemplate(data) as any
        this.templates.unshift(t)
        this.showNotification('Template created successfully')
      } catch (e: any) {
        this.showNotification(e.message || 'Failed to create template', 'error')
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateTemplate(id: string | number, data: any) {
      this.loading = true
      try {
        const updated = await adminService.updateTemplate(id, data) as any
        const idx = this.templates.findIndex(t => String(t.id) === String(id))
        if (idx !== -1 && this.templates[idx]) Object.assign(this.templates[idx], updated)
        this.showNotification('Template updated successfully')
      } catch (e: any) {
        this.showNotification(e.message || 'Failed to update template', 'error')
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateTemplateStatus(id: string | number, status: string) {
      try {
        await adminService.updateTemplateStatus(id, status)
        const idx = this.templates.findIndex(t => String(t.id) === String(id))
        if (idx !== -1 && this.templates[idx]) (this.templates[idx] as any).status = status
        this.showNotification(`Template ${status.toLowerCase()} successfully`)
      } catch (e: any) {
        this.showNotification(e.message || 'Failed to update template status', 'error')
        throw e
      }
    },

    async deleteTemplate(id: string | number) {
      this.loading = true
      try {
        await adminService.deleteTemplate(id)
        this.templates = this.templates.filter(t => String(t.id) !== String(id))
        this.showNotification('Template deleted')
      } catch (e: any) {
        this.showNotification(e.message || 'Failed to delete template', 'error')
        throw e
      } finally {
        this.loading = false
      }
    },

    // ── Questions ───────────────────────────────────────────────────────────
    async fetchQuestionsData() {
      try {
        const response = await adminService.fetchQuestions() as any[]
        if (response?.length > 0) this.questions = response
      } catch (err: any) {
        if (err.status !== 404) console.error('[AdminFrameworkStore] fetchQuestionsData error:', err)
      }
    },

    async addQuestion(question: any) {
      this.loading = true
      try {
        await adminService.saveQuestion(question)
        await this.fetchQuestionsData()
        this.showNotification('Question added successfully')
      } catch (e: any) {
        this.showNotification(e.message || 'Failed to add question', 'error')
        throw e
      } finally {
        this.loading = false
      }
    },

    async updateQuestion(question: any) {
      this.loading = true
      try {
        await adminService.saveQuestion(question)
        const idx = this.questions.findIndex(q => q.id === question.id)
        if (idx !== -1) this.questions[idx] = { ...question }
        this.showNotification('Question updated successfully')
      } catch (e: any) {
        this.showNotification(e.message || 'Failed to update question', 'error')
        throw e
      } finally {
        this.loading = false
      }
    },

    async deleteQuestion(id: string) {
      this.loading = true
      try {
        await adminService.deleteQuestion(id)
        this.questions = this.questions.filter(q => q.id !== id)
        this.showNotification('Question deleted')
      } finally {
        this.loading = false
      }
    },

    // ── Sectors ─────────────────────────────────────────────────────────────
    async fetchSectors() {
      try {
        this.sectors = await adminService.fetchSectors() as any[]
      } catch (err) {
        console.error('[AdminFrameworkStore] fetchSectors error:', err)
      }
    },

    async addSector(data: any) {
      try {
        const s = await adminService.addSector(data)
        if (s) (this.sectors as any[]).push(s)
      } catch (e: any) {
        this.showNotification(e.message || 'Failed to add sector', 'error')
        throw e
      }
    },

    async updateSector(id: string | number, data: any) {
      try {
        await adminService.updateSector(id, data)
        await this.fetchSectors()
      } catch (e: any) {
        this.showNotification(e.message || 'Failed to update sector', 'error')
        throw e
      }
    },

    async deleteSector(id: string | number) {
      try {
        await adminService.deleteSector(id)
        this.sectors = (this.sectors as any[]).filter((s: any) => String(s.id) !== String(id))
      } catch (e: any) {
        this.showNotification(e.message || 'Failed to delete sector', 'error')
        throw e
      }
    },
  },
})
