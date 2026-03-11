import { defineEventHandler, getQuery, setHeader } from 'h3'
import { storage } from '~/server/utils/storage'
import { db } from '~/server/utils/db'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const smeId = query.smeId

  const data = storage.get()
  const assessments = data.assessments || []
  const responses = data.responses || []
  const questions = db.questions.findAll()

  let targetAssessments = assessments
  if (smeId) {
     targetAssessments = assessments.filter((a: any) => String(a.sme_id) === String(smeId))
  }
  
  // Sort assessments so the newest is first
  targetAssessments.sort((a: any, b: any) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())

  // Create a fast lookup map for SME names
  const smeNames: Record<string, string> = {}
  db.smes.findAll().forEach((sme: any) => {
     smeNames[String(sme.id)] = sme.name || sme.company_name || 'Unknown SME'
  })

  db.reportLogs.create({
    type: 'CSV',
    name: 'Raw Scores Export',
    company: smeId ? (smeNames[String(smeId)] || 'Unknown') : 'All SMEs',
  })

  // Generate CSV Content
  let csv = ''
  
  targetAssessments.forEach((assessment: any) => {
      const assessmentResponses = responses.filter((r: any) => r.assessment_id === assessment.id)
      const smeName = smeNames[String(assessment.sme_id)] || 'Unknown SME'
      const formattedDate = new Date(assessment.completed_at).toLocaleDateString()
      const cleanId = `ASM-${new Date(assessment.completed_at).getFullYear()}-${String(assessment.id).slice(-5)}`
      
      // Setup Assessment Profile Header Block
      csv += `Assessment Report\n`
      csv += `SME Name:,"${smeName}"\n`
      csv += `Assessment ID:,"${cleanId}"\n`
      csv += `Date Completed:,"${formattedDate}"\n`
      csv += `Status:,"${assessment.status}"\n`
      csv += `Total Readiness Score:,"${assessment.total_score} / 100"\n\n`
      
      // Setup Questions Subheader
      csv += `Question Text,SME Answer,Score Awarded\n`
      
      assessmentResponses.forEach((resp: any) => {
          // Check if questions array is saved directly on the assessment object (for dynamic templates), or fallback to global template questions
          let question = null
          if (assessment.questions && Array.isArray(assessment.questions)) {
              question = assessment.questions.find((q: any) => q.id === resp.question_id)
          }
          if (!question) {
              question = questions.find((q: any) => q.id === resp.question_id)
          }
          
          const rawQText = question ? question.text : 'Unknown Question'
          
          // Escape quotes for CSV by doubling them and wrapping the whole field in quotes
          const qText = rawQText.replace(/"/g, '""')
          let ansText = String(resp.answer_value || '')
            
          // Clean up boolean/TRUE/FALSE to read nicer in Excel
          if (ansText.toLowerCase() === 'true') ansText = 'Yes'
          if (ansText.toLowerCase() === 'false') ansText = 'No'
          
          ansText = ansText.replace(/"/g, '""').replace(/\n/g, ' ') // protect against line breaks corrupting CSV row count
          
          csv += `"${qText}","${ansText}","${resp.score_awarded}"\n`
      })
      
      // Add explicit spacing and visual separator line between assessments 
      // This forces Excel/Numbers to recognize them as distinct "tables" or blocks
      csv += `\n\n`
      csv += `------------------------------------------------------------,\n`
      csv += `------------------------------------------------------------,\n`
      csv += `\n\n`
  })

  if (targetAssessments.length === 0) {
      csv += 'No assessment data found for the requested criteria.\n'
  }

  // Set headers for download
  const filename = smeId ? `sme_${smeId}_assessment_export.csv` : `all_smes_assessment_export.csv`
  setHeader(event, 'Content-Type', 'text/csv')
  setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)

  return csv
})
