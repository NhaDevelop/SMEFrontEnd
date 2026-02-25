import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import fs from 'node:fs'
import path from 'node:path'
import { storage, UPLOADS_DIR } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  // Parse multipart form data
  const parts = await readMultipartFormData(event)
  if (!parts || parts.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  // Extract fields
  const filePart = parts.find(p => p.name === 'file')
  const namePart = parts.find(p => p.name === 'name')
  const categoryPart = parts.find(p => p.name === 'category')
  const descriptionPart = parts.find(p => p.name === 'description')
  const smeIdPart = parts.find(p => p.name === 'smeId')

  if (!filePart?.data) {
    throw createError({ statusCode: 400, statusMessage: 'No file data received' })
  }

  // Ensure uploads directory exists
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  }

  // Generate a unique filename
  const originalName = filePart.filename || 'upload'
  const ext = path.extname(originalName)
  const id = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const savedFilename = `${id}${ext}`
  const savedPath = path.join(UPLOADS_DIR, savedFilename)

  // Write file to disk
  fs.writeFileSync(savedPath, filePart.data)

  const sizeKb = (filePart.data.length / 1024).toFixed(1)
  const sizeDisplay = filePart.data.length > 1024 * 1024
    ? `${(filePart.data.length / (1024 * 1024)).toFixed(1)} MB`
    : `${sizeKb} KB`

  // Build document metadata record
  const docRecord = {
    id,
    sme_id: smeIdPart ? parseInt(smeIdPart.data.toString()) : 1,
    name: namePart?.data.toString() || originalName,
    original_filename: originalName,
    saved_filename: savedFilename,
    category: categoryPart?.data.toString() || 'General',
    description: descriptionPart?.data.toString() || '',
    size: sizeDisplay,
    size_bytes: filePart.data.length,
    mime_type: filePart.type || 'application/octet-stream',
    uploaded_at: new Date().toISOString(),
    is_verified: false
  }

  // Save to JSON storage
  const existing = storage.get()
  const updatedDocuments = [docRecord, ...(existing.documents || [])]
  storage.save({ ...existing, documents: updatedDocuments })

  console.log(`[Documents API] Saved: ${originalName} → ${savedFilename} (${sizeDisplay})`)

  return {
    success: true,
    document: docRecord
  }
})
