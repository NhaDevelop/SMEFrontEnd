import { defineEventHandler, getQuery } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))

  const query = getQuery(event)
  
  const allSmes = db.smes.findAll()
  
  const filteredSmes = allSmes.filter(sme => {
    if (query.industry && sme.industry !== query.industry) return false
    if (query.stage && sme.stage !== query.stage) return false
    
    if (query.minScore) {
      const min = Number(query.minScore)
      if (sme.score < min) return false
    }
    
    if (query.maxScore) {
        const max = Number(query.maxScore)
        if (sme.score > max) return false
    }
    
    return true
  })

  return {
    smes: filteredSmes,
    total: filteredSmes.length
  }
})
