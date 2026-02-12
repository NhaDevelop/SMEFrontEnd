import { defineEventHandler, readBody } from 'h3'

const mockUser = {
  id: 1,
  name: 'Sokha Chan',
  email: 'sokha@angkortech.com',
  avatar: 'S',
  company: {
    id: 1,
    name: 'Angkor Tech',
    industry: 'Technology',
    size: '10-50 employees',
    founded: '2020',
    lastAssessed: 'Aug 3, 2024'
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { role } = body

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    user: { ...mockUser, role },
    token: 'mock-jwt-token-' + Date.now()
  }
})
