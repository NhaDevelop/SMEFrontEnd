import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 300))

  return {
    stats: {
      total: 3,
      pending: 0,
      smes: 1,
      investors: 0,
      admins: 2
    },
    users: [], // Mocking empty pending users for now as per screenshot
    pendingUsers: []
  }
})
