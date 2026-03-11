import { defineEventHandler, readBody } from 'h3'
import { storage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)
  const newRole = body.role

  if (!id) {
    throw createError({ statusCode: 400, message: 'User ID is required' })
  }

  if (!newRole) {
    throw createError({ statusCode: 400, message: 'Role is required' })
  }

  const db = storage.get()
  const registrations = (db.registrations || []) as any[]

  // Find the user if they were a registered user
  const userIndex = registrations.findIndex((r: any) => String(r.id) === String(id))

  if (userIndex !== -1) {
    // Update the role
    registrations[userIndex].role = newRole
    storage.save({ ...db, registrations })
    return { success: true, message: `User role updated to ${newRole}`, user: registrations[userIndex] }
  }

  // If not found in registrations, they might be a hardcoded seed user.
  // We can't actually change seed users in this mock, but we return a success response
  // to power the frontend optimistic update.
  return { success: true, message: `User role mock updated to ${newRole}` }
})
