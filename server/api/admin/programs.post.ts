import { defineEventHandler, readBody } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Basic validation
  if (!body.name || !body.description || !body.template) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  const newProgram = db.programs.create({
    name: body.name,
    description: body.description,
    template: body.template, // Store the template name
    templateId: body.templateId, // Correct template ID from frontend
    status: body.status || 'Active',
    startDate: body.startDate,
    endDate: body.endDate,
    sector: body.sector,
    duration: body.duration,
    deadline: body.deadline,
    investmentAmount: body.investmentAmount,
    benefits: body.benefits,
    smesCount: 0,
    avgScore: 0,
    progress: 0
  })

  return newProgram
})
