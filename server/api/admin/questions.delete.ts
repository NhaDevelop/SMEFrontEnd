import { defineEventHandler, getQuery } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const id = query.id as string

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Missing question ID'
    })
  }

  return db.questions.delete(id)
})
