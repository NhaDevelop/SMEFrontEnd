import { defineEventHandler } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))

  const allQuestions = db.questions.findAll()
  const allPillars = db.templates.findAll() // Or maybe framework settings?

  return {
    questions: allQuestions,
    totalQuestions: allQuestions.length
  }
})
