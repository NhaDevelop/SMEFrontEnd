import { defineEventHandler, getRouterParam } from 'h3'
import { getSMEData } from '~/utils/mock-data'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))

  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'SME ID is required'
    })
  }

  const smeId = parseInt(id)
  const smeData = getSMEData(smeId)
  
  if (!smeData) {
    throw createError({
      statusCode: 404,
      message: 'SME not found'
    })
  }

  return {
    ...smeData,
    // Add computed fields for UI
    readinessLevel: smeData.latestAssessment?.total_score 
      ? smeData.latestAssessment.total_score >= 70 
        ? 'Investment Ready' 
        : smeData.latestAssessment.total_score >= 50 
          ? 'Developing' 
          : 'Needs Improvement'
      : 'Not Assessed'
  }
})
