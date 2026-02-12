import { defineEventHandler } from 'h3'
import { 
  mockSMEProfiles, 
  mockInvestorProfiles, 
  mockPrograms, 
  mockProgramEnrollments,
  mockAssessments,
  getAdminLogs,
  getSMEData
} from '~/utils/mock-data'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  // Calculate SME statistics
  const totalSMEs = mockSMEProfiles.length
  const completedAssessments = mockAssessments.filter(a => a.status === 'COMPLETED').length
  const inProgressAssessments = mockAssessments.filter(a => a.status === 'IN_PROGRESS').length
  
  // Calculate average score from completed assessments
  const completedAssessmentsList = mockAssessments.filter(a => a.status === 'COMPLETED')
  const avgScore = completedAssessmentsList.length > 0
    ? completedAssessmentsList.reduce((sum, a) => sum + (a.total_score || 0), 0) / completedAssessmentsList.length
    : 0

  // Get SMEs with their latest assessment data
  const smesWithData = mockSMEProfiles.map(sme => {
    const smeData = getSMEData(sme.id)
    return {
      ...sme,
      latestAssessment: smeData?.latestAssessment,
      score: smeData?.latestAssessment?.total_score || null,
      status: smeData?.latestAssessment?.status || 'NOT_STARTED'
    }
  })

  // Program statistics
  const totalPrograms = mockPrograms.length
  const activePrograms = mockPrograms.filter(p => {
    const endDate = new Date(p.end_date)
    return endDate > new Date()
  }).length

  // Enrollment statistics
  const totalEnrollments = mockProgramEnrollments.length
  const acceptedEnrollments = mockProgramEnrollments.filter(e => e.status === 'ACCEPTED').length

  // Recent activity (audit logs)
  const recentActivity = getAdminLogs(undefined, 10)

  return {
    stats: {
      totalSMEs,
      totalInvestors: mockInvestorProfiles.length,
      totalPrograms,
      activePrograms,
      completedAssessments,
      inProgressAssessments,
      avgScore: Math.round(avgScore),
      totalEnrollments,
      acceptedEnrollments
    },
    smes: smesWithData,
    recentActivity,
    programs: mockPrograms.map(program => {
      const enrollments = mockProgramEnrollments.filter(e => e.program_id === program.id)
      return {
        ...program,
        enrollmentCount: enrollments.length,
        acceptedCount: enrollments.filter(e => e.status === 'ACCEPTED').length
      }
    })
  }
})
