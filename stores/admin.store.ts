import { defineStore } from 'pinia'
import { AdminService } from '~/modules/admin/admin.service'

interface UserStats {
  total: number
  pending: number
  smes: number
  investors: number
  admins: number
}

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
  templateId: string
  smesCount: number
  investorsCount?: number
  avgScore: number
  progress: number
  startDate?: string
  endDate?: string
  sector?: string
  duration?: string
  deadline?: string
  investmentAmount?: string
  benefits?: string[]
  thresholds?: any[]
  enrolledSMEs?: number[]
  createdAt?: string
  createdBy?: string
}

interface PillarWeight {
  id: string
  name: string
  weight: number
  indicators?: string[]
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

interface AuditLog {
  id: number | string
  admin: string
  action: string
  target: string
  timestamp: string
  details: string
}

interface User {
  id: number | string
  name: string
  email: string
  role: 'admin' | 'sme' | 'investor'
  status: 'active' | 'pending' | 'rejected'
  department?: string
  lastActive?: string
  registered?: string
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

interface ScoringRule {
  id: string
  name: string
  condition: string
  modifier: number
  isActive: boolean
}

interface Indicator {
  id: string
  pillarId: string
  name: string
  weight: number // Relative weight within the pillar (must sum to 100% per pillar)
}

export interface CustomField {
  id: string
  entityType: 'SME' | 'User' | 'Program'
  name: string
  label: string
  type: 'Text' | 'Number' | 'Date' | 'Dropdown' | 'Yes/No'
  required: boolean
  active: boolean
  options?: string[]
}

interface Question {
  id: string
  pillarId: string
  indicatorId?: string // Link to parent Indicator
  templateId?: string
  text: string
  type: string
  weight: number // Relative weight within the indicator
  required: boolean
  helperText?: string
  options?: string[]
}

interface SmeProfile {
  id: number | string
  name: string
  company_name?: string
  industry: string
  location: string
  lastAssessed: string
  last_assessed?: string
  riskLevel: 'Low' | 'Medium' | 'High'
  latest_risk_level?: 'Low' | 'Medium' | 'High'
  readinessStatus: string
  score: number
  latest_score?: number
  growthPotential: number
  programIds: (number | string)[]
  programs?: any[]
  readinessHistory?: number[]
  status?: string // e.g. 'Invited', 'Enrolled', etc.
  pillars?: any[]
}

interface AdminState {
  userStats: UserStats | null
  pendingUsers: any[]
  programStats: ProgramStats | null
  dashboardStats: any | null
  programs: Program[]
  frameworkSettings: PillarWeight[]
  frameworkThresholds: any[]
  indicators: Indicator[]
  smes: SmeProfile[]
  users: User[]
  verificationRequests: VerificationRequest[]
  auditLogs: AuditLog[]
  templates: Template[]
  scoringRules: ScoringRule[]
  customFields: CustomField[]
  questions: Question[]
  sectors: any[]
  participants: any[]
  loading: boolean
  error: string | null
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    userStats: null,
    pendingUsers: [],
    dashboardStats: null,
    frameworkThresholds: [],
    users: [],
    programStats: null,
    programs: [],
    frameworkSettings: [],
    indicators: [],
    smes: [],
    verificationRequests: [],
    auditLogs: [],
    templates: [],
    questions: [],
    scoringRules: [],
    customFields: [],
    sectors: [],
    participants: [],
    loading: false,
    error: null
  }),

  getters: {
    // Add a getter for filtered programs
    filteredPrograms: (state) => (query: string) => {
        if (!query) return state.programs
        const lowerQuery = query.toLowerCase()
        return state.programs.filter(p => 
          (p.name && p.name.toLowerCase().includes(lowerQuery)) || 
          (p.description && p.description.toLowerCase().includes(lowerQuery))
        )
    },
    getSmeById: (state) => (id: string | number) => {
        return state.smes.find(sme => sme.id == id)
    },
    pendingVerificationCount: (state) => state.verificationRequests.filter(r => r.status === 'Pending').length,
    // User Getters
    pendingUsersList: (state) => state.users.filter(u => u.status === 'pending'),
    approvedUsersList: (state) => state.users.filter(u => u.status === 'active'),
    availableTemplates: (state) => {
      // Get IDs of templates already assigned to programs
      const assignedTemplateIds = state.programs
        .map(p => String(p.templateId))
        .filter(id => id && id !== 'null' && id !== 'undefined')
      
      // Return templates that are not assigned AND not archived
      return state.templates.filter(t => 
        !assignedTemplateIds.includes(String(t.id)) && 
        t.status !== 'Archived'
      )
    }
  },

  actions: {
    async fetchDashboardStats() {
      this.loading = true
      this.error = null
      const service = new AdminService()
      try {
        const response = await service.fetchStats() as any
        if (response) {
          this.dashboardStats = response
        }
      } catch (err: any) {
        this.error = err.message
        console.error('Failed to fetch dashboard stats', err)
      } finally {
        this.loading = false
      }
    },

    async fetchUsersData() {
      this.loading = true
      this.error = null
      const service = new AdminService()
      try {
        const response = await service.fetchUsers() as any

        // AdminService.fetchUsers now returns mapping result directly if it's an array
        const userList = Array.isArray(response) ? response : (response?.users || [])
        if (userList.length >= 0) {
          this.users = userList
        }

        // Use stats from API if available, otherwise compute from users list
        if (response?.stats) {
          this.userStats = response.stats
        } else {
          this.userStats = {
            total: this.users.length,
            pending: this.users.filter((u: any) => u.status === 'pending').length,
            smes: this.users.filter((u: any) => u.role === 'sme').length,
            investors: this.users.filter((u: any) => u.role === 'investor').length,
            admins: this.users.filter((u: any) => u.role === 'admin').length
          }
        }
        this.pendingUsers = this.users.filter((u: any) => u.status === 'pending')

      } catch (err: any) {
        this.error = err.message
        console.error('Failed to fetch admin users data', err)
      } finally {
        this.loading = false
      }
    },

    async createUser(userData: any) {
        this.loading = true
        const service = new AdminService()
        try {
            if (userData.role) {
                userData.role = userData.role.toUpperCase()
            }
            await service.createUser(userData)
            await this.fetchUsersData()
             this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Created User',
                target: `User ${userData.name}`,
                timestamp: new Date().toLocaleString(),
                details: `Created new ${userData.role} user`
            })
        } catch (e: any) { 
            this.error = e.message 
        } finally { 
            this.loading = false 
        }
    },

    async fetchPendingUsers() {
        this.loading = true
        const service = new AdminService()
        try {
            const users = await service.fetchPendingUsers()
            this.pendingUsers = users
        } catch (err: any) {
            this.error = err.message
        } finally {
            this.loading = false
        }
    },

    async approveUser(id: number | string) {
        this.loading = true
        const service = new AdminService()
        try {
            await service.setStatus(id, 'approve')
            await this.fetchUsersData()
            await this.fetchPendingUsers()
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Approved User',
                target: `User ID ${id}`,
                timestamp: new Date().toLocaleString(),
                details: 'Approved registration request'
            })
        } catch (e: any) { 
            this.error = e.message 
        } finally { 
            this.loading = false 
        }
    },

    async rejectUser(id: number | string) {
        this.loading = true
        const service = new AdminService()
        try {
            await service.setStatus(id, 'reject')
            await this.fetchUsersData()
            await this.fetchPendingUsers()
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Rejected User',
                target: `User ID ${id}`,
                timestamp: new Date().toLocaleString(),
                details: 'Rejected registration request'
            })
        } catch (err: any) {
            this.error = err.message
        } finally {
            this.loading = false
        }
    },

    async deleteUser(id: number | string) {
        this.loading = true
        const service = new AdminService()
        try {
            await service.removeUser(id)
            await this.fetchUsersData()
             this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Deleted User',
                target: `User ID ${id}`,
                timestamp: new Date().toLocaleString(),
                details: 'Deleted user from platform'
            })
        } catch (e: any) { 
            this.error = e.message 
        } finally { 
            this.loading = false 
        }
    },

    async updateUserRole(id: number | string, role: string) {
        this.loading = true
        const service = new AdminService()
        try {
            await service.setRole(id, role)
            await this.fetchUsersData()
             this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Updated User Role',
                target: `User ID ${id}`,
                timestamp: new Date().toLocaleString(),
                details: `Changed role to ${role}`
            })
        } catch (e: any) { 
            this.error = e.message 
        } finally { 
            this.loading = false 
        }
    },

    async resetPassword(id: number | string, password?: string) {
        this.loading = true
        const service = new AdminService()
        try {
            await service.resetUserPassword(id, password)
             this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Reset Password',
                target: `User ID ${id}`,
                timestamp: new Date().toLocaleString(),
                details: 'Initiated password reset'
            })
        } catch (e: any) { 
            this.error = e.message 
            throw e
        } finally { 
            this.loading = false 
        }
    },

    async fetchParticipants(programId: number | string) {
      this.loading = true
      this.error = null
      const service = new AdminService()
      try {
        const participants = await service.fetchParticipants(programId)
        this.participants = Array.isArray(participants) ? participants : []
        
        // Update the program's counts in the local state if it exists
        const programIndex = this.programs.findIndex(p => String(p.id) === String(programId))
        if (programIndex !== -1 && this.participants.length > 0) {
          const smesCount = this.participants.filter(p => p.role === 'SME').length
          const investorsCount = this.participants.filter(p => p.role === 'INVESTOR').length
          
          this.programs[programIndex] = {
            ...this.programs[programIndex],
            smesCount,
            investorsCount
          } as Program
        }
      } catch (err: any) {
        this.error = err.message
        console.error('Failed to fetch participants', err)
      } finally {
        this.loading = false
      }
    },

    async fetchProgramsData() {
      this.loading = true
      this.error = null
      const service = new AdminService()
      try {
        const response = await service.fetchPrograms()
        this.programStats = response.stats
        this.programs = response.programs
      } catch (err: any) {
        this.error = err.message
        console.error('Failed to fetch admin programs data', err)
      } finally {
        this.loading = false
      }
    },
    async fetchTemplatesData() {
      this.loading = true
      this.error = null
      const service = new AdminService()
      try {
        const templates = await service.fetchTemplates()
        this.templates = templates
        console.log(`[Admin Store] Fetched ${templates?.length} templates`)
        
        // Also fetch questions whenever templates are fetched to stay in sync
        await this.fetchQuestionsData()
      } catch (err: any) {
        this.error = err.message
        console.error('Failed to fetch admin templates data', err)
      } finally {
        this.loading = false
      }
    },

    async fetchQuestionsData() {
        const service = new AdminService()
        try {
            const response = await service.fetchQuestions()
            if (response && response.length > 0) {
                this.questions = response
            }
            console.log(`[Admin Store] Fetched ${this.questions.length} questions`)
        } catch (err: any) {
            console.error('Failed to fetch questions', err)
        }
    },

    async fetchSmesData(programId?: string | number) {
        const service = new AdminService()
        try {
            const response = await service.fetchSmes(programId) as any[]
            if (response) {
                this.smes = response
            }
            console.log(`[Admin Store] Fetched ${this.smes.length} SMEs`)
        } catch (err: any) {
            console.error('Failed to fetch SMEs', err)
        }
    },
    async fetchFrameworkSettings() {
      this.loading = true
      const service = new AdminService()
      try {
        const response = await service.fetchFrameworkSettings() as any
        const settings = response.data || response
        if (settings) {
           this.frameworkSettings = (settings.pillars || []).map((p: any) => ({
             ...p,
             id: String(p.id)
           }))
           this.frameworkThresholds = settings.thresholds || []
        }
      } catch (err: any) {
        console.error('Failed to fetch Framework Settings:', err)
      } finally {
        this.loading = false
      }
    },

    async updateFrameworkSettings(payloadData: { pillars?: any[], thresholds?: any[] }) {
      this.loading = true
      const service = new AdminService()
      try {
          await service.saveFrameworkSettings(payloadData)
          
          // Log this action
          this.auditLogs.unshift({
              id: Date.now(),
              admin: 'Super Admin',
              action: 'Updated Framework',
              target: 'Pillar Weights',
              timestamp: new Date().toLocaleString(),
              details: 'Updated pillar weight distribution'
          })
          
          await this.fetchFrameworkSettings()
      } catch (err: any) {
          console.error('Failed to update Framework Settings:', err)
          throw err
      } finally {
          this.loading = false
      }
    },

    async fetchSmes() {
        this.loading = true;
        // In the future, this would be:
        // const response = await api.get('/smes')
        // this.smes = response.data
        await new Promise(resolve => setTimeout(resolve, 800)) // Simulate network latency
        this.loading = false;
    },

    async fetchSme(id: string | number) {
        // Optimistic check: if we already have it in the list, no need to fetch (unless we want to force refresh)
        const existing = this.smes.find(s => s.id == id)
        if (existing) return existing

        this.loading = true
        // Simulate API call for single resource
        // const response = await api.get(`/smes/${id}`)
        await new Promise(resolve => setTimeout(resolve, 500)) 
        
        // For now, since we only have the static list, we can't truly "fetch" a new one if it's not there.
        // In a real app, we would add the fetched SME to this.smes or a dedicated `currentSme` state.
        this.loading = false
        return this.smes.find(s => s.id == id)
    },

    async createProgram(programData: any) {
      this.loading = true
      const service = new AdminService()
      try {
        await service.addProgram(programData)
        await this.fetchProgramsData()
        this.auditLogs.unshift({
            id: Date.now(), 
            admin: 'Current Admin',
            action: 'Created Program',
            target: programData.name,
            timestamp: new Date().toLocaleString(),
            details: 'Created new investment program'
        })
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateProgram(programData: any) {
      this.loading = true
      const service = new AdminService()
      try {
        await service.updateProgram(programData.id, programData)
        await this.fetchProgramsData()
        this.auditLogs.unshift({
            id: Date.now(),
            admin: 'Current Admin',
            action: 'Updated Program',
            target: programData.name,
            timestamp: new Date().toLocaleString(),
            details: 'Updated program details'
        })
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async setProgramStatus(id: number | string, status: string) {
        this.loading = true
        const service = new AdminService()
        try {
            await service.setProgramStatus(id, status)
            await this.fetchProgramsData()
        } catch (err: any) {
            this.error = err.message
        } finally {
            this.loading = false
        }
    },

    async deleteProgram(id: number | string) {
      this.loading = true
      const service = new AdminService()
      try {
        await service.deleteProgram(id)
        await this.fetchProgramsData()
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async verifyDocument(requestId: number | string, isApproved: boolean, notes?: string) {
        this.loading = true
        await new Promise(resolve => setTimeout(resolve, 600)) // Simulate network
        
        const request = this.verificationRequests.find(r => r.id === requestId)
        if (request) {
            request.status = isApproved ? 'Approved' : 'Rejected'
            if (notes) request.notes = notes
            
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: isApproved ? 'Approved Document' : 'Rejected Document',
                target: request.smeName,
                timestamp: new Date().toLocaleString(),
                details: `${isApproved ? 'Verified' : 'Rejected'} ${request.documentType}`
            })
        }
        this.loading = false
    },

    async addScoringRule(rule: any) {
        this.loading = true
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 500))
            const newRule = { ...rule, id: `rule_${Date.now()}` }
            this.scoringRules.push(newRule)
            
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Created Rule',
                target: rule.name,
                timestamp: new Date().toLocaleString(),
                details: `Added new scoring rule: ${rule.condition}`
            })
        } finally {
            this.loading = false
        }
    },

    async updateScoringRule(rule: any) {
        this.loading = true
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            const index = this.scoringRules.findIndex(r => r.id === rule.id)
            if (index !== -1) {
                this.scoringRules[index] = { ...rule }
                
                this.auditLogs.unshift({
                    id: Date.now(),
                    admin: 'Current Admin',
                    action: 'Updated Rule',
                    target: rule.name,
                    timestamp: new Date().toLocaleString(),
                    details: `Updated scoring rule logic`
                })
            }
        } finally {
            this.loading = false
        }
    },

    async deleteScoringRule(id: string) {
        this.loading = true
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            const rule = this.scoringRules.find(r => r.id === id)
            this.scoringRules = this.scoringRules.filter(r => r.id !== id)
            
             if (rule) {
                this.auditLogs.unshift({
                    id: Date.now(),
                    admin: 'Current Admin',
                    action: 'Deleted Rule',
                    target: rule.name,
                    timestamp: new Date().toLocaleString(),
                    details: `Removed scoring rule`
                })
             }
        } finally {
            this.loading = false
        }
    },



    async addQuestion(question: any) {
        this.loading = true
        try {
            const service = new AdminService()
            const newQuestion = { 
                ...question, 
                id: question.id || `q_${Date.now()}` // Ensure ID
            }
            const response = await service.saveQuestion(newQuestion) as any
            const realQuestion = response?.data || response
            
            // If the backend returns the newly created question, use its real ID
            if (realQuestion && realQuestion.id) {
                newQuestion.id = realQuestion.id
                // Optionally update other fields if backend assigned them
            }
            
            this.questions.push(newQuestion)

            // Update template question count
            if (question.templateId) {
                const template = this.templates.find(t => t.id === question.templateId)
                if (template) {
                    template.questionCount = (template.questionCount || 0) + 1
                }
            }
            
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Added Question',
                target: question.text.substring(0, 30) + '...',
                timestamp: new Date().toLocaleString(),
                details: `Added new question to ${question.templateId}`
            })
        } finally {
            this.loading = false
        }
    },

    async updateQuestion(question: any) {
        this.loading = true
        try {
            const service = new AdminService()
            await service.saveQuestion(question)
            
            const index = this.questions.findIndex(q => q.id === question.id)
            if (index !== -1) {
                this.questions[index] = { ...question }
                
                this.auditLogs.unshift({
                    id: Date.now(),
                    admin: 'Current Admin',
                    action: 'Updated Question',
                    target: question.id,
                    timestamp: new Date().toLocaleString(),
                    details: `Updated question text or settings`
                })
            }
        } finally {
            this.loading = false
        }
    },

    async deleteQuestion(id: string) {
        this.loading = true
        try {
            const service = new AdminService()
            await service.deleteQuestion(id)
            
            const question = this.questions.find(q => q.id === id)
            this.questions = this.questions.filter(q => q.id !== id)
            
            if (question && question.templateId) {
                const template = this.templates.find(t => t.id === question.templateId)
                if (template && template.questionCount > 0) {
                    template.questionCount--
                }
            }

            if (question) {
                this.auditLogs.unshift({
                    id: Date.now(),
                    admin: 'Current Admin',
                    action: 'Deleted Question',
                    target: id,
                    timestamp: new Date().toLocaleString(),
                    details: 'Deleted question'
                })
            }
        } finally {
            this.loading = false
        }
    },

    async duplicateTemplate(id: string) {
        this.loading = true
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            const source = this.templates.find(t => t.id === id)
            if (source) {
                const newTemplate = {
                    ...source,
                    id: `temp_${Date.now()}`,
                    name: `${source.name} (Copy)`,
                    status: 'Draft',
                    version: 'v1.0',
                    usageCount: 0,
                    updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    updatedBy: 'You'
                }
                this.templates.unshift(newTemplate as any)
                
                this.auditLogs.unshift({
                    id: Date.now(),
                    admin: 'Current Admin',
                    action: 'Duplicated Template',
                    target: source.name,
                    timestamp: new Date().toLocaleString(),
                    details: `Created copy of template`
                })
            }
        } finally {
            this.loading = false
        }
    },

    async updateTemplateStatus(id: string | number, status: 'Active' | 'Draft' | 'Archived') {
        this.loading = true
        const service = new AdminService()
        try {
            await service.updateTemplateStatus(id, status)
            await this.fetchTemplatesData()
            
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Updated Template Status',
                target: `Template ID ${id}`,
                timestamp: new Date().toLocaleString(),
                details: `Changed status to ${status}`
            })
        } catch (err: any) {
            this.error = err.message
        } finally {
            this.loading = false
        }
    },

    async createTemplateVersion(id: string, versionData: { version: string, changelog: string }) {
        this.loading = true
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            const source = this.templates.find(t => t.id === id)
            if (source) {
                // Determine logic: Create NEW record for new version, maintain old as is?
                // Or update current? Usually "Create New Version" means we now have a V2 draft.
                const newTemplate = {
                    ...source,
                    id: `temp_${Date.now()}`,
                    version: `v${versionData.version}`,
                    status: 'Draft', // New versions usually start as Draft
                    usageCount: 0,
                    updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    updatedBy: 'You',
                    description: source.description // Keep description
                }
                this.templates.unshift(newTemplate as any)

                this.auditLogs.unshift({
                    id: Date.now(),
                    admin: 'Current Admin',
                    action: 'Created New Version',
                    target: `${source.name} ${newTemplate.version}`,
                    timestamp: new Date().toLocaleString(),
                    details: `Created version ${versionData.version}`
                })
            }
        } finally {
            this.loading = false
        }
    },

    async createTemplate(templateData: any) {
        this.loading = true
        const service = new AdminService()
        try {
            await service.createTemplate(templateData)
            await this.fetchTemplatesData()
            
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Created Template',
                target: templateData.name,
                timestamp: new Date().toLocaleString(),
                details: `Created new assessment template`
            })
        } catch (err: any) {
            this.error = err.message
            throw err
        } finally {
            this.loading = false
        }
    },

    async deleteTemplate(id: string | number) {
        this.loading = true
        const service = new AdminService()
        try {
            await service.deleteTemplate(id)
            await this.fetchTemplatesData()
            
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Deleted Template',
                target: String(id),
                timestamp: new Date().toLocaleString(),
                details: `Deleted assessment template`
            })
        } catch (err: any) {
            this.error = err.message
        } finally {
            this.loading = false
        }
    },

    async createCustomField(fieldData: Omit<CustomField, 'id'>) {
        this.loading = true
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            const newField: CustomField = {
                ...fieldData,
                id: `cf_${Date.now()}`
            }
            this.customFields.push(newField)
            
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Created Custom Field',
                target: fieldData.label,
                timestamp: new Date().toLocaleString(),
                details: `Created custom field for ${fieldData.entityType}`
            })
        } finally {
            this.loading = false
        }
    },

    async updateCustomField(id: string, updates: Partial<CustomField>) {
        this.loading = true
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            const field = this.customFields.find(f => f.id === id)
            if (field) {
                Object.assign(field, updates)
                
                this.auditLogs.unshift({
                    id: Date.now(),
                    admin: 'Current Admin',
                    action: 'Updated Custom Field',
                    target: field.label,
                    timestamp: new Date().toLocaleString(),
                    details: `Updated custom field properties`
                })
            }
        } finally {
            this.loading = false
        }
    },

    async deleteCustomField(id: string) {
        this.loading = true
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            const field = this.customFields.find(f => f.id === id)
            if (field) {
                this.customFields = this.customFields.filter(f => f.id !== id)
                
                this.auditLogs.unshift({
                    id: Date.now(),
                    admin: 'Current Admin',
                    action: 'Deleted Custom Field',
                    target: field.label,
                    timestamp: new Date().toLocaleString(),
                    details: `Deleted custom field`
                })
            }
        } finally {
            this.loading = false
        }
    },

    async enrollSmesToProgram(programId: number | string, smeIds: (number | string)[]) {
        this.loading = true
        try {
            const service = new AdminService()
            await service.enroll(programId, smeIds)
            
            const pId = Number(programId)

            // multiple enrollment
            smeIds.forEach(smeId => {
                // Find SME using loose equality to match string/number IDs
                const sme = this.smes.find(s => s.id == smeId)
                
                if (sme) {
                    // Initialize programIds if it doesn't exist
                    if (!sme.programIds) {
                        sme.programIds = []
                    }
                    
                    // Check if program ID already exists (comparing as numbers)
                    const alreadyEnrolled = sme.programIds.some(existingId => Number(existingId) === pId)
                    
                    if (!alreadyEnrolled) {
                        // Push as number to be consistent
                        sme.programIds.push(pId)
                        // Reset status to Invited for the new program context (mock behavior)
                        sme.status = 'Invited'
                        // Reset mock score/progress for the demo effect if needed, 
                        // but sticking to status override is cleaner for now.
                    }
                }
            })

            // Update program count
            const program = this.programs.find(p => p.id == programId)
            if (program) {
                // Determine actual new count based on our state (more reliable)
                const count = this.smes.filter(s => 
                    s.programIds && s.programIds.some(id => Number(id) === pId)
                ).length
                
                program.smesCount = count
                
                this.auditLogs.unshift({
                    id: Date.now(),
                    admin: 'Current Admin',
                    action: 'Updated Program',
                    target: program.name,
                    timestamp: new Date().toLocaleString(),
                    details: `Enrolled ${smeIds.length} SMEs`
                })
            }
            
        } finally {
            this.loading = false
        }
    },

    async removeSmeFromProgram(programId: number | string, smeId: number | string) {
        this.loading = true
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const sme = this.smes.find(s => s.id == smeId)
            if (sme) {
                sme.programIds = sme.programIds.filter(id => id != programId)
            }

            // Update program count
            const program = this.programs.find(p => p.id == programId)
            if (program) {
                program.smesCount = Math.max(0, (program.smesCount || 0) - 1)
                
                this.auditLogs.unshift({
                    id: Date.now(),
                    admin: 'Current Admin',
                    action: 'Updated Program',
                    target: program.name,
                    timestamp: new Date().toLocaleString(),
                    details: `Removed SME from program`
                })
            }
            
        } finally {
            this.loading = false
        }
    },

    async updateSmeStatus(programId: number | string, smeId: number | string, status: string) {
        this.loading = true
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            const sme = this.smes.find(s => s.id == smeId)
            if (sme) {
                sme.status = status
                
                // If status is not Invited, we might want to ensure they have some progress
                if (status === 'In Progress' && (!sme.score || sme.score === 0)) {
                    sme.score = 25 // Default starting score
                }
                
                if (status === 'Completed') {
                     sme.score = 100
                }

                 this.auditLogs.unshift({
                    id: Date.now(),
                    admin: 'Current Admin',
                    action: 'Updated Status',
                    target: sme.name,
                    timestamp: new Date().toLocaleString(),
                    details: `Updated status to ${status}`
                })
            }
        } finally {
            this.loading = false
        }
    },

    async updatePillarWeights(newWeights: PillarWeight[]) {
        this.loading = true
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Validate total weight equals 100
            const total = newWeights.reduce((sum, p) => sum + p.weight, 0)
            if (Math.abs(total - 100) > 0.1) {
                this.error = 'Total weight must equal 100%'
                return
            }

            this.frameworkSettings = newWeights
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Updated Framework',
                target: 'Pillar Weights',
                timestamp: new Date().toLocaleString(),
                details: 'Updated pillar weight distribution'
            })
        } catch (err: any) {
            this.error = err.message
        } finally {
            this.loading = false
        }
    },

    async fetchSectors() {
        this.loading = true
        const service = new AdminService()
        try {
            const sectors = await service.fetchSectors()
            this.sectors = sectors
            return sectors
        } catch (err: any) {
            this.error = err.message
        } finally {
            this.loading = false
        }
    },

    async saveSector(sectorData: any) {
        this.loading = true
        const service = new AdminService()
        try {
            await service.saveSector(sectorData)
            await this.fetchSectors()
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: sectorData.id ? 'Updated Sector' : 'Created Sector',
                target: sectorData.name,
                timestamp: new Date().toLocaleString(),
                details: sectorData.id ? `Updated sector ${sectorData.name}` : `Created new sector ${sectorData.name}`
            })
        } catch (err: any) {
            this.error = err.message
            throw err
        } finally {
            this.loading = false
        }
    },

    async deleteSector(id: string | number) {
        this.loading = true
        const service = new AdminService()
        try {
            await service.deleteSector(id)
            await this.fetchSectors()
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Deleted Sector',
                target: String(id),
                timestamp: new Date().toLocaleString(),
                details: 'Removed industry sector'
            })
        } catch (err: any) {
            this.error = err.message
        } finally {
            this.loading = false
        }
    }
  }
})
