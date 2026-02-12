export default defineNuxtRouteMiddleware((to, from) => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated) {
    return navigateTo('/')
  }

  if (auth.role !== 'INVESTOR') {
    return navigateTo('/')
  }
})
