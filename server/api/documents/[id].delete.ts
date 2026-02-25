import { defineEventHandler, getRouterParam, createError } from 'h3'
import fs from 'node:fs'
import path from 'node:path'
import { storage, UPLOADS_DIR } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing document ID' })

  const existing = storage.get()
  const docIndex = existing.documents.findIndex((d: any) => d.id === id)

  if (docIndex === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }

  const doc = existing.documents[docIndex]

  // Delete physical file if it exists
  if (doc.saved_filename) {
    const filePath = path.join(UPLOADS_DIR, doc.saved_filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      console.log(`[Documents API] Deleted file: ${doc.saved_filename}`)
    }
  }

  // Remove from storage
  const updatedDocuments = existing.documents.filter((d: any) => d.id !== id)
  storage.save({ ...existing, documents: updatedDocuments })

  return { success: true, deletedId: id }
})
