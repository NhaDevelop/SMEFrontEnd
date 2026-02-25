import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { storage } from '~/server/utils/storage'

// ─── Fixed-role user database ─────────────────────────────────────────────────
// Roles are server-determined — users cannot self-select their role.
// company.id MUST match mockSMEProfiles IDs in utils/mock-data/users.ts:
//   1 = Angkor Tech, 2 = GreenData Farm Solutions, 3 = FinTech Solutions
// investorProfileId MUST match mockInvestorProfiles IDs:
//   1 = Mekong Capital, 2 = Sequoia SEA
const USERS = [
  // ── ADMIN ACCOUNTS ──────────────────────────────────────────────────────────
  { id: 1, name: 'Admin IRIP', email: 'admin@irip.com', password: 'password', role: 'ADMIN', avatar: 'A' },
  { id: 2, name: 'Super Admin', email: 'stsmey@gmail.com', password: 'password', role: 'ADMIN', avatar: 'S' },

  // ── SME ACCOUNTS — company.id links to mock dashboard data ──────────────────
  {
    id: 3, name: 'Sokha Chan', email: 'sokha@angkortech.com', password: 'password', role: 'SME', avatar: 'S',
    company: { id: 1, name: 'Angkor Tech', industry: 'Technology', size: '25 employees', founded: '2020', lastAssessed: 'Dec 19, 2024' }
  },
  {
    id: 4, name: 'Leang Sokha', email: 'founder@greendata.com', password: 'password', role: 'SME', avatar: 'G',
    company: { id: 2, name: 'GreenData Farm Solutions', industry: 'AgriTech', size: '8 employees', founded: '2022', lastAssessed: 'Nov 18, 2024' }
  },
  {
    id: 5, name: 'Vanna Kim', email: 'ceo@fintech-solutions.com', password: 'password', role: 'SME', avatar: 'V',
    company: { id: 3, name: 'FinTech Solutions', industry: 'FinTech', size: '5 employees', founded: '2023', lastAssessed: 'Jan 25, 2024' }
  },
  {
    id: 6, name: 'La', email: 'la@gmail.com', password: 'password', role: 'SME', avatar: 'L',
    company: { id: 1, name: 'Angkor Tech', industry: 'Technology', size: '25 employees', founded: '2020', lastAssessed: 'Dec 19, 2024' }
  },
  {
    id: 7, name: 'Testing (Bunphinim)', email: 'bunphinim@gmail.com', password: 'password', role: 'SME', avatar: 'B',
    company: { id: 2, name: 'GreenData Farm Solutions', industry: 'AgriTech', size: '8 employees', founded: '2022', lastAssessed: 'Nov 18, 2024' }
  },

  // ── INVESTOR ACCOUNTS ────────────────────────────────────────────────────────
  { id: 8, name: 'James Wong', email: 'james@mekongcapital.com', password: 'password', role: 'INVESTOR', avatar: 'J', investorProfileId: 1 },
  { id: 9, name: 'Panha Pay', email: 'paypanha45@gmail.com', password: 'password', role: 'INVESTOR', avatar: 'P', investorProfileId: 1 },
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400))

  // ── Step 1: Check hardcoded users first ───────────────────────────────────
  const hardcodedUser = USERS.find(u => u.email.toLowerCase() === (email || '').toLowerCase())

  if (hardcodedUser) {
    if (hardcodedUser.password !== password) {
      throw createError({ statusCode: 401, statusMessage: 'Invalid email or password.' })
    }
    const { password: _pw, ...safeUser } = hardcodedUser

    setCookie(event, 'irip_auth_user', JSON.stringify(safeUser), { maxAge: 60 * 60 * 24 * 7, path: '/' })
    return { user: safeUser, token: 'mock-jwt-token-' + Date.now() }
  }

  // ── Step 2: Check approved registrations from storage ─────────────────────
  const db = storage.get()
  const registrations = (db.registrations || []) as any[]

  const reg = registrations.find(
    (r: any) => r.email?.toLowerCase() === (email || '').toLowerCase() && r.status === 'approved'
  )

  if (!reg) {
    // Give a more helpful message if pending
    const pending = registrations.find(
      (r: any) => r.email?.toLowerCase() === (email || '').toLowerCase() && r.status === 'pending'
    )
    if (pending) {
      throw createError({ statusCode: 401, statusMessage: 'Your registration is still pending admin approval. Please wait.' })
    }
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password.' })
  }

  // Verify password stored during registration
  if (!reg.password) {
    throw createError({ statusCode: 401, statusMessage: 'No password set for this account. Please contact support.' })
  }
  if (reg.password !== password) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password.' })
  }

  // Build user response from registration data
  const roleUpper = ((reg.role as string) || 'sme').toUpperCase()
  const registeredUser: Record<string, any> = {
    id: reg.id,
    name: reg.name,
    email: reg.email,
    role: roleUpper,
    avatar: (reg.name as string)?.charAt(0)?.toUpperCase() || '?'
  }

  if (roleUpper === 'SME') {
    registeredUser.company = {
      id: reg.id, // Use actual registration ID instead of hardcoded 1
      name: reg.company || reg.name,
      industry: reg.industry || 'General',
      size: reg.employees ? `${reg.employees} employees` : 'N/A',
      founded: reg.years || 'N/A',
      lastAssessed: 'Never'
    }
  } else {
    registeredUser.investorProfileId = 1 // Default investor profile
  }

  console.log(`[Auth] Registered user login: ${reg.name} <${reg.email}> as ${roleUpper}`)

  setCookie(event, 'irip_auth_user', JSON.stringify(registeredUser), { maxAge: 60 * 60 * 24 * 7, path: '/' })
  return { user: registeredUser, token: 'mock-jwt-token-' + Date.now() }
})
