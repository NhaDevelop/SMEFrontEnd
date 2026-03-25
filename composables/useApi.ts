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
    onResponse({ response }) {
      // Centrally handle the new backend response structure where data is wrapped in a 'data' property
      // BUT, do not unwrap if it looks like a paginated response (has total or current_page)
      // as the store needs that metadata for pagination to work.
      const isPaginated = response._data && typeof response._data === 'object' && 
                         ('current_page' in response._data || 'total' in response._data);

      const hasDataWrapper = response._data && typeof response._data === 'object' && 
                            'success' in response._data && 'data' in response._data;

      if (hasDataWrapper && !isPaginated) {
        response._data = response._data.data
      }
    },
    onResponseError({ response, options }) {
      // Log the error for easier debugging
      console.error(`[API Error] ${response.status} ${response.url}`, {
        data: response._data,
        method: options.method,
        headers: options.headers
      })
      
      if (response.status === 401 && !response.url.includes('/auth/login')) {
         console.warn('-- Unauthorized access detected on protected route. Clearing token might be needed if it expired.')
         // Clear tokens
         const cookie = useCookie('irip_access_token')
         cookie.value = null
         if (typeof localStorage !== 'undefined') {
           localStorage.removeItem('irip_access_token')
           localStorage.removeItem('irip_user_data')
         }
         
         // Redirect to login if running in client
         if (process.client) {
            window.location.href = '/login'
         }
      }
    }
  })
}
