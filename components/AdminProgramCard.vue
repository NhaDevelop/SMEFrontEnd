<template>
  <div class="bg-white rounded-xl border border-gray-100 p-6 hover:border-cyan-100 transition-colors shadow-sm">
    <div class="flex items-start justify-between mb-4">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h3 class="font-bold text-gray-900 text-lg">{{ program.name }}</h3>
          <span :class="[
            'px-2 py-0.5 rounded-full text-xs font-semibold',
            program.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          ]">
            {{ program.status }}
          </span>
        </div>
        <p class="text-gray-500 text-sm max-w-2xl">{{ program.description }}</p>
      </div>

      <!-- Headless UI Menu -->
      <Menu as="div" class="relative">
        <MenuButton class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <EllipsisHorizontalIcon class="w-6 h-6" />
        </MenuButton>

        <transition enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0">
          <MenuItems
            class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
            <div class="px-1 py-1">
              <MenuItem v-slot="{ active }">
              <button :class="[
                active ? 'bg-gray-50' : '',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900'
              ]" @click="$emit('view', program)">
                <EyeIcon :active="active" class="mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                View Details
              </button>
              </MenuItem>
              <MenuItem v-slot="{ active }" v-if="!isInvestor">
              <button :class="[
                active ? 'bg-gray-50' : '',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900'
              ]" @click="$emit('edit', program)">
                <PencilSquareIcon :active="active" class="mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                Edit
              </button>
              </MenuItem>
              <MenuItem v-slot="{ active }" v-if="!isInvestor">
              <button :class="[
                active ? 'bg-gray-50' : '',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900'
              ]" @click="$emit('manage-smes', program)">
                <UserGroupIcon :active="active" class="mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                Manage SMEs ({{ program.smesCount ?? program.smes ?? 0 }})
              </button>
              </MenuItem>
            </div>
            <div class="px-1 py-1" v-if="!isInvestor">
              <MenuItem v-slot="{ active }">
              <button :class="[
                active ? 'bg-red-50' : '',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-600'
              ]" @click="$emit('delete', program.id)">
                <TrashIcon :active="active" class="mr-2 h-4 w-4 text-red-500" aria-hidden="true" />
                Delete
              </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>

    <div v-if="!program.template"
      class="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg text-xs font-medium text-orange-700 mb-6 border border-orange-100">
      <DocumentTextIcon class="w-4 h-4" />
      <span>No template assigned</span>
      <button v-if="!isInvestor" @click="$emit('edit', program)"
        class="ml-1 text-orange-800 hover:text-orange-900 font-semibold hover:underline">
        Assign now
      </button>
    </div>
    <div v-else
      class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 text-xs font-medium text-gray-600 mb-6">
      <DocumentDuplicateIcon class="w-3.5 h-3.5" />
      Template: <span class="text-gray-900">{{ program.template }}</span>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-3 gap-8 mb-6">
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">{{ program.smesCount ?? program.smes }}</div>
        <div class="text-xs text-gray-500 font-medium">SMEs</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">{{ program.avgScore }}</div>
        <div class="text-xs text-gray-500 font-medium">Avg Score</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-gray-900">{{ program.progress ?? program.completion }}%</div>
        <div class="text-xs text-gray-500 font-medium">Complete</div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-4">
      <div class="flex justify-between text-xs mb-1">
        <span class="text-gray-500">Progress</span>
        <span class="text-gray-900 font-medium">{{ program.progress ?? program.completion }}%</span>
      </div>
      <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div class="h-full bg-cyan-600 rounded-full transition-all duration-500"
          :style="{ width: `${program.progress ?? program.completion}%` }"></div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-50">
      <div v-if="program.startDate && program.endDate">
        {{ program.startDate }} → {{ program.endDate }}
      </div>
      <div v-else-if="program.endDate">
        Ends: {{ program.endDate }}
      </div>
      <div v-else>
        No dates set
      </div>

      <div class="flex items-center gap-3">
        <button @click="$emit('discuss', program)"
          class="font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
          <ChatBubbleLeftRightIcon class="w-4 h-4" />
          Discussion
        </button>
        <NuxtLink :to="`${reportsPath}?programId=${program.id}`"
          class="font-medium text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
          View Report
          <ArrowLongRightIcon class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useAuthStore } from '~/stores/auth.store'
import {
  EllipsisHorizontalIcon,
  DocumentDuplicateIcon,
  ArrowLongRightIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/vue/24/outline'

defineProps<{
  program: {
    id: number | string
    name: string
    status: string
    description: string
    template: string
    templateId?: string
    smesCount?: number
    smes?: number
    avgScore: number
    progress?: number
    completion?: number
    startDate?: string
    endDate?: string
  }
}>()

const emit = defineEmits(['edit', 'delete', 'view', 'manage-smes', 'discuss'])

// Get user role to determine correct reports path and actions visibility
const authStore = useAuthStore()
const isInvestor = computed(() => {
  return authStore.user?.role === 'INVESTOR'
})

const reportsPath = computed(() => {
  return isInvestor.value ? '/investor/reports' : '/admin/reports'
})
</script>
