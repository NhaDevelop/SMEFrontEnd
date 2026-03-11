<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside :class="sidebarClasses" class="bg-navy-900 text-white flex flex-col transition-all duration-300">
      <!-- Logo & Toggle -->
      <div class="p-4 flex items-center justify-between border-b border-navy-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <ChartBarSquareIcon class="w-6 h-6 text-white" />
          </div>
          <div v-if="!isCollapsed">
            <h1 class="text-lg font-bold">IRIP</h1>
          </div>
        </div>
        <button @click="toggleSidebar" class="p-1.5 hover:bg-navy-800 rounded-lg transition-colors lg:block hidden">
          <ChevronLeftIcon v-if="!isCollapsed" class="w-5 h-5" />
          <ChevronRightIcon v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" v-slot="{ isActive }" custom>
          <a @click="$router.push(item.path)" :class="[
            'flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth cursor-pointer',
            isActive
              ? 'bg-cyan-500 text-white'
              : 'text-gray-300 hover:bg-navy-800 hover:text-white'
          ]">
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!isCollapsed" class="font-medium">{{ item.label }}</span>
          </a>
        </router-link>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-navy-800">
        <div v-if="user"
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-navy-800 transition-smooth cursor-pointer">
          <div class="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-sm font-semibold">{{ user.avatar }}</span>
          </div>
          <div v-if="!isCollapsed" class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ user.name }}</p>
            <p class="text-xs text-gray-400 truncate">{{ user.role }}</p>
          </div>
        </div>

        <!-- Sign Out -->
        <button @click="handleSignOut"
          class="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-gray-300 hover:bg-navy-800 hover:text-white transition-smooth">
          <ArrowRightOnRectangleIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed">Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <slot />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuth } from '@/modules/auth/composables/useAuth'
import {
  ChartBarSquareIcon,
  ChartPieIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'MainLayout',
  components: {
    ChartBarSquareIcon,
    ChevronLeftIcon,
    ChevronRightIcon
  },
  setup() {
    const { user, logout } = useAuth()
    const isCollapsed = ref(false)

    const navItems = [
      {
        path: '/dashboard',
        label: 'Dashboard',
        icon: ChartPieIcon
      },
      {
        path: '/assessment',
        label: 'Assessment',
        icon: ClipboardDocumentCheckIcon
      },
      {
        path: '/reports',
        label: 'Reports',
        icon: DocumentTextIcon
      },
      {
        path: '/settings',
        label: 'Settings',
        icon: Cog6ToothIcon
      }
    ]

    const sidebarClasses = computed(() => {
      return isCollapsed.value ? 'w-20' : 'w-64'
    })

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value
    }

    const handleSignOut = () => {
      logout()
    }

    return {
      isCollapsed,
      navItems,
      user,
      sidebarClasses,
      toggleSidebar,
      handleSignOut,
      ArrowRightOnRectangleIcon
    }
  }
}
</script>
