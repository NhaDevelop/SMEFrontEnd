export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore()
  
  // Fast server-side / client-side hydration via cookies
  // Fast server-side / client-side hydration via cookies
  const token = useCookie('irip_access_token')
  if (token.value) {
    // We have a token, fetch the user profile from Laravel to hydrate the store
    await authStore.fetchUser()
  }
})
