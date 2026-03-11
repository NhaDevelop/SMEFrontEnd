import { defineEventHandler, readBody } from 'h3'
import { storage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.name?.trim()) {
    return { success: false, error: 'Sector name is required' }
  }

  const data = storage.get()
  const sectors = data.sectors || []

  const exists = sectors.some((s: any) => s.name.toLowerCase() === body.name.trim().toLowerCase())
  if (exists) {
    return { success: false, error: 'A sector with this name already exists' }
  }

  const newSector = {
    id: Date.now(),
    name: body.name.trim(),
    color: body.color || '#6b7280',
    description: body.description?.trim() || '',
    createdAt: new Date().toISOString()
  }

  sectors.push(newSector)
  storage.save({ sectors })

  return { success: true, sector: newSector }
})
