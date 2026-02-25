import { defineEventHandler, readBody } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.text || !body.pillarId) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields'
    })
  }

  // Check if question exists
  const existing = body.id ? db.questions.findAll().find(q => q.id === body.id) : null

  if (existing) {
    console.log('[API] Updating existing question:', body.id)
    return db.questions.update(body.id, body)
  } else {
    console.log('[API] Creating new question with ID:', body.id || 'new')
    return db.questions.create(body)
  }
})
