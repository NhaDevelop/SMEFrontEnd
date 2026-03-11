import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '~/server/utils/db'
import { calculateOverallScore } from '~/utils/helpers.js'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { smeId, title, description, targetScore, deadline, pillars, createdBy, investorName, investorCompany } = body
  
  if (!smeId || !title || !deadline) {
    throw createError({
      statusCode: 400,
      message: 'smeId, title, and target date are required'
    })
  }

  // Calculate initial overall score from pillars using shared helper
  const initialScore = calculateOverallScore(pillars || [])

  const newGoal = db.goals.create({
    sme_id: smeId,
    title,
    description,
    target_score: targetScore,
    current_score: initialScore,
    due_date: deadline,
    pillars: pillars || [],
    created_by: createdBy || 'sme',
    investor_name: investorName,
    investor_company: investorCompany,
    status: 'ACTIVE',
    progress_percentage: 0
  })

  return {
    success: true,
    goal: newGoal
  }
})
