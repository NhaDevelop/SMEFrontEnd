export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()
  
  // Restore session from cookies on app initialization
  await authStore.restoreSession()
})
