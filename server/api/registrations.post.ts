import { defineEventHandler, readBody, createError } from 'h3'
import { storage } from '~/server/utils/storage'

// POST /api/registrations — called by /register page
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.email || !body.name || !body.role || !body.password) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields (name, email, role, password)' })
  }

  if (body.password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Password must be at least 6 characters.' })
  }

  const db = storage.get()

  // Block emails that belong to existing seed/platform users
  const SEED_EMAILS = new Set([
    'la@gmail.com',
    'paypanha45@gmail.com',
    'stsmey@gmail.com',
    'bunphinim@gmail.com'
  ])
  if (SEED_EMAILS.has(body.email.toLowerCase())) {
    throw createError({ statusCode: 409, statusMessage: 'An account with this email already exists on the platform.' })
  }

  // Prevent duplicate registrations by email (in pending/approved registrations)
  const exists = (db.registrations || []).find(
    (r: any) => r.email.toLowerCase() === body.email.toLowerCase()
  )
  if (exists) {
    throw createError({ statusCode: 409, statusMessage: 'An account with this email already exists or is pending approval.' })
  }

  const newReg = {
    id: 'reg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    name: body.name,
    email: body.email,
    password: body.password,   // ← saved so user can log in after approval
    role: body.role,           // 'sme' or 'investor'
    company: body.company || '',
    phone: body.phone || '',
    website: body.website || '',
    industry: body.industry || '',
    employees: body.employees || '',
    years: body.years || '',
    regNo: body.regNo || '',
    address: body.address || '',
    status: 'pending',
    registered_at: new Date().toISOString(),
    registered: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const updated = [newReg, ...(db.registrations || [])]
  storage.save({ ...db, registrations: updated })

  console.log(`[Registrations API] New pending registration: ${body.name} <${body.email}> as ${body.role}`)

  return { success: true, id: newReg.id }
})
