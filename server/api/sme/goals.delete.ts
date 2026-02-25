import { defineEventHandler, getQuery, createError } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = Number(query.id)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Goal ID is required'
    })
  }

  const success = db.goals.delete(id)

  if (!success) {
    throw createError({
      statusCode: 404,
      message: 'Goal not found'
    })
  }

  return {
    success: true,
    message: 'Goal deleted successfully'
  }
})
