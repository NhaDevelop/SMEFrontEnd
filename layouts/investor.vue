<template>
    <div class="h-screen flex bg-gray-50">
        <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar -->
            <aside class="w-64 bg-[#1a3a3a] flex flex-col flex-shrink-0 h-screen sticky top-0 overflow-hidden">
                <!-- Sidebar Header -->
                <div class="p-4 border-b border-gray-700">
                    <div class="flex flex-col items-center justify-center gap-2">
                        <img src="/logo.png" alt="CAM INVESTMENT"
                            class="h-16 w-16 object-cover rounded-full shadow-lg" />
                        <p class="text-gray-400 text-xs tracking-widest uppercase">Investor Account</p>
                    </div>
                </div>

                <nav class="flex-1 px-3 py-3 space-y-4 overflow-hidden">
                    <!-- Overview -->
                    <div>
                        <p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Overview</p>
                        <NuxtLink to="/investor"
                            class="flex items-center px-3 py-1.5 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors text-sm">
                            <Squares2X2Icon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Dashboard
                        </NuxtLink>
                    </div>

                    <!-- Investor Tools -->
                    <div>
                        <p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Investor Tools
                        </p>
                        <NuxtLink to="/investor/portfolio"
                            class="flex items-center px-3 py-1.5 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors text-sm">
                            <BriefcaseIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Portfolio
                        </NuxtLink>
                        <NuxtLink to="/investor/analytics"
                            class="flex items-center px-3 py-1.5 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors text-sm">
                            <ChartBarIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Analytics
                        </NuxtLink>
                        <NuxtLink to="/investor/opportunities"
                            class="flex items-center px-3 py-1.5 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors text-sm">
                            <FolderIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Programs
                        </NuxtLink>
                        <NuxtLink to="/investor/messages"
                            class="flex items-center px-3 py-1.5 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors text-sm">
                            <ChatBubbleLeftRightIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Messages
                        </NuxtLink>
                    </div>

                    <!-- Reports & Analytics -->
                    <div>
                        <p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Reports &
                            Analytics</p>
                        <NuxtLink to="/investor/reports"
                            class="flex items-center px-3 py-1.5 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors text-sm">
                            <DocumentTextIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Reports
                        </NuxtLink>
                    </div>

                    <!-- Settings -->
                    <div>
                        <p class="px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Settings</p>
                        <NuxtLink to="/investor/settings"
                            class="flex items-center px-3 py-1.5 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors text-sm">
                            <Cog6ToothIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Settings
                        </NuxtLink>
                    </div>
                </nav>

                <!-- User Profile Section -->
                <div class="px-3 py-3 border-t border-gray-700">
                    <div class="flex items-center gap-3 mb-2">
                        <div
                            class="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
                            {{ (user?.full_name || user?.name || 'S').charAt(0).toUpperCase() }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-white truncate">{{ user?.full_name || user?.name || 'Sokha Chan' }}</p>
                            <p class="text-xs text-gray-400 uppercase">{{ user?.role || 'INVESTOR' }}</p>
                        </div>
                    </div>
                    <button @click="logout"
                        class="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors text-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 overflow-auto">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store'
import {
    Squares2X2Icon,
    BriefcaseIcon,
    ChartBarIcon,
    FolderIcon,
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    Cog6ToothIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const { ask } = useConfirm()

const logout = async () => {
    const confirmed = await ask({
        title: 'Confirm Logout',
        message: 'Are you sure you want to sign out of your account?',
        confirmText: 'Sign Out',
        type: 'warning'
    })

    if (confirmed) {
        await authStore.logout()
    }
}
</script>
