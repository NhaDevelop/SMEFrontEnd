<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside :class="[sidebarClasses, 'h-screen sticky top-0 overflow-hidden']" class="bg-[#1a3a3a] text-white flex flex-col transition-all duration-300">
      <!-- Logo & Toggle -->
      <div class="p-4 border-b border-gray-700 relative">
        <div class="flex flex-col items-center justify-center gap-2">
          <img src="/logo.png" alt="CAM INVESTMENT" :class="isCollapsed ? 'h-10 w-10' : 'h-16 w-16'"
            class="object-cover rounded-full shadow-lg transition-all duration-300 flex-shrink-0" />
            <p v-if="!isCollapsed" class="text-gray-400 text-xs tracking-widest uppercase mt-1">{{ isInvestor ? 'Investor Portal' : (isAdmin ? 'Admin Portal' : 'SME Portal') }}</p>
        </div>
        <button @click="toggleSidebar"
          class="absolute top-4 right-4 p-1.5 rounded-md transition-colors lg:block hidden text-gray-400 hover:text-white hover:bg-gray-700">
          <ChevronLeftIcon v-if="!isCollapsed" class="w-5 h-5" />
          <ChevronRightIcon v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-3 space-y-1 overflow-y-auto scrollbar-thin">
        <template v-for="(item, index) in navItems" :key="index">
          <!-- Header Item -->
          <div v-if="item.header" class="px-3 mt-4 mb-1 first:mt-1">
            <p v-if="!isCollapsed" class="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{{
              item.header }}</p>
            <div v-else class="h-px bg-white opacity-10 mx-2 mb-2"></div>
          </div>

          <!-- Link Item -->
          <NuxtLink v-else :to="item.path" v-slot="{ isActive }" custom>
            <a @click="navigateTo(item.path)" :class="[
              'flex items-center gap-3 px-3 py-1.5 mt-1 rounded-lg transition-colors cursor-pointer group',
              isActive ? 'text-teal-400 bg-gray-700/50 font-medium' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            ]">
              <component :is="item.icon"
                :class="['w-5 h-5 flex-shrink-0', isActive ? 'text-teal-400' : 'group-hover:text-teal-400']" />
              <span v-if="!isCollapsed" class="text-sm">{{ item.label }}</span>
            </a>
          </NuxtLink>
        </template>
      </nav>

      <!-- User Profile -->
      <div class="px-3 py-3 border-t border-gray-700">
        <div v-if="user"
          class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-700 transition-smooth cursor-pointer">
          <div class="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-sm font-semibold">{{ (user?.full_name || user?.name || user?.role || 'U').charAt(0).toUpperCase() }}</span>
          </div>
          <div v-if="!isCollapsed" class="flex-1 min-w-0">
            <p class="text-sm font-medium truncate">{{ user?.full_name || user?.name || user?.role }}</p>
            <p class="text-xs text-gray-400 truncate">{{ user?.role }}</p>
          </div>
        </div>

        <!-- Sign Out -->
        <button @click="handleSignOut"
          class="w-full flex items-center gap-3 px-3 py-2 mt-1 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-smooth">
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
import { useConfirm } from '~/composables/useConfirm'
import { useDashboardStore } from '~/stores/dashboard.store'
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
    const dashboardStore = useDashboardStore()
    const isCollapsed = ref(false)
    const isInvestor = computed(() => {
      const role = user.value?.role?.toUpperCase()
      return role === 'INVESTOR'
    })

    const isAdmin = computed(() => {
      const role = user.value?.role?.toUpperCase()
      return role === 'ADMIN' || role === 'ADMINISTRATOR'
    })

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
            path: '/investor/settings',
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
            path: '/admin/users',
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
            path: '/admin/framework-settings',
            label: 'Framework Settings',
            icon: ShieldCheckIcon
          },
          {
            path: '/admin/templates',
            label: 'Templates',
            icon: DocumentDuplicateIcon
          },
          {
            path: '/admin/questions',
            label: 'Question Builder',
            icon: ListBulletIcon
          },
          {
            path: '/admin/rules',
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
            path: '/sme/programs',
            label: 'Programs',
            icon: Square3Stack3DIcon
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
            path: '/sme/messages',
            label: 'Messages',
            icon: ChatBubbleLeftRightIcon
          },
          { header: 'REPORTS & ANALYTICS' },
          {
            path: '/sme/reports',
            label: 'Reports',
            icon: DocumentTextIcon
          },
          { header: 'SETTINGS' },
          {
            path: '/sme/settings',
            label: 'Settings',
            icon: Cog6ToothIcon
          }
        ]
      }
    })

    const sidebarClasses = computed(() => {
      if (dashboardStore.isAssessmentActive) return 'w-0 overflow-hidden opacity-0 invisible'
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

    const { ask } = useConfirm()

    const handleSignOut = async () => {
      const confirmed = await ask({
        title: 'Confirm Logout',
        message: 'Are you sure you want to sign out? Your session will be ended.',
        confirmText: 'Sign Out',
        type: 'warning'
      })

      if (confirmed) {
        logout()
      }
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
