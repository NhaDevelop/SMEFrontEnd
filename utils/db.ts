
// Mock Database with rich data relationships simulating the IRIP Admin Portal requirements

// 1. Programs & Cohorts
export interface Program {
  id: number | string
  name: string
  status: 'Active' | 'Completed' | 'Draft'
  description: string
  templateId: string
  smesCount: number
  avgScore: number
  progress: number
  startDate?: string
  endDate?: string
}

const programs: Program[] = [
  {
    id: 1,
    name: 'SME Growth Accelerator 2024',
    status: 'Active',
    description: 'A 6-month intensive program for high-growth potential SMEs looking to scale operations and expand market reach.',
    templateId: 'temp_001',
    smesCount: 12,
    avgScore: 65,
    progress: 45,
    startDate: '2024-01-15',
    endDate: '2024-07-15'
  },
  {
    id: 2,
    name: 'FinTech Innovation Fund',
    status: 'Active',
    description: 'Focused on early-stage fintech startups seeking seed funding and regulatory guidance.',
    templateId: 'temp_002',
    smesCount: 8,
    avgScore: 58,
    progress: 30,
    startDate: '2024-03-01',
    endDate: '2024-09-01'
  },
  {
    id: 3,
    name: 'AgriTech Scale-up',
    status: 'Completed',
    description: 'Supporting agricultural technology adoption in rural areas.',
    templateId: 'temp_001',
    smesCount: 15,
    avgScore: 72,
    progress: 100,
    startDate: '2023-01-01',
    endDate: '2023-12-31'
  },
  {
    id: 4,
    name: 'Women Entrepreneurs Initiative',
    status: 'Active',
    description: 'Empowering women-led businesses with mentorship, networking, and investment readiness training.',
    templateId: 'temp_004',
    smesCount: 24,
    avgScore: 63,
    progress: 60,
    startDate: '2024-02-15',
    endDate: '2024-08-15'
  },
  {
    id: 5,
    name: 'Green Energy Transition',
    status: 'Draft',
    description: 'Helping SMEs in the energy sector transition to renewable sources and sustainable practices.',
    templateId: 'temp_001',
    smesCount: 0,
    avgScore: 0,
    progress: 0,
    startDate: '2024-06-01',
    endDate: '2024-12-01'
  },
  {
    id: 6,
    name: 'Digital Transformation Cohort',
    status: 'Active',
    description: 'Assisting traditional businesses in digitizing their operations and sales channels.',
    templateId: 'temp_003',
    smesCount: 18,
    avgScore: 55,
    progress: 25,
    startDate: '2024-04-01',
    endDate: '2024-10-01'
  },
  {
    id: 7,
    name: 'Tourism Recovery Program',
    status: 'Active',
    description: ' revitalizing the tourism sector post-pandemic through strategic investment and modernization.',
    templateId: 'temp_004',
    smesCount: 30,
    avgScore: 68,
    progress: 75,
    startDate: '2024-01-10',
    endDate: '2024-07-10'
  },
  {
    id: 8,
    name: 'Young Founders Bootcamp',
    status: 'Completed',
    description: 'A crash course for university students and recent graduates starting their first venture.',
    templateId: 'temp_003',
    smesCount: 45,
    avgScore: 70,
    progress: 100,
    startDate: '2023-09-01',
    endDate: '2023-11-30'
  },
  {
    id: 9,
    name: 'Export Readiness Program',
    status: 'Active',
    description: 'Preparing manufacturing SMEs for international market entry and compliance.',
    templateId: 'temp_002',
    smesCount: 10,
    avgScore: 61,
    progress: 40,
    startDate: '2024-03-15',
    endDate: '2024-09-15'
  }
]

// 2. Templates
export interface Template {
  id: string
  name: string
  version: string
  pillarCount: number
  questionCount: number
  usageCount: number
  description: string
}

const templates: Template[] = [
  {
    id: 'temp_001',
    name: 'Standard Investment Readiness Assessment',
    version: '2.1',
    pillarCount: 8,
    questionCount: 45,
    usageCount: 156,
    description: 'The comprehensive assessment for general SMEs.'
  },
  {
    id: 'temp_002',
    name: 'Investor Due Diligence',
    version: '1.0',
    pillarCount: 6,
    questionCount: 60,
    usageCount: 24,
    description: 'Deep-dive financial and legal focus.'
  },
  {
    id: 'temp_003',
    name: 'Quick Health Check',
    version: '1.2',
    pillarCount: 4,
    questionCount: 12,
    usageCount: 305,
    description: 'A 5-minute pre-screening tool.'
  },
  {
    id: 'temp_004',
    name: 'ESG Compliance Assessment',
    version: '1.0',
    pillarCount: 5,
    questionCount: 35,
    usageCount: 54,
    description: 'Focus on Environmental, Social, and Governance metrics.'
  }
]

// 3. Questions
export interface Question {
  id: string
  pillarId: string
  text: string
  type: 'Boolean' | 'Choice' | 'Text' | 'Number' | 'File'
  weight: number
  required: boolean
  helpText?: string
}

const questions: Question[] = [
  {
    id: 'q_fin_01',
    pillarId: 'finance',
    text: 'Do you have audited financial statements for the last 2 years?',
    type: 'Boolean',
    weight: 15,
    required: true,
    helpText: 'Statements must be signed by a certified accountant.'
  },
  {
    id: 'q_mkt_01',
    pillarId: 'market',
    text: 'What is your Total Addressable Market (TAM) size?',
    type: 'Number',
    weight: 10,
    required: true
  },
  {
    id: 'q_team_01',
    pillarId: 'team',
    text: 'Who are your key management personnel?',
    type: 'Text',
    weight: 5,
    required: false
  }
]

// 4. Scoring Rules
export interface ScoringRule {
  id: string
  name: string
  condition: string // e.g., "growthRate > 20"
  modifier: number // e.g., +10 or -5
  isActive: boolean
}

const scoringRules: ScoringRule[] = [
  {
    id: 'rule_01',
    name: 'High Growth Bonus',
    condition: 'revenue_growth > 20%',
    modifier: 10,
    isActive: true
  },
  {
    id: 'rule_02',
    name: 'No Audit Penalty',
    condition: 'audited_financials == false',
    modifier: -15,
    isActive: true
  }
]

// 5. Verification Requests
export interface VerificationRequest {
  id: number
  smeName: string
  documentType: string
  submissionDate: string
  status: 'Pending' | 'Approved' | 'Rejected'
  evidenceLink: string
}

const verificationRequests: VerificationRequest[] = [
  {
    id: 101,
    smeName: 'GreenTech Solutions',
    documentType: 'Financial Audit 2023',
    submissionDate: '2024-03-10',
    status: 'Pending',
    evidenceLink: 'audit_2023.pdf'
  },
  {
    id: 102,
    smeName: 'Urban Crafts',
    documentType: 'Business License',
    submissionDate: '2024-03-12',
    status: 'Pending',
    evidenceLink: 'license_scan.jpg'
  }
]

// 6. Audit Logs
export interface AuditLog {
  id: number
  admin: string
  action: string
  target: string
  timestamp: string
  details: string
}

const auditLogs: AuditLog[] = [
  {
    id: 1,
    admin: 'Sokha Chan',
    action: 'Updated Framework',
    target: 'Pillar Weights',
    timestamp: '2024-03-14 10:30 AM',
    details: 'Changed Team & Leadership from 10% to 12.5%'
  },
  {
    id: 2,
    admin: 'Super Admin',
    action: 'Created Program',
    target: 'FinTech Growth Program',
    timestamp: '2024-03-13 02:15 PM',
    details: 'Launched new accelerator program'
  }
]

// 7. Users
export interface User {
  id: number | string
  name: string
  email: string
  role: 'admin' | 'sme' | 'investor'
  status: 'active' | 'pending' | 'rejected'
  department?: string
  lastActive?: string
}

const users: User[] = [
  { id: 1, name: 'Sokha Chan', email: 'admin@irip.com', role: 'admin', status: 'active', department: 'Operations', lastActive: 'Now' },
  { id: 2, name: 'Angkor Tech', email: 'contact@angkortech.com', role: 'sme', status: 'active', lastActive: '2h ago' },
  { id: 3, name: 'David Chen', email: 'david@vc.com', role: 'investor', status: 'active', lastActive: '1d ago' },
  { id: 4, name: 'Mekong Solutions', email: 'info@mekong.com', role: 'sme', status: 'active', lastActive: '3d ago' },
  { id: 5, name: 'Sarah Admin', email: 'sarah@irip.com', role: 'admin', status: 'active', department: 'Finance', lastActive: '5h ago' },
  { id: 6, name: 'Pending Investor', email: 'new@investor.com', role: 'investor', status: 'pending', lastActive: '-' },
  { id: 7, name: 'Startup KPI', email: 'founder@startup.com', role: 'sme', status: 'pending', lastActive: '-' },
  { id: 8, name: 'Rejected User', email: 'spam@bot.com', role: 'sme', status: 'rejected', lastActive: '-' }
]


export const db = {
  programs: {
    findAll: () => [...programs],
    create: (program: any) => {
        const newP = { ...program, id: programs.length + 1, smesCount: 0, avgScore: 0, progress: 0 }
        programs.unshift(newP)
        return newP
    }
  },
  templates: {
    findAll: () => [...templates]
  },
  questions: {
    findAll: () => [...questions],
    findByPillar: (pillarId: string) => questions.filter(q => q.pillarId === pillarId)
  },
  scoringRules: {
    findAll: () => [...scoringRules]
  },
  verificationRequests: {
    findAll: () => [...verificationRequests],
    updateStatus: (id: number, status: 'Approved' | 'Rejected') => {
        const req = verificationRequests.find(r => r.id === id)
        if (req) req.status = status
        return req
    }
  },
  auditLogs: {
    findAll: () => [...auditLogs],
    create: (log: any) => {
        const newLog = { ...log, id: auditLogs.length + 1, timestamp: new Date().toLocaleString() }
        auditLogs.unshift(newLog)
        return newLog
    }
  },
  users: {
    findAll: () => [...users],
    create: (user: any) => {
        const newUser = { status: 'pending', lastActive: '-', ...user, id: users.length + 1 }
        users.push(newUser)
        return newUser
    },
    updateStatus: (id: number | string, status: 'active' | 'rejected') => {
        const u = users.find(x => x.id === id)
        if(u) u.status = status
    }
  }
}
