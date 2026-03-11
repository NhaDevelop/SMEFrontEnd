import { defineEventHandler } from 'h3'
import { storage } from '~/server/utils/storage'

const DEFAULT_SECTORS = [
  { id: 1, name: 'Agriculture', color: '#16a34a', description: 'Farming, agribusiness, and food production', createdAt: new Date().toISOString() },
  { id: 2, name: 'Technology', color: '#2563eb', description: 'Software, hardware, and digital services', createdAt: new Date().toISOString() },
  { id: 3, name: 'Manufacturing', color: '#9333ea', description: 'Industrial production and goods manufacturing', createdAt: new Date().toISOString() },
  { id: 4, name: 'Finance & Banking', color: '#0891b2', description: 'Financial services, banking, and insurance', createdAt: new Date().toISOString() },
  { id: 5, name: 'Healthcare', color: '#e11d48', description: 'Medical services, pharma, and health tech', createdAt: new Date().toISOString() },
  { id: 6, name: 'Retail & Commerce', color: '#ea580c', description: 'Consumer goods, e-commerce, and trade', createdAt: new Date().toISOString() },
  { id: 7, name: 'Education', color: '#d97706', description: 'Schools, training, and EdTech', createdAt: new Date().toISOString() },
  { id: 8, name: 'Energy', color: '#059669', description: 'Oil, gas, renewables, and utilities', createdAt: new Date().toISOString() },
]

export default defineEventHandler((event) => {
  const data = storage.get()
  let sectors = data.sectors || []

  // Seed defaults if empty
  if (sectors.length === 0) {
    sectors = DEFAULT_SECTORS
    storage.save({ sectors })
  }

  return sectors.sort((a: any, b: any) => a.name.localeCompare(b.name))
})
