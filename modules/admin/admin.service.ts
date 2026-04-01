import { AdminRepository } from './admin.repository'

export class AdminService {
  private repo = new AdminRepository()

  async fetchUsers() {
    const response = await this.repo.getUsers() as any
    const mapUser = (u: any) => ({
      id: String(u.id),
      name: u.full_name || u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      company: u.sme_profile?.company_name || u.investor_profile?.organization_name || u.company,
      industry: u.sme_profile?.industry || u.investor_profile?.industry || u.industry,
      phone: u.phone,
      registered: u.created_at,
      avatar: u.avatar
    })

    const userList = Array.isArray(response) ? response : (response?.data || response?.users || [])
    
    if (Array.isArray(userList)) {
      return userList.map(mapUser)
    }
    
    return response
  }

  async fetchPendingUsers() {
    const response = await this.repo.getPendingUsers() as any
    const mapUser = (u: any) => ({
      id: String(u.id),
      name: u.full_name || u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      company: u.sme_profile?.company_name || u.investor_profile?.organization_name || u.company,
      industry: u.sme_profile?.industry || u.investor_profile?.industry || u.industry,
      phone: u.phone,
      registered: u.created_at,
      avatar: u.avatar
    })

    const userList = Array.isArray(response) ? response : (response?.data || response?.users || [])
    
    if (Array.isArray(userList)) {
      return userList.map(mapUser)
    }
    
    return response || []
  }

  async createUser(data: any) {
    return await this.repo.createUser(data)
  }

  async setStatus(id: number | string, action: 'approve' | 'reject') {
    return await this.repo.updateUserStatus(id, action)
  }

  async setRole(id: number | string, role: string) {
    return await this.repo.updateUserRole(id, role.toUpperCase())
  }

  async resetUserPassword(id: number | string, password?: string) {
    return await this.repo.resetPassword(id, password)
  }

  async removeUser(id: number | string) {
    return await this.repo.deleteUser(id)
  }

  private mapProgram(p: any) {
    // Robust status mapping to handle potential integer values or string mismatches
    let status = p.status
    if (typeof status === 'number') {
      // Assuming 1 = Published/Active, 0 = Draft/Unpublished, 2 = Finished
      if (status === 1) status = 'Published'
      else if (status === 2) status = 'Finished'
      else status = 'Coming Soon'
    } else if (typeof status === 'string') {
      // Handle casing and similar terms
      const s = status.toLowerCase()
      if (s === 'active' || s === 'published') status = 'Published'
      else if (s === 'finished' || s === 'completed' || s === 'closed') status = 'Finished'
      else if (s === 'draft' || s === 'unpublished' || s === 'coming soon') status = 'Coming Soon'
    } else {
      status = 'Published' // Default to Published if it's already in the list
    }

    return {
      id: String(p.id),
      name: p.name,
      status: status,
      description: p.description,
      template: p.template?.name || p.template_name || p.template || 'No Template',
      templateId: (p.template_id || p.templateId) ? String(p.template_id || p.templateId) : null,
      pillarCount: p.template?.pillarCount || p.pillar_count || 8,
      questionCount: p.template?.questionCount || p.questions_count || 0,
      smesCount: p.smes_count || p.smesCount || 0,
      investorsCount: p.investors_count || p.investorsCount || 0,
      avgScore: p.avgScore ?? p.avg_score ?? 0,
      progress: p.progress || 0,
      startDate: p.startDate || p.start_date,
      endDate: p.endDate || p.end_date,
      sector: p.sector,
      duration: p.duration,
      investmentAmount: p.investmentAmount || p.investment_amount,
      benefits: p.benefits || [],
      enrolledSMEs: p.enrolledSMEs || p.enrolled_smes || [],
      createdAt: p.createdAt || p.created_at,
      createdBy: p.createdBy || p.created_by
    }
  }

  async fetchPrograms() {
    const response = await this.repo.getPrograms() as any
    const programList = Array.isArray(response) ? response : (response?.data || response?.programs || [])
    
    if (Array.isArray(programList)) {
      const mapped = programList.map((p: any) => this.mapProgram(p))
      return {
        ...response,
        programs: mapped,
        stats: response.stats || {}
      }
    }
    return response
  }

  async addProgram(data: any) {
    const payload = {
      name: data.name,
      description: data.description,
      templateId: data.templateId ? Number(data.templateId) : null,
      status: data.status || 'Coming Soon',
      startDate: data.startDate,
      endDate: data.endDate,
      sector: data.sector,
      duration: data.duration,
      deadline: data.deadline,
      investmentAmount: data.investmentAmount,
      benefits: data.benefits
    }
    const response = await this.repo.createProgram(payload) as any
    const programData = response?.program || response
    return this.mapProgram(programData)
  }

  async updateProgram(id: number | string, data: any) {
    const payload = {
      name: data.name,
      description: data.description,
      templateId: data.templateId ? Number(data.templateId) : null,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
      sector: data.sector,
      duration: data.duration,
      deadline: data.deadline,
      investmentAmount: data.investmentAmount,
      benefits: data.benefits
    }
    const response = await this.repo.updateProgram(id, payload) as any
    const programData = response?.program || response
    return this.mapProgram(programData)
  }

  async setProgramStatus(id: number | string, status: string) {
    const response = await this.repo.updateProgramStatus(id, status) as any
    const programData = response?.program || response
    return this.mapProgram(programData)
  }

  async fetchParticipants(programId: number | string) {
    const response = await this.repo.getParticipants(programId) as any
    const data = response?.data || response || []
    
    if (Array.isArray(data)) {
      return data.map((p: any) => {
        const role = (p.role?.toUpperCase() === 'INVESTOR' || p.user_role?.toUpperCase() === 'INVESTOR') ? 'INVESTOR' : 'SME'
        
        let status = p.status || 'Active'
        if (['accepted', 'approved', 'enrolled', 'active'].includes(status.toLowerCase())) {
          status = 'Enrolled'
        } else if (['applied', 'pending'].includes(status.toLowerCase())) {
          status = 'Applied'
        }

        return {
          ...p,
          id: String(p.id),
          name: p.name || p.user?.name || 'Unknown',
          role: role,
          status: status,
          enrolled_at: p.enrolled_at || p.created_at
        }
      })
    }
    return data
  }

  async deleteProgram(id: number | string) {
    return await this.repo.deleteProgram(id)
  }

  async enroll(programId: number | string, smeIds: (number | string)[]) {
    return await this.repo.enrollSmes(programId, smeIds)
  }

  async updateEnrollmentStatus(programId: number | string, smeId: number | string, status: string) {
    return await this.repo.updateEnrollmentStatus(programId, smeId, status)
  }

  async fetchSectors() {
    const response = await this.repo.getSectors() as any
    const sectorList = Array.isArray(response) ? response : (response?.data || response?.sectors || [])
    return sectorList
  }

  async fetchPublicSectors() {
    return await this.repo.getPublicSectors() as any[]
  }

  async saveSector(data: any) {
    if (data.id) {
      return await this.repo.updateSector(data.id, data)
    }
    return await this.repo.createSector(data)
  }

  async fetchPillars() {
    const response = await this.repo.getPillars() as any
    const pillarList = Array.isArray(response) ? response : (response?.data || response?.pillars || [])
    
    if (Array.isArray(pillarList)) {
      return pillarList.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        weight: p.weight,
        indicators: []
      }))
    }
    return []
  }

  async addPillar(data: any) {
    return await this.repo.createPillar(data)
  }

  async fetchTemplates() {
    const response = await this.repo.getTemplates() as any
    const templateList = Array.isArray(response) ? response : (response?.data || response?.templates || [])
    
    if (Array.isArray(templateList)) {
      return templateList.map((t: any) => this.mapTemplate(t))
    }
    return []
  }

  async fetchActiveTemplates(programId?: number | string) {
    const response = await this.repo.getActiveTemplates(programId) as any
    const templateList = Array.isArray(response) ? response : (response?.data || response?.templates || [])
    
    if (Array.isArray(templateList)) {
      return templateList.map((t: any) => this.mapTemplate(t))
    }
    return []
  }

  private mapTemplate(t: any) {
    return {
      id: String(t.id),
      name: t.name,
      version: t.version,
      industry: t.industry,
      status: t.status,
      description: t.description,
      settings: t.settings,
      pillarCount: t.pillars_count || 8, // Default to 8 pillars if not provided
      questionCount: t.questions_count || 0,
      usageCount: t.usage_count || t.assessments_count || 0,
      createdAt: t.created_at,
      updatedAt: t.updated_at
    }
  }

  async createTemplate(data: any) {
    const payload = {
      name: data.name,
      version: data.version,
      industry: data.industry,
      status: data.status,
      description: data.description,
      settings: data.settings
    }
    return await this.repo.createTemplate(payload)
  }

  async updateTemplate(id: number | string, data: any) {
    const payload = {
      name: data.name,
      version: data.version,
      industry: data.industry,
      status: data.status,
      description: data.description,
      settings: data.settings
    }
    return await this.repo.updateTemplate(id, payload)
  }

  async updateTemplateStatus(id: number | string, status: string) {
    return await this.repo.updateTemplateStatus(id, status)
  }

  async fetchQuestions() {
    const response = await this.repo.getQuestions() as any
    const questionList = Array.isArray(response) ? response : (response?.data || response?.questions || [])
    
    if (Array.isArray(questionList)) {
      return questionList.map((q: any) => ({
        id: String(q.id),
        templateId: String(q.template_id),
        pillarId: String(q.pillar_id),
        text: q.text,
        type: q.type,
        weight: q.weight,
        required: Boolean(q.required),
        options: q.options,
        helperText: q.helper_text,
        createdAt: q.created_at,
        updatedAt: q.updated_at
      }))
    }
    return []
  }

  async createQuestion(data: any) {
    const payload = {
      template_id: data.templateId,
      pillar_id: data.pillarId,
      text: data.text,
      type: data.type,
      weight: data.weight,
      required: data.required,
      options: data.options,
      helper_text: data.helperText
    }
    return await this.repo.createQuestion(payload)
  }

  async deleteQuestion(id: number | string) {
    return await this.repo.deleteQuestion(id)
  }

  async updateQuestion(id: number | string, data: any) {
    const payload = {
      template_id: data.templateId,
      pillar_id: data.pillarId,
      text: data.text,
      type: data.type,
      weight: data.weight,
      required: data.required,
      options: data.options,
      helper_text: data.helperText
    }
    return await this.repo.updateQuestion(id, payload)
  }

  async saveQuestion(data: any) {
    const payload = {
      template_id: data.templateId,
      pillar_id: data.pillarId,
      text: data.text,
      type: data.type,
      weight: data.weight,
      required: data.required,
      options: data.options,
      helper_text: data.helperText
    }
    // Temporary frontend IDs start with "q_". Only existing questions have numeric or backend uuid IDs.
    if (data.id && !String(data.id).startsWith('q_')) {
      return await this.repo.updateQuestion(data.id, payload)
    }
    return await this.repo.createQuestion(payload)
  }

  async addIndicator(data: any) {
    return await this.repo.addIndicator(data)
  }

  async fetchFrameworkSettings() {
    const response = await this.repo.getFrameworkSettings() as any
    // Common Laravel pattern: { success: true, data: { pillars: [...] } } or { pillars: [...] }
    const data = response?.data || response
    if (data && data.pillars) {
      return data
    }
    return response
  }

  async saveFrameworkSettings(data: any) {
    return await this.repo.updateFrameworkSettings(data)
  }

  async fetchStats() {
    const res = await this.repo.getDashboardStats() as any
    if (res && res.stats) {
      const s = res.stats
      return {
        ...res,
        stats: {
          totalUsers: s.totalUsers ?? s.total_users ?? 0,
          totalSMEs: s.totalSMEs ?? s.total_smes ?? 0,
          totalInvestors: s.totalInvestors ?? s.total_investors ?? 0,
          totalPrograms: s.totalPrograms ?? s.total_programs ?? 0,
          completedAssessments: s.completedAssessments ?? s.completed_assessments ?? 0,
          inProgressAssessments: s.inProgressAssessments ?? s.in_progress_assessments ?? 0,
          totalSectors: s.totalSectors ?? s.total_sectors ?? 0
        }
      }
    }
    return res
  }

  async fetchLogs(page: number = 1) {
    return await this.repo.getAuditLogs(page)
  }

  async fetchSmes(programId?: string | number) {
    const response = await this.repo.getSmeDirectory(programId) as any
    const smeList = Array.isArray(response) ? response : (response?.data || response?.smes || [])
    return smeList
  }

  async fetchVerifications() {
    return await this.repo.getVerificationRequests()
  }

  async setVerificationStatus(id: number | string, status: string) {
    return await this.repo.updateVerificationStatus(id, status)
  }

  // --- NEW CRUD PROXIES ---
  async updateSector(id: number | string, data: any) {
    return await this.repo.updateSector(id, data)
  }

  async deleteSector(id: number | string) {
    return await this.repo.deleteSector(id)
  }

  async updatePillar(id: number | string, data: any) {
    return await this.repo.updatePillar(id, data)
  }

  async deletePillar(id: number | string) {
    return await this.repo.deletePillar(id)
  }


  async deleteTemplate(id: number | string) {
    return await this.repo.deleteTemplate(id)
  }
}

export const adminService = new AdminService()
