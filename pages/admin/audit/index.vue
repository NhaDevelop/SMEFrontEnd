<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">System Audit Log</h1>
          <p class="text-gray-500 mt-1">Track all administrative actions and system events for accountability</p>
        </div>
        <button class="text-gray-500 hover:text-gray-900 flex items-center gap-2 text-sm font-medium">
            <ArrowDownTrayIcon class="w-4 h-4" />
            Export Log (CSV)
        </button>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto custom-scrollbar px-8 py-8 w-full">
      <div class="max-w-[1600px] mx-auto space-y-8">
        
        <!-- Log Cards -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="divide-y divide-gray-100">
                <div v-for="log in logs" :key="log.id" class="p-6 hover:bg-gray-50 transition duration-150">
                    <div class="flex items-start justify-between">
                        <div class="flex gap-4">
                            <!-- Icon based on action -->
                            <div :class="[
                                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                                log.action.includes('Approved') ? 'bg-green-100 text-green-600' :
                                log.action.includes('Rejected') ? 'bg-red-100 text-red-600' :
                                log.action.includes('Updated') ? 'bg-blue-100 text-blue-600' :
                                'bg-gray-100 text-gray-600'
                            ]">
                                <CheckCircleIcon v-if="log.action.includes('Approved')" class="w-5 h-5" />
                                <XCircleIcon v-else-if="log.action.includes('Rejected')" class="w-5 h-5" />
                                <PencilSquareIcon v-else-if="log.action.includes('Updated')" class="w-5 h-5" />
                                <InformationCircleIcon v-else class="w-5 h-5" />
                            </div>

                            <div>
                                <p class="text-sm font-medium text-gray-900">
                                    <span class="font-bold">{{ log.admin }}</span> 
                                    {{ log.action.toLowerCase() }} 
                                    <span class="font-bold text-gray-800">{{ log.target }}</span>
                                </p>
                                <p class="text-sm text-gray-500 mt-1">{{ log.details }}</p>
                            </div>
                        </div>
                        <div class="text-xs text-gray-400 font-medium whitespace-nowrap">
                            {{ log.timestamp }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore } from '~/stores/admin.store'
import { 
    CheckCircleIcon, 
    XCircleIcon, 
    PencilSquareIcon,
    InformationCircleIcon,
    ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'

const adminStore = useAdminStore()
const logs = computed(() => adminStore.auditLogs)

definePageMeta({
  middleware: 'auth'
})
</script>
