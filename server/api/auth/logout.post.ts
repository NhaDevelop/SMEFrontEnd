import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // Execute server-side logout logic (e.g., clearing cookies) if needed
  return { success: true }
})
