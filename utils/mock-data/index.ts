// Central index file for all mock data
// This makes it easy to import mock data throughout the application

export * from './users'
export * from './assessments'
export * from './programs-goals'
export * from './admin-notifications'

// Helper functions to get related data
import { mockUsers, mockSMEProfiles, mockInvestorProfiles } from './users'
import { mockAssessments, mockPillars, getPillarScores } from './assessments'
import { mockGoals, mockPrograms, mockProgramEnrollments, mockInvestorInterests, mockDocuments } from './programs-goals'
import { mockAdminAuditLogs, mockNotifications } from './admin-notifications'

/**
 * Get complete SME data including user, profile, latest assessment, goals, etc.
 */
export function getSMEData(smeId: number) {
  const profile = mockSMEProfiles.find(p => p.id === smeId)
  if (!profile) return null
  
  const user = mockUsers.find(u => u.id === profile.user_id)
  const assessments = mockAssessments
    .filter(a => a.sme_id === smeId && a.status === 'COMPLETED')
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
  
  const latestAssessment = assessments[0]
  const pillarScores = latestAssessment ? getPillarScores(latestAssessment.id) : []
  
  const goals = mockGoals.filter(g => g.sme_id === smeId)
  const enrollments = mockProgramEnrollments.filter(e => e.sme_id === smeId)
  const programs = enrollments.map(e => mockPrograms.find(p => p.id === e.program_id)).filter(Boolean)
  const documents = mockDocuments.filter(d => d.sme_id === smeId)
  const interests = mockInvestorInterests.filter(i => i.sme_id === smeId)
  
  return {
    user,
    profile,
    latestAssessment,
    pillarScores,
    assessmentHistory: assessments,
    goals,
    programs,
    documents,
    investorInterests: interests
  }
}

/**
 * Get complete Investor data
 */
export function getInvestorData(investorId: number) {
  const profile = mockInvestorProfiles.find(p => p.id === investorId)
  if (!profile) return null
  
  const user = mockUsers.find(u => u.id === profile.user_id)
  const watchlist = mockInvestorInterests.filter(i => i.investor_id === investorId)
  
  const watchedSMEs = watchlist.map(w => {
    const smeData = getSMEData(w.sme_id)
    return {
      ...smeData,
      watchlistNotes: w.notes,
      watchedSince: w.created_at
    }
  })
  
  return {
    user,
    profile,
    watchlist: watchedSMEs
  }
}

/**
 * Get all SMEs filtered by criteria (for Investor dashboard)
 */
export function filterSMEs(filters: {
  industry?: string
  minScore?: number
  maxScore?: number
  stage?: string
}) {
  return mockSMEProfiles
    .filter(profile => {
      if (filters.industry && profile.industry !== filters.industry) return false
      if (filters.stage && profile.stage !== filters.stage) return false
      
      if (filters.minScore || filters.maxScore) {
        const latestAssessment = mockAssessments
          .filter(a => a.sme_id === profile.id && a.status === 'COMPLETED')
          .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())[0]
        
        if (!latestAssessment) return false
        if (filters.minScore && latestAssessment.total_score! < filters.minScore) return false
        if (filters.maxScore && latestAssessment.total_score! > filters.maxScore) return false
      }
      
      return true
    })
    .map(profile => getSMEData(profile.id))
}

/**
 * Get program with enrolled SMEs
 */
export function getProgramData(programId: number) {
  const program = mockPrograms.find(p => p.id === programId)
  if (!program) return null
  
  const enrollments = mockProgramEnrollments.filter(e => e.program_id === programId)
  const smes = enrollments.map(e => ({
    ...getSMEData(e.sme_id),
    enrollmentStatus: e.status,
    enrollmentDate: e.enrollment_date
  }))
  
  const creator = mockUsers.find(u => u.id === program.created_by_user_id)
  
  return {
    program,
    creator,
    enrolledSMEs: smes,
    stats: {
      total: smes.length,
      accepted: smes.filter(s => s.enrollmentStatus === 'ACCEPTED').length,
      applied: smes.filter(s => s.enrollmentStatus === 'APPLIED').length,
      avgScore: smes.reduce((sum, s) => sum + (s.latestAssessment?.total_score || 0), 0) / smes.length
    }
  }
}

/**
 * Get admin activity logs
 */
export function getAdminLogs(adminUserId?: number, limit = 50) {
  let logs = mockAdminAuditLogs
  
  if (adminUserId) {
    logs = logs.filter(log => log.admin_user_id === adminUserId)
  }
  
  return logs
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

/**
 * Get user notifications
 */
export function getUserNotifications(userId: number, unreadOnly = false) {
  let notifications = mockNotifications.filter(n => n.user_id === userId)
  
  if (unreadOnly) {
    notifications = notifications.filter(n => !n.is_read)
  }
  
  return notifications.sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

// Export aggregated data
export const mockData = {
  users: mockUsers,
  smeProfiles: mockSMEProfiles,
  investorProfiles: mockInvestorProfiles,
  pillars: mockPillars,
  assessments: mockAssessments,
  goals: mockGoals,
  programs: mockPrograms,
  programEnrollments: mockProgramEnrollments,
  investorInterests: mockInvestorInterests,
  documents: mockDocuments,
  adminAuditLogs: mockAdminAuditLogs,
  notifications: mockNotifications
}
