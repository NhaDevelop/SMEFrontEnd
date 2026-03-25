/**
 * useGoals — ViewModel composable for the Goals feature.
 *
 * MVVM Layer: View (used by pages & components)
 * Dependencies: goalService (Model layer) — NO direct useApi() calls.
 *
 * Replaces the business-logic code that was embedded in pages/sme/goals.vue.
 */
import { ref, computed } from 'vue'
import { goalService } from '~/modules/goal/goal.service'
import type { Goal, GoalCreatePayload, GoalUpdatePayload } from '~/modules/goal/goal.types'

// ─── Status normalisation ────────────────────────────────────────────────────
const ACTIVE_STATUSES = ['Active', 'ACTIVE', 'Paused', 'PAUSED', 'Not Started']
const ACHIEVED_STATUSES = ['Achieved', 'COMPLETED']

export const useGoals = () => {
  // ── State ──────────────────────────────────────────────────────────────────
  const goals = ref<Goal[]>([])
  const selectedGoal = ref<Goal | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filter state
  const activeFilter = ref('Active (0)')
  const activeCreatorFilter = ref('All Goals')
  const creatorFilterOptions = ['All Goals', 'Assigned by Investor', 'Self-Created']

  // Modal state
  const showCreateGoalModal = ref(false)
  const showProofModal = ref(false)
  const goalIdToComplete = ref<number | string>('')

  // ── CRUD Actions ───────────────────────────────────────────────────────────
  const fetchGoals = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await goalService.fetchGoals()
      goals.value = data as unknown as Goal[]
      // Auto-select first goal if none is selected
      if (goals.value.length > 0 && !selectedGoal.value) {
        selectedGoal.value = goals.value[0] ?? null
      }
      _updateFilterCounts()
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch goals'
      console.error('[useGoals] fetchGoals error:', e)
    } finally {
      loading.value = false
    }
  }

  const createGoal = async (payload: GoalCreatePayload) => {
    loading.value = true
    error.value = null
    try {
      await goalService.create(payload)
      await fetchGoals()
      showCreateGoalModal.value = false
    } catch (e: any) {
      error.value = e.message || 'Failed to create goal'
      console.error('[useGoals] createGoal error:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateGoal = async (id: number, payload: GoalUpdatePayload) => {
    loading.value = true
    error.value = null
    try {
      await goalService.update(id, payload)
      await fetchGoals()
      // Re-select the updated goal
      const updated = goals.value.find(g => g.id === id)
      if (updated) selectedGoal.value = updated
    } catch (e: any) {
      error.value = e.message || 'Failed to update goal'
      console.error('[useGoals] updateGoal error:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const deleteGoal = async (id: number) => {
    if (!confirm('Are you sure you want to delete this goal? This action cannot be undone.')) return
    loading.value = true
    error.value = null
    try {
      await goalService.delete(id)
      await fetchGoals()
      if (selectedGoal.value?.id === id) {
        selectedGoal.value = goals.value[0] ?? null
      }
    } catch (e: any) {
      error.value = e.message || 'Failed to delete goal'
      console.error('[useGoals] deleteGoal error:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  const pauseGoal = async (id: number, currentStatus: string) => {
    const newStatus: GoalUpdatePayload['status'] = currentStatus === 'Paused' ? 'Active' : 'Paused'
    await updateGoal(id, { status: newStatus })
  }

  const markAsAchieved = async (payload: { id: number; proofNote: string; proofDocument: string }) => {
    await updateGoal(payload.id, {
      status: 'Achieved',
      proof_note: payload.proofNote,
      proof_document: payload.proofDocument
    } as any)
    showProofModal.value = false
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  const openProofModal = (id: number) => {
    goalIdToComplete.value = id
    showProofModal.value = true
  }

  const _updateFilterCounts = () => {
    const active = goals.value.filter(g => ACTIVE_STATUSES.includes(g.status)).length
    const achieved = goals.value.filter(g => ACHIEVED_STATUSES.includes(g.status)).length
    const prevTab = activeFilter.value.startsWith('Active') ? 'Active' : 'Achieved'
    activeFilter.value = prevTab === 'Active' ? `Active (${active})` : `Achieved (${achieved})`
    // Keep the other tab label updated in the filters array
    _statusFilterTabs.value = [`Active (${active})`, `Achieved (${achieved})`]
  }

  const _statusFilterTabs = ref(['Active (0)', 'Achieved (0)'])

  // ── Computed (Derived View State) ──────────────────────────────────────────
  const filteredGoals = computed(() => {
    let result = goals.value

    // Status filter
    if (activeFilter.value.startsWith('Active')) {
      result = result.filter(g => ACTIVE_STATUSES.includes(g.status))
    } else if (activeFilter.value.startsWith('Achieved')) {
      result = result.filter(g => ACHIEVED_STATUSES.includes(g.status))
    }

    // Creator filter
    if (activeCreatorFilter.value === 'Assigned by Investor') {
      result = result.filter(g => (g as any).created_by_role === 'investor')
    } else if (activeCreatorFilter.value === 'Self-Created') {
      result = result.filter(g => (g as any).created_by_role === 'sme' || !(g as any).created_by_role)
    }

    return result
  })

  const avgProgress = computed(() => {
    if (goals.value.length === 0) return 0
    const sum = goals.value.reduce((acc, g) => acc + ((g as any).progress || 0), 0)
    return Math.round(sum / goals.value.length)
  })

  const radarData = computed(() => {
    const goal = selectedGoal.value as any
    if (!goal?.pillars?.length) return null
    return {
      labels: goal.pillars.map((p: any) => p.name),
      datasets: [
        {
          label: 'Current',
          data: goal.pillars.map((p: any) => p.score),
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderColor: '#3B82F6',
          pointBackgroundColor: '#3B82F6',
          pointBorderColor: '#fff',
        },
        {
          label: 'Target',
          data: goal.pillars.map((p: any) => p.target),
          backgroundColor: 'transparent',
          borderColor: '#10B981',
          pointBackgroundColor: '#10B981',
          borderDash: [5, 5],
        },
      ],
    }
  })

  return {
    // State
    goals,
    selectedGoal,
    loading,
    error,
    activeFilter,
    activeCreatorFilter,
    creatorFilterOptions,
    statusFilterTabs: _statusFilterTabs,
    showCreateGoalModal,
    showProofModal,
    goalIdToComplete,
    // Computed
    filteredGoals,
    avgProgress,
    radarData,
    // Actions
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    pauseGoal,
    markAsAchieved,
    openProofModal,
  }
}
