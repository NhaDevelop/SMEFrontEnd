import { defineEventHandler } from 'h3'
import { storage } from '~/server/utils/storage'

// GET /api/registrations — called by admin users page
export default defineEventHandler(async (_event) => {
  const db = storage.get()
  const registrations = (db.registrations || []) as any[]

  const pending = registrations.filter((r: any) => r.status === 'pending')
  const approved = registrations.filter((r: any) => r.status === 'approved')
  const rejected = registrations.filter((r: any) => r.status === 'rejected')

  return {
    pending,
    approved,
    rejected,
    stats: {
      total: registrations.length,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
      // All registrations by role (any status)
      smes: registrations.filter((r: any) => r.role === 'sme').length,
      investors: registrations.filter((r: any) => r.role === 'investor').length,
      // Only APPROVED registrations by role (for stat card additions)
      approvedSmes: approved.filter((r: any) => r.role === 'sme').length,
      approvedInvestors: approved.filter((r: any) => r.role === 'investor').length
    }
  }
})
