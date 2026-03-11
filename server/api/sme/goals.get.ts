import { defineEventHandler, getQuery } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const smeIdRaw = query.smeId as string | undefined
  // If numeric, convert; otherwise keep as string (for registration IDs like reg_...)
  const smeId: string | number = (smeIdRaw && !isNaN(Number(smeIdRaw))) ? Number(smeIdRaw) : (smeIdRaw || 2)
  
  const allGoals = db.goals.findBySmeId(smeId)
  
  // Deduplicate goals by ID, keeping the latest one
  const uniqueGoalsMap = new Map()
  allGoals.forEach((g: any) => {
    uniqueGoalsMap.set(g.id, g)
  })
  const goals = Array.from(uniqueGoalsMap.values())
  
  const smeProfile = db.smes.findById(smeId)
  
  return goals.map((g: any) => {
    const goal = g
    const date = goal.due_date ? new Date(goal.due_date) : null
    
    let validPillars = []
    if (Array.isArray(goal.pillars) && goal.pillars.length > 0) {
        validPillars = goal.pillars.map((p: any) => ({
            name: p.name || p.pillar_name,
            score: typeof p.score === 'number' ? p.score : (typeof p.currentScore === 'number' ? p.currentScore : 0),
            target: typeof p.target === 'number' ? p.target : (typeof p.targetScore === 'number' ? p.targetScore : (goal.target_score || 85))
        }))
    } else if (smeProfile?.pillars) {
        validPillars = smeProfile.pillars.map((p: any) => ({
            name: p.name || p.pillar_name,
            score: p.score || 0,
            target: goal.target_score || 85
        }))
    }
    
    // Dynamically compute Priority Actions based on the largest gap between target and current score
    const computedActions = goal.status === 'COMPLETED' ? [] : validPillars
        .map((p: any) => ({
            title: `Improve ${p.name || p.pillar_name || 'System'}`,
            points: Math.max(0, (p.target || 80) - (p.score || 0))
        }))
        .filter((a: any) => a.points > 0)
        .sort((a: any, b: any) => b.points - a.points)
        .slice(0, 3)

    const isCompleted = goal.status === 'COMPLETED'
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let overdueDays = null

    if (date && !isCompleted) {
        const dDate = new Date(date)
        dDate.setHours(0, 0, 0, 0)
        if (dDate < today) {
            const diffTime = Math.abs(today.getTime() - dDate.getTime())
            overdueDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        }
    }

    return {
      ...goal,
      targetScore: goal.target_score || 85,
      currentScore: goal.current_score || 0,
      deadline: date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline',
      progress: goal.progress_percentage || 0,
      status: goal.status === 'ACTIVE' ? 'Active' : goal.status === 'COMPLETED' ? 'Achieved' : goal.status === 'PAUSED' ? 'Paused' : goal.status,
      pillars: validPillars,
      actions: goal.actions?.length ? goal.actions : computedActions,
      overdue: overdueDays,
      createdBy: goal.created_by || 'sme',
      investorName: goal.investor_name,
      investorCompany: goal.investor_company
    }
  })
})
