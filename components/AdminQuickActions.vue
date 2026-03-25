<template>
  <div class="bg-white rounded-lg shadow-soft p-6">
    <h3 class="font-semibold text-gray-900 mb-4">Quick Actions</h3>
    <div class="space-y-2">
      <button v-for="action in actions" :key="action.label"
        @click="router.push(action.path)"
        class="w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors group text-left">
        <span class="text-gray-700 font-medium group-hover:text-cyan-700 transition-colors">{{ action.label }}</span>
        <div class="flex items-center gap-2">
          <span v-if="action.count" class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
            {{ action.count }}
          </span>
          <ChevronRightIcon class="w-4 h-4 text-gray-400 group-hover:text-cyan-500 transition-colors" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import { useAdminStore } from '~/stores/admin.store'

const router = useRouter()
const adminStore = useAdminStore()

const actions = computed(() => [
  { label: 'Manage Users', count: (adminStore.dashboardStats?.stats?.totalSMEs ?? 0) + (adminStore.dashboardStats?.stats?.totalInvestors ?? 0) + 1, path: '/admin/users' },
  { label: 'View Programs', count: adminStore.dashboardStats?.stats?.totalPrograms ?? 0, path: '/admin/programs' },
  { label: 'Assessment Templates', count: adminStore.templates?.length ?? 0, path: '/admin/templates' },
  { label: 'Export Reports', count: null, path: '#' }
])
</script>
