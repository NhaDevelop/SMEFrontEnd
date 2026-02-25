import { defineEventHandler, readBody } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.name) {
      throw createError({
        statusCode: 400,
        message: 'Missing template name'
      })
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  return db.templates.create(body)
})
