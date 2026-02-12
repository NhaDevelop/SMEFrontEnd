import { defineEventHandler } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const programs = db.programs.findAll()
  const templates = db.templates.findAll()

  const enrichedPrograms = programs.map(p => {
    const tmpl = templates.find(t => t.id === p.templateId)
    return {
        ...p,
        template: tmpl ? tmpl.name : p.templateId // Polyfill for UI
    }
  })

  const stats = {
    total: programs.length,
    active: programs.filter(p => p.status === 'Active').length,
    enrolled: programs.reduce((sum, p) => sum + p.smesCount, 0),
    avgScore: programs.length ? Math.round(programs.reduce((sum, p) => sum + p.avgScore, 0) / programs.length) : 0
  }

  return {
    stats,
    programs: enrichedPrograms
  }
})
