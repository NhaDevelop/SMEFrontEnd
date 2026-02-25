import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { programId, smeIds } = body

  if (!programId || !Array.isArray(smeIds)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing programId or smeIds'
    })
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const program = db.programs.findById(Number(programId))
  if (!program) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Program not found'
    })
  }

  // Update program's enrolledSMEs list
  const currentEnrolled = program.enrolledSMEs || []
  const newEnrolled = [...new Set([...currentEnrolled, ...smeIds])]
  
  db.programs.update(Number(programId), { 
    enrolledSMEs: newEnrolled,
    smesCount: newEnrolled.length
  })

  return { success: true, count: newEnrolled.length }
})
