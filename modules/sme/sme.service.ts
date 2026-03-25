import { SmeRepository } from './sme.repository'

export class SmeService {
  private repo = new SmeRepository()

  async fetchSmeDetails() {
    const response = await this.repo.getSmeDetails() as any
    // data is unwrapped by useApi if it exists
    const sme = response?.data || response
    
    return {
      id: String(sme.id),
      name: sme.name || sme.company_name || 'Unknown SME',
      industry: sme.industry || sme.sector || '-',
      location: sme.location || '-',
      lastAssessed: sme.lastAssessed || sme.last_assessed || sme.updated_at || '-',
      riskLevel: (() => {
        const risk = sme.riskLevel || sme.risk_level || 'Medium'
        if (typeof risk === 'number') {
          if (risk === 1) return 'Low'
          if (risk === 2) return 'Medium'
          return 'High'
        }
        const r = String(risk).toLowerCase()
        if (r === 'low') return 'Low'
        if (r === 'high') return 'High'
        return 'Medium'
      })() as 'Low' | 'Medium' | 'High',
      readinessStatus: sme.readinessStatus || sme.readiness_status || sme.stage || 'Early Stage',
      score: sme.score || sme.readiness_score || 0,
      growthPotential: sme.growthPotential || sme.growth_potential || 0,
      programIds: sme.programIds || sme.program_ids || [],
      readinessHistory: sme.readinessHistory || sme.readiness_history || [],
      pillars: (() => {
        // 1. Try direct pillars (unlikely from backend but keep for fallback)
        if (sme.pillars && sme.pillars.length > 0) return sme.pillars
        if (sme.dashboard_data?.pillars && sme.dashboard_data.pillars.length > 0) return sme.dashboard_data.pillars
        
        // 2. Extract from latest assessment if available
        if (sme.assessments && sme.assessments.length > 0) {
          // Sort by date to get the latest
          const sorted = [...sme.assessments].sort((a, b) => {
            const dateA = new Date(a.completedAt || a.completed_at || 0).getTime()
            const dateB = new Date(b.completedAt || b.completed_at || 0).getTime()
            return dateB - dateA
          })
          const latest = sorted[0]
          if (latest.pillars && latest.pillars.length > 0) {
            return latest.pillars
          }
        }
        
        return []
      })(),
      assessments: sme.assessments || [],
      registrationNumber: sme.registrationNumber || sme.registration_number || '-',
      teamSize: sme.teamSize || sme.team_size || '-',
      yearsInBusiness: sme.yearsInBusiness || sme.years_in_business || '-',
      address: sme.address || '-',
      websiteUrl: sme.websiteUrl || sme.website_url || '-',
      description: sme.description || '',
      logoUrl: sme.logoUrl || sme.logo_url || ''
    }
  }

  async fetchSmeDashboard() {
    const response = await this.repo.getSmeDashboard() as any
    const data = response?.data || response
    
    return {
      company: {
        name: data.company?.name || data.name || 'Unknown SME',
        industry: data.company?.industry || data.industry || '-',
        location: data.company?.location || data.location || '-',
        lastAssessed: data.company?.lastAssessed || data.last_assessed || '-',
        overallScore: data.company?.overallScore || data.score || 0
      },
      pillars: data.pillars || [],
      progress: data.progress || [],
      actions: (data.actions || []).map((a: any) => ({
        id: String(a.id),
        title: a.title,
        description: a.description,
        priority: (a.priority || a.importance || 'medium').toLowerCase(),
        pillar: a.pillar,
        impact: a.impact || 10,
        status: a.status || 'pending'
      })),
      primaryGoal: data.primaryGoal || null,
      thresholds: data.thresholds || []
    }
  }

  async fetchEnrolledPrograms() {
    const response = await this.repo.getEnrolledPrograms() as any
    const data = response?.data || response
    return (data || []).map((p: any) => ({
      id: String(p.id),
      name: p.name,
      description: p.description,
      templateId: String(p.template_id || p.templateId)
    }))
  }

  async fetchTemplates() {
    const response = await this.repo.getTemplates() as any
    return response?.data || response || []
  }

  async fetchQuestions(templateId?: string | number) {
    const response = await this.repo.getQuestions(templateId) as any
    const data = response?.data || response || []
    return data.map((q: any) => ({
      id: String(q.id),
      templateId: String(q.template_id),
      pillarId: String(q.pillar_id),
      text: q.text,
      type: q.type,
      weight: q.weight,
      required: Boolean(q.required),
      options: q.options
    }))
  }

  async fetchFrameworkSettings() {
    const response = await this.repo.getFrameworkSettings() as any
    const data = response?.data || response || {}
    
    // Support both root level and .settings wrapper
    const pillars = Array.isArray(data) ? data : (data.pillars || data.settings?.pillars || [])
    
    return pillars.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      weight: p.weight
    }))
  }
  
  async fetchSettings() {
    const response = await this.repo.getFrameworkSettings() as any
    return response?.data || response || { pillars: [], thresholds: [] }
  }

  async fetchSectors() {
    return await this.repo.getSectors()
  }

  async fetchPrograms() {
    return await this.repo.getPrograms()
  }

  async enrollInProgram(id: string | number) {
    return await this.repo.applyToProgram(id)
  }

  async fetchProgramComments(id: string | number) {
    return await this.repo.getProgramComments(id)
  }

  async fetchProgramParticipants(id: string | number) {
    const response = await this.repo.getProgramParticipants(id) as any
    return response?.data || response
  }

  async addProgramComment(id: string | number, content: string) {
    return await this.repo.postProgramComment(id, content)
  }
}

export const smeService = new SmeService()
