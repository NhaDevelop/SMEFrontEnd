import { defineEventHandler, getRouterParam } from 'h3'
import { storage } from '~/server/utils/storage'

export default defineEventHandler((event) => {
  const programId = getRouterParam(event, 'id')
  const data = storage.get()
  const comments = (data.program_comments || [])
    .filter((c: any) => String(c.programId) === String(programId))
    .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return comments
})
