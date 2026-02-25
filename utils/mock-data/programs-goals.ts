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
    current_score: 85,
    target_score: 80,
    pillars: [
      { name: 'Team', score: 85, target: 80 },
      { name: 'Business', score: 90, target: 85 },
      { name: 'Market', score: 88, target: 90 },
      { name: 'Financial', score: 82, target: 80 }
    ],
    actions: [
      { title: 'Goal Achieved', points: 0 }
    ],
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
    current_score: 95,
    target_score: 90,
    pillars: [
      { name: 'Financial Readiness', score: 95, target: 90 }
    ],
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
    current_score: 12,
    target_score: 50,
    pillars: [
      { name: 'Market & Traction', score: 12, target: 50 }
    ],
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
    current_score: 25,
    target_score: 100,
    pillars: [
      { name: 'Legal & Governance', score: 25, target: 100 }
    ],
    created_at: '2024-11-22T11:00:00Z',
    completed_at: null
  }
]

// Programs
export const mockPrograms = [
  {
    id: 1,
    name: 'Investment Accelerator 2024',
    description: 'Our flagship Investment Accelerator is a comprehensive 12-week program designed to transform promising SMEs into investor-ready companies.',
    created_by_user_id: 1, // Sarah (Admin)
    start_date: '2024-03-01',
    end_date: '2024-05-31',
    created_at: '2024-01-15T09:00:00Z',
    sector: 'All Sectors',
    duration: '12 weeks',
    deadline: 'March 31, 2024',
    investmentAmount: 'Up to $500K',
    benefits: ['1-on-1 mentorship', 'Investor introductions', 'Assessment coaching', 'Pitch preparation', 'Legal support', 'Financial modeling'],
    eligibility: [
      'Minimum 12 months of operations',
      'Revenue-generating or strong traction',
      'Full-time founding team',
      'Scalable business model',
      'Clear use of funds plan',
      'Registered legal entity'
    ],
    timeline: [
      { title: 'Foundation', week: 'Week 1-4', description: 'Business assessment, gap analysis, and goal setting' },
      { title: 'Development', week: 'Week 5-8', description: 'Intensive workshops, mentorship, and improvement implementation' },
      { title: 'Preparation', week: 'Week 9-10', description: 'Pitch deck development, financial modeling, and documentation' },
      { title: 'Demo Day', week: 'Week 11-12', description: 'Investor presentations and follow-up meetings' }
    ],
    outcomes: [
      '85% of participants improve readiness score by 20+ points',
      '60% secure funding within 6 months of completion',
      'Average deal size of $350K secured',
      'Access to network of 45+ active investors'
    ]
  },
  {
    id: 2,
    name: 'FinTech Growth Program',
    description: 'Specialized accelerator for financial technology startups ready to scale their operations.',
    created_by_user_id: 1,
    start_date: '2024-11-01',
    end_date: '2025-04-30',
    created_at: '2024-09-20T10:00:00Z',
    sector: 'FinTech',
    duration: '8 weeks',
    deadline: 'April 15, 2024',
    investmentAmount: 'Up to $300K',
    benefits: ['Regulatory guidance', 'Banking partnerships', 'Technical advisory', 'Go-to-market support', 'Compliance review', 'API integration support'],
    eligibility: [
      'FinTech or financial services focus',
      'Working product or MVP',
      'Active users or pilot customers',
      'Technical founding team',
      'Regulatory awareness'
    ],
    timeline: [
      { title: 'Assessment', week: 'Week 1', description: 'Product review, compliance audit, and market analysis' },
      { title: 'Regulatory Track', week: 'Week 2-4', description: 'Licensing guidance and regulatory framework setup' },
      { title: 'Banking Partnerships', week: 'Week 5-6', description: 'Introductions to banking partners and API integrations' },
      { title: 'Investor Demo', week: 'Week 7-8', description: 'Investor showcase and partnership closing sessions' }
    ],
    outcomes: [
      '90% clarity on regulatory pathway',
      '3+ banking partnership introductions',
      'Average 40% improvement in readiness score',
      'Direct access to FinTech-focused investors'
    ]
  },
  {
    id: 3,
    name: 'AgriTech Innovation Fund',
    description: 'Supporting agricultural technology ventures transforming food systems in Southeast Asia.',
    created_by_user_id: 2,
    start_date: '2024-12-01',
    end_date: '2025-05-31',
    created_at: '2024-10-10T08:00:00Z',
    sector: 'AgriTech',
    duration: '16 weeks',
    deadline: 'May 1, 2024',
    investmentAmount: 'Up to $250K',
    benefits: ['Field pilots', 'Supply chain access', 'Impact measurement', 'Sustainability certification'],
    eligibility: [
      'AgriTech or food systems focus',
      'Operational prototype or pilot',
      'Southeast Asia market presence',
      'Sustainability-oriented model',
      'Team with domain expertise'
    ],
    timeline: [
      { title: 'Field Assessment', week: 'Week 1-2', description: 'On-site evaluation of technology and operations' },
      { title: 'Impact Mapping', week: 'Week 3-6', description: 'Supply chain integration and impact metrics setup' },
      { title: 'Scale Planning', week: 'Week 7-12', description: 'Go-to-market strategy and partner introductions' },
      { title: 'Certification', week: 'Week 13-14', description: 'Sustainability audit and certification process' },
      { title: 'Investment Showcase', week: 'Week 15-16', description: 'Investor day and follow-up negotiations' }
    ],
    outcomes: [
      '75% of participants secure field pilot partnerships',
      '3+ supply chain partner introductions',
      'Sustainability certification upon completion',
      'Average 50% improvement in operational readiness'
    ]
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
