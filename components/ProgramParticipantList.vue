<template>
  <div class="space-y-4">
    <!-- Loading State -->
    <div v-if="loading && !participants.length" class="flex flex-col items-center justify-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-100">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mb-3"></div>
      <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading cohort...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!participants.length" class="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
      <UserGroupIcon class="w-10 h-10 text-gray-200 mx-auto mb-3" />
      <h4 class="text-sm font-bold text-gray-900">No participants yet</h4>
      <p class="text-xs text-gray-400 mt-1">Be the first to join this program!</p>
    </div>

    <!-- Participant List -->
    <div v-else class="space-y-3">
      <div v-for="participant in participants" :key="participant.id"
           class="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-teal-200 hover:shadow-sm transition-all group">
        <!-- Avatar/Initials -->
        <div class="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-sm font-black text-gray-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all shadow-sm shrink-0">
          {{ (participant.name || 'P').charAt(0) }}
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <h4 class="text-sm font-bold text-gray-900 truncate group-hover:text-teal-700 transition-colors">
            {{ participant.name || 'Participant' }}
          </h4>
          <div class="flex items-center gap-2 mt-0.5">
            <span :class="participant.role === 'INVESTOR' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-teal-50 text-teal-600 border-teal-100'"
                  class="text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider">
              {{ participant.role || 'SME' }}
            </span>
            <span v-if="participant.industry" class="text-[9px] text-gray-400 font-bold uppercase tracking-widest truncate">
              {{ participant.industry }}
            </span>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="shrink-0">
          <span :class="getStatusStyles(participant.status)" class="text-[9px] font-bold px-2.5 py-1 rounded-full border shadow-sm transition-colors">
            {{ participant.status || 'Active' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserGroupIcon } from '@heroicons/vue/24/outline'

defineProps<{
  participants: Array<{
    id: number | string
    name: string
    role: string
    status: string
    industry?: string
  }>
  loading?: boolean
}>()

const getStatusStyles = (status: string) => {
  const s = status?.toLowerCase()
  if (['accepted', 'enrolled', 'active', 'approved'].includes(s)) return 'bg-green-50 text-green-700 border-green-200 group-hover:bg-green-100'
  if (['applied', 'pending'].includes(s)) return 'bg-amber-50 text-amber-700 border-amber-200 group-hover:bg-amber-100'
  if (['rejected', 'withdrawn'].includes(s)) return 'bg-rose-50 text-rose-700 border-rose-200 group-hover:bg-rose-100'
  return 'bg-gray-50 text-gray-700 border-gray-200 group-hover:bg-gray-100'
}
</script>
