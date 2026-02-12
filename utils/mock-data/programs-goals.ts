// Goals Data
export const mockGoals = [
  {
    id: 1,
    sme_id: 1, // Angkor Tech
    title: 'Investor Ready by Q4 2024',
    description: 'Achieve readiness score of 80+ to attract Series A funding',
    pillar_id: null, // Overall goal
    status: 'COMPLETED',
    due_date: '2024-12-31',
    progress_percentage: 100,
    created_at: '2024-08-05T10:00:00Z',
    completed_at: '2024-11-15T14:00:00Z'
  },
  {
    id: 2,
    sme_id: 2, // GreenData
    title: 'Complete 2023 Financial Audit',
    description: 'Hire external auditor and complete full financial audit',
    pillar_id: 4, // FINANCIALS
    status: 'COMPLETED',
    due_date: '2024-10-31',
    progress_percentage: 100,
    created_at: '2024-09-17T09:00:00Z',
    completed_at: '2024-10-28T16:00:00Z'
  },
  {
    id: 3,
    sme_id: 2, // GreenData
    title: 'Expand Customer Base to 50',
    description: 'Grow from 12 to 50 paying customers',
    pillar_id: 3, // MARKET
    status: 'ACTIVE',
    due_date: '2025-03-31',
    progress_percentage: 56,
    created_at: '2024-11-03T10:00:00Z',
    completed_at: null
  },
  {
    id: 4,
    sme_id: 3, // FinTech Solutions
    title: 'Establish Legal Framework',
    description: 'Register company, create shareholder agreement, and IP protection',
    pillar_id: 6, // LEGAL
    status: 'ACTIVE',
    due_date: '2025-01-31',
    progress_percentage: 25,
    created_at: '2024-11-22T11:00:00Z',
    completed_at: null
  }
]

// Programs
export const mockPrograms = [
  {
    id: 1,
    name: 'AgriTech 2024 Batch',
    description: 'Accelerator program focused on agricultural technology startups in Southeast Asia',
    created_by_user_id: 1, // Sarah (Admin)
    start_date: '2024-09-01',
    end_date: '2025-02-28',
    created_at: '2024-07-15T09:00:00Z'
  },
  {
    id: 2,
    name: 'FinTech Innovation Fund',
    description: 'Investment readiness program for financial technology companies',
    created_by_user_id: 1,
    start_date: '2024-11-01',
    end_date: '2025-04-30',
    created_at: '2024-09-20T10:00:00Z'
  },
  {
    id: 3,
    name: 'Tech Growth Accelerator',
    description: 'Growth-stage program for technology companies seeking Series A',
    created_by_user_id: 2,
    start_date: '2024-08-01',
    end_date: '2025-01-31',
    created_at: '2024-06-10T08:00:00Z'
  }
]

// Program Enrollments
export const mockProgramEnrollments = [
  {
    id: 1,
    program_id: 1, // AgriTech 2024
    sme_id: 2, // GreenData
    status: 'ACCEPTED',
    enrollment_date: '2024-08-20T10:00:00Z'
  },
  {
    id: 2,
    program_id: 2, // FinTech Innovation
    sme_id: 3, // FinTech Solutions
    status: 'ACCEPTED',
    enrollment_date: '2024-11-05T09:00:00Z'
  },
  {
    id: 3,
    program_id: 3, // Tech Growth
    sme_id: 1, // Angkor Tech
    status: 'ACCEPTED',
    enrollment_date: '2024-07-25T11:00:00Z'
  }
]

// Investor Interests (Watchlist)
export const mockInvestorInterests = [
  {
    id: 1,
    investor_id: 1, // James @ Mekong Capital
    sme_id: 2, // GreenData
    notes: 'Strong market traction. Waiting for financial audit completion.',
    created_at: '2024-09-18T14:00:00Z'
  },
  {
    id: 2,
    investor_id: 1,
    sme_id: 1, // Angkor Tech
    notes: 'Excellent team and execution. Ready for Series A discussion.',
    created_at: '2024-10-05T10:00:00Z'
  },
  {
    id: 3,
    investor_id: 2, // Sequoia
    sme_id: 1, // Angkor Tech
    notes: 'High-growth potential. Monitoring progress.',
    created_at: '2024-10-12T11:00:00Z'
  }
]

// Documents
export const mockDocuments = [
  {
    id: 1,
    sme_id: 1,
    type: 'PITCH_DECK',
    file_url: '/documents/angkor-tech-pitch-2024.pdf',
    is_verified: true,
    verified_by_user_id: 1,
    uploaded_at: '2024-08-10T09:00:00Z'
  },
  {
    id: 2,
    sme_id: 1,
    type: 'FINANCIALS',
    file_url: '/documents/angkor-tech-financials-q3-2024.pdf',
    is_verified: true,
    verified_by_user_id: 1,
    uploaded_at: '2024-10-01T10:00:00Z'
  },
  {
    id: 3,
    sme_id: 2,
    type: 'FINANCIALS',
    file_url: '/documents/greendata-audit-2023.pdf',
    is_verified: true,
    verified_by_user_id: 1,
    uploaded_at: '2024-10-28T16:30:00Z'
  },
  {
    id: 4,
    sme_id: 2,
    type: 'PITCH_DECK',
    file_url: '/documents/greendata-pitch-nov-2024.pdf',
    is_verified: false,
    verified_by_user_id: null,
    uploaded_at: '2024-11-05T11:00:00Z'
  },
  {
    id: 5,
    sme_id: 3,
    type: 'LEGAL',
    file_url: '/documents/fintech-incorporation.pdf',
    is_verified: false,
    verified_by_user_id: null,
    uploaded_at: '2024-11-23T14:00:00Z'
  }
]
