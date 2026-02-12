export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  console.log('SME Middleware Check:', { 
    isAuthenticated: auth.isAuthenticated, 
    role: auth.role,
    user: auth.user 
  })

  if (!auth.isAuthenticated) {
    console.log('SME Middleware: Not authenticated')
    return navigateTo('/')
  }

  const role = auth.role ? auth.role.trim() : ''
  if (role !== 'SME') {
    return navigateTo('/')
  }
})
