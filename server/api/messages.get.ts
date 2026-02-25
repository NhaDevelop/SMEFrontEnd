import { defineEventHandler, getQuery, createError } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const chatId = query.chatId as string
  
  // If the user wants to mark messages as read
  const markReadFor = Number(query.markReadFor)
  if (chatId && markReadFor) {
    db.messages.markRead(chatId, markReadFor)
  }

  // If no chatId provided, return all messages for frontend filtering
  if (!chatId) {
    const allMessages = db.messages.findAll()
    return allMessages.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const messages = db.messages.findByChatId(chatId)
  
  // Sort by timestamp ascending (oldest first, like a chat app)
  return messages.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
})
