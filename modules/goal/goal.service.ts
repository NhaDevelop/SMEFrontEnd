import { GoalRepository } from './goal.repository'
import type { Goal, GoalCreatePayload, GoalUpdatePayload } from './goal.types'

export class GoalService {
  private repository: GoalRepository

  constructor() {
    this.repository = new GoalRepository()
  }

  async fetchGoals(): Promise<Goal[]> {
    return this.repository.getGoals()
  }

  async getById(id: number): Promise<Goal> {
    return this.repository.getGoal(id)
  }

  async create(payload: GoalCreatePayload): Promise<Goal> {
    return this.repository.createGoal(payload)
  }

  async update(id: number, payload: GoalUpdatePayload): Promise<Goal> {
    return this.repository.updateGoal(id, payload)
  }

  async delete(id: number): Promise<void> {
    return this.repository.deleteGoal(id)
  }
}

export const goalService = new GoalService()
