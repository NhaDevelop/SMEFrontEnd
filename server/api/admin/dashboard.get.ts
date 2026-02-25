import { defineEventHandler } from 'h3'
import { db } from '~/server/utils/db'
import { storage } from '~/server/utils/storage'
import { seedUsers } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const smes = db.smes.findAll()
  const programs = db.programs.findAll()

  const storageData = storage.get()
  const assessments = storageData.assessments || []
  const registrations = storageData.registrations || []

  // Combine seed investors + approved registrations with role 'investor'
  const seedInvestors = seedUsers.filter(u => u.role === 'investor')
  const seedEmails = new Set(seedUsers.map(u => u.email.toLowerCase()))
  const approvedInvestors = registrations.filter((r: any) => r.status === 'approved' && r.role === 'investor' && !seedEmails.has(r.email?.toLowerCase()))
  const totalInvestors = seedInvestors.length + approvedInvestors.length

  // Calculate SME statistics
  const totalSMEs = smes.length
  const completedAssessments = assessments.filter((a: any) => a.status === 'COMPLETED').length
  const inProgressAssessments = assessments.filter((a: any) => a.status === 'IN_PROGRESS').length
  
  // Calculate average score from completed assessments
  const completedAssessmentsList = assessments.filter((a: any) => a.status === 'COMPLETED')
  const avgScore = completedAssessmentsList.length > 0
    ? completedAssessmentsList.reduce((sum: number, a: any) => sum + (a.total_score || 0), 0) / completedAssessmentsList.length
    : 0

  // Program statistics
  const totalPrograms = programs.length
  const activePrograms = programs.filter(p => p.status === 'Active').length

  // Enrollment statistics
  const totalEnrollments = programs.reduce((sum, p) => sum + (p.smesCount || 0), 0)
  const acceptedEnrollments = totalEnrollments

  // Recent activity (audit logs)
  const recentActivity = registrations
    .slice(-10) // get most recent
    .map((r: any) => ({
      id: r.id || Date.now() + Math.random(),
      admin: 'System',
      action: r.status === 'approved' ? 'Approved Registration' : r.status === 'rejected' ? 'Rejected Registration' : 'New Registration',
      target: r.company || r.name,
      timestamp: new Date(r.registered_at || Date.now()).toLocaleString(),
      details: r.role
    }))
    .reverse()

  return {
    stats: {
      totalSMEs,
      totalInvestors: totalInvestors,
      totalPrograms,
      activePrograms,
      completedAssessments,
      inProgressAssessments,
      avgScore: Math.round(avgScore),
      totalEnrollments,
      acceptedEnrollments
    },
    smes: smes,
    recentActivity,
    programs: programs.map(program => {
      // Compatibility mapping for existing UI
      return {
        ...program,
        enrollmentCount: program.smesCount || 0,
        acceptedCount: program.smesCount || 0
      }
    })
  }
})
