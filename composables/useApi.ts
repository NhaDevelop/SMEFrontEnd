export const useApi = () => {
  const config = useRuntimeConfig()
  
  return $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }: any) {
      // Ensure headers exist
      options.headers = options.headers || {}
      
      // Use a consistent way to set headers that works with both plain objects and Headers objects
      const setHeader = (name: string, value: string) => {
        if (options.headers instanceof Headers) {
          options.headers.set(name, value)
        } else {
          options.headers[name] = value
        }
      }

      setHeader('Accept', 'application/json')
      
      // Inject Authorization token if it exists
      const token = useCookie('irip_access_token').value || (typeof localStorage !== 'undefined' ? localStorage.getItem('irip_access_token') : null)
      
      if (token) {
        setHeader('Authorization', `Bearer ${token}`)
      } else {
        console.warn(`[useApi] No token found for request: ${options.url}`)
      }
    },
    onResponse({ response, options }) {
      // Centrally handle the new backend response structure where data is wrapped in a 'data' property
      // BUT, do not unwrap if it looks like a paginated response (has total or current_page)
      // as the store needs that metadata for pagination to work.
      const isPaginated = response._data && typeof response._data === 'object' && 
                         ('current_page' in response._data || 'total' in response._data);

      const hasDataWrapper = response._data && typeof response._data === 'object' && 
                            'success' in response._data && 'data' in response._data;

      // ----- GLOBAL TOAST INJECTION (SUCCESS) -----
      // Only auto-toast on POST, PUT, DELETE, PATCH to prevent spam on every GET page load
      if (
        process.client && 
        response._data?.message && 
        response._data?.success === true &&
        options.method && options.method.toUpperCase() !== 'GET'
      ) {
        const { success } = useToast()
        success(response._data.message)
      }

      if (hasDataWrapper && !isPaginated) {
        response._data = response._data.data
      }
    },
    onResponseError({ response, options, request }) {
      const reqUrl = request?.toString() || response.url || ''

      // ----- GLOBAL TOAST INJECTION (ERRORS) -----
      if (process.client && (options as any).ignoreErrors !== true) {
        const { error } = useToast()
        const errMsg = response._data?.message
          || response._data?.error
          || 'An unexpected error occurred. Please try again.'

        // Don't toast 401 — we redirect instead (handled below)
        if (response.status !== 401) {
          error(errMsg)
        }
      }

      // Log for debugging
      console.error(`[API Error] ${response.status} ${reqUrl}`, {
        data: response._data,
        method: options.method,
        headers: options.headers,
      })

      // Handle session expiry
      if (response.status === 401 && !reqUrl.includes('/auth/login')) {
        console.warn('[useApi] Unauthorized — clearing session and redirecting to login.')
        const cookie = useCookie('irip_access_token')
        cookie.value = null
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('irip_access_token')
          localStorage.removeItem('irip_user_data')
        }
        if (process.client) {
          window.location.href = '/login'
        }
      }
    }
  })
}
