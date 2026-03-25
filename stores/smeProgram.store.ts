import { defineStore } from 'pinia'

export interface SmeProgram {
  id: number
  name: string
  description: string
  status: string
  sector: string
  investment_amount: string
  benefits: string[]
  startDate: string
  endDate: string
  templateName: string
  templateId: number
  enrollmentStatus: 'None' | 'Applied' | 'Enrolled' | 'Accepted' | 'Rejected'
  progress: number
  avgScore: number
  smesCount?: number
}

export const useSmeProgramStore = defineStore('smeProgram', {
  state: () => ({
    programs: [] as SmeProgram[],
    enrolledPrograms: [] as SmeProgram[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    getProgramById: (state) => (id: number | string) => {
      return state.programs.find(p => p.id == id)
    }
  },

  actions: {
    async fetchPrograms() {
      this.loading = true
      this.error = null
      const api = useApi()
      try {
        const response = await api<any>('/sme/programs')
        this.programs = response.data || response
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch programs'
        console.error('[SmeProgramStore] Fetch error:', err)
      } finally {
        this.loading = false
      }
    },

    async fetchEnrolledPrograms() {
      this.loading = true
      this.error = null
      const api = useApi()
      try {
        const response = await api<any>('/sme/enrolled-programs')
        this.enrolledPrograms = response.data || response
      } catch (err: any) {
        this.error = err.message || 'Failed to fetch enrolled programs'
      } finally {
        this.loading = false
      }
    },

    async applyToProgram(programId: number) {
      this.loading = true
      const api = useApi()
      try {
        await api(`/programs/${programId}/apply`, {
          method: 'POST'
        })
        // Refresh programs to show updated status
        await this.fetchPrograms()
      } catch (err: any) {
        this.error = err.data?.message || err.message || 'Failed to apply to program'
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
