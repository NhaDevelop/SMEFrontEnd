// Assessment Framework: Pillars & Questions
// NOTE: Pillars use numeric IDs to maintain compatibility with legacy code
// Questions use String IDs ('q1') to match Admin Store (Frontend)

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

// Map string pillar IDs (from Frontend) to Numeric (Backend)
const PILLAR_MAP: Record<string, number> = {
    'team': 1,
    'business': 2,
    'market': 3,
    'finance': 4, 
    'ops': 5,
    'legal': 6,
    'data': 7,
    'growth': 8
}

export const mockQuestions = [
  // Team (Pillar 1)
  { id: 'q1', pillar_id: 1, text: 'Does your company have a dedicated CEO?', type: 'BOOLEAN', weight: 0.15, options: [{value: true, points: 10}, {value: false, points: 0}] },
  { id: 'q2', pillar_id: 1, text: 'Do you have a CFO?', type: 'BOOLEAN', weight: 0.15, options: [{value: true, points: 10}, {value: false, points: 0}] },
  { id: 'q3', pillar_id: 1, text: 'Do you have an advisory board?', type: 'BOOLEAN', weight: 0.10, options: [{value: true, points: 10}, {value: false, points: 0}] },
  { 
      id: 'q4', 
      pillar_id: 1, 
      text: 'Years of industry experience in leadership?', 
      type: 'CHOICE', 
      weight: 0.20, 
      options: [
          {value: '10+ years', points: 10}, 
          {value: '6-10 years', points: 7}, 
          {value: '3-5 years', points: 4},
          {value: '0-2 years', points: 0}
      ] 
  },
  { id: 'q5', pillar_id: 1, text: 'Rate team execution ability', type: 'NUMBER', weight: 0.20 },
  { id: 'q23', pillar_id: 1, text: 'Do you have a clear organizational chart?', type: 'BOOLEAN', weight: 0.20 },

  // Business (Pillar 2)
  { id: 'q8', pillar_id: 2, text: 'Is your value proposition clearly defined?', type: 'BOOLEAN', weight: 0.20 },
  { id: 'q9', pillar_id: 2, text: 'Do you have a scalable business model?', type: 'BOOLEAN', weight: 0.20 },
  { 
      id: 'q10', 
      pillar_id: 2, 
      text: 'Primary revenue stream?', 
      type: 'CHOICE', 
      weight: 0.20, 
      options: [
          {value: 'Recurring / Subscription', points: 10}, 
          {value: 'One-time Sales', points: 5},
          {value: 'Service Fees', points: 5},
          {value: 'Licensing', points: 8},
          {value: 'Advertising', points: 3}
      ] 
  },
  { id: 'q24', pillar_id: 2, text: 'Customer acquisition strategy defined?', type: 'BOOLEAN', weight: 0.20 },
  { id: 'q25', pillar_id: 2, text: 'Partnership strategy in place?', type: 'BOOLEAN', weight: 0.20 },

  // Market (Pillar 3)
  { id: 'q7', pillar_id: 3, text: 'Total Addressable Market (TAM) size?', type: 'NUMBER', weight: 0.30 },
  { id: 'q11', pillar_id: 3, text: 'Have you defined your target customer persona?', type: 'BOOLEAN', weight: 0.20 },
  { id: 'q12', pillar_id: 3, text: 'Who is your main competitor?', type: 'TEXT', weight: 0.10 },
  { id: 'q26', pillar_id: 3, text: 'Market growth rate (%)', type: 'NUMBER', weight: 0.20 },
  { id: 'q27', pillar_id: 3, text: 'Regulatory barriers to entry?', type: 'BOOLEAN', weight: 0.20 },

  // Finance (Pillar 4)
  { id: 'q13', pillar_id: 4, text: 'Do you have 2 years of financial statements?', type: 'BOOLEAN', weight: 0.25 },
  { id: 'q14', pillar_id: 4, text: 'Are you currently profitable?', type: 'BOOLEAN', weight: 0.25 },
  { id: 'q15', pillar_id: 4, text: 'Monthly Burn Rate (USD)', type: 'NUMBER', weight: 0.20 },
  { id: 'q28', pillar_id: 4, text: 'Projected revenue next year?', type: 'NUMBER', weight: 0.15 },
  { id: 'q29', pillar_id: 4, text: 'Debt to Equity ratio', type: 'NUMBER', weight: 0.15 },

  // Ops (Pillar 5)
  { id: 'q16', pillar_id: 5, text: 'Do you have documented SOPs?', type: 'BOOLEAN', weight: 0.30 },
  { id: 'q17', pillar_id: 5, text: 'Rate your supply chain stability', type: 'NUMBER', weight: 0.30 },
  { id: 'q30', pillar_id: 5, text: 'Disaster recovery plan in place?', type: 'BOOLEAN', weight: 0.20 },
  { id: 'q31', pillar_id: 5, text: 'Quality control process defined?', type: 'BOOLEAN', weight: 0.10 },
  { id: 'q32', pillar_id: 5, text: 'Inventory management system used?', type: 'BOOLEAN', weight: 0.10 },

  // Legal (Pillar 6)
  { id: 'q18', pillar_id: 6, text: 'Is your IP legally protected?', type: 'BOOLEAN', weight: 0.40 },
  { id: 'q19', pillar_id: 6, text: 'Any pending litigation?', type: 'BOOLEAN', weight: 0.60, options: [{value: true, points: 0}, {value: false, points: 10}] }, // Reverse logic usually
  { id: 'q33', pillar_id: 6, text: 'Employee contracts signed?', type: 'BOOLEAN', weight: 0.30 },
  { id: 'q34', pillar_id: 6, text: 'Compliance with local labor laws?', type: 'BOOLEAN', weight: 0.30 },
  { id: 'q35', pillar_id: 6, text: 'Shareholder agreement signed?', type: 'BOOLEAN', weight: 0.40 },

  // Data (Pillar 7)
  { id: 'q20', pillar_id: 7, text: 'Do you collect customer data?', type: 'BOOLEAN', weight: 0.30 },
  { id: 'q21', pillar_id: 7, text: 'Are you compliant with data privacy laws?', type: 'BOOLEAN', weight: 0.70 },
  { 
      id: 'q36', 
      pillar_id: 7, 
      text: 'Data backup frequency?', 
      type: 'CHOICE', 
      weight: 0.30,
      options: [
          {value: 'Daily', points: 10}, 
          {value: 'Weekly', points: 8}, 
          {value: 'Monthly', points: 5},
          {value: 'Never', points: 0}
      ]
  },
  { id: 'q37', pillar_id: 7, text: 'Cybersecurity measures in place?', type: 'BOOLEAN', weight: 0.40 },
  { id: 'q38', pillar_id: 7, text: 'Analytics tools used?', type: 'TEXT', weight: 0.30 },

  // Growth (Pillar 8)
  { id: 'q22', pillar_id: 8, text: 'Do you have a clear expansion plan?', type: 'BOOLEAN', weight: 0.50 },
  { id: 'q39', pillar_id: 8, text: 'International markets identified?', type: 'BOOLEAN', weight: 0.25 },
  { id: 'q40', pillar_id: 8, text: 'Product roadmap for next 12 months?', type: 'BOOLEAN', weight: 0.25 },
  { id: 'q41', pillar_id: 8, text: 'Hiring plan for next 12 months?', type: 'BOOLEAN', weight: 0.25 },
  { id: 'q42', pillar_id: 8, text: 'Marketing budget allocated?', type: 'BOOLEAN', weight: 0.25 }
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
  }
  // REMOVED: Hardcoded assessment for SME ID 3 (FinTech Solutions)
  // This ensures dashboard shows 0 on first login, and real scores after assessment submission
]

// Mock Responses using new IDs
export const mockAssessmentResponses: any[] = [
  // Sample Data for Angkor Tech (Using new qX IDs)
  { evaluation_id: 1, assessment_id: 1, question_id: 'q1', answer_value: true, score_awarded: 10 },
  { evaluation_id: 2, assessment_id: 1, question_id: 'q2', answer_value: true, score_awarded: 10 },
  { evaluation_id: 3, assessment_id: 1, question_id: 'q13', answer_value: true, score_awarded: 10 }, // Financials
  { evaluation_id: 4, assessment_id: 1, question_id: 'q14', answer_value: false, score_awarded: 0 },
  
  // Sample Data for GreenData
  { evaluation_id: 5, assessment_id: 2, question_id: 'q1', answer_value: false, score_awarded: 0 },
  { evaluation_id: 6, assessment_id: 2, question_id: 'q8', answer_value: true, score_awarded: 10 } // Business

  // REMOVED: All responses for assessment_id 4 (FinTech Solutions)
  // This ensures dashboard shows 0 on first login for SME ID 3
]

// Helper function to get pillar scores for an assessment
export function getPillarScores(assessmentId: number, adminQuestions?: any[], overrideResponses?: any[], overrideAssessments?: any[]) {
  const responses = (overrideResponses || mockAssessmentResponses).filter(r => r.assessment_id === assessmentId)
  const allAssessments = (overrideAssessments || mockAssessments)
  const assessment = allAssessments.find((a: any) => a.id === assessmentId)
  
  // Priority order for questions:
  // 1. Questions saved with assessment (for admin-created templates)
  // 2. Questions passed as parameter (from admin store)
  // 3. Mock questions (fallback)
  const allQuestions = (assessment as any)?.questions || (adminQuestions && adminQuestions.length > 0 ? adminQuestions : mockQuestions)
  
  console.log(`[getPillarScores] Assessment ${assessmentId}: Using ${allQuestions.length} questions (source: ${(assessment as any)?.questions ? 'assessment' : adminQuestions ? 'parameter' : 'mock'})`)
  
  const pillarScores: Record<number, { total: number, max: number }> = {}
  
  // Initialize all pillars with 0 to ensure they appear even if empty
  mockPillars.forEach(p => {
      pillarScores[p.id] = { total: 0, max: 0 }
  })

  responses.forEach(response => {
    // Look for question in provided questions
    const question = allQuestions.find((q: any) => q.id === response.question_id)
    if (!question) {
      if (!(assessment as any)?.questions) {
        console.warn(`[getPillarScores] Question ${response.question_id} not found in ${allQuestions.length} questions`)
      }
      return
    }
    
    // Map pillarId from question (might be string like 'team', 'business', etc.)
    // to numeric pillar ID from mockPillars
    let numericPillarId: number
    
    if (typeof question.pillar_id === 'string' || typeof question.pillarId === 'string') {
      // Convert string pillar ID to numeric
      const pillarIdStr = (question.pillar_id || question.pillarId || '').toLowerCase()
      const pillarMap: Record<string, number> = {
        'team': 1,
        'business': 2,
        'market': 3,
        'finance': 4,
        'ops': 5,
        'legal': 6,
        'data': 7,
        'growth': 8
      }
      numericPillarId = pillarMap[pillarIdStr] || 1
    } else {
      numericPillarId = question.pillar_id || question.pillarId || 1
    }
    
    // Safety check if question ID is mapped to existing pillar
    if (!pillarScores[numericPillarId]) {
      pillarScores[numericPillarId] = { total: 0, max: 0 }
    }
    
    const pillarScore = pillarScores[numericPillarId]!
    const weight = question.weight || 10
    pillarScore.total += response.score_awarded * weight
    pillarScore.max += 10 * weight
  })
  
  return Object.entries(pillarScores).map(([pillarId, scores]) => {
    const pillar = mockPillars.find(p => p.id === parseInt(pillarId))
    const calculatedScore = scores.max > 0 ? Math.round((scores.total / scores.max) * 100) : 0
    return {
      pillar_id: parseInt(pillarId),
      pillar_name: pillar?.name || '',
      score: calculatedScore
    }
  })
}
