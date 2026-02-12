import { defineEventHandler, getQuery } from 'h3'
import { filterSMEs } from '~/utils/mock-data'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))

  const query = getQuery(event)
  
  const filters: any = {}
  
  if (query.industry) {
    filters.industry = query.industry as string
  }
  
  if (query.minScore) {
    filters.minScore = parseInt(query.minScore as string)
  }
  
  if (query.maxScore) {
    filters.maxScore = parseInt(query.maxScore as string)
  }
  
  if (query.stage) {
    filters.stage = query.stage as string
  }

  const smes = filterSMEs(filters)

  return {
    smes,
    total: smes.length,
    filters
  }
})
