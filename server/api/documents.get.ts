import { defineEventHandler, getQuery, createError } from 'h3'
import { storage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  await new Promise(resolve => setTimeout(resolve, 150))

  const query = getQuery(event)
  const smeId = query.smeId ? parseInt(query.smeId as string) : 1

  // Load stored (uploaded) documents from JSON storage
  const db = storage.get()
  const storedDocs = (db.documents || []).filter((d: any) => d.sme_id === smeId)

  // Transform to UI-friendly format
  const documents = storedDocs.map((d: any) => ({
    id: d.id,
    name: d.name,
    original_filename: d.original_filename,
    category: d.category,
    description: d.description || '',
    size: d.size,
    date: new Date(d.uploaded_at).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    }),
    is_verified: d.is_verified || false,
    download_url: `/api/documents/${d.id}`
  }))

  return { documents }
})
