import { defineEventHandler, readBody, createError } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.programId || !body.smeId) {
    throw createError({ statusCode: 400, message: 'programId and smeId are required' })
  }

  const program = db.programs.findById(Number(body.programId))
  
  if (!program) {
    throw createError({ statusCode: 404, message: 'Program not found' })
  }

  // Initialize array if it somehow doesn't exist
  if (!program.enrolledSMEs) {
     program.enrolledSMEs = []
  }

  // Prevent duplicate enrollment
  if (!program.enrolledSMEs.includes(body.smeId)) {
     program.enrolledSMEs.push(body.smeId)
     program.smesCount = program.enrolledSMEs.length
     db.programs.update(program.id, program)
  }

  return { success: true, program }
})
