import { defineEventHandler, getQuery } from 'h3'
import { getUserNotifications } from '~/utils/mock-data'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150))

  const query = getQuery(event)
  
  // TODO: Get actual user from session/auth
  // For now, use query param or default to user 1
  const userId = query.userId ? parseInt(query.userId as string) : 1
  const unreadOnly = query.unreadOnly === 'true'

  const notifications = getUserNotifications(userId, unreadOnly)
  const unreadCount = notifications.filter(n => !n.is_read).length

  return {
    notifications,
    unreadCount,
    total: notifications.length
  }
})
