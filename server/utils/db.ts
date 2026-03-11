import { storage } from './storage'
import { generatePillarScores, generateProgressData, getRiskFromScore } from '~/utils/sme-data'
import { getPillarScores } from './scoring'

const PILLAR_DISPLAY_NAMES: Record<string, string> = {
  'TEAM': 'Team & Leadership',
  'BUSINESS_MODEL': 'Business Model',
  'MARKET': 'Market & Traction',
  'FINANCIALS': 'Financial Readiness',
  'OPERATIONS': 'Operations',
  'LEGAL': 'Legal & Governance',
  'DATA': 'Data & Digital Maturity',
  'GROWTH': 'Growth & Scalability',
  'DIGITAL_MATURITY': 'Data & Digital Maturity'
}

const templates = [
// ... (lines 5-52 remain same, I must not delete them if I can help it)
// But I can't target "top of file" easily without overwriting.
// I'll add import at the top, and logic after array.

// Wait, I can't insert at Line 1 easily.
// I'll replace lines 1-4 with import + comment + const templates = [.

  {
    id: 'temp_001',
    name: 'Standard Investment Readiness Assessment',
    version: 'v1.0',
    pillarCount: 8,
    questionCount: 41,
    usageCount: 45,
    description: 'Comprehensive assessment covering all 8 pillars of investment readiness',
    status: 'Active',
    updatedAt: 'Jan 29, 2026',
    updatedBy: 'System Admin'
  },
  {
    id: 'temp_002',
    name: 'Financial Focus Assessment',
    version: 'v1.0',
    pillarCount: 2,
    questionCount: 8,
    usageCount: 0,
    description: 'Deep-dive assessment focused on financial readiness and business model validation',
    status: 'Draft',
    updatedAt: 'Nov 1, 2024',
    updatedBy: 'Finance Team'
  },
  {
    id: 'temp_003',
    name: 'Investor Due Diligence',
    version: 'v1.2',
    pillarCount: 5,
    questionCount: 13,
    usageCount: 12,
    description: 'Comprehensive due diligence assessment for investors evaluating potential investments',
    status: 'Active',
    updatedAt: 'Oct 20, 2024',
    updatedBy: 'Investment Team'
  },
  {
    id: 'temp_004',
    name: 'Quick Assessment',
    version: 'v2.0',
    pillarCount: 4,
    questionCount: 4,
    usageCount: 85,
    description: 'Shortened assessment for initial screening with focus on core pillars',
    status: 'Active',
    updatedAt: 'Dec 15, 2025',
    updatedBy: 'System Admin'
  },
  {
    id: 'temp_agritech_001',
    name: 'AgriTech Sustainability Standard',
    version: 'v1.0',
    pillarCount: 3,
    questionCount: 4,
    usageCount: 0,
    description: 'Specialized assessment for AgriTech startups with focus on sustainability and ESG.',
    status: 'Active',
    updatedAt: 'Feb 10, 2026',
    updatedBy: 'Agri Expert'
  },
  {
    id: 'temp_it_001',
    name: 'IT & Software Standard',
    version: 'v1.0',
    pillarCount: 8,
    questionCount: 24,
    usageCount: 0,
    description: 'Specialized assessment for IT & Software SMEs focusing on scalable architecture and data.',
    status: 'Active',
    updatedAt: 'Mar 7, 2026',
    updatedBy: 'IT Expert'
  }
]

// Load persisted templates
try {
    const fromStorage = storage.get().templates || []
    fromStorage.forEach((t: any) => {
         if (!templates.find(existing => existing.id == t.id)) {
             templates.push(t)
         }
    })
    console.log('[DB] Loaded', fromStorage.length, 'persisted templates')
} catch (e) {
    console.error('[DB] Failed to load persisted templates', e)
}
const programs = [
  {
    id: 1,
    name: 'Investment Accelerator 2024',
    description: 'Our flagship Investment Accelerator is a comprehensive 12-week program designed to transform promising SMEs into investor-ready companies. Through intensive mentorship, workshops, and direct investor access, we prepare you for successful Series A funding.',
    templateId: 'temp_001',
    status: 'Active',
    sector: 'All Sectors',
    duration: '12 weeks',
    deadline: 'March 31, 2024',
    investmentAmount: 'Up to $500K',
    benefits: ['1-on-1 mentorship', 'Investor introductions', 'Assessment coaching', 'Pitch preparation', 'Legal support', 'Financial modeling'],
    smesCount: 3,
    avgScore: 62,
    progress: 45,
    enrolledSMEs: [1, 2, 3],
    createdAt: '2024-01-15',
    createdBy: 'Admin'
  },
  {
    id: 2,
    name: 'FinTech Growth Program',
    description: 'Specialized accelerator for financial technology startups ready to scale their operations. Focuses on regulatory compliance, banking partnerships, and scaling customer acquisition.',
    templateId: 'temp_002',
    status: 'Active',
    sector: 'FinTech',
    duration: '8 weeks',
    deadline: 'April 15, 2024',
    investmentAmount: 'Up to $300K',
    benefits: ['Regulatory guidance', 'Banking partnerships', 'Technical advisory', 'Go-to-market support'],
    smesCount: 1,
    avgScore: 75,
    progress: 60,
    enrolledSMEs: [3],
    createdAt: '2024-02-01',
    createdBy: 'Admin'
  },
  {
    id: 3,
    name: 'AgriTech Innovation Fund',
    description: 'Supporting agricultural technology ventures transforming food systems in Southeast Asia with a focus on sustainability and impact.',
    templateId: 'temp_agritech_001',
    status: 'Draft',
    sector: 'AgriTech',
    duration: '16 weeks',
    deadline: 'May 1, 2024',
    investmentAmount: 'Up to $250K',
    benefits: ['Field pilots', 'Supply chain access', 'Impact measurement', 'Sustainability certification'],
    smesCount: 1,
    avgScore: 78,
    progress: 100,
    enrolledSMEs: [2],
    createdAt: '2024-02-15',
    createdBy: 'Admin'
  },
  {
    id: 4,
    name: 'Tech Innovators Accelerator',
    description: 'A focused accelerator for IT and Software SMEs. We look for strong technical architecture and scalable business models.',
    templateId: 'temp_it_001',
    status: 'Draft',
    sector: 'Information Technology',
    duration: '10 weeks',
    deadline: 'June 1, 2026',
    investmentAmount: 'Up to $400K',
    benefits: ['Cloud credits', 'Technical architecture review', 'Security audit', 'Venture capital intros'],
    smesCount: 0,
    avgScore: 0,
    progress: 0,
    enrolledSMEs: [],
    createdAt: '2026-03-07',
    createdBy: 'Admin'
  }
]

// Load persisted programs
try {
    const fromStorage = storage.get().programs || []
    fromStorage.forEach((p: any) => {
         const existing = programs.find(e => e.id == p.id)
         if (!existing) {
             programs.push(p)
         } else if (p.enrolledSMEs) {
             // Merge storage enrolled SMEs to prevent wipe
             existing.enrolledSMEs = [...new Set([...(existing.enrolledSMEs || []), ...p.enrolledSMEs])]
             existing.smesCount = existing.enrolledSMEs.length
         }
    })
    console.log('[DB] Loaded', fromStorage.length, 'persisted programs and merged enrollments')
    storage.save({ programs })
} catch (e) {
    console.error('[DB] Failed to load persisted programs', e)
}

import { templateQuestions } from '~/utils/mock-data/template-questions'
const questions = [...templateQuestions]

const goals: any[] = []

// Load persisted goals
try {
    const fromStorage = storage.get().goals || []
    fromStorage.forEach((g: any) => {
        if (!goals.find(existing => existing.id == g.id)) {
            goals.push(g)
        }
    })
    console.log('[DB] Loaded', fromStorage.length, 'persisted goals')
} catch (e) {
    console.error('[DB] Failed to load persisted goals', e)
}

// Load persisted questions
try {
    const fromStorage = storage.get().questions || []
    fromStorage.forEach((q: any) => {
        if (!questions.find(existing => existing.id === q.id)) {
            questions.push(q)
        }
    })
    console.log('[DB] Loaded', fromStorage.length, 'persisted questions')
    // Force save to ensure keys are in the file
    storage.save({ questions })
} catch (e) {
    console.error('[DB] Failed to load persisted questions', e)
}



export const seedUsers = [
  { id: 1, name: 'la', email: 'la@gmail.com', role: 'sme', status: 'active', registered: 'Jan 30, 2026' },
  { id: 2, name: 'panha pay', email: 'paypanha45@gmail.com', role: 'investor', status: 'active', registered: 'Jan 29, 2026' },
  { id: 3, name: 'Super Admin', email: 'stsmey@gmail.com', role: 'admin', status: 'active', registered: 'Jan 21, 2026' },
  { id: 4, name: 'Testing', email: 'bunphinim@gmail.com', role: 'sme', status: 'active', registered: 'Jan 17, 2026' },
  { id: 5, name: 'Testing', email: 'stsmey@gmail.com', role: 'admin', status: 'active', registered: 'Jan 16, 2026' }
]

export const db = {
  smes: {
    findAll: () => {
      const storageData = storage.get()
      const assessments = storageData.assessments || []
      
      // Fetch approved registrations from storage
      const approvedRegistrations = (storageData.registrations || [])
        .filter((r: any) => r.status === 'approved' && r.role === 'sme')
        .map((r: any) => ({
          id: r.id,
          name: r.company || r.name,
          company_name: r.company || r.name,
          industry: r.industry || 'General',
          location: r.address || 'Unknown',
          lastAssessed: r.registered_at,
          riskLevel: 'Low',
          readinessStatus: 'Enrolled',
          score: 0,
          growthPotential: 0,
          description: r.description || ''
        }))

      // The previous SME fetch was merging mockSMEProfiles (4 items). 
      // Instead, we merge the 'sme' seedUsers (2 items) so we match the Users table exactly.
      const seedSmes = seedUsers.filter(u => u.role === 'sme').map(sme => ({
          ...sme,
          company_name: sme.name,
          industry: 'General',
          location: 'Unknown',
          lastAssessed: sme.registered,
          riskLevel: 'Low',
          readinessStatus: 'Enrolled',
          score: 0,
          growthPotential: 0,
          description: ''
      }))

      const allSMEProfiles = [...seedSmes, ...approvedRegistrations]

      return allSMEProfiles.map((profile: any) => {
        const smeAssessments = assessments
          .filter((a: any) => a.sme_id == profile.id && a.status === 'COMPLETED')
          .sort((a: any, b: any) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
        
        const latest = smeAssessments[0]

        const score = latest ? latest.total_score : profile.score || 0
        const liveThresholds = db.settings.get().thresholds || []

        // Use real pillar scores if assessment exists, otherwise fallback to deterministic mock
        let realPillars = []
        if (latest) {
          const rawPillars = getPillarScores(latest.id, latest.questions || templateQuestions, storageData.responses || [], assessments)
          const livePillars = db.settings.get().pillars || []
          
          realPillars = rawPillars.map((p: any) => {
            const normalizedName = p.pillar_name ? p.pillar_name.toUpperCase() : ''
            // Attempt to derive genuine name from global settings if it's a number, otherwise use dict fallback
            const settingsMatch = livePillars.find((lp: any) => String(lp.id) === String(p.pillar_id))
            const definitiveName = settingsMatch ? settingsMatch.name : (PILLAR_DISPLAY_NAMES[normalizedName] || PILLAR_DISPLAY_NAMES[p.pillar_name] || p.pillar_name)
            
            return {
              id: p.pillar_id,
              name: definitiveName,
              score: p.score,
              potential: Math.round((100 - p.score) * 0.4) // Standard fallback potential
            }
          })
        } else {
          // Instead of generating mock scores, return 0 for all standard pillars
          const uniqueMainPillars = [
            'TEAM', 'BUSINESS_MODEL', 'MARKET', 'FINANCIALS', 
            'OPERATIONS', 'LEGAL', 'DATA', 'GROWTH'
          ]
          realPillars = uniqueMainPillars.map(key => ({
            id: key,
            name: PILLAR_DISPLAY_NAMES[key],
            score: 0,
            potential: 0
          }))
        }

        // Derive realistic growth potential from actual pillar scores (Growth & Scalability, Market & Traction)
        let actualGrowthPotential = profile.growthRate
        if (!actualGrowthPotential) {
          const growthPillar = realPillars.find((p: any) => p.name?.includes('Growth') || p.id === 'GROWTH')
          const marketPillar = realPillars.find((p: any) => p.name?.includes('Market') || p.id === 'MARKET')
          
          const gScore = growthPillar ? growthPillar.score : score
          const mScore = marketPillar ? marketPillar.score : score
          
          // Add slight deterministic variance based on ID so they don't lock into perfectly straight linear lines
          const variance = (Math.sin(profile.id * 1.5) * 15)
          actualGrowthPotential = Math.max(10, Math.min(95, Math.round((gScore * 0.6) + (mScore * 0.4) + variance)))
        }

        return {
          ...profile,
          name: profile.company_name || profile.name,
          globalScore: latest ? latest.total_score : 0,
          lastAssessed: latest ? latest.completed_at : profile.lastAssessed || null,
          assessments: assessments
            .filter((a: any) => a.sme_id == profile.id)
            .map((a: any) => {
               // Calculate the true score dynamically to ensure the Admin dashboard perfectly matches 
               // the recalculated history shown on the SME portal, rather than relying on stale snapshots.
               let trueScore = a.total_score
               try {
                  const pScores = getPillarScores(a.id, a.questions || templateQuestions, storageData.responses || [], assessments)
                  const calcScore = pScores.reduce((acc: number, p: any) => {
                      const weight = (p.weight || 0) / 100
                      return acc + (p.score * weight)
                  }, 0)
                  if (!isNaN(calcScore)) trueScore = Math.round(calcScore)
               } catch(e) {}

               return {
                 id: a.id,
                 templateId: a.template_id,
                 score: trueScore,
                 status: a.status,
                 completedAt: a.completed_at || a.started_at
               }
            }),
          score: score,
          status: latest ? 'Completed' : 'Enrolled', 
          pillars: realPillars,
          readinessHistory: generateProgressData(profile.id, score, smeAssessments.map((a: any) => a.total_score).reverse()).map((p: any) => p.score),
          financialRisk: getRiskFromScore(score, liveThresholds),
          riskLevel: getRiskFromScore(score, liveThresholds),
          growthRate: actualGrowthPotential,
          growthPotential: actualGrowthPotential,
          fundingNeeded: profile.fundingNeeded || 50000,
          financials: profile.financials || { revenue: '$100k', profit: '$20k', growth: '+15%' },
          programIds: programs
            .filter((p: any) => p.enrolledSMEs && p.enrolledSMEs.some((e: any) => e == profile.id))
            .map((p: any) => p.id)
        }
      })
    },
    findById: (id: string | number) => {
      return db.smes.findAll().find(s => s.id == id)
    }
  },
  templates: {
    findAll: () => templates,
    findById: (id: string | number) => templates.find(t => t.id === id),
    create: (data: any) => {
      const newTemplate = {
        id: data.id || `temp_${Date.now()}`,
        ...data,
        pillarCount: data.pillarCount || 0,
        questionCount: data.questionCount || 0,
        usageCount: 0,
        updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        updatedBy: 'Current Admin'
      }
      templates.push(newTemplate)
      storage.save({ templates })
      return newTemplate
    }
  },
  programs: {
    findAll: () => programs,
    findById: (id: number) => programs.find(p => p.id === id),
    create: (data: any) => {
      const newProgram = {
        id: programs.length + 1,
        ...data,
        status: data.templateId ? (data.status || 'Active') : 'Draft',
        smesCount: data.smesCount || 0,
        avgScore: data.avgScore || 0,
        progress: data.progress || 0,
        enrolledSMEs: data.enrolledSMEs || [] // Should be empty by default
      }
      programs.push(newProgram)
      storage.save({ programs })
      return newProgram
    },
    update: (id: number, data: any) => {
        const index = programs.findIndex(p => p.id === id)
        if (index !== -1) {
            const updated = { ...programs[index], ...data }
            if (!updated.templateId) {
                updated.status = 'Draft'
            }
            programs[index] = updated
            storage.save({ programs })
            return programs[index]
        }
        return null
    },
    delete: (id: number) => {
        const index = programs.findIndex(p => p.id === id)
        if (index !== -1) {
            programs.splice(index, 1)
            return true
        }
        return false
    }
  },
  questions: {
    findAll: () => questions,
    findByTemplateId: (templateId: string) => questions.filter(q => q.templateId === templateId),
    create: (data: any) => {
      const newQuestion = {
        ...data,
        id: data.id || `q_${Date.now()}`
      }
      questions.push(newQuestion)
      storage.save({ questions })
      return newQuestion
    },
    update: (id: string, data: any) => {
      const index = questions.findIndex(q => q.id === id)
      if (index !== -1) {
        questions[index] = { ...questions[index], ...data }
        storage.save({ questions })
        return questions[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = questions.findIndex(q => q.id === id)
      if (index !== -1) {
        questions.splice(index, 1)
        storage.save({ questions })
        return true
      }
      return false
    }
  },
  goals: {
    findAll: () => goals,
    findBySmeId: (smeId: number | string) => goals.filter(g => g.sme_id == smeId),
    create: (data: any) => {
      const newGoal = {
        id: goals.length + 1,
        ...data,
        status: data.status || 'ACTIVE',
        created_at: data.created_at || new Date().toISOString(),
        progress_percentage: data.progress_percentage || 0
      }
      goals.push(newGoal)
      storage.save({ goals })
      return newGoal
    },
    update: (id: number, data: any) => {
      const index = goals.findIndex(g => g.id == id)
      if (index !== -1) {
        goals[index] = { ...goals[index], ...data }
        storage.save({ goals })
        return goals[index]
      }
      return null
    },
    delete: (id: number) => {
      const index = goals.findIndex(g => g.id == id)
      if (index !== -1) {
        goals.splice(index, 1)
        storage.save({ goals })
        return true
      }
      return false
    }
  },
  audit_logs: {
    findAll: () => {
      const data = storage.get()
      return data.audit_logs || []
    },
    create: (data: any) => {
      const storeData = storage.get()
      if (!storeData.audit_logs) storeData.audit_logs = []
      
      const newLog = {
        id: `log_${Date.now()}`,
        ...data,
        timestamp: data.timestamp || new Date().toISOString()
      }
      
      storeData.audit_logs.unshift(newLog) // newest first
      storage.save({ audit_logs: storeData.audit_logs })
      return newLog
    }
  },
  notifications: {
    findAll: () => {
      const data = storage.get()
      return data.notifications || []
    },
    findByUserId: (userId: number | string) => {
      const data = storage.get()
      const notifications = data.notifications || []
      return notifications.filter((n: any) => String(n.user_id) === String(userId))
    },
    create: (data: any) => {
      const storeData = storage.get()
      if (!storeData.notifications) storeData.notifications = []
      
      const newNotif = {
        id: `notif_${Date.now()}`,
        is_read: false,
        created_at: new Date().toISOString(),
        ...data
      }
      
      storeData.notifications.unshift(newNotif)
      storage.save({ notifications: storeData.notifications })
      return newNotif
    }
  },
  messages: {
    findAll: () => {
      const data = storage.get()
      return data.messages || []
    },
    findByChatId: (chatId: string) => {
      const data = storage.get()
      const messages = data.messages || []
      return messages.filter((m: any) => m.chatId === chatId)
    },
    create: (data: any) => {
      const storeData = storage.get()
      if (!storeData.messages) storeData.messages = []
      
      const newMessage = {
        id: `msg_${Date.now()}`,
        ...data,
        timestamp: data.timestamp || new Date().toISOString()
      }
      
      storeData.messages.push(newMessage)
      storage.save({ messages: storeData.messages })
      return newMessage
    },
    markRead: (chatId: string, recipientId: number) => {
      const storeData = storage.get()
      if (!storeData.messages) return 0
      
      let count = 0
      storeData.messages = storeData.messages.map((m: any) => {
        if (m.chatId === chatId && m.senderId !== recipientId && !m.read) {
          count++
          return { ...m, read: true }
        }
        return m
      })
      
      if (count > 0) {
        storage.save({ messages: storeData.messages })
      }
      return count
    }
  },
  settings: {
    get: () => {
      const data = storage.get()
      return data.settings || {
        pillars: [
          { id: 'team', name: 'Team & Leadership', weight: 15 },
          { id: 'business_model', name: 'Business Model', weight: 15 },
          { id: 'market', name: 'Market & Traction', weight: 15 },
          { id: 'financials', name: 'Financial Readiness', weight: 20 },
          { id: 'operations', name: 'Operations', weight: 10 },
          { id: 'legal', name: 'Legal & Governance', weight: 10 },
          { id: 'data', name: 'Data & Digital Maturity', weight: 5 },
          { id: 'growth', name: 'Growth & Scalability', weight: 10 }
        ],
        thresholds: [
          { id: 'investor', label: 'Investor Ready', min: 80, max: 100, colorBg: 'bg-emerald-500' },
          { id: 'near', label: 'Near Ready', min: 60, max: 79, colorBg: 'bg-amber-500' },
          { id: 'early', label: 'Early Stage', min: 40, max: 59, colorBg: 'bg-teal-500' },
          { id: 'pre', label: 'Pre-Investment', min: 0, max: 39, colorBg: 'bg-red-500' }
        ]
      }
    },
    update: (newSettings: any) => {
      storage.save({ settings: newSettings })
      return newSettings
    }
  },
  reportLogs: {
    findAll: () => {
      const data = storage.get() as any
      return data.reportLogs || []
    },
    create: (logInfo: any) => {
      const storeData = storage.get() as any
      if (!storeData.reportLogs) storeData.reportLogs = []
      
      const newLog = {
        id: `log_${Date.now()}`,
        created_at: new Date().toISOString(),
        ...logInfo
      }
      
      storeData.reportLogs.unshift(newLog)
      if (storeData.reportLogs.length > 50) {
        storeData.reportLogs = storeData.reportLogs.slice(0, 50)
      }
      storage.save({ reportLogs: storeData.reportLogs } as any)
      return newLog
    }
  }
}
