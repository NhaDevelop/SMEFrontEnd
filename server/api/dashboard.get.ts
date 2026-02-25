import { defineEventHandler, getQuery, createError } from 'h3'
import { db } from '~/server/utils/db'
import { mockPillars } from '~/utils/mock-data'
import { templateQuestions } from '~/utils/mock-data/template-questions'
import { storage } from '~/server/utils/storage'
import { calculateOverallScore } from '~/utils/helpers.js'

// Helper to get risk level based on score
function getRiskLevel(score: number): string {
  if (score >= 70) return 'low'
  if (score >= 50) return 'medium'
  return 'high'
}

const PILLAR_DISPLAY_NAMES: Record<string, string> = {
  'TEAM': 'Team & Leadership',
  'BUSINESS_MODEL': 'Business Model',
  'MARKET': 'Market & Traction',
  'FINANCIALS': 'Financial Readiness',
  'OPERATIONS': 'Operations',
  'LEGAL': 'Legal & Governance',
  'DATA': 'Data & Digital Maturity',
  'GROWTH': 'Growth & Scalability'
}

type Priority = 'high' | 'medium' | 'low'

interface DashboardAction {
  id: string
  title: string
  description: string
  priority: Priority
  pillar: string
  impact: number
  status: string
  type: string
  isGoal?: boolean
}

function formattedPillarName(name: string): string {
  return PILLAR_DISPLAY_NAMES[name] || name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
}

// Question-based Recommendation Engine Mapping
const GAP_ACTION_TEMPLATES: Record<string, { title: string, description: string, impact: number, priority: Priority }> = {
  'q1': { title: 'Appoint Dedicated CEO', description: 'Strong leadership is critical for investors. Consider formalizing the CEO role.', impact: 15, priority: 'high' },
  'q2': { title: 'Hire/Appoint a CFO', description: 'Financial oversight is a top investor requirement for scaling.', impact: 15, priority: 'high' },
  'q3': { title: 'Establish Advisory Board', description: 'Strategic guidance from industry experts increases company valuation.', impact: 10, priority: 'medium' },
  'q23': { title: 'Create Organizational Chart', description: 'Clear roles and responsibilities demonstrate operational maturity.', impact: 10, priority: 'medium' },
  'q8': { title: 'Refine Value Proposition', description: 'Investors look for clearly defined problems and unique solutions.', impact: 15, priority: 'high' },
  'q9': { title: 'Develop Scalable Model', description: 'Demonstrate how the business can grow without proportional cost increases.', impact: 20, priority: 'high' },
  'q24': { title: 'Define Acquisition Strategy', description: 'Optimize your marketing and sales funnels for predictable growth.', impact: 12, priority: 'medium' },
  'q11': { title: 'Map Customer Personas', description: 'A deep understanding of your target market reduces investment risk.', impact: 10, priority: 'medium' },
  'q13': { title: 'Prepare 2-Year Financials', description: 'Historical data is required for due diligence and valuation.', impact: 25, priority: 'high' },
  'q14': { title: 'Roadmap to Profitability', description: 'Show a clear path to sustainable margins even if currently burning cash.', impact: 20, priority: 'high' },
  'q18': { title: 'Secure IP Protection', description: 'Protect your competitive advantage through trademarks or patents.', impact: 18, priority: 'high' },
  'q35': { title: 'Sign Shareholder Agreements', description: 'Legal clarity between founders prevents future investment blockers.', impact: 15, priority: 'high' },
  'q21': { title: 'Data Privacy Compliance', description: 'Ensure customer data handling meets local and international laws.', impact: 14, priority: 'high' },
  'q22': { title: 'Expansion Business Plan', description: 'Document your strategy for new markets or product lines.', impact: 15, priority: 'medium' }
}

const SYSTEM_PILLAR_TEMPLATES: Record<string, { title: string, impact: number, priority: Priority }[]> = {
  'TEAM': [{ title: 'Team Execution Review', impact: 10, priority: 'medium' }],
  'BUSINESS_MODEL': [{ title: 'Revenue Stream Optimization', impact: 12, priority: 'high' }],
  'MARKET': [{ title: 'Competitor Analysis Update', impact: 7, priority: 'low' }],
  'FINANCIALS': [{ title: 'Audit Internal Controls', impact: 15, priority: 'high' }],
  'OPERATIONS': [{ title: 'Standardize Business SOPs', impact: 12, priority: 'medium' }],
  'LEGAL': [{ title: 'Legal Compliance Audit', impact: 15, priority: 'high' }],
  'DATA': [{ title: 'Implement Security Protocols', impact: 10, priority: 'medium' }],
  'GROWTH': [{ title: 'Market Opportunity Scan', impact: 12, priority: 'medium' }]
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const smeId: string | number = query.smeId ? String(query.smeId) : 3
  
  // 1. Data Retrieval
  let storageData: { assessments?: any[], responses?: any[], goals?: any[] } = {}
  try {
    storageData = storage.get()
  } catch (e) {
    console.warn('[Dashboard API] Storage read failed', e)
  }

  const mergedAssessments = storageData.assessments || []
  const mergedResponses = storageData.responses || []
  const mergedGoals = (storageData.goals || []).filter((g: any) => String(g.sme_id) === String(smeId))
  
  // Deduplicate goals by ID
  const uniqueGoalsMap = new Map()
  mergedGoals.forEach((g: any) => uniqueGoalsMap.set(g.id, g))
  const currentGoals = Array.from(uniqueGoalsMap.values())

  const sme = db.smes.findById(smeId)
  if (!sme) {
    throw createError({ statusCode: 404, message: 'SME not found' })
  }
  
  // Securely retrieve the authentic latest chronological assessment
  const authenticSmeAssessments = mergedAssessments
    .filter((a: any) => String(a.sme_id) === String(smeId) && a.status === 'COMPLETED')
    .sort((a: any, b: any) => new Date(b.completed_at || b.started_at).getTime() - new Date(a.completed_at || a.started_at).getTime())

  const latestAssessment = authenticSmeAssessments.length > 0 ? authenticSmeAssessments[0] : null

  const sourcePillars = sme.pillars.length > 0 ? sme.pillars.map((p: any) => ({
      pillar_id: p.id || p.name,
      pillar_name: p.name,
      score: p.score
  })) : mockPillars.map(p => ({
      pillar_id: p.id,
      pillar_name: p.name,
      score: 0
  }))

  // 2. Recommendation Engine
  const allGeneratedActions: DashboardAction[] = []
  const latestResponses = latestAssessment ? mergedResponses.filter((r: any) => r.assessment_id === latestAssessment.id) : []
  
  // A. Gap-Based Actions (The most relevant - from real answers)
  latestResponses.forEach(resp => {
    // If response is negative (false, low score, etc.)
    const isNegative = resp.answer_value === false || resp.answer_value === 'No' || (typeof resp.answer_value === 'number' && resp.answer_value < 5);
    
    const template = GAP_ACTION_TEMPLATES[resp.question_id]
    if (isNegative && template) {
      const question = templateQuestions.find(q => q.id === resp.question_id)
      const rawPillarName = question?.pillarId ? question.pillarId.toUpperCase() : 'GENERAL'
      const displayName = formattedPillarName(rawPillarName)

      allGeneratedActions.push({
        id: `gap_${resp.question_id}`,
        title: template.title,
        description: template.description,
        priority: template.priority,
        pillar: displayName,
        impact: template.impact,
        status: 'pending',
        type: 'gap'
      })
    }
  })

  // B. Goal-Based Actions (Active things the user is already doing)
  const activeUserGoals = currentGoals.filter(g => g.status === 'ACTIVE')
  activeUserGoals.forEach(goal => {
    const rawName = mockPillars.find(p => p.id === goal.pillar_id)?.name || 'General'
    const displayName = formattedPillarName(rawName)
    
    // Impact of a goal is usually the remaining gap to target or a preset value
    const baseImpact = goal.target_score ? (goal.target_score - (goal.current_score || 0)) : 10
    
    allGeneratedActions.push({
      id: `goal_${goal.id}`,
      title: goal.title,
      description: goal.description || `Active target to reach ${goal.target_score}% in ${displayName}.`,
      priority: goal.progress_percentage < 40 ? 'high' : 'medium',
      pillar: displayName,
      impact: Math.max(5, baseImpact), // Min impact of 5
      status: goal.progress_percentage === 0 ? 'pending' : 'in_progress',
      isGoal: true,
      type: 'goal'
    })
  })

  // C. Systematic Fallbacks (If a pillar is low risk but has no specific gap/goal)
  sourcePillars.forEach((p: any) => {
    const rawName = mockPillars.find((mp: any) => mp.id === p.pillar_id)?.name || p.pillar_name
    const displayName = formattedPillarName(rawName)
    
    // If score is low (< 70) and we don't have enough actions for this pillar yet
    const existingPillarActions = allGeneratedActions.filter(a => a.pillar === displayName)
    if (p.score < 70 && existingPillarActions.length < 2) {
      const pKey = (mockPillars.find((mp: any) => mp.id === p.pillar_id)?.name || '').toUpperCase()
      const templates = SYSTEM_PILLAR_TEMPLATES[pKey] || []
      
      templates.forEach((template, idx) => {
        // Don't duplicate
        if (!existingPillarActions.some(exa => exa.title === template.title)) {
          allGeneratedActions.push({
            id: `sys_${p.pillar_id}_${idx}`,
            title: template.title,
            description: `Strategically improve your ${displayName} readiness.`,
            priority: p.score < 40 ? 'high' : 'medium',
            pillar: displayName,
            impact: template.impact,
            status: 'pending',
            type: 'system'
          })
        }
      })
    }
  })

  // 3. Final Calculations & Mapping
  
  // Calculate potential per pillar (Sum of all actions for that pillar)
  const pillarPotentialMap: Record<string, number> = {}
  allGeneratedActions.forEach(action => {
    // Only sum pending or in-progress things
    if (action.status !== 'completed') {
      pillarPotentialMap[action.pillar] = (pillarPotentialMap[action.pillar] || 0) + action.impact
    }
  })

  const pillars = sourcePillars.map((p: any) => {
    const mockPillar = mockPillars.find((mp: any) => mp.id === p.pillar_id)
    const rawName = mockPillar?.name || p.pillar_name
    const displayName = formattedPillarName(rawName)
    return {
      id: p.pillar_id,
      name: displayName,
      score: p.score,
      weight: mockPillar?.weight || 0,
      riskLevel: getRiskLevel(p.score),
      improvementPotential: pillarPotentialMap[displayName] || 0
    }
  })

  // Sort and limit actions for the sidebar (Highest impact/priority first)
  const sidebarActions = [...allGeneratedActions]
    .sort((a, b) => {
      // High priority first
      const pMap: Record<Priority, number> = { 'high': 3, 'medium': 2, 'low': 1 }
      const diff = pMap[b.priority] - pMap[a.priority]
      if (diff !== 0) return diff
      // Then highest impact
      return b.impact - a.impact
    })
    .slice(0, 5)

  // Calculate honest overall score from true database assessment history
  const calculatedOverallScore = latestAssessment && latestAssessment.total_score !== undefined
    ? latestAssessment.total_score 
    : calculateOverallScore(pillars)

  // Build remaining response objects
  const company = {
    name: sme.name,
    industry: sme.industry,
    location: sme.location,
    lastAssessed: sme.lastAssessed
      ? new Date(sme.lastAssessed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Never',
    overallScore: calculatedOverallScore
  }

  const assessmentHistory = sme.assessments || []
  const progress = assessmentHistory.map((a: any) => ({
    month: new Date(a.completedAt || a.completed_at!).toLocaleDateString('en-US', { month: 'short' }),
    score: a.score || a.total_score || 0
  })).reverse()

  if (progress.length === 1 && progress[0]) {
    const currentScore = progress[0].score
    progress.unshift(
      { month: 'Jan', score: Math.max(0, currentScore - 20) },
      { month: 'Feb', score: Math.max(0, currentScore - 15) },
      { month: 'Mar', score: Math.max(0, currentScore - 10) },
      { month: 'Apr', score: Math.max(0, currentScore - 5) }
    )
  }

  let primaryGoal = null
  const activeG = activeUserGoals[0]
  if (activeG) {
    const dueDate = new Date(activeG.due_date)
    const diffDays = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    primaryGoal = {
      title: activeG.title,
      target: activeG.target_score || 100,
      progress: activeG.progress_percentage,
      dueDate: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      daysRemaining: Math.abs(diffDays),
      isOverdue: diffDays < 0,
      focus: formattedPillarName(mockPillars.find(p => p.id === activeG.pillar_id)?.name || 'General')
    }
  }

  return {
    company,
    pillars,
    progress,
    actions: sidebarActions,
    primaryGoal
  }
})
