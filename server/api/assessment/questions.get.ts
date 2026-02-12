import { defineEventHandler } from 'h3'
import { mockPillars, mockQuestions } from '~/utils/mock-data'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 200))

  // Group questions by pillar
  const questionsByPillar = mockPillars.map(pillar => {
    const pillarQuestions = mockQuestions.filter(q => q.pillar_id === pillar.id)
    
    return {
      pillar: {
        id: pillar.id,
        name: pillar.name,
        weight: pillar.weight
      },
      questions: pillarQuestions.map(q => ({
        id: q.id,
        text: q.text,
        type: q.type,
        weight: q.weight,
        options: q.options
      })),
      questionCount: pillarQuestions.length
    }
  })

  return {
    pillars: mockPillars,
    questions: mockQuestions,
    questionsByPillar,
    totalQuestions: mockQuestions.length
  }
})
