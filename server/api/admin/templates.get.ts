import { defineEventHandler } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const templates = db.templates.findAll()
  const questions = db.questions.findAll()

  // Enrich templates with actual question and pillar counts
  return templates.map((template: any) => {
    const templateQuestions = questions.filter((q: any) => q.templateId === template.id)
    const pillarIds = new Set(templateQuestions.map((q: any) => q.pillarId))
    
    return {
      ...template,
      questionCount: templateQuestions.length,
      pillarCount: pillarIds.size
    }
  })
})
