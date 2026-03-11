import { defineEventHandler, getQuery } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150))

  const query = getQuery(event)
  
  // TODO: Get actual user from session/auth
  // For now, use query param or default to user 1
  const userId = query.userId ? parseInt(query.userId as string) : 1
  const unreadOnly = query.unreadOnly === 'true'

  let notifications = db.notifications.findByUserId(userId)
  if (unreadOnly) {
    notifications = notifications.filter((n: any) => !n.is_read)
  }
  
  const unreadCount = notifications.filter((n: any) => !n.is_read).length

  return {
    notifications,
    unreadCount,
    total: notifications.length
  }
})
