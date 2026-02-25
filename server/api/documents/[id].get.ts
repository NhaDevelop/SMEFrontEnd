import { defineEventHandler, getRouterParam, createError, setHeader } from 'h3'
import fs from 'node:fs'
import path from 'node:path'
import { storage, UPLOADS_DIR } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Missing document ID' })

  const existing = storage.get()
  const doc = existing.documents.find((d: any) => d.id === id)

  if (!doc) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' })
  }

  const filePath = path.join(UPLOADS_DIR, doc.saved_filename)
  if (!fs.existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'File not found on disk' })
  }

  const fileData = fs.readFileSync(filePath)

  setHeader(event, 'Content-Type', doc.mime_type || 'application/octet-stream')
  setHeader(event, 'Content-Disposition', `attachment; filename="${doc.original_filename}"`)
  setHeader(event, 'Content-Length', fileData.length)

  return fileData
})
