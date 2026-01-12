// Mock data for development - will be replaced with Laravel API calls

export const mockUser = {
  id: 1,
  name: 'Sokha Chan',
  email: 'sokha@angkortech.com',
  role: 'sme_user',
  avatar: 'S',
  company: {
    id: 1,
    name: 'Angkor Tech',
    industry: 'Technology',
    size: '10-50 employees',
    founded: '2020',
    lastAssessed: 'Aug 3, 2024'
  }
}

export const mockPillars = [
  {
    id: 1,
    name: 'Team & Leadership',
    score: 70,
    riskLevel: 'low',
    improvementPotential: 22,
    description: 'Leadership team strength and organizational structure'
  },
  {
    id: 2,
    name: 'Market & Traction',
    score: 70,
    riskLevel: 'low',
    improvementPotential: 20,
    description: 'Market positioning and customer traction'
  },
  {
    id: 3,
    name: 'Operations',
    score: 75,
    riskLevel: 'low',
    improvementPotential: 18,
    description: 'Operational efficiency and processes'
  },
  {
    id: 4,
    name: 'Digital Maturity',
    score: 68,
    riskLevel: 'medium',
    improvementPotential: 25,
    description: 'Digital transformation and technology adoption'
  },
  {
    id: 5,
    name: 'Business Model',
    score: 61,
    riskLevel: 'medium',
    improvementPotential: 12,
    description: 'Business model viability and scalability'
  },
  {
    id: 6,
    name: 'Financial Readiness',
    score: 72,
    riskLevel: 'low',
    improvementPotential: 15,
    description: 'Financial health and investor readiness'
  },
  {
    id: 7,
    name: 'Legal & Governance',
    score: 66,
    riskLevel: 'medium',
    improvementPotential: 12,
    description: 'Legal compliance and governance structure'
  },
  {
    id: 8,
    name: 'Growth & Scalability',
    score: 78,
    riskLevel: 'low',
    improvementPotential: 16,
    description: 'Growth potential and scalability readiness'
  }
]

export const mockProgressData = [
  { month: 'Jan 2024', score: 61 },
  { month: 'Feb 2024', score: 63 },
  { month: 'Mar 2024', score: 65 },
  { month: 'Apr 2024', score: 68 },
  { month: 'May 2024', score: 71 },
  { month: 'Jun 2024', score: 74 },
  { month: 'Jul 2024', score: 76 }
]

export const mockRecommendedActions = [
  {
    id: 1,
    title: 'Create scalable pricing strategy',
    description: 'Develop a tiered pricing model that can scale with customer growth',
    priority: 'medium',
    pillar: 'Business Model',
    impact: 15,
    status: 'pending'
  },
  {
    id: 2,
    title: 'Ensure IP protection and registration',
    description: 'Register trademarks and patents for key intellectual property',
    priority: 'medium',
    pillar: 'Legal & Governance',
    impact: 12,
    status: 'pending'
  },
  {
    id: 3,
    title: 'Implement data analytics dashboard',
    description: 'Set up comprehensive analytics to track key business metrics',
    priority: 'high',
    pillar: 'Digital Maturity',
    impact: 18,
    status: 'in_progress'
  },
  {
    id: 4,
    title: 'Develop succession planning',
    description: 'Create clear succession plans for key leadership positions',
    priority: 'low',
    pillar: 'Team & Leadership',
    impact: 10,
    status: 'pending'
  },
  {
    id: 5,
    title: 'Establish customer feedback loop',
    description: 'Implement systematic customer feedback collection and analysis',
    priority: 'medium',
    pillar: 'Market & Traction',
    impact: 14,
    status: 'pending'
  }
]

export const mockAssessmentHistory = [
  {
    id: 1,
    date: '2024-08-03',
    overallScore: 76,
    status: 'completed'
  },
  {
    id: 2,
    date: '2024-06-15',
    overallScore: 74,
    status: 'completed'
  },
  {
    id: 3,
    date: '2024-04-20',
    overallScore: 68,
    status: 'completed'
  }
]

// Calculate overall investment readiness score
export function calculateOverallScore(pillars) {
  if (!pillars || pillars.length === 0) return 0
  const sum = pillars.reduce((acc, pillar) => acc + pillar.score, 0)
  return Math.round(sum / pillars.length)
}

// Calculate growth potential
export function calculateGrowthPotential(pillars) {
  if (!pillars || pillars.length === 0) return 0
  const sum = pillars.reduce((acc, pillar) => acc + pillar.improvementPotential, 0)
  return Math.round(sum / pillars.length)
}

// Get risk level based on score
export function getRiskLevel(score) {
  if (score >= 76) return 'low'
  if (score >= 61) return 'medium'
  return 'high'
}

// Get risk level color
export function getRiskColor(riskLevel) {
  const colors = {
    low: 'green',
    medium: 'orange',
    high: 'red'
  }
  return colors[riskLevel] || 'gray'
}

// Get priority color
export function getPriorityColor(priority) {
  const colors = {
    high: 'red',
    medium: 'orange',
    low: 'yellow'
  }
  return colors[priority] || 'gray'
}

// Get readiness status label
export function getReadinessStatus(score) {
  if (score >= 85) return 'Investment Ready'
  if (score >= 76) return 'Near Ready'
  if (score >= 61) return 'Developing'
  return 'Early Stage'
}

// Calculate score change
export function calculateScoreChange(currentScore, previousScore) {
  return currentScore - previousScore
}
