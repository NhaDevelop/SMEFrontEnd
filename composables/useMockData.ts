// Composable to use mock data with easy API migration path
import { getSMEData, getInvestorData, filterSMEs, getProgramData, getUserNotifications } from '~/utils/mock-data'

/**
 * Composable for SME Dashboard Data
 * Currently uses mock data, but structured to easily swap to API calls
 */
export function useSMEDashboard(smeId: number) {
  const data = ref(getSMEData(smeId))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const refresh = async () => {
    loading.value = true
    error.value = null
    
    try {
      // TODO: Replace with API call
      // const response = await $fetch(`/api/sme/${smeId}/dashboard`)
      // data.value = response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      data.value = getSMEData(smeId)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    refresh
  }
}

/**
 * Composable for Investor Dashboard Data
 */
export function useInvestorDashboard(investorId: number) {
  const data = ref(getInvestorData(investorId))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const refresh = async () => {
    loading.value = true
    error.value = null
    
    try {
      // TODO: Replace with API call
      // const response = await $fetch(`/api/investor/${investorId}/dashboard`)
      // data.value = response
      
      await new Promise(resolve => setTimeout(resolve, 300))
      data.value = getInvestorData(investorId)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  const searchSMEs = async (filters: any) => {
    loading.value = true
    try {
      // TODO: Replace with API call
      // const response = await $fetch('/api/sme/search', { query: filters })
      // return response
      
      await new Promise(resolve => setTimeout(resolve, 300))
      return filterSMEs(filters)
    } catch (e: any) {
      error.value = e.message
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    refresh,
    searchSMEs
  }
}

/**
 * Composable for Program Data
 */
export function useProgramData(programId: number) {
  const data = ref(getProgramData(programId))
  const loading = ref(false)
  const error = ref<string | null>(null)

  const refresh = async () => {
    loading.value = true
    error.value = null
    
    try {
      // TODO: Replace with API call
      // const response = await $fetch(`/api/programs/${programId}`)
      // data.value = response
      
      await new Promise(resolve => setTimeout(resolve, 300))
      data.value = getProgramData(programId)
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    refresh
  }
}

/**
 * Composable for User Notifications
 */
export function useNotifications(userId: number) {
  const notifications = ref(getUserNotifications(userId))
  const unreadCount = computed(() => notifications.value.filter(n => !n.is_read).length)
  const loading = ref(false)

  const refresh = async () => {
    loading.value = true
    try {
      // TODO: Replace with API call
      // const response = await $fetch(`/api/users/${userId}/notifications`)
      // notifications.value = response
      
      await new Promise(resolve => setTimeout(resolve, 200))
      notifications.value = getUserNotifications(userId)
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (notificationId: number) => {
    // TODO: Replace with API call
    // await $fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' })
    
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.is_read = true
    }
  }

  return {
    notifications: computed(() => notifications.value),
    unreadCount,
    loading: computed(() => loading.value),
    refresh,
    markAsRead
  }
}
