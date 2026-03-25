import { useApi } from '~/composables/useApi'
import type { Program, ProgramComment } from './program.types'

export class ProgramRepository {
  async getPrograms(): Promise<Program[]> {
    const api = useApi()
    return await api<Program[]>('/admin/programs')
  }

  async applyToProgram(programId: number): Promise<void> {
    const api = useApi()
    await api(`/programs/${programId}/apply`, { method: 'POST' })
  }

  async getComments(programId: number): Promise<ProgramComment[]> {
    const api = useApi()
    return await api<ProgramComment[]>(`/programs/${programId}/comments`)
  }

  async postComment(programId: number, content: string): Promise<ProgramComment> {
    const api = useApi()
    return await api<ProgramComment>(`/programs/${programId}/comments`, {
      method: 'POST',
      body: { content }
    })
  }

  async deleteComment(programId: number, commentId: number): Promise<void> {
    const api = useApi()
    await api(`/programs/${programId}/comments/${commentId}`, { method: 'DELETE' })
  }
}
