import { defineEventHandler, deleteCookie } from 'h3'

export default defineEventHandler(async (event) => {
  // Clear the authentication cookie
  deleteCookie(event, 'irip_auth_user')
  return { success: true }
})
