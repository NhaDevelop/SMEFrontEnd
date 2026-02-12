// Assessment Framework: Pillars & Questions
export const mockPillars = [
  { id: 1, name: 'TEAM', weight: 0.15 },
  { id: 2, name: 'BUSINESS_MODEL', weight: 0.15 },
  { id: 3, name: 'MARKET', weight: 0.15 },
  { id: 4, name: 'FINANCIALS', weight: 0.15 },
  { id: 5, name: 'OPERATIONS', weight: 0.10 },
  { id: 6, name: 'LEGAL', weight: 0.10 },
  { id: 7, name: 'DIGITAL_MATURITY', weight: 0.10 },
  { id: 8, name: 'GROWTH', weight: 0.10 }
]

export const mockQuestions = [
  // Team Questions (Pillar 1)
  {
    id: 1,
    pillar_id: 1,
    text: 'Does your team have prior startup experience?',
    type: 'CHOICE',
    weight: 0.3,
    options: [
      { value: 'none', label: 'No experience', points: 0 },
      { value: 'some', label: 'Some team members', points: 5 },
      { value: 'most', label: 'Most team members', points: 8 },
      { value: 'all', label: 'All founders', points: 10 }
    ]
  },
  {
    id: 2,
    pillar_id: 1,
    text: 'Do you have a technical co-founder?',
    type: 'BOOLEAN',
    weight: 0.25,
    options: [
      { value: true, label: 'Yes', points: 10 },
      { value: false, label: 'No', points: 0 }
    ]
  },
  
  // Business Model Questions (Pillar 2)
  {
    id: 7,
    pillar_id: 2,
    text: 'Do you have a validated business model?',
    type: 'CHOICE',
    weight: 0.4,
    options: [
      { value: 'none', label: 'No validation', points: 0 },
      { value: 'some', label: 'Partially validated', points: 5 },
      { value: 'mostly', label: 'Mostly validated', points: 8 },
      { value: 'fully', label: 'Fully validated', points: 10 }
    ]
  },
  {
    id: 8,
    pillar_id: 2,
    text: 'What is your revenue model?',
    type: 'CHOICE',
    weight: 0.3,
    options: [
      { value: 'none', label: 'No clear model', points: 0 },
      { value: 'single', label: 'Single revenue stream', points: 5 },
      { value: 'multiple', label: 'Multiple revenue streams', points: 8 },
      { value: 'recurring', label: 'Recurring revenue model', points: 10 }
    ]
  },
  
  // Market Questions (Pillar 3)
  {
    id: 3,
    pillar_id: 3,
    text: 'What is your current monthly revenue?',
    type: 'CHOICE',
    weight: 0.4,
    options: [
      { value: 'none', label: 'No revenue', points: 0 },
      { value: 'low', label: 'Under $5k', points: 3 },
      { value: 'medium', label: '$5k - $20k', points: 7 },
      { value: 'high', label: 'Over $20k', points: 10 }
    ]
  },
  {
    id: 4,
    pillar_id: 3,
    text: 'How many paying customers do you have?',
    type: 'NUMBER',
    weight: 0.3,
    options: [] // Number input, scored based on range
  },
  
  // Financials Questions (Pillar 4)
  {
    id: 5,
    pillar_id: 4,
    text: 'Do you have audited financial statements?',
    type: 'BOOLEAN',
    weight: 0.35,
    options: [
      { value: true, label: 'Yes', points: 10 },
      { value: false, label: 'No', points: 0 }
    ]
  },
  {
    id: 6,
    pillar_id: 4,
    text: 'What is your burn rate?',
    type: 'CHOICE',
    weight: 0.25,
    options: [
      { value: 'positive', label: 'Profitable', points: 10 },
      { value: 'low', label: 'Under $5k/month', points: 7 },
      { value: 'medium', label: '$5k-$15k/month', points: 4 },
      { value: 'high', label: 'Over $15k/month', points: 2 }
    ]
  },
  
  // Operations Questions (Pillar 5)
  {
    id: 9,
    pillar_id: 5,
    text: 'Do you have documented operational processes?',
    type: 'BOOLEAN',
    weight: 0.35,
    options: [
      { value: true, label: 'Yes', points: 10 },
      { value: false, label: 'No', points: 0 }
    ]
  },
  {
    id: 10,
    pillar_id: 5,
    text: 'What is your operational efficiency level?',
    type: 'CHOICE',
    weight: 0.3,
    options: [
      { value: 'low', label: 'Needs improvement', points: 2 },
      { value: 'medium', label: 'Adequate', points: 5 },
      { value: 'high', label: 'Efficient', points: 8 },
      { value: 'excellent', label: 'Highly optimized', points: 10 }
    ]
  },
  
  // Legal & Governance Questions (Pillar 6)
  {
    id: 11,
    pillar_id: 6,
    text: 'Is your company properly registered and compliant?',
    type: 'BOOLEAN',
    weight: 0.4,
    options: [
      { value: true, label: 'Yes', points: 10 },
      { value: false, label: 'No', points: 0 }
    ]
  },
  {
    id: 12,
    pillar_id: 6,
    text: 'Do you have intellectual property protection?',
    type: 'CHOICE',
    weight: 0.3,
    options: [
      { value: 'none', label: 'No protection', points: 0 },
      { value: 'pending', label: 'Applications pending', points: 5 },
      { value: 'partial', label: 'Some protection', points: 7 },
      { value: 'full', label: 'Comprehensive protection', points: 10 }
    ]
  },
  
  // Digital Maturity Questions (Pillar 7)
  {
    id: 13,
    pillar_id: 7,
    text: 'What is your level of digital infrastructure?',
    type: 'CHOICE',
    weight: 0.35,
    options: [
      { value: 'basic', label: 'Basic tools only', points: 2 },
      { value: 'moderate', label: 'Some digital systems', points: 5 },
      { value: 'advanced', label: 'Integrated systems', points: 8 },
      { value: 'cutting-edge', label: 'Fully digital', points: 10 }
    ]
  },
  {
    id: 14,
    pillar_id: 7,
    text: 'Do you have data analytics capabilities?',
    type: 'BOOLEAN',
    weight: 0.3,
    options: [
      { value: true, label: 'Yes', points: 10 },
      { value: false, label: 'No', points: 0 }
    ]
  },
  
  // Growth Questions (Pillar 8)
  {
    id: 15,
    pillar_id: 8,
    text: 'What is your year-over-year growth rate?',
    type: 'CHOICE',
    weight: 0.4,
    options: [
      { value: 'negative', label: 'Negative growth', points: 0 },
      { value: 'stable', label: '0-20%', points: 3 },
      { value: 'moderate', label: '20-50%', points: 6 },
      { value: 'high', label: '50-100%', points: 8 },
      { value: 'exceptional', label: 'Over 100%', points: 10 }
    ]
  },
  {
    id: 16,
    pillar_id: 8,
    text: 'Do you have a clear growth strategy?',
    type: 'BOOLEAN',
    weight: 0.3,
    options: [
      { value: true, label: 'Yes', points: 10 },
      { value: false, label: 'No', points: 0 }
    ]
  }
]

// Assessment Instances
export const mockAssessments = [
  {
    id: 1,
    sme_id: 1, // Angkor Tech
    status: 'COMPLETED',
    started_at: '2024-08-01T09:00:00Z',
    completed_at: '2024-08-03T14:30:00Z',
    total_score: 72.5
  },
  {
    id: 2,
    sme_id: 2, // GreenData
    status: 'COMPLETED',
    started_at: '2024-09-15T10:00:00Z',
    completed_at: '2024-09-16T16:00:00Z',
    total_score: 65.0
  },
  {
    id: 3,
    sme_id: 2, // GreenData - Updated assessment
    status: 'COMPLETED',
    started_at: '2024-11-01T09:00:00Z',
    completed_at: '2024-11-02T11:00:00Z',
    total_score: 78.0
  },
  {
    id: 4,
    sme_id: 3, // FinTech Solutions
    status: 'IN_PROGRESS',
    started_at: '2024-11-20T10:00:00Z',
    completed_at: null,
    total_score: null
  }
]

// Individual Responses
export const mockAssessmentResponses = [
  // Angkor Tech Assessment (id: 1) - All 8 Pillars
  { id: 1, assessment_id: 1, question_id: 1, answer_value: 'most', score_awarded: 8 },
  { id: 2, assessment_id: 1, question_id: 2, answer_value: true, score_awarded: 10 },
  { id: 3, assessment_id: 1, question_id: 3, answer_value: 'medium', score_awarded: 7 },
  { id: 4, assessment_id: 1, question_id: 4, answer_value: 45, score_awarded: 8 },
  { id: 5, assessment_id: 1, question_id: 5, answer_value: true, score_awarded: 10 },
  { id: 6, assessment_id: 1, question_id: 6, answer_value: 'low', score_awarded: 7 },
  { id: 17, assessment_id: 1, question_id: 7, answer_value: 'mostly', score_awarded: 8 },
  { id: 18, assessment_id: 1, question_id: 8, answer_value: 'multiple', score_awarded: 8 },
  { id: 19, assessment_id: 1, question_id: 9, answer_value: true, score_awarded: 10 },
  { id: 20, assessment_id: 1, question_id: 10, answer_value: 'high', score_awarded: 8 },
  { id: 21, assessment_id: 1, question_id: 11, answer_value: true, score_awarded: 10 },
  { id: 22, assessment_id: 1, question_id: 12, answer_value: 'partial', score_awarded: 7 },
  { id: 23, assessment_id: 1, question_id: 13, answer_value: 'advanced', score_awarded: 8 },
  { id: 24, assessment_id: 1, question_id: 14, answer_value: true, score_awarded: 10 },
  { id: 25, assessment_id: 1, question_id: 15, answer_value: 'moderate', score_awarded: 6 },
  { id: 26, assessment_id: 1, question_id: 16, answer_value: true, score_awarded: 10 },
  
  // GreenData First Assessment (id: 2) - All 8 Pillars
  { id: 7, assessment_id: 2, question_id: 1, answer_value: 'some', score_awarded: 5 },
  { id: 8, assessment_id: 2, question_id: 2, answer_value: true, score_awarded: 10 },
  { id: 9, assessment_id: 2, question_id: 3, answer_value: 'low', score_awarded: 3 },
  { id: 10, assessment_id: 2, question_id: 4, answer_value: 12, score_awarded: 4 },
  { id: 11, assessment_id: 2, question_id: 5, answer_value: false, score_awarded: 0 },
  { id: 12, assessment_id: 2, question_id: 6, answer_value: 'medium', score_awarded: 4 },
  { id: 27, assessment_id: 2, question_id: 7, answer_value: 'some', score_awarded: 5 },
  { id: 28, assessment_id: 2, question_id: 8, answer_value: 'single', score_awarded: 5 },
  { id: 29, assessment_id: 2, question_id: 9, answer_value: false, score_awarded: 0 },
  { id: 30, assessment_id: 2, question_id: 10, answer_value: 'medium', score_awarded: 5 },
  { id: 31, assessment_id: 2, question_id: 11, answer_value: true, score_awarded: 10 },
  { id: 32, assessment_id: 2, question_id: 12, answer_value: 'pending', score_awarded: 5 },
  { id: 33, assessment_id: 2, question_id: 13, answer_value: 'moderate', score_awarded: 5 },
  { id: 34, assessment_id: 2, question_id: 14, answer_value: false, score_awarded: 0 },
  { id: 35, assessment_id: 2, question_id: 15, answer_value: 'stable', score_awarded: 3 },
  { id: 36, assessment_id: 2, question_id: 16, answer_value: false, score_awarded: 0 },
  
  // GreenData Updated Assessment (id: 3) - All 8 Pillars
  { id: 13, assessment_id: 3, question_id: 1, answer_value: 'most', score_awarded: 8 },
  { id: 14, assessment_id: 3, question_id: 2, answer_value: true, score_awarded: 10 },
  { id: 15, assessment_id: 3, question_id: 3, answer_value: 'medium', score_awarded: 7 },
  { id: 16, assessment_id: 3, question_id: 4, answer_value: 28, score_awarded: 7 },
  { id: 17, assessment_id: 3, question_id: 5, answer_value: true, score_awarded: 10 },
  { id: 18, assessment_id: 3, question_id: 6, answer_value: 'low', score_awarded: 7 },
  { id: 37, assessment_id: 3, question_id: 7, answer_value: 'mostly', score_awarded: 8 },
  { id: 38, assessment_id: 3, question_id: 8, answer_value: 'multiple', score_awarded: 8 },
  { id: 39, assessment_id: 3, question_id: 9, answer_value: true, score_awarded: 10 },
  { id: 40, assessment_id: 3, question_id: 10, answer_value: 'high', score_awarded: 8 },
  { id: 41, assessment_id: 3, question_id: 11, answer_value: true, score_awarded: 10 },
  { id: 42, assessment_id: 3, question_id: 12, answer_value: 'partial', score_awarded: 7 },
  { id: 43, assessment_id: 3, question_id: 13, answer_value: 'advanced', score_awarded: 8 },
  { id: 44, assessment_id: 3, question_id: 14, answer_value: true, score_awarded: 10 },
  { id: 45, assessment_id: 3, question_id: 15, answer_value: 'high', score_awarded: 8 },
  { id: 46, assessment_id: 3, question_id: 16, answer_value: true, score_awarded: 10 }
]

// Helper function to get pillar scores for an assessment
export function getPillarScores(assessmentId: number) {
  const responses = mockAssessmentResponses.filter(r => r.assessment_id === assessmentId)
  const pillarScores: Record<number, { total: number, max: number }> = {}
  
  responses.forEach(response => {
    const question = mockQuestions.find(q => q.id === response.question_id)
    if (!question) return
    
    if (!pillarScores[question.pillar_id]) {
      pillarScores[question.pillar_id] = { total: 0, max: 0 }
    }
    
    // Store in local variable to ensure type safety
    const pillarScore = pillarScores[question.pillar_id]!
    pillarScore.total += response.score_awarded * question.weight
    pillarScore.max += 10 * question.weight
  })
  
  return Object.entries(pillarScores).map(([pillarId, scores]) => {
    const pillar = mockPillars.find(p => p.id === parseInt(pillarId))
    return {
      pillar_id: parseInt(pillarId),
      pillar_name: pillar?.name || '',
      score: Math.round((scores.total / scores.max) * 100)
    }
  })
}
