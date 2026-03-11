import { defineEventHandler, getRouterParam, readBody } from 'h3'
import { storage } from '~/server/utils/storage'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const data = storage.get()
  const sectors = data.sectors || []
  const idx = sectors.findIndex((s: any) => String(s.id) === String(id))

  if (idx === -1) {
    return { success: false, error: 'Sector not found' }
  }

  sectors[idx] = {
    ...sectors[idx],
    name: body.name?.trim() || sectors[idx].name,
    color: body.color || sectors[idx].color,
    description: body.description !== undefined ? body.description.trim() : sectors[idx].description,
    updatedAt: new Date().toISOString()
  }

  storage.save({ sectors })
  return { success: true, sector: sectors[idx] }
})
