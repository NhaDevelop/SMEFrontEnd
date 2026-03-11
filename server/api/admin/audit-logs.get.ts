import { defineEventHandler, getQuery } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))

  const query = getQuery(event)
  
  const adminUserId = query.adminUserId ? parseInt(query.adminUserId as string) : undefined
  const limit = query.limit ? parseInt(query.limit as string) : 50

  let logs = db.audit_logs.findAll()
  if (adminUserId) {
    logs = logs.filter((log: any) => String(log.admin_id) === String(adminUserId))
  }
  logs = logs.slice(0, limit)

  // Group by action type
  const logsByType = logs.reduce((acc: any, log: any) => {
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
