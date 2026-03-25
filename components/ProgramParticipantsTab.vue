<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
    </div>
    
    <div v-else-if="participants.length === 0" class="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
      <UsersIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500 font-medium">No participants enrolled yet</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Industry</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Enrolled</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="person in participants" :key="person.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">
                  {{ person.name?.charAt(0) }}
                </div>
                <div class="text-sm font-semibold text-gray-900">{{ person.name }}</div>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <span :class="[
                'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
                person.role === 'SME' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
              ]">
                {{ person.role }}
              </span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ person.industry || '—' }}
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-xs text-gray-400">
              {{ person.enrolled_at ? formatDate(person.enrolled_at) : '—' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UsersIcon } from '@heroicons/vue/24/outline'
import { formatDate } from '~/utils/format'

const props = defineProps<{
  programId: string | number
}>()

const participants = ref<any[]>([])
const loading = ref(true)

const fetchParticipants = async () => {
  loading.value = true
  try {
    // We use useApi directly here for simplicity across roles
    const response = await useApi()(`/programs/${props.programId}/participants`) as any
    participants.value = response.data || response
  } catch (error) {
    console.error('Failed to fetch participants:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchParticipants)
</script>
