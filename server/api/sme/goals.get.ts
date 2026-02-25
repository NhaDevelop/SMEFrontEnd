import { defineEventHandler, getQuery } from 'h3'
import { db } from '~/server/utils/db'
import { mockPillars } from '~/utils/mock-data'

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
  
  // Transform goals for the frontend if needed, or just return them
  // The frontend currently uses a more complex structure, so we'll do some mapping
  // to help the transition.
  
  return goals.map(g => {
    const goal = g as any
    const date = goal.due_date ? new Date(goal.due_date) : null
    
    return {
      ...goal,
      targetScore: goal.target_score || 85,
      currentScore: goal.current_score || 0,
      deadline: date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline',
      progress: goal.progress_percentage || 0,
      status: goal.status === 'ACTIVE' ? 'Active' : goal.status === 'COMPLETED' ? 'Achieved' : goal.status === 'PAUSED' ? 'Paused' : goal.status,
      pillars: goal.pillars && goal.pillars.length > 0 ? goal.pillars : [
          { name: 'Team', score: 40, target: 80 },
          { name: 'Business', score: 50, target: 85 },
          { name: 'Market', score: 60, target: 90 },
          { name: 'Financial', score: 30, target: 80 }
      ],
      actions: goal.actions || [
          { title: 'Update Strategy', points: 15 },
          { title: 'Hire Key Staff', points: 10 }
      ]
    }
  })
})
