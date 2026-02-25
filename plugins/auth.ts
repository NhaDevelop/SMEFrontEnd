export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()
  
  // Fast server-side / client-side hydration via cookies
  const userCookie = useCookie('irip_auth_user')
  if (userCookie.value) {
    authStore.user = userCookie.value as any
  } else {
    // Attempt standard network restoration fallback
    await authStore.restoreSession()
  }
})
