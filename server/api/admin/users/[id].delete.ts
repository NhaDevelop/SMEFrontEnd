import { defineEventHandler } from 'h3'
import { storage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({ statusCode: 400, message: 'User ID is required' })
  }

  const db = storage.get()
  let registrations = (db.registrations || []) as any[]

  const originalLength = registrations.length
  registrations = registrations.filter((r: any) => String(r.id) !== String(id))

  if (registrations.length < originalLength) {
    storage.save({ ...db, registrations })
    return { success: true, message: 'User access revoked' }
  }

  return { success: true, message: 'User removed from mock system' }
})
