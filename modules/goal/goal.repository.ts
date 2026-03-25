import { useApi } from '~/composables/useApi'
import type { Goal, GoalCreatePayload, GoalUpdatePayload } from './goal.types'

export class GoalRepository {
  async getGoals(): Promise<Goal[]> {
    const api = useApi()
    return await api<Goal[]>('/sme/goals')
  }

  async getGoal(id: number): Promise<Goal> {
    const api = useApi()
    return await api<Goal>(`/sme/goals/${id}`)
  }

  async createGoal(payload: GoalCreatePayload): Promise<Goal> {
    const api = useApi()
    return await api<Goal>('/sme/goals', {
      method: 'POST',
      body: payload
    })
  }

  async updateGoal(id: number, payload: GoalUpdatePayload): Promise<Goal> {
    const api = useApi()
    return await api<Goal>(`/sme/goals/${id}`, {
      method: 'PATCH',
      body: payload
    })
  }

  async deleteGoal(id: number): Promise<void> {
    const api = useApi()
    await api(`/sme/goals/${id}`, { method: 'DELETE' })
  }
}
