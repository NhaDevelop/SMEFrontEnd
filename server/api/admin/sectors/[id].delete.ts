import { defineEventHandler, getRouterParam } from 'h3'
import { storage } from '~/server/utils/storage'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')

  const data = storage.get()
  const sectors = data.sectors || []
  const idx = sectors.findIndex((s: any) => String(s.id) === String(id))

  if (idx === -1) {
    return { success: false, error: 'Sector not found' }
  }

  sectors.splice(idx, 1)
  storage.save({ sectors })

  return { success: true }
})
