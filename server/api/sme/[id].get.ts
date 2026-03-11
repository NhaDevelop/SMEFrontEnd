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

  // Map through assessments to attach real names instead of database IDs
  const mappedSmeData = { ...smeData }
  if (mappedSmeData.assessments && Array.isArray(mappedSmeData.assessments)) {
     mappedSmeData.assessments = mappedSmeData.assessments.map((a: any) => {
         const t = db.templates.findById(a.templateId || a.template_id)
         return {
             ...a,
             templateName: t ? t.name : 'Standard Readiness Assessment'
         }
     })
  }

  return {
    ...mappedSmeData,
    // Add computed fields for UI
    readinessLevel: mappedSmeData.assessments && mappedSmeData.assessments[0]?.score 
      ? mappedSmeData.assessments[0].score >= 70 
        ? 'Investment Ready' 
        : mappedSmeData.assessments[0].score >= 50 
          ? 'Developing' 
          : 'Needs Improvement'
      : 'Not Assessed'
  }
})
