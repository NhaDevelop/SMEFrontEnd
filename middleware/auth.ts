import { navigateTo } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth.store'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Check if user is logged in
  if (!authStore.isAuthenticated) {
     return navigateTo('/')
  }
})
