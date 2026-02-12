<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[400px]">
    <h3 class="font-bold text-xl text-gray-900 mb-1">Audit Log</h3>
    <p class="text-gray-500 text-sm mb-6">Track user activities and system changes</p>

    <div class="space-y-4">
        <div v-for="log in auditLogs" :key="log.id" class="flex gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100 items-start">
             <div class="mt-1">
                <div class="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 shadow-sm">
                    <UserIcon v-if="log.action.includes('User')" class="w-4 h-4" />
                    <ShieldCheckIcon v-else-if="log.action.includes('Role')" class="w-4 h-4" />
                    <DocumentTextIcon v-else class="w-4 h-4" />
                </div>
            </div>
            <div class="flex-1">
                <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900">
                        <span class="font-bold">{{ log.admin }}</span> {{ log.action }}
                    </p>
                    <span class="text-xs text-gray-400">{{ log.timestamp }}</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ log.details }}</p>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserIcon, ShieldCheckIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'

// Mock Data
const auditLogs = [
    {
        id: 1,
        admin: 'Super Admin',
        action: 'approved new SME user',
        target: 'Angkor Tech',
        timestamp: '2 mins ago',
        details: 'Approved registration request for Angkor Tech (SME)'
    },
    {
        id: 2,
        admin: 'Sokha Chan',
        action: 'updated user role',
        target: 'David Chen',
        timestamp: '1 hour ago',
        details: 'Changed role for David Chen from Guest to Investor'
    },
     {
        id: 3,
        admin: 'Super Admin',
        action: 'deleted user',
        target: 'Spam Bot',
        timestamp: '3 hours ago',
        details: 'Removed suspicious user account Spam Bot'
    }
]
</script>
