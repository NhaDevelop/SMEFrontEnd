import { defineEventHandler, getRouterParam } from 'h3'
import { db } from '~/server/utils/db'

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

  // Pass raw ID to support both numeric and alphanumeric "reg_*" IDs
  const smeData = db.smes.findById(id)
  
  if (!smeData) {
    throw createError({
      statusCode: 404,
      message: 'SME not found'
    })
  }

  return {
    ...smeData,
    // Add computed fields for UI
    readinessLevel: smeData.assessments && smeData.assessments[0]?.score 
      ? smeData.assessments[0].score >= 70 
        ? 'Investment Ready' 
        : smeData.assessments[0].score >= 50 
          ? 'Developing' 
          : 'Needs Improvement'
      : 'Not Assessed'
  }
})
