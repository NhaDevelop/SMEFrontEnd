import { defineStore } from 'pinia'
import { AdminService } from '~/modules/user/user.service'
import { db } from '~/utils/db'

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
  avgScore: number
  progress: number
  startDate?: string
  endDate?: string
  sector?: string
  duration?: string
  deadline?: string
  investmentAmount?: string
  benefits?: string[]
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
  industry: string
  location: string
  lastAssessed: string
  riskLevel: 'Low' | 'Medium' | 'High'
  readinessStatus: string
  score: number
  growthPotential: number
  programIds: (number | string)[]
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
  loading: boolean
  error: string | null
}

export const useAdminStore = defineStore('admin', {
  state: (): AdminState => ({
    userStats: null,
    pendingUsers: [],
    dashboardStats: null,
    frameworkThresholds: [],
    users: [
       {
            id: 1,
            name: 'la',
            email: 'la@gmail.com',
            role: 'sme',
            status: 'active',
            registered: 'Jan 30, 2026'
       },
       {
            id: 2,
            name: 'panha pay',
            email: 'paypanha45@gmail.com',
            role: 'investor',
            status: 'active',
            registered: 'Jan 29, 2026'
       },
       {
            id: 3,
            name: 'Super Admin',
            email: 'stsmey@gmail.com',
            role: 'admin',
            status: 'active',
            registered: 'Jan 21, 2026'
       },
       {
            id: 4,
            name: 'Testing',
            email: 'bunphinim@gmail.com',
            role: 'sme',
            status: 'active',
            registered: 'Jan 17, 2026'
       },
       {
            id: 5,
            name: 'Testing',
            email: 'stsmey@gmail.com',
            role: 'admin',
            status: 'active',
            registered: 'Jan 16, 2026'
       }
    ],
    programStats: null,
    programs: [
      {
        id: 1,
        name: 'Investment Accelerator 2024',
        description: 'A comprehensive 12-week program designed to prepare high-potential SMEs for Series A funding.',
        template: 'Standard Investment Readiness Assessment',
        templateId: 'temp_001',
        status: 'Active',
        sector: 'All Sectors',
        duration: '12 weeks',
        deadline: 'March 31, 2024',
        investmentAmount: 'Up to $500K',
        benefits: ['1-on-1 mentorship', 'Investor introductions', 'Assessment coaching', 'Pitch preparation'],
        smesCount: 3,
        avgScore: 62,
        progress: 45,
        enrolledSMEs: [1, 2, 3],
        createdAt: '2023-12-01',
        createdBy: 'Admin'
      },
      {
        id: 2,
        name: 'FinTech Growth Program',
        description: 'Specialized accelerator for financial technology startups ready to scale their operations.',
        template: 'Financial Focus Assessment',
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
        createdAt: '2024-05-15',
        createdBy: 'Admin'
      },
      {
        id: 3,
        name: 'AgriTech Innovation Fund',
        description: 'Supporting agricultural technology ventures transforming food systems in Southeast Asia.',
        status: 'Draft',
        template: 'AgriTech Sustainability Standard',
        templateId: 'temp_agritech_001',
        sector: 'AgriTech',
        duration: '16 weeks',
        deadline: 'May 1, 2024',
        investmentAmount: 'Up to $250K',
        benefits: ['Field pilots', 'Supply chain access', 'Impact measurement', 'Sustainability certification'],
        smesCount: 1,
        avgScore: 78,
        progress: 100,
        enrolledSMEs: [2],
        createdAt: '2023-12-15',
        createdBy: 'Admin'
      }
    ],
    frameworkSettings: [
      { id: 'team', name: 'Team & Leadership', weight: 12.5, indicators: ['Organizational Structure', 'Key Management Experience'] },
      { id: 'business', name: 'Business Model', weight: 12.5, indicators: ['Value Proposition', 'Revenue Streams', 'Cost Structure'] },
      { id: 'market', name: 'Market & Traction', weight: 12.5, indicators: ['Market Size', 'Competitive Landscape', 'Customer Acquisition'] },
      { id: 'finance', name: 'Financial Readiness', weight: 12.5, indicators: ['Financial Statements', 'Unit Economics', 'Funding History'] },
      { id: 'ops', name: 'Operations', weight: 12.5, indicators: ['Supply Chain', 'Operational Processes', 'Infrastructure'] },
      { id: 'legal', name: 'Legal & Governance', weight: 12.5, indicators: ['Incorporation Status', 'IP Rights', 'Compliance'] },
      { id: 'data', name: 'Data & Digital Maturity', weight: 12.5, indicators: ['Data Collection', 'Analytics Usage', 'Cybersecurity'] },
      { id: 'growth', name: 'Growth & Scalability', weight: 12.5, indicators: ['Expansion Plans', 'Scalability Potential', 'Exit Strategy'] },
    ],
    indicators: [
        { id: 'ind_team_struct', pillarId: 'team', name: 'Organizational Structure', weight: 40 },
        { id: 'ind_team_exp', pillarId: 'team', name: 'Key Management Experience', weight: 60 },
        { id: 'ind_fin_audit', pillarId: 'finance', name: 'Financial Audits', weight: 50 },
        { id: 'ind_fin_perf', pillarId: 'finance', name: 'Financial Performance', weight: 50 }
    ],
    smes: [],
    verificationRequests: [
      {
        id: 101,
        smeName: 'GreenTech Solutions',
        documentType: 'Financial Audit 2023',
        submissionDate: '2024-03-10',
        status: 'Pending',
        evidenceLink: 'audit_2023.pdf',
        notes: 'Please verify revenue figures against tax return.'
      },
      {
        id: 102,
        smeName: 'Urban Crafts',
        documentType: 'Business License',
        submissionDate: '2024-03-12',
        status: 'Pending',
        evidenceLink: 'license_scan.jpg'
      },
      {
        id: 103,
        smeName: 'AgriExport Co',
        documentType: 'Export Certification',
        submissionDate: '2024-03-08',
        status: 'Approved',
        evidenceLink: 'cert_export.pdf'
      }
    ],
    auditLogs: [],
    templates: [
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
        id: 'temp_agritech_001',
        name: 'AgriTech Sustainability Standard',
        version: 'v2.1',
        pillarCount: 8,
        questionCount: 42,
        usageCount: 5,
        description: 'Specialized assessment for AgriTech startups with focus on sustainability and ESG.',
        status: 'Active',
        updatedAt: 'Feb 10, 2026',
        updatedBy: 'Agri Expert'
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
        usageCount: 28,
        description: 'Shortened assessment for initial screening with focus on core pillars',
        status: 'Active',
        updatedAt: 'Sep 15, 2024',
        updatedBy: 'Admin User'
      },
      {
        id: 'temp_005',
        name: 'Legacy Assessment (2023)',
        version: 'v3.0',
        pillarCount: 6,
        questionCount: 0,
        usageCount: 156,
        description: 'Previous version of the standard assessment - archived for reference',
        status: 'Archived',
        updatedAt: 'Jan 1, 2024',
        updatedBy: 'System Admin'
      }
    ],
    scoringRules: [
        {
            id: 'rule_01',
            name: 'High Growth Bonus',
            condition: 'revenue_growth > 20%',
            modifier: +10,
            isActive: true
        },
        {
            id: 'rule_02',
            name: 'High Margins Bonus',
            condition: 'profit_margin > 15%',
            modifier: +5,
            isActive: true
        },
        {
            id: 'rule_03',
            name: 'No Audit Penalty',
            condition: 'audited_financials == false',
            modifier: -15,
            isActive: true
        },
        {
            id: 'rule_04',
            name: 'Strong Management',
            condition: 'management_exp > 10yrs',
            modifier: +8,
            isActive: false
        }
    ],
    customFields: [
        {
            id: 'cf_01',
            entityType: 'SME',
            name: 'taxId',
            label: 'Tax ID Number',
            type: 'Text',
            required: false,
            active: true
        },
        {
            id: 'cf_02',
            entityType: 'SME',
            name: 'preferredContact',
            label: 'Preferred Contact Method',
            type: 'Dropdown',
            required: false,
            active: true,
            options: ['Email', 'Phone', 'Messaging App']
        }
    ] as CustomField[],
    questions: [
       // --- Standard Investment Readiness (temp_001) - 41 questions ---
       // Team (6)
       { id: 'q1', pillarId: 'team', templateId: 'temp_001', text: 'Does your company have a dedicated CEO?', type: 'Yes/No', weight: 15, required: true },
       { id: 'q2', pillarId: 'team', templateId: 'temp_001', text: 'Do you have a CFO?', type: 'Yes/No', weight: 15, required: true },
       { id: 'q3', pillarId: 'team', templateId: 'temp_001', text: 'Do you have an advisory board?', type: 'Yes/No', weight: 10, required: false },
       { 
         id: 'q4', 
         pillarId: 'team', 
         templateId: 'temp_001', 
         text: 'Years of industry experience in leadership?', 
         type: 'Dropdown Select', 
         weight: 20, 
         required: true,
         options: ['10+ years', '6-10 years', '3-5 years', '0-2 years'] 
       },
       { id: 'q5', pillarId: 'team', templateId: 'temp_001', text: 'Rate team execution ability', type: 'Scale (1-10)', weight: 20, required: true },
       { id: 'q23', pillarId: 'team', templateId: 'temp_001', text: 'Do you have a clear organizational chart?', type: 'Yes/No', weight: 20, required: true },
       
       // Business (5)
       { id: 'q8', pillarId: 'business', templateId: 'temp_001', text: 'Is your value proposition clearly defined?', type: 'Yes/No', weight: 20, required: true },
       { id: 'q9', pillarId: 'business', templateId: 'temp_001', text: 'Do you have a scalable business model?', type: 'Yes/No', weight: 20, required: true },
       { 
         id: 'q10', 
         pillarId: 'business', 
         templateId: 'temp_001', 
         text: 'Primary revenue stream?', 
         type: 'Dropdown Select', 
         weight: 20, 
         required: true,
         options: ['Recurring / Subscription', 'One-time Sales', 'Service Fees', 'Licensing', 'Advertising'] 
       },
       { id: 'q24', pillarId: 'business', templateId: 'temp_001', text: 'Customer acquisition strategy defined?', type: 'Yes/No', weight: 20, required: true },
       { id: 'q25', pillarId: 'business', templateId: 'temp_001', text: 'Partnership strategy in place?', type: 'Yes/No', weight: 20, required: false },

       // Market (5)
       { id: 'q7', pillarId: 'market', templateId: 'temp_001', text: 'Total Addressable Market (TAM) size?', type: 'Number', weight: 30, required: true },
       { id: 'q11', pillarId: 'market', templateId: 'temp_001', text: 'Have you defined your target customer persona?', type: 'Yes/No', weight: 20, required: true },
       { id: 'q12', pillarId: 'market', templateId: 'temp_001', text: 'Who is your main competitor?', type: 'Text', weight: 10, required: false },
       { id: 'q26', pillarId: 'market', templateId: 'temp_001', text: 'Market growth rate (%)', type: 'Number', weight: 20, required: true },
       { id: 'q27', pillarId: 'market', templateId: 'temp_001', text: 'Regulatory barriers to entry?', type: 'Yes/No', weight: 20, required: true },

       // Finance (5)
       { id: 'q13', pillarId: 'finance', templateId: 'temp_001', text: 'Do you have 2 years of financial statements?', type: 'Yes/No', weight: 25, required: true },
       { id: 'q14', pillarId: 'finance', templateId: 'temp_001', text: 'Are you currently profitable?', type: 'Yes/No', weight: 25, required: true },
       { id: 'q15', pillarId: 'finance', templateId: 'temp_001', text: 'Monthly Burn Rate (USD)', type: 'Number', weight: 20, required: true },
       { id: 'q28', pillarId: 'finance', templateId: 'temp_001', text: 'Projected revenue next year?', type: 'Number', weight: 15, required: true },
       { id: 'q29', pillarId: 'finance', templateId: 'temp_001', text: 'Debt to Equity ratio', type: 'Number', weight: 15, required: false },

       // Ops (5)
       { id: 'q16', pillarId: 'ops', templateId: 'temp_001', text: 'Do you have documented SOPs?', type: 'Yes/No', weight: 30, required: true },
       { id: 'q17', pillarId: 'ops', templateId: 'temp_001', text: 'Rate your supply chain stability', type: 'Scale (1-10)', weight: 30, required: true },
       { id: 'q30', pillarId: 'ops', templateId: 'temp_001', text: 'Disaster recovery plan in place?', type: 'Yes/No', weight: 20, required: true },
       { id: 'q31', pillarId: 'ops', templateId: 'temp_001', text: 'Quality control process defined?', type: 'Yes/No', weight: 10, required: true },
       { id: 'q32', pillarId: 'ops', templateId: 'temp_001', text: 'Inventory management system used?', type: 'Yes/No', weight: 10, required: false },

       // Legal (5)
       { id: 'q18', pillarId: 'legal', templateId: 'temp_001', text: 'Is your IP legally protected?', type: 'Yes/No', weight: 40, required: true },
       { id: 'q19', pillarId: 'legal', templateId: 'temp_001', text: 'Any pending litigation?', type: 'Yes/No', weight: 60, required: true },
       { id: 'q33', pillarId: 'legal', templateId: 'temp_001', text: 'Employee contracts signed?', type: 'Yes/No', weight: 30, required: true },
       { id: 'q34', pillarId: 'legal', templateId: 'temp_001', text: 'Compliance with local labor laws?', type: 'Yes/No', weight: 30, required: true },
       { id: 'q35', pillarId: 'legal', templateId: 'temp_001', text: 'Shareholder agreement signed?', type: 'Yes/No', weight: 40, required: true },

       // Data (5)
       { id: 'q20', pillarId: 'data', templateId: 'temp_001', text: 'Do you collect customer data?', type: 'Yes/No', weight: 30, required: true },
       { id: 'q21', pillarId: 'data', templateId: 'temp_001', text: 'Are you compliant with data privacy laws?', type: 'Yes/No', weight: 70, required: true },
       { 
         id: 'q36', 
         pillarId: 'data', 
         templateId: 'temp_001', 
         text: 'Data backup frequency?', 
         type: 'Dropdown Select', 
         weight: 30, 
         required: true,
         options: ['Daily', 'Weekly', 'Monthly', 'Never']
       },
       { id: 'q37', pillarId: 'data', templateId: 'temp_001', text: 'Cybersecurity measures in place?', type: 'Yes/No', weight: 40, required: true },
       { id: 'q38', pillarId: 'data', templateId: 'temp_001', text: 'Analytics tools used?', type: 'Text', weight: 30, required: false },

       // Growth (5)
       { id: 'q22', pillarId: 'growth', templateId: 'temp_001', text: 'Do you have a clear expansion plan?', type: 'Yes/No', weight: 50, required: true },
       { id: 'q39', pillarId: 'growth', templateId: 'temp_001', text: 'International markets identified?', type: 'Yes/No', weight: 25, required: true },
       { id: 'q40', pillarId: 'growth', templateId: 'temp_001', text: 'Product roadmap for next 12 months?', type: 'Yes/No', weight: 25, required: true },
       { id: 'q41', pillarId: 'growth', templateId: 'temp_001', text: 'Hiring plan for next 12 months?', type: 'Yes/No', weight: 25, required: true },
       { id: 'q42', pillarId: 'growth', templateId: 'temp_001', text: 'Marketing budget allocated?', type: 'Yes/No', weight: 25, required: true },

       // --- Financial Focus Assessment (temp_002) - ~15 questions ---
       { id: 'q2_f1', pillarId: 'finance', templateId: 'temp_002', text: 'Do you have audited financials?', type: 'Yes/No', weight: 20, required: true },
       { id: 'q2_f2', pillarId: 'finance', templateId: 'temp_002', text: 'Current Runway (Months)', type: 'Number', weight: 20, required: true },
       { id: 'q2_f3', pillarId: 'finance', templateId: 'temp_002', text: 'Gross Margin %', type: 'Number', weight: 20, required: true },
       { id: 'q2_f4', pillarId: 'finance', templateId: 'temp_002', text: 'EBITDA Margin %', type: 'Number', weight: 20, required: true },
       { id: 'q2_f5', pillarId: 'finance', templateId: 'temp_002', text: 'Do you have a dedicated finance team?', type: 'Yes/No', weight: 20, required: true },
       { id: 'q2_b1', pillarId: 'business', templateId: 'temp_002', text: 'Revenue Model Type', type: 'Dropdown Select', weight: 30, required: true },
       { id: 'q2_b2', pillarId: 'business', templateId: 'temp_002', text: 'Cost of Customer Acquisition (CAC)', type: 'Number', weight: 35, required: true },
       { id: 'q2_b3', pillarId: 'business', templateId: 'temp_002', text: 'Customer Lifetime Value (LTV)', type: 'Number', weight: 35, required: true },

       // --- Investor Due Diligence (temp_003) - ~40 questions ---
       // Team
       { id: 'q3_t1', pillarId: 'team', templateId: 'temp_003', text: 'Full list of shareholders provided?', type: 'File Upload', weight: 10, required: true },
       { id: 'q3_t2', pillarId: 'team', templateId: 'temp_003', text: 'Background checks on founders completed?', type: 'Yes/No', weight: 20, required: true },
       { id: 'q3_t3', pillarId: 'team', templateId: 'temp_003', text: 'Key Man Insurance in place?', type: 'Yes/No', weight: 15, required: true },
       // Legal
       { id: 'q3_l1', pillarId: 'legal', templateId: 'temp_003', text: 'Certificate of Incorporation', type: 'File Upload', weight: 20, required: true },
       { id: 'q3_l2', pillarId: 'legal', templateId: 'temp_003', text: 'Memorandum & Articles of Association', type: 'File Upload', weight: 20, required: true },
       { id: 'q3_l3', pillarId: 'legal', templateId: 'temp_003', text: 'Cap Table Verification', type: 'Yes/No', weight: 20, required: true },
       // Finance
       { id: 'q3_f1', pillarId: 'finance', templateId: 'temp_003', text: '3-Year Financial Projections', type: 'File Upload', weight: 25, required: true },
       { id: 'q3_f2', pillarId: 'finance', templateId: 'temp_003', text: 'Bank Statements (Last 12 Months)', type: 'File Upload', weight: 25, required: true },
       { id: 'q3_f3', pillarId: 'finance', templateId: 'temp_003', text: 'Tax Returns (Last 2 Years)', type: 'File Upload', weight: 25, required: true },
       // Market
       { id: 'q3_m1', pillarId: 'market', templateId: 'temp_003', text: 'Competitive Analysis Report', type: 'File Upload', weight: 30, required: true },
       { id: 'q3_m2', pillarId: 'market', templateId: 'temp_003', text: 'Customer Contracts / LOIs', type: 'File Upload', weight: 30, required: true },
       // Tech/Data
       { id: 'q3_d1', pillarId: 'data', templateId: 'temp_003', text: 'Tech Stack Documentation', type: 'File Upload', weight: 40, required: true },
       { id: 'q3_d2', pillarId: 'data', templateId: 'temp_003', text: 'Cybersecurity Audit Report', type: 'File Upload', weight: 60, required: true },

       // --- Quick Assessment (temp_004) - ~21 questions ---
       { id: 'q4_t1', pillarId: 'team', templateId: 'temp_004', text: 'Founder Full Time?', type: 'Yes/No', weight: 50, required: true },
       { id: 'q4_b1', pillarId: 'business', templateId: 'temp_004', text: 'Product is Live?', type: 'Yes/No', weight: 50, required: true },
        { id: 'q4_m1', pillarId: 'market', templateId: 'temp_004', text: 'Market Growing?', type: 'Yes/No', weight: 50, required: true },
        { id: 'q4_f1', pillarId: 'finance', templateId: 'temp_004', text: 'Generated Revenue?', type: 'Yes/No', weight: 50, required: true },

        // --- AgriTech Sustainability Standard (temp_agritech_001) ---
        { id: 'qa_t1', pillarId: 'team', templateId: 'temp_agritech_001', text: 'Does your team have agricultural expertise?', type: 'Yes/No', weight: 50, required: true },
        { id: 'qa_b1', pillarId: 'business', templateId: 'temp_agritech_001', text: 'Is your solution sustainable?', type: 'Yes/No', weight: 100, required: true },
        { id: 'qa_o1', pillarId: 'ops', templateId: 'temp_agritech_001', text: 'Do you have a stable supply chain?', type: 'Yes/No', weight: 50, required: true },
        { id: 'qa_o2', pillarId: 'ops', templateId: 'temp_agritech_001', text: 'Do you measure your carbon footprint?', type: 'Yes/No', weight: 50, required: true, helperText: 'Custom ESG metric for AgriTech' }
    ],
    loading: false,
    error: null
  }),

  getters: {
    // Add a getter for filtered programs
    filteredPrograms: (state) => (query: string) => {
       if (!query) return state.programs
       const lowerQuery = query.toLowerCase()
       return state.programs.filter(p => 
         p.name.toLowerCase().includes(lowerQuery) || 
         p.description.toLowerCase().includes(lowerQuery)
       )
    },
    getSmeById: (state) => (id: string | number) => {
        return state.smes.find(sme => sme.id == id)
    },
    pendingVerificationCount: (state) => state.verificationRequests.filter(r => r.status === 'Pending').length,
    // User Getters
    pendingUsersList: (state) => state.users.filter(u => u.status === 'pending'),
    approvedUsersList: (state) => state.users.filter(u => u.status === 'active')
  },

  actions: {
    async fetchDashboardStats() {
      this.loading = true
      this.error = null
      const service = new AdminService()
      try {
        const response = await service.getDashboardData() as any
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
        const response = await service.getUsersData() as any

        // API returns { users: [], stats: {}, pendingUsers: [] }
        const userList = response?.users || []
        if (userList.length > 0) {
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

    async createUser(user: Partial<User>) {
        this.loading = true
        try {
            // Mock Create
            const newUser = { ...user, status: 'active', lastActive: 'Just now' } // Auto activate for admin creation
            db.users.create(newUser)
            await this.fetchUsersData()
             this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Created User',
                target: `User ${newUser.name}`,
                timestamp: new Date().toLocaleString(),
                details: `Created new ${newUser.role} user`
            })
        } catch (e: any) { this.error = e.message } 
        finally { this.loading = false }
    },
    async approveUser(id: number | string) {
        this.loading = true
        try {
            db.users.updateStatus(id, 'active')
            await this.fetchUsersData()
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Approved User',
                target: `User ID ${id}`,
                timestamp: new Date().toLocaleString(),
                details: 'Approved registration request'
            })
        } catch (e: any) { this.error = e.message } 
        finally { this.loading = false }
    },

    async rejectUser(id: number | string) {
        this.loading = true
        try {
            db.users.updateStatus(id, 'rejected')
            await this.fetchUsersData()
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Rejected User',
                target: `User ID ${id}`,
                timestamp: new Date().toLocaleString(),
                details: 'Rejected registration request'
            })
        } catch (e: any) { this.error = e.message } 
        finally { this.loading = false }
    },

    async deleteUser(id: number | string) {
        this.loading = true
        try {
            db.users.updateStatus(id, 'rejected')
            await this.fetchUsersData()
             this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Deleted User',
                target: `User ID ${id}`,
                timestamp: new Date().toLocaleString(),
                details: 'Deleted user from platform'
            })
        } catch (e: any) { this.error = e.message } 
        finally { this.loading = false }
    },

    async fetchProgramsData() {
      this.loading = true
      this.error = null
      const service = new AdminService()
      try {
        const response = await service.getProgramsData()
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
        const templates = await service.getTemplatesData()
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
            const response = await service.getQuestionsData()
            if (response && response.length > 0) {
                this.questions = response
            }
            console.log(`[Admin Store] Fetched ${this.questions.length} questions`)
        } catch (err: any) {
            console.error('Failed to fetch questions', err)
        }
    },

    async fetchSmesData() {
        const service = new AdminService()
        try {
            const response = await service.getSMEsData()
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
      try {
        const settings = await $fetch<any>('/api/admin/settings')
        if (settings && settings.pillars) {
           this.frameworkSettings = settings.pillars
           if(settings.thresholds) {
              this.frameworkThresholds = settings.thresholds
           }
        }
      } catch (err: any) {
        console.error('Failed to fetch Framework Settings:', err)
      } finally {
        this.loading = false
      }
    },

    async updateFrameworkSettings(payloadData: { pillars: PillarWeight[], thresholds?: any[] }) {
      this.loading = true
      try {
        const currentData = await $fetch<any>('/api/admin/settings').catch(() => null)
        const payload = {
            pillars: payloadData.pillars,
            thresholds: payloadData.thresholds || currentData?.thresholds || []
        }
        
        const response = await $fetch<any>('/api/admin/settings', {
            method: 'POST',
            body: payload
        })
        
        if (response && response.success) {
            this.frameworkSettings = response.settings.pillars
            if(response.settings.thresholds) {
                this.frameworkThresholds = response.settings.thresholds
            }
            
            // Log this action
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Super Admin',
                action: 'Updated Framework',
                target: 'Pillar Weights',
                timestamp: new Date().toLocaleString(),
                details: 'Updated pillar weight distribution'
            })
        }
      } catch(err) {
         console.error('Failed to update framework settings', err)
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
        await service.createProgram(programData)
        // Refresh list to get updated stats and list
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


    
    async updateProgram(programData: any) {
      this.loading = true
      // const service = new AdminService() // If we had update endpoint
      try {
        // Mock update for now
        const index = this.programs.findIndex(p => p.id === programData.id)
        if (index !== -1) {
             const existing = this.programs[index]
             const updated = { ...existing, ...programData }
             this.programs[index] = updated
             
             this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Updated Program',
                target: programData.name || existing?.name || 'Unknown Program',
                timestamp: new Date().toLocaleString(),
                details: 'Updated program details'
            })
        }
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (err: any) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteProgram(id: number | string) {
        this.loading = true
        try {
            // Mock delete
            this.programs = this.programs.filter(p => p.id !== id)
            
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Deleted Program',
                target: `ID: ${id}`,
                timestamp: new Date().toLocaleString(),
                details: 'Deleted program from list'
            })
            await new Promise(resolve => setTimeout(resolve, 500))
        } catch (err: any) {
            this.error = err.message
            throw err
        } finally {
            this.loading = false
        }
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
            
            await service.saveQuestion(newQuestion)
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

    async updateTemplateStatus(id: string, status: 'Active' | 'Draft' | 'Archived') {
        this.loading = true
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            const template = this.templates.find(t => t.id === id)
            if (template) {
                const oldStatus = template.status
                template.status = status
                template.updatedAt = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                template.updatedBy = 'You'
                
                this.auditLogs.unshift({
                    id: Date.now(),
                    admin: 'Current Admin',
                    action: 'Updated Template Status',
                    target: template.name,
                    timestamp: new Date().toLocaleString(),
                    details: `Changed status from ${oldStatus} to ${status}`
                })
            }
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
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            
            const newTemplate = {
                id: `temp_${Date.now()}`,
                name: templateData.name,
                description: templateData.description,
                version: 'v0.1',
                // Explicitly cast or handle types if strict check is on
                pillarCount: 0,
                questionCount: 0,
                usageCount: 0,
                status: 'Draft',
                updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                updatedBy: 'You'
            }

            if (templateData.cloneFrom) {
                const source = this.templates.find(t => t.id === templateData.cloneFrom)
                if (source) {
                    newTemplate.pillarCount = source.pillarCount
                    newTemplate.questionCount = source.questionCount
                }
            }

            // Save to server first
            const service = new AdminService()
            await service.createTemplate(newTemplate)

            this.templates.unshift(newTemplate as any)
            
            this.auditLogs.unshift({
                id: Date.now(),
                admin: 'Current Admin',
                action: 'Created Template',
                target: templateData.name,
                timestamp: new Date().toLocaleString(),
                details: `Created new assessment template`
            })
        } finally {
            this.loading = false
        }
    },

    async deleteTemplate(id: string) {
        this.loading = true
        try {
            await new Promise(resolve => setTimeout(resolve, 500))
            const template = this.templates.find(t => t.id === id)
            this.templates = this.templates.filter(t => t.id !== id)
            
            if (template) {
                 this.auditLogs.unshift({
                    id: Date.now(),
                    admin: 'Current Admin',
                    action: 'Deleted Template',
                    target: template.name,
                    timestamp: new Date().toLocaleString(),
                    details: `Deleted assessment template`
                })
            }
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
            await service.enrollSmesToProgram(programId, smeIds)
            
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
    }
  }
})
