import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/modules/auth/pages/LandingPage.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/modules/dashboard/pages/DashboardPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/assessment',
      name: 'assessment',
      component: () => import('@/modules/assessment/pages/AssessmentPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/modules/reports/pages/ReportsPage.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/modules/settings/pages/SettingsPage.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router

