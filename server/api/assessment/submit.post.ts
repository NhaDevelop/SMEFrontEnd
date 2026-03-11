import { defineEventHandler, readBody } from 'h3'
import { storage } from '~/server/utils/storage'
import { db } from '~/server/utils/db'
import { calculateOverallScore } from '~/utils/helpers.js'
import { getPillarScores } from '~/server/utils/scoring'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const smeId = body.smeId || 3 // Preserve string IDs
  const userAnswers = body.answers || {}
  const templateId = body.templateId || 'temp_001'
  
  // IMPORTANT: Use questions from request body if provided (for admin-created templates)
  // Otherwise fall back to static template questions
  let questions: any[] = []
  
  if (body.questions && Array.isArray(body.questions) && body.questions.length > 0) {
    // Admin-created template: use questions sent from client
    questions = body.questions
    console.log(`[Assessment Submit] Using ${questions.length} questions from request body (admin-created template)`)
  } else {
    // Static template: filter from database questions
    const staticTemplateQuestions = db.questions.findAll()
    questions = staticTemplateQuestions.filter((q: any) => q.templateId === templateId)
    console.log(`[Assessment Submit] Using ${questions.length} questions from database (template: ${templateId})`)
  }
  
  if (questions.length === 0) {
    console.warn(`[Assessment Submit] No questions found for template ${templateId}`)
    return {
      success: false,
      error: 'No questions found for this template'
    }
  }
  
  // 1. Create a new assessment record
  const newAssessmentId = Date.now() // Use timestamp for unique ID
  
  // 2. Generate responses and calculate scores based on REAL answers
  const newResponses: any[] = []
  
  questions.forEach((question: any) => {
    const rawAnswer = userAnswers[question.id]
    
    // Default: 0 points if not answered
    let points = 0
    let storedAnswer = rawAnswer // snapshot of what they answered

    if (rawAnswer !== undefined && rawAnswer !== null && rawAnswer !== '') {
      // Calculate points based on question type
      // Points are on 0-10 scale, will be multiplied by weight later
      
      if (question.type === 'BOOLEAN' || question.type === 'Yes/No') {
        points = rawAnswer === true ? 10 : 0
      }
      else if ((question.type === 'CHOICE' || question.type === 'Multiple Choice' || question.type === 'Single Choice') && question.options) {
        // Handle both object format {value, label, points} and simple string array
        const selectedOption: any = question.options.find((opt: any) => {
          const optValue = typeof opt === 'object' && opt !== null && ('value' in opt ? opt.value : opt.label) ? (opt.value || opt.label) : opt
          return optValue === rawAnswer
        })
        
        if (selectedOption) {
          // If option has points property, use it
          if (typeof selectedOption === 'object' && selectedOption !== null && 'points' in selectedOption) {
            points = selectedOption.points
          } else {
            // For simple string options, give full credit (10 points)
            points = 10
          }
        }
      }
      else if (question.type === 'SCALE' || question.type === 'Scale (1-10)') {
        const scaleValue = typeof rawAnswer === 'number' ? rawAnswer : parseInt(rawAnswer)
        if (!isNaN(scaleValue)) {
          points = scaleValue // Already on 1-10 scale
        }
      }
      else if ((question.type === 'Dropdown Select' || question.type === 'Dropdown') && question.options) {
        // Look up the selected option's points — same logic as Single Choice
        const selectedOption: any = question.options.find((opt: any) => {
          const optValue = typeof opt === 'object' && opt !== null ? (opt.value || opt.label) : opt
          return optValue === rawAnswer
        })
        if (selectedOption && typeof selectedOption === 'object' && 'points' in selectedOption) {
          points = selectedOption.points
        } else {
          points = 10 // fallback if no points configured
        }
      }
      else {
        // For TEXT, File Upload - give full credit (10 points)
        points = 10
      }
    }

    // Ensure unique response IDs by looking at the storage count
    const storageData = storage.get()
    const baselineLength = (storageData.responses || []).length
    
    newResponses.push({
      id: baselineLength + 1000 + newResponses.length,
      assessment_id: newAssessmentId,
      question_id: question.id,
      answer_value: storedAnswer,
      score_awarded: points
    })
  })

  // 3. Calculate Total Score using unified weighted pillar model
  const mockAssessment = { id: newAssessmentId, questions: questions }
  const pillarScores = getPillarScores(newAssessmentId, questions, newResponses, [mockAssessment])
  const finalTotalScore = calculateOverallScore(pillarScores)

  const newAssessment = {
    id: newAssessmentId,
    sme_id: smeId,
    template_id: templateId, // Save template ID
    status: 'COMPLETED',
    started_at: new Date(Date.now() - 3600000).toISOString(), 
    completed_at: new Date().toISOString(),
    total_score: finalTotalScore,
    questions: questions // ← Save questions with assessment for dashboard!
  }

  // 4. Update the Database (Using storage entirely)
  try {
      const current = storage.get()
      const updatedAssessments = [newAssessment, ...(current.assessments || [])]
      const updatedResponses = [...newResponses, ...(current.responses || [])]
      storage.save({ ...current, assessments: updatedAssessments, responses: updatedResponses })
      console.log(`[Assessment Submit SUCCESS] Assessment ${newAssessment.id} saved for SME ${smeId}. Total Score: ${finalTotalScore}`)
      console.log(`[Assessment Submit SUCCESS] Storage Assessments Count: ${updatedAssessments.length}, Responses: ${updatedResponses.length}`)
  } catch (e) {
      console.error('[Assessment Submit] Failed to persist storage:', e)
  }

  return {
    success: true,
    assessment: newAssessment,
    message: 'Assessment submitted successfully'
  }
})
