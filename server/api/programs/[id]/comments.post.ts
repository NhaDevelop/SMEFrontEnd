import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { storage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const programId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!body.text?.trim()) {
    return { success: false, error: 'Message text is required' }
  }

  const data = storage.get()
  const comments = data.program_comments || []

  const newComment = {
    id: Date.now(),
    programId,
    authorId: body.authorId,
    authorName: body.authorName || 'Unknown',
    authorRole: body.authorRole || 'sme',   // 'admin' | 'investor' | 'sme'
    text: body.text.trim(),
    timestamp: new Date().toISOString()
  }

  comments.push(newComment)
  storage.save({ program_comments: comments })

  return { success: true, comment: newComment }
})
