import { defineEventHandler } from 'h3'
import { storage } from '~/server/utils/storage'
import { seedUsers } from '~/server/utils/db'

// GET /api/admin/users — returns approved users from registrations + hardcoded seed users
export default defineEventHandler(async (_event) => {
  const db = storage.get()
  const registrations = (db.registrations || []) as any[]

  // Approved registrations become active users (avoid duplicating seed emails)
  const seedEmails = new Set(seedUsers.map(u => u.email.toLowerCase()))
  const approvedFromRegistrations = registrations
    .filter((r: any) => r.status === 'approved' && !seedEmails.has(r.email?.toLowerCase()))
    .map((r: any) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role,
      status: 'active',
      registered: r.registered || new Date(r.registered_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }))

  // Pending registrations (for pending count only)
  const pending = registrations.filter((r: any) => r.status === 'pending')

  const allUsers = [...seedUsers, ...approvedFromRegistrations]

  return {
    users: allUsers,
    pendingUsers: pending,
    stats: {
      total: allUsers.length,
      pending: pending.length,
      smes: allUsers.filter(u => u.role === 'sme').length,
      investors: allUsers.filter(u => u.role === 'investor').length,
      admins: allUsers.filter(u => u.role === 'admin').length
    }
  }
})
