import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.chatId || !body.senderId || !body.text) {
    throw createError({ statusCode: 400, message: 'chatId, senderId, and text are required' })
  }

  const newMessage = db.messages.create({
    chatId: body.chatId,
    senderId: body.senderId,
    senderEmail: body.senderEmail,
    recipientId: body.recipientId,
    recipientEmail: body.recipientEmail,
    subject: body.subject,
    text: body.text,
    read: false,
    timestamp: new Date().toISOString()
  })

  return newMessage
})
