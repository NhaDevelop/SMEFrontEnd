import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Restore auth session from localStorage
import { useAuthStore } from '@/modules/auth/store'
const authStore = useAuthStore(pinia)
authStore.restoreSession()

app.mount('#app')
