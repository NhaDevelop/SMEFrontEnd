import { ProgramRepository } from './program.repository'
import type { Program, ProgramComment } from './program.types'

export class ProgramService {
  private repository: ProgramRepository

  constructor() {
    this.repository = new ProgramRepository()
  }

  async fetchPrograms(): Promise<Program[]> {
    return this.repository.getPrograms()
  }

  async apply(programId: number): Promise<void> {
    return this.repository.applyToProgram(programId)
  }

  async fetchComments(programId: number): Promise<ProgramComment[]> {
    return this.repository.getComments(programId)
  }

  async addComment(programId: number, content: string): Promise<ProgramComment> {
    return this.repository.postComment(programId, content)
  }

  async removeComment(programId: number, commentId: number): Promise<void> {
    return this.repository.deleteComment(programId, commentId)
  }
}

export const programService = new ProgramService()
