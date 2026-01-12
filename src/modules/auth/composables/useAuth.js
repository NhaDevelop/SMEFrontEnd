import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store'

/**
 * Auth Composable - Reusable authentication logic
 * @returns {Object} Auth helpers and state
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  // Computed properties
  const user = computed(() => authStore.currentUser)
  const isAuthenticated = computed(() => authStore.isLoggedIn)
  const loading = computed(() => authStore.loading)
  const error = computed(() => authStore.error)

  /**
   * Login with role selection
   * @param {string} role - User role
   * @param {string} redirectTo - Route to redirect after login
   */
  const login = async (role, redirectTo = '/dashboard') => {
    try {
      await authStore.login(role)
      router.push(redirectTo)
    } catch (err) {
      console.error('Login failed:', err)
      throw err
    }
  }

  /**
   * Logout and redirect to landing page
   */
  const logout = async () => {
    await authStore.logout()
    router.push('/')
  }

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return authStore.userRole === role
  }

  /**
   * Require authentication - redirect if not authenticated
   */
  const requireAuth = () => {
    if (!isAuthenticated.value) {
      router.push('/')
      return false
    }
    return true
  }

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    
    // Actions
    login,
    logout,
    hasRole,
    requireAuth
  }
}
