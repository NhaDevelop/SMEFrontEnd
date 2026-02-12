<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside :class="sidebarClasses" class="bg-[#1a3a3a] text-white flex flex-col transition-all duration-300">
      <!-- Logo & Toggle -->
      <div class="p-4 flex items-center justify-between border-b border-gray-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <ChartBarSquareIcon class="w-6 h-6 text-white" />
          </div>
          <div v-if="!isCollapsed">
            <h1 class="text-lg font-bold text-white tracking-wide">IRIP</h1>
          </div>
        </div>
        <button @click="toggleSidebar"
          class="p-1.5 rounded-lg transition-colors lg:block hidden text-gray-400 hover:text-white hover:bg-gray-700">
          <ChevronLeftIcon v-if="!isCollapsed" class="w-5 h-5" />
          <ChevronRightIcon v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1">
        <template v-for="(item, index) in navItems" :key="index">
          <!-- Header Item -->
          <div v-if="item.header" class="px-4 mt-6 mb-2 first:mt-2">
            <p v-if="!isCollapsed" class="text-xs font-bold text-gray-400 opacity-60 uppercase tracking-wider">{{
              item.header }}</p>
            <div v-else class="h-px bg-white opacity-10 mx-2 mb-2"></div>
          </div>

          <!-- Link Item -->
          <NuxtLink v-else :to="item.path" v-slot="{ isActive }" custom>
            <a @click="navigateTo(item.path)" :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth cursor-pointer group',
              isActive ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            ]">
              <component :is="item.icon"
                :class="['w-5 h-5 flex-shrink-0', isActive ? 'text-white' : 'group-hover:text-white text-gray-400']" />
              <span v-if="!isCollapsed" class="font-medium text-sm">{{ item.label }}</span>
            </a>
          </NuxtLink>
        </template>
      </nav>

      <!-- User Profile -->
      <div class="p-4 border-t border-gray-700">
        <div v-if="user"
          class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-700 transition-smooth cursor-pointer">
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
          class="w-full flex items-center gap-3 px-4 py-3 mt-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-smooth">
          <ArrowRightOnRectangleIcon class="w-5 h-5 flex-shrink-0" />
          <span v-if="!isCollapsed">Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-y-auto">
      <slot />
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import {
  ChartBarSquareIcon,
  ChartPieIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserGroupIcon,
  FolderIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  BoltIcon,
  ListBulletIcon,
  VariableIcon,
  ChartBarIcon, // New
  UsersIcon, // New
  ScaleIcon, // New
  HomeIcon, // New
  BuildingLibraryIcon, // New
  ArrowTrendingUpIcon, // New
  Square3Stack3DIcon, // New
  ChatBubbleLeftRightIcon, // New
} from '@heroicons/vue/24/outline'

export default {
  name: 'DefaultLayout',
  components: {
    ChartBarSquareIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowRightOnRectangleIcon // Registering this icon
  },
  setup() {
    const { user, logout } = useAuth()
    const isCollapsed = ref(false)
    const isInvestor = computed(() => {
      // Only check the user's actual role, not the route
      return user.value?.role === 'investor'
    })

    const isAdmin = computed(() => user.value?.role === 'administrator')

    const navItems = computed(() => {
      if (isInvestor.value) {
        // Investor Navigation (Deep Teal Theme)
        return [
          { header: 'OVERVIEW' },
          {
            path: '/investor/dashboard',
            label: 'Dashboard',
            icon: ChartPieIcon
          },
          { header: 'INVESTOR TOOLS' },
          {
            path: '/investor/portfolio',
            label: 'Portfolio',
            icon: BuildingLibraryIcon
          },
          {
            path: '/investor/analytics',
            label: 'Analytics',
            icon: ArrowTrendingUpIcon
          },
          {
            path: '/programs',
            label: 'Programs',
            icon: Square3Stack3DIcon
          },
          {
            path: '/messages',
            label: 'Messages',
            icon: ChatBubbleLeftRightIcon
          },
          { header: 'REPORTS & ANALYTICS' },
          {
            path: '/investor/reports',
            label: 'Reports',
            icon: DocumentTextIcon
          },
          { header: 'SETTINGS' },
          {
            path: '/settings', // Note: This might need to be investor settings in future
            label: 'Settings',
            icon: Cog6ToothIcon
          }
        ]
      } else if (isAdmin.value) {
        // Admin Navigation
        return [
          { header: 'OVERVIEW' },
          {
            path: '/admin/dashboard',
            label: 'Dashboard',
            icon: ChartPieIcon
          },

          { header: 'USER MANAGEMENT' },
          {
            path: '/users',
            label: 'Users',
            icon: UsersIcon
          },
          {
            path: '/programs',
            label: 'Programs',
            icon: Square3Stack3DIcon
          },

          { header: 'FRAMEWORK' },
          {
            path: '/admin/settings',
            label: 'Framework Settings',
            icon: ShieldCheckIcon
          },
          {
            path: '/templates',
            label: 'Templates',
            icon: DocumentDuplicateIcon
          },
          {
            path: '/questions',
            label: 'Question Builder',
            icon: ListBulletIcon
          },
          {
            path: '/rules',
            label: 'Scoring Rules',
            icon: BoltIcon
          },

          { header: 'REPORTS & ANALYTICS' },
          {
            path: '/admin/reports',
            label: 'Reports',
            icon: DocumentTextIcon
          }
        ]
      } else {
        // SME / Default Navigation
        return [
          { header: 'OVERVIEW' },
          {
            path: '/sme/dashboard',
            label: 'Dashboard',
            icon: HomeIcon
          },
          { header: 'SME TOOLS' },
          {
            path: '/sme/assessment',
            label: 'Assessment',
            icon: ClipboardDocumentCheckIcon
          },
          {
            path: '/sme/history',
            label: 'History',
            icon: ClipboardDocumentListIcon
          },
          {
            path: '/sme/goals',
            label: 'Goals',
            icon: ChartBarIcon
          },
          {
            path: '/sme/what-if',
            label: 'What-If Scenarios',
            icon: BoltIcon
          },
          {
            path: '/sme/documents',
            label: 'Documents',
            icon: FolderIcon
          },
          {
            path: '/messages',
            label: 'Messages',
            icon: ChatBubbleLeftRightIcon
          },
          { header: 'REPORTS & ANALYTICS' },
          {
            path: '/reports',
            label: 'Reports',
            icon: DocumentTextIcon
          },
          { header: 'SETTINGS' },
          {
            path: '/sme/preferences',
            label: 'Preferences',
            icon: Cog6ToothIcon
          }
        ]
      }
    })

    const sidebarClasses = computed(() => {
      return isCollapsed.value ? 'w-20' : 'w-64'
    })

    const sidebarStyle = computed(() => {
      if (isInvestor.value) {
        return { backgroundColor: '#0F2E28', borderColor: '#19433A' }
      }
      return {} // Default to class-based Navy Blue
    })

    const activeItemClass = computed(() => {
      if (isInvestor.value) {
        return 'bg-[#19433A] text-[#33CCCC]'
      }
      return 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
    })

    const inactiveItemClass = computed(() => {
      if (isInvestor.value) {
        return 'text-[rgba(240,245,244,0.7)] hover:bg-[#19433A] hover:text-white'
      }
      return 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
      sidebarStyle,
      activeItemClass,
      inactiveItemClass,
      toggleSidebar,
      handleSignOut,
      ArrowRightOnRectangleIcon,
      isInvestor
    }
  }
}
</script>

<style scoped></style>
