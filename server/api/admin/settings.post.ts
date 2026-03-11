import { defineEventHandler, readBody } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing settings payload'
    })
  }

  const updatedSettings = db.settings.update(body)
  
  return {
    success: true,
    settings: updatedSettings
  }
})
