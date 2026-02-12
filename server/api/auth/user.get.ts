import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
  // In a real app, verify session/token here
  // For now, allow the client to handle 401 if no valid session exists
  
  // Example for future:
  // const token = getCookie(event, 'auth_token')
  // if (!token) throw createError({ statusCode: 401 })
  
  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized'
  })
})
