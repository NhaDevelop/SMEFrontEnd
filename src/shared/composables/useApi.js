import { ref } from 'vue'

/**
 * Composable for handling API requests with loading and error states
 * @returns {Object} { loading, error, request }
 */
export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Execute an API request with automatic loading and error handling
   * @param {Function} apiCall - The API function to call
   * @returns {Promise} The API response data
   */
  const request = async (apiCall) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiCall()
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'An error occurred'
      console.error('API Error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    request
  }
}
