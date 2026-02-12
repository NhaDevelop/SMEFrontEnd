<template>
    <div class="h-screen flex bg-gray-50">
        <div class="flex flex-1 overflow-hidden">
            <!-- Sidebar -->
            <aside class="w-64 bg-[#1a3a3a] flex flex-col flex-shrink-0">
                <!-- Sidebar Header -->
                <div class="p-6 border-b border-gray-700">
                    <div class="flex items-center gap-3">
                        <div class="bg-teal-500 text-white p-2 rounded-lg">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                            </svg>
                        </div>
                        <div>
                            <h2 class="text-white font-bold text-lg">IRIP</h2>
                            <p class="text-gray-400 text-xs">Admin Portal</p>
                        </div>
                    </div>
                </div>

                <nav class="flex-1 p-4 space-y-6 overflow-y-auto">
                    <!-- Overview -->
                    <div>
                        <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Overview</p>
                        <NuxtLink to="/admin"
                            class="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors">
                            <Squares2X2Icon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Dashboard
                        </NuxtLink>
                    </div>

                    <!-- User Management -->
                    <div>
                        <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">User
                            Management</p>
                        <NuxtLink to="/admin/users"
                            class="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors">
                            <UsersIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Users
                        </NuxtLink>
                        <NuxtLink to="/admin/programs"
                            class="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors">
                            <FolderIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Programs
                        </NuxtLink>
                    </div>

                    <!-- Framework -->
                    <div>
                        <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Framework</p>
                        <NuxtLink to="/admin/settings"
                            class="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors">
                            <Cog6ToothIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Framework Settings
                        </NuxtLink>
                        <NuxtLink to="/admin/templates"
                            class="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors">
                            <DocumentDuplicateIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Templates
                        </NuxtLink>
                        <NuxtLink to="/admin/questions"
                            class="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors">
                            <QuestionMarkCircleIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Question Builder
                        </NuxtLink>
                        <NuxtLink to="/admin/rules"
                            class="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors">
                            <BoltIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Scoring Rules
                        </NuxtLink>
                        <NuxtLink to="/admin/custom-fields"
                            class="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors">
                            <QueueListIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Custom Fields
                        </NuxtLink>
                    </div>

                    <!-- Reports -->
                    <div>
                        <p class="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Reports &
                            Analytics</p>
                        <NuxtLink to="/admin/reports"
                            class="flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 group transition-colors">
                            <ChartBarIcon class="w-5 h-5 mr-3 text-gray-400 group-hover:text-teal-400" />
                            Reports
                        </NuxtLink>
                    </div>
                </nav>

                <!-- User Profile Section -->
                <div class="p-4 border-t border-gray-700">
                    <div class="flex items-center gap-3 mb-3">
                        <div
                            class="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
                            {{ user?.name?.charAt(0) || 'A' }}
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-white truncate">{{ user?.name || 'Admin' }}</p>
                            <p class="text-xs text-gray-400 uppercase">{{ user?.role || 'ADMIN' }}</p>
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
    UsersIcon,
    FolderIcon,
    Cog6ToothIcon,
    DocumentDuplicateIcon,
    QuestionMarkCircleIcon,
    BoltIcon,
    ChartBarIcon,
    QueueListIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const logout = async () => {
    await authStore.logout()
}
</script>
