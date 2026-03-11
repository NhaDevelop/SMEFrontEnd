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

  // Fetch live Admin Framework Settings for Thresholds
  const liveSettings = db.settings.get()
  const thresholds = liveSettings.thresholds || []
  
  // Transform to match Investor Dashboard UI requirements
  const dealFlow = filteredSmes.map(sme => {
    // Dynamically calculate financial risk based on Admin Score Thresholds
    let financialRisk: 'Low' | 'Medium' | 'High' = 'High'
    
    // Find where the SME score lands within the Admin's configured brackets
    const investorLevel = thresholds.find((t: any) => sme.score >= t.min && sme.score <= t.max)
    
    if (investorLevel) {
       // Map the custom UI threshold IDs back to the Investor Core Models
       if (investorLevel.id === 'investor' || investorLevel.id === 'near') financialRisk = 'Low'
       else if (investorLevel.id === 'early') financialRisk = 'Medium'
       else financialRisk = 'High'
    } else {
       // Fallback if settings are somehow stripped
       if (sme.score >= 70) financialRisk = 'Low'
       else if (sme.score >= 50) financialRisk = 'Medium'
    }

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
    const isCompleted = g.status === 'COMPLETED'
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let isOverdue = false
    let overdueDays = 0

    if (g.due_date && !isCompleted) {
        const dDate = new Date(g.due_date)
        dDate.setHours(0, 0, 0, 0)
        if (dDate < today) {
            isOverdue = true
            const diffTime = Math.abs(today.getTime() - dDate.getTime())
            overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        }
    }

    return {
        id: g.id,
        smeId: g.sme_id,
        smeName: profile?.company_name || profile?.name || 'Unknown SME',
        sector: profile?.industry || 'Technology',
        location: profile?.location || 'Phnom Penh',
        title: g.title,
        description: g.description,
        status: isCompleted ? 'Achieved' : 'Active',
        isOffTrack: false,
        progress: g.progress_percentage || 0,
        progressColor: 'text-emerald-600',
        barColor: 'bg-emerald-600',
        targetScore: g.target_score || 80, 
        currentScore: profile?.score || 0,
        expectedScore: 0,
        overdue: isOverdue,
        overdueDays: overdueDays ? `${overdueDays} days` : undefined,
        dueDate: g.due_date ? new Date(g.due_date).toLocaleDateString() : 'TBD',
        profilePillars: profile?.pillars || [],
        goalPillars: g.pillars || [],
        readinessHistory: profile?.readinessHistory || [],
        proofNote: g.proof_note,
        proofDocument: g.proof_document
    }
  })

  return {
    dealFlow: dealFlow as SME[],
    goals: allGoals
  }
})
