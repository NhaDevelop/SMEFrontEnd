import { defineEventHandler, readBody } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, status, proofNote, proofDocument } = body
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Goal ID is required'
    })
  }

  // Fetch existing goal to get targets if we are completing it
  const existingGoal = db.goals.findAll().find(g => g.id === Number(id)) as any
  
  const updateData: any = {
    status: status || 'COMPLETED',
    completed_at: status === 'COMPLETED' ? new Date().toISOString() : null,
    progress_percentage: status === 'COMPLETED' ? 100 : undefined,
    proof_note: proofNote,
    proof_document: proofDocument
  }

  // If marking as completed, set current scores to target scores
  if (status === 'COMPLETED' && existingGoal) {
    updateData.current_score = existingGoal.target_score
    if (existingGoal.pillars) {
      updateData.pillars = existingGoal.pillars.map((p: any) => ({
        ...p,
        score: p.target
      }))
    }
  }

  const updatedGoal = db.goals.update(Number(id), updateData)

  if (!updatedGoal) {
    throw createError({
      statusCode: 404,
      message: 'Goal not found'
    })
  }

  return {
    success: true,
    goal: updatedGoal
  }
})
