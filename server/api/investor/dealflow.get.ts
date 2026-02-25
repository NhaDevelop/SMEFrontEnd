import { defineEventHandler, getQuery } from 'h3'
import { db } from '~/server/utils/db'
import type { SME, Goal } from '~/stores/investor.store'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const query = getQuery(event)
  
  // Get all SMEs from our unified repository
  const allSmes = db.smes.findAll()

  // Apply filters
  const filteredSmes = allSmes.filter(sme => {
    if (query.industry && sme.industry !== query.industry) return false
    if (query.stage && sme.stage !== query.stage) return false
    
    if (query.minScore) {
      const min = Number(query.minScore)
      if (sme.score < min) return false
    }
    
    return true
  })

  // Transform to match Investor Dashboard UI requirements
  const dealFlow = filteredSmes.map(sme => {
    // Calculate financial risk based on score (mock logic matching store interface)
    let financialRisk: 'Low' | 'Medium' | 'High' = 'High'
    if (sme.score >= 70) financialRisk = 'Low'
    else if (sme.score >= 50) financialRisk = 'Medium'

    return {
      id: sme.id,
      name: sme.company_name || sme.name,
      industry: sme.industry,
      location: sme.location,
      stage: sme.stage || 'Seed', // Default stage if missing
      score: sme.score,
      keyStrength: 'High Potential', 
      fundingNeeded: sme.fundingNeeded || 50000, 
      description: sme.description || `${sme.company_name || sme.name} is a leading player in ${sme.industry}.`,
      financials: sme.financials || { revenue: '$100k', profit: '$20k', growth: '+15%' }, 
      financialRisk,
      growthRate: sme.growthRate || 15,
      status: sme.status,
      lastUpdated: sme.lastAssessed ? new Date(sme.lastAssessed).toLocaleDateString() : 'Never',
      lastAssessedDate: sme.lastAssessed || '',
      readinessHistory: (sme.assessments || []).map((a: any) => a.score || a.total_score || 0),
      readinessProgress: 5,
      programIds: sme.programIds || [],
      pillars: sme.pillars || []
    }
  })

  // Get all active goals from our central repository
  const allGoalsFromDb = db.goals.findAll()
  const allSmesMap = Object.fromEntries(allSmes.map(s => [s.id, s]))

  const allGoals: Goal[] = allGoalsFromDb.map(g => {
    const profile = allSmesMap[g.sme_id]
    return {
        id: g.id,
        smeId: g.sme_id,
        smeName: profile?.company_name || profile?.name || 'Unknown SME',
        sector: profile?.industry || 'Technology',
        location: profile?.location || 'Phnom Penh',
        title: g.title,
        description: g.description,
        status: g.status === 'COMPLETED' ? 'Achieved' : 'Active',
        isOffTrack: false,
        progress: g.progress_percentage || 0,
        progressColor: 'text-emerald-600',
        barColor: 'bg-emerald-600',
        targetScore: 80, 
        currentScore: 0,
        expectedScore: 0,
        overdue: false,
        dueDate: g.due_date ? new Date(g.due_date).toLocaleDateString() : 'TBD'
    }
  })

  return {
    dealFlow: dealFlow as SME[],
    goals: allGoals
  }
})
