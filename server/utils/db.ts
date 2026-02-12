
// Simple in-memory mock database
const templates = [
  { id: 1, name: 'ESG Assessment' },
  { id: 2, name: 'Digital Maturity' },
  { id: 3, name: 'Financial Health' }
]

const programs = [
  {
    id: 1,
    name: 'SME Digitization Initiative',
    description: 'Helping SMEs adopt digital tools',
    templateId: 2,
    status: 'Active',
    smesCount: 17, // Matches client store data
    avgScore: 75,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    progress: 45
  },
  {
    id: 2,
    name: 'Green Business Program',
    description: 'Sustainability for small businesses',
    templateId: 1,
    status: 'Draft',
    smesCount: 5, // Matches client store data
    avgScore: 0,
    startDate: '2024-06-01',
    endDate: '2024-12-31',
    progress: 0
  }
]

export const db = {
  templates: {
    findAll: () => templates,
    findById: (id: number) => templates.find(t => t.id === id)
  },
  programs: {
    findAll: () => programs,
    findById: (id: number) => programs.find(p => p.id === id),
    create: (data: any) => {
      const newProgram = {
        id: programs.length + 1,
        ...data,
        smesCount: data.smesCount || 0,
        avgScore: data.avgScore || 0,
        progress: data.progress || 0
      }
      programs.push(newProgram)
      return newProgram
    },
    update: (id: number, data: any) => {
        const index = programs.findIndex(p => p.id === id)
        if (index !== -1) {
            programs[index] = { ...programs[index], ...data }
            return programs[index]
        }
        return null
    },
    delete: (id: number) => {
        const index = programs.findIndex(p => p.id === id)
        if (index !== -1) {
            programs.splice(index, 1)
            return true
        }
        return false
    }
  }
}
