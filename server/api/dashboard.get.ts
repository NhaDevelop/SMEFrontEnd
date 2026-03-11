import { defineEventHandler, getQuery, createError } from 'h3'
import { db } from '~/server/utils/db'
import { storage } from '~/server/utils/storage'
import { calculateOverallScore } from '~/utils/helpers.js'

// Helper to get risk level based on score (fallback, no thresholds)
function getRiskLevel(score: number): string {
  if (score >= 70) return 'low'
  if (score >= 50) return 'medium'
  return 'high'
}

// Helper: resolve pillar score to 'high'/'medium'/'low' using admin thresholds
function getPillarRisk(score: number, thresholds: any[]): 'high' | 'medium' | 'low' {
  if (thresholds && thresholds.length > 0) {
    const matched = thresholds.find((t: any) => score >= t.min && score <= t.max)
    if (matched) {
      const lbl = (matched.label || '').toLowerCase()
      if (lbl.includes('high') || lbl.includes('critical') || lbl.includes('poor')) return 'high'
      if (lbl.includes('medium') || lbl.includes('moderate') || lbl.includes('developing') || lbl.includes('growing')) return 'medium'
      return 'low'
    }
  }
  // Fallback to hard-coded scale
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
  pillarScore?: number
  pillarRisk?: 'high' | 'medium' | 'low'
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
  
  const liveSettings = db.settings.get()
  const mockPillars = liveSettings.pillars || []
  const templateQuestions = db.questions.findAll() || []

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

  // Merge real SME pillars into the global setting mockPillars baseline so we always yield 8 correctly-named items
  const sourcePillars = mockPillars.map((mp: any) => {
    const existingLiveScore = sme.pillars.find((sp: any) => String(sp.id) === String(mp.id) || String(sp.pillar_id) === String(mp.id))
    
    return {
      pillar_id: mp.id,
      pillar_name: mp.name,
      score: existingLiveScore ? existingLiveScore.score : 0
    }
  })

  // 2. Recommendation Engine
  const allGeneratedActions: DashboardAction[] = []
  const latestResponses = latestAssessment ? mergedResponses.filter((r: any) => r.assessment_id === latestAssessment.id) : []
  const assessmentQuestions: any[] = (latestAssessment as any)?.questions || templateQuestions

  // 🆕 Onboarding state: no assessment taken yet → show a single getting-started action
  if (!latestAssessment || latestResponses.length === 0) {
    allGeneratedActions.push({
      id: 'onboarding_start',
      title: 'Get Started: Enroll in a Program & Take Your Assessment',
      description: 'You haven\'t completed an assessment yet. Enroll in a program and complete your first investment readiness assessment to unlock personalized recommendations and track your progress.',
      priority: 'high',
      pillar: 'General',
      pillarScore: 0,
      pillarRisk: 'high',
      impact: 100,
      status: 'pending',
      type: 'onboarding'
    })
  }

  // Helper: get pillar display name from a question
  const getQuestionPillarName = (question: any): string => {
    const rawId = String(question?.pillar_id || question?.pillarId || '')
    const cleanInput = rawId.toLowerCase().replace(/[\s\-_]/g, '')
    const fuzzyMatch = mockPillars.find((p: any) => {
      const cleanDbId = String(p.id).toLowerCase().replace(/[\s\-_]/g, '')
      const cleanDbName = String(p.name).toLowerCase().replace(/[\s\-_&]/g, '')
      return cleanDbId === cleanInput || cleanDbName === cleanInput || cleanDbId.includes(cleanInput) || cleanDbName.includes(cleanInput)
    })
    return fuzzyMatch ? formattedPillarName(fuzzyMatch.name) : formattedPillarName(rawId.toUpperCase())
  }

  // Helper: build recommendation title and description from question text when no static template exists
  const deriveActionFromQuestion = (question: any, pillarName: string, score: number): { title: string, description: string, impact: number, priority: Priority } => {
    const maxPoints = 10
    const gap = maxPoints - score
    const priority: Priority = score <= 2 ? 'high' : score <= 5 ? 'medium' : 'low'
    const qText = (question?.question_text || question?.text || question?.title || '').trim()
    const baseTitle = qText.length > 0 ? `Improve: ${qText.length > 50 ? qText.substring(0, 47) + '...' : qText}` : `Strengthen ${pillarName} readiness`
    const description = qText.length > 0
      ? `Your response to "${qText.length > 80 ? qText.substring(0, 77) + '...' : qText}" was below expectations. Addressing this will significantly strengthen your ${pillarName} score.`
      : `Your ${pillarName} assessment revealed a gap here. Improving this area will increase your overall investment readiness.`
    return {
      title: baseTitle,
      description,
      impact: Math.round((gap / maxPoints) * 20), // Scale impact to 0-20
      priority
    }
  }

  // A. Gap-Based Actions (The most relevant - from real answers)
  latestResponses.forEach(resp => {
    const question = assessmentQuestions.find(q => q.id === resp.question_id)
    const scoreAwarded: number = typeof resp.score_awarded === 'number' ? resp.score_awarded : 0
    const maxScore = 10 // All scores normalized to 0-10

    // Detect weak answers: boolean false/No, OR scored below or at 50% (<= 5 out of 10)
    const isNegativeBool = resp.answer_value === false || resp.answer_value === 'No'
    const isLowScore = scoreAwarded <= 5 && resp.answer_value !== undefined && resp.answer_value !== null && resp.answer_value !== ''

    if (!isNegativeBool && !isLowScore) return // Only proceed for weak answers

    const template = GAP_ACTION_TEMPLATES[resp.question_id]
    const pillarName = question ? getQuestionPillarName(question) : 'General'

    // Look up the pillar's actual score for card coloring
    const matchedPillar = sourcePillars.find((p: any) => {
      const mp = mockPillars.find((m: any) => String(m.id) === String(p.pillar_id))
      return formattedPillarName(mp?.name || '') === pillarName
    })
    const pillarScore: number = matchedPillar?.score ?? scoreAwarded * 10
    const pillarRisk = getPillarRisk(pillarScore, liveSettings.thresholds || [])

    if (template) {
      // Use static template if matched
      allGeneratedActions.push({
        id: `gap_${resp.question_id}`,
        title: template.title,
        description: template.description,
        priority: template.priority,
        pillar: pillarName,
        pillarScore,
        pillarRisk,
        impact: template.impact,
        status: 'pending',
        type: 'gap'
      })
    } else if (question) {
      // No static template: dynamically derive from question text and score
      const derived = deriveActionFromQuestion(question, pillarName, scoreAwarded)
      allGeneratedActions.push({
        id: `gap_${resp.question_id}`,
        title: derived.title,
        description: derived.description,
        priority: derived.priority,
        pillar: pillarName,
        pillarScore,
        pillarRisk,
        impact: derived.impact,
        status: 'pending',
        type: 'gap'
      })
    }
  })

  // B. Pillar-Level Fallback: for any red/medium pillar still missing a recommendation
  // This catches cases where question IDs didn't match or score_awarded wasn't detected
  const PILLAR_RECOMMENDATIONS: Record<string, { title: string, description: string }> = {
    'financial': { title: 'Strengthen Financial Readiness', description: 'Your financial readiness score is critically low. Prepare up-to-date financial statements, cash flow forecasts, and establish proper accounting practices to meet investor requirements.' },
    'team': { title: 'Build a Stronger Core Team', description: 'Investors heavily evaluate team quality. Address gaps in leadership roles, define clear responsibilities, and strengthen your advisory board.' },
    'business': { title: 'Refine Your Business Model', description: 'Your business model needs improvement. Clearly define your revenue streams, unit economics, and path to profitability to attract investment.' },
    'market': { title: 'Validate Your Market Position', description: 'Improve your market traction score by documenting customer acquisition data, competitive advantages, and measurable growth metrics.' },
    'legal': { title: 'Complete Legal & Governance Setup', description: 'Investors require clean legal structure. Register your company, sort shareholder agreements, and ensure IP and compliance are in order.' },
    'operations': { title: 'Standardize Your Operations', description: 'Operational maturity signals investor confidence. Document processes, establish KPIs, and implement standard operating procedures.' },
    'data': { title: 'Improve Data & Digital Maturity', description: 'Strengthen your data strategy, cybersecurity posture, and digital infrastructure to meet investor due diligence standards.' },
    'growth': { title: 'Develop a Scalable Growth Strategy', description: 'Outline a clear roadmap for growth and scalability — including new markets, product expansion, or partnerships — to demonstrate potential returns.' }
  }

  sourcePillars.forEach((p: any) => {
    const mockPillar = mockPillars.find((mp: any) => String(mp.id) === String(p.pillar_id))
    const rawName = mockPillar?.name || p.pillar_name || ''
    const displayName = formattedPillarName(rawName)
    const pillarScore = p.score

    // Only add fallback for red/medium pillars (score <= 50) with no existing recommendation
    if (pillarScore <= 50) {
      const alreadyHasAction = allGeneratedActions.some(a => a.pillar === displayName)
      if (!alreadyHasAction) {
        // Find a matching keyword recommendation
        const cleanName = rawName.toLowerCase().replace(/[\s_&]/g, '')
        const matchKey = Object.keys(PILLAR_RECOMMENDATIONS).find(k => cleanName.includes(k))
        const rec = (matchKey ? PILLAR_RECOMMENDATIONS[matchKey] : undefined) ?? {
          title: `Improve ${displayName} readiness`,
          description: `Your ${displayName} score is critically low. Take targeted actions to address the weaknesses identified in this pillar.`
        }
        const priority: Priority = pillarScore <= 30 ? 'high' : 'medium'
        const pillarRisk = getPillarRisk(pillarScore, liveSettings.thresholds || [])
        allGeneratedActions.push({
          id: `pillar_fallback_${p.pillar_id}`,
          title: rec.title,
          description: rec.description,
          priority,
          pillar: displayName,
          pillarScore,
          pillarRisk,
          impact: Math.round((50 - pillarScore) / 2),
          status: 'pending',
          type: 'gap'
        })
      }
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

  const thresholds = liveSettings.thresholds || []

  const pillars = sourcePillars.map((p: any) => {
    const mockPillar = mockPillars.find((mp: any) => String(mp.id) === String(p.pillar_id))
    const rawName = mockPillar?.name || p.pillar_name || String(p.pillar_id)
    const displayName = formattedPillarName(rawName)
    
    // Map individual pillar risk to true Admin Threshold labels
    const matched = thresholds.find((t: any) => p.score >= t.min && p.score <= t.max)
    const exactRiskName = matched ? matched.label : getRiskLevel(p.score)

    // Locate actual Admin-defined structural weight to prevent What-If math collapse
    const liveWeightMatch = liveSettings.pillars.find((lp: any) => String(lp.id).toLowerCase() === String(p.pillar_id).toLowerCase())

    return {
      id: p.pillar_id,
      name: displayName,
      score: p.score,
      weight: liveWeightMatch ? liveWeightMatch.weight : (mockPillar?.weight || 0),
      riskLevel: exactRiskName,
      improvementPotential: pillarPotentialMap[displayName] || 0
    }
  })

  // Sync each action's pillarRisk to use the EXACT same riskLevel the pillar table uses
  allGeneratedActions.forEach((action: any) => {
    // Case-insensitive name match
    const matchedPillar = pillars.find((p: any) =>
      p.name.toLowerCase().trim() === (action.pillar || '').toLowerCase().trim()
    )
    if (matchedPillar) {
      const lbl = (matchedPillar.riskLevel || '').toLowerCase()
      // Sort thresholds to determine risk tier by position (lowest = high risk, highest = low risk)
      const sorted = [...thresholds].sort((a: any, b: any) => a.min - b.min)
      const tierCount = sorted.length
      const matchedIdx = sorted.findIndex((t: any) =>
        matchedPillar.score >= t.min && matchedPillar.score <= t.max
      )
      if (matchedIdx !== -1 && tierCount > 0) {
        const pct = matchedIdx / Math.max(tierCount - 1, 1)
        action.pillarRisk = pct < 0.34 ? 'high' : pct < 0.67 ? 'medium' : 'low'
      } else if (lbl.includes('high') || lbl.includes('critical') || lbl.includes('poor') || lbl.includes('early')) {
        action.pillarRisk = 'high'
      } else if (lbl.includes('medium') || lbl.includes('moderate') || lbl.includes('developing') || lbl.includes('growing') || lbl.includes('near')) {
        action.pillarRisk = 'medium'
      } else {
        action.pillarRisk = 'low'
      }
    } else if (typeof action.pillarScore === 'number') {
      // Fallback: use raw score with admin thresholds directly
      action.pillarRisk = getPillarRisk(action.pillarScore, thresholds)
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

  // Calculate honest overall score directly from current pillar configuration (Syncing with What-If math)
  const calculatedOverallScore = calculateOverallScore(pillars)

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

  // Removed mock historical data injection; now shows authentic assessment history.

  let primaryGoal = null
  const activeUserGoals = currentGoals.filter((g: any) => g.status === 'ACTIVE')
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
      focus: formattedPillarName(mockPillars.find((p: any) => p.id === activeG.pillar_id)?.name || 'General')
    }
  }

  return {
    company,
    pillars,
    progress,
    actions: sidebarActions,
    primaryGoal,
    thresholds
  }
})
