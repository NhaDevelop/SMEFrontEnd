import { defineEventHandler, getQuery } from 'h3'
import { mockDocuments, getSMEData } from '~/utils/mock-data'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150))

  const query = getQuery(event)
  
  // TODO: Get actual user from session/auth
  // For now, use query param or default to SME 1
  const smeId = query.smeId ? parseInt(query.smeId as string) : 1

  const smeData = getSMEData(smeId)
  
  if (!smeData) {
    throw createError({
      statusCode: 404,
      message: 'SME not found'
    })
  }

  const documents = smeData.documents

  // Group by type
  const documentsByType = {
    PITCH_DECK: documents.filter(d => d.type === 'PITCH_DECK'),
    FINANCIALS: documents.filter(d => d.type === 'FINANCIALS'),
    LEGAL: documents.filter(d => d.type === 'LEGAL')
  }

  const stats = {
    total: documents.length,
    verified: documents.filter(d => d.is_verified).length,
    pending: documents.filter(d => !d.is_verified).length
  }

  return {
    documents,
    documentsByType,
    stats
  }
})
