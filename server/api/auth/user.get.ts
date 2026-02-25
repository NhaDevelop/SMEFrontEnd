import { defineEventHandler, createError, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const userCookie = getCookie(event, 'irip_auth_user')
  
  if (userCookie) {
    try {
      return JSON.parse(userCookie)
    } catch (e) {
      // JSON parse failed, clear or ignore
    }
  }

  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized'
  })
})
