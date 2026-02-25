import { defineEventHandler, readBody, getRouterParam, createError } from 'h3'
import { storage } from '~/server/utils/storage'

// PATCH /api/registrations/[id] — approve or reject a pending registration
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing registration ID' })

  const action = body.action // 'approve' | 'reject'
  if (!['approve', 'reject'].includes(action)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid action. Use "approve" or "reject"' })
  }

  const db = storage.get()
  // Use loose equality to handle potential string/number mismatches
  const idx = (db.registrations || []).findIndex((r: any) => r.id == id)

  if (idx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Registration not found' })
  }

  const updatedRegistrations = [...db.registrations]
  updatedRegistrations[idx] = {
    ...updatedRegistrations[idx],
    status: action === 'approve' ? 'approved' : 'rejected',
    reviewed_at: new Date().toISOString()
  }

  const reg = updatedRegistrations[idx]
  let updatedGoals = db.goals || []

  // ── Seeding Initial State ──────────────────────────────────────────────────
  // If it's an SME being approved, prepare default goals
  if (action === 'approve' && reg.role === 'sme') {
    const seedGoals = [
      {
        id: `goal_auto_${Date.now()}_1`,
        sme_id: reg.id,
        title: 'Complete Initial Assessment',
        description: 'Take your first self-assessment to understand your investment readiness gaps.',
        pillar_id: 1, // Team
        status: 'ACTIVE',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week
        progress_percentage: 0,
        target_score: 80,
        current_score: 0,
        pillars: [
          { name: 'Team & Leadership', score: 0, target: 80 },
          { name: 'Business Model', score: 0, target: 80 }
        ],
        actions: [
          { title: 'Complete Company Profile', points: 10 },
          { title: 'Upload Team CVs', points: 15 }
        ],
        created_at: new Date().toISOString()
      },
      {
        id: `goal_auto_${Date.now()}_2`,
        sme_id: reg.id,
        title: 'Establish Legal Framework',
        description: 'Prepare your registration documents and shareholder agreements for review.',
        pillar_id: 6, // Legal
        status: 'ACTIVE',
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 month
        progress_percentage: 0,
        target_score: 90,
        current_score: 10,
        pillars: [
          { name: 'Legal & Governance', score: 10, target: 90 }
        ],
        actions: [
          { title: 'Upload Business License', points: 20 },
          { title: 'Review Shareholder Agreement', points: 30 }
        ],
        created_at: new Date().toISOString()
      }
    ]
    updatedGoals = [...updatedGoals, ...seedGoals]
    console.log(`[Registrations API] Prepared ${seedGoals.length} default goals for SME: ${reg.name}`)
  }

  // Atomic save for all changed data
  storage.save({ 
    ...db, 
    registrations: updatedRegistrations,
    goals: updatedGoals 
  })
  // ────────────────────────────────────────────────────────────────────────────
  console.log(`[Registrations API] ${action.toUpperCase()}: ${reg.name} <${reg.email}>`)

  return { success: true, registration: reg }
})
