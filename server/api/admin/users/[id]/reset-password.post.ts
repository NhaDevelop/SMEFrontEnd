import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({ statusCode: 400, message: 'User ID is required' })
  }

  // Simulate sending a password reset email
  console.log(`[Mock Send] Password reset link sent to User ID: ${id}`)

  return { 
    success: true, 
    message: `Password reset link sent successfully.` 
  }
})
