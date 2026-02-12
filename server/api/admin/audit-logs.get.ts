import { defineEventHandler, getQuery } from 'h3'
import { getAdminLogs } from '~/utils/mock-data'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))

  const query = getQuery(event)
  
  const adminUserId = query.adminUserId ? parseInt(query.adminUserId as string) : undefined
  const limit = query.limit ? parseInt(query.limit as string) : 50

  const logs = getAdminLogs(adminUserId, limit)

  // Group by action type
  const logsByType = logs.reduce((acc, log) => {
    if (!acc[log.action_type]) {
      acc[log.action_type] = []
    }
    acc[log.action_type]!.push(log)
    return acc
  }, {} as Record<string, typeof logs>)

  return {
    logs,
    logsByType,
    total: logs.length
  }
})
