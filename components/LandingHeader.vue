<template>
    <header
        class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b bg-white/90 backdrop-blur-md border-gray-100 py-4 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center">
                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center gap-2 cursor-pointer group">
                    <img src="/logo.png" alt="CAM INVESTMENT"
                        class="h-24 w-24 object-cover rounded-full shadow-lg shadow-teal-600/20 group-hover:rotate-6 transition-all duration-300" />
                </NuxtLink>

                <nav
                    class="hidden md:flex items-center gap-8 text-[13px] font-medium text-gray-500 uppercase tracking-wider">
                    <NuxtLink to="/" class="hover:text-teal-600 transition-colors" exact-active-class="text-teal-600">
                        Home</NuxtLink>
                    <NuxtLink to="/programs" class="hover:text-teal-600 transition-colors" active-class="text-teal-600">
                        Programs</NuxtLink>
                    <NuxtLink to="/landing/sme" class="hover:text-teal-600 transition-colors"
                        active-class="text-teal-600">For SMEs</NuxtLink>
                    <NuxtLink to="/landing/investor" class="hover:text-teal-600 transition-colors"
                        active-class="text-teal-600">For Investors</NuxtLink>
                    <NuxtLink to="/contact" class="hover:text-teal-600 transition-colors" active-class="text-teal-600">
                        Contact</NuxtLink>
                </nav>

                <!-- Auth Buttons -->
                <div class="flex items-center gap-5">
                    <template v-if="auth.isAuthenticated.value">
                        <!-- User Profile Dropdown -->
                        <div class="relative">
                            <button @click="showDropdown = !showDropdown" @blur="closeDropdownDelayed"
                                class="flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-colors focus:outline-none">
                                <div
                                    class="w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center text-white text-[11px] font-bold">
                                    {{ auth.user.value?.avatar || 'You' }}
                                </div>
                                <span
                                    class="hidden sm:block text-[13px] font-medium text-gray-700 truncate max-w-[120px]">{{
                                        auth.user.value?.name || 'User' }}</span>
                                <ChevronDownIcon class="w-4 h-4 text-gray-400" />
                            </button>

                            <!-- Dropdown Menu -->
                            <transition enter-active-class="transition duration-200 ease-out"
                                enter-from-class="transform scale-95 opacity-0"
                                enter-to-class="transform scale-100 opacity-100"
                                leave-active-class="transition duration-75 ease-in"
                                leave-from-class="transform scale-100 opacity-100"
                                leave-to-class="transform scale-95 opacity-0">
                                <div v-if="showDropdown"
                                    class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                    <div class="px-4 py-2 border-b border-gray-50 mb-1">
                                        <div class="text-sm font-semibold text-gray-900 truncate">{{
                                            auth.user.value?.name }}</div>
                                        <div class="text-xs text-gray-500 truncate">{{ auth.user.value?.email }}</div>
                                    </div>
                                    <button @click="goToDashboard"
                                        class="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors text-left">
                                        <ChartBarSquareIcon class="w-4 h-4" />
                                        Dashboard
                                    </button>
                                    <button @click="handleLogout"
                                        class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                                        <ArrowRightOnRectangleIcon class="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </transition>
                        </div>

                        <!-- Explicit Dashboard Action -->
                        <button @click="goToDashboard"
                            class="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-[13px] font-semibold tracking-wide rounded-lg transition-all shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 active:scale-95 flex items-center gap-2">
                            Dashboard
                            <ArrowRightIcon class="w-4 h-4" />
                        </button>
                    </template>
                    <template v-else>
                        <NuxtLink :to="{ path: '/login', query: { redirect: route.fullPath } }"
                            class="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-[13px] font-semibold tracking-wide uppercase rounded-lg transition-all shadow-lg shadow-teal-600/20 active:scale-95">
                            Log In
                        </NuxtLink>
                    </template>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
    ChartBarIcon, ArrowRightIcon, ChevronDownIcon,
    ArrowRightOnRectangleIcon, ChartBarSquareIcon
} from '@heroicons/vue/24/outline'

const auth = useAuth()
const route = useRoute()
const { ask } = useConfirm()

const dashboardRoute = computed(() => {
    const role = auth.user?.value?.role?.toUpperCase()
    if (role === 'ADMIN' || role === 'ADMINISTRATOR') return '/admin/dashboard'
    if (role === 'INVESTOR') return '/investor/dashboard'
    return '/sme/dashboard'
})

const showDropdown = ref(false)

const closeDropdownDelayed = () => {
    setTimeout(() => { showDropdown.value = false }, 200)
}

const router = useRouter()
const goToDashboard = () => {
    showDropdown.value = false
    router.push(dashboardRoute.value)
}

const handleLogout = async () => {
    showDropdown.value = false
    const confirmed = await ask({
        title: 'Confirm Logout',
        message: 'Are you sure you want to sign out?',
        confirmText: 'Sign Out',
        type: 'warning'
    })

    if (confirmed) {
        await auth.logout()
    }
}
</script>
