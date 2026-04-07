<template>
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
                <h3 class="text-lg font-bold text-gray-900">Goals & History</h3>
                <p class="text-sm text-gray-500 mt-1">Track assigned and self-created goals, and review proof of
                    achievements.</p>
            </div>
        </div>

        <div v-if="loading" class="p-12 text-center text-gray-500">
            <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
            <p>Loading goals...</p>
        </div>

        <div v-else-if="goals.length === 0" class="p-12 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-12 h-12 mx-auto mb-4 text-gray-300">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
            </svg>
            <h3 class="text-lg font-medium text-gray-900">No Goals Found</h3>
            <p class="mt-1 text-sm">There are no goals available for this SME yet.</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
            <div v-for="goal in goals" :key="goal.id" class="p-6 hover:bg-gray-50 transition-colors">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h4 class="text-base font-bold text-gray-900">{{ goal.title }}</h4>
                            <span :class="[
                                'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                                goal.status === 'Achieved' ? 'bg-emerald-100 text-emerald-800' :
                                    goal.status === 'Pending Verification' ? 'bg-purple-100 text-purple-800' :
                                        goal.status === 'Active' || goal.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'
                            ]">
                                {{ goal.status }}
                            </span>
                        </div>
                        <p class="text-sm text-gray-600 mb-3">{{ goal.description || 'No description provided.' }}</p>

                        <div class="flex items-center gap-4 text-xs font-medium">
                            <span class="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-100 text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                                {{ goal.created_by_role === 'sme' ? 'Self-created' : 'Assigned by Investor' }}
                            </span>
                            <span v-if="goal.created_by_role !== 'sme' && (goal.investor_name || goal.investor_company)"
                                class="text-gray-500 italic">
                                by {{ goal.investor_company || goal.investor_name }}
                            </span>
                        </div>
                    </div>

                    <div class="ml-6 flex flex-col items-end gap-2">
                        <div
                            class="text-sm font-bold text-gray-900 border px-3 py-1.5 rounded-lg border-gray-200 shadow-sm whitespace-nowrap bg-white">
                            Target: <span class="text-teal-600">{{ Number(goal.target_score).toFixed(0) }} points</span>
                        </div>

                        <!-- Evidence Download Button -->
                        <button v-if="goal.proof_document" @click="downloadProof(goal.proof_document)"
                            class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-xs font-medium shadow-sm mt-1 whitespace-nowrap">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                stroke="currentColor" class="w-3.5 h-3.5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Download Evidence
                        </button>
                    </div>
                </div>

                <div v-if="goal.proof_note"
                    class="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700 italic flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"
                        class="w-4 h-4 text-gray-400 mt-0.5">
                        <path
                            d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    </svg>
                    <span>"{{ goal.proof_note }}"</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
    smeId: string | number
}>()

const goals = ref<any[]>([])
const loading = ref(false)
const config = useRuntimeConfig()

const fetchGoals = async () => {
    if (!props.smeId) return
    loading.value = true
    const api = useApi()
    try {
        const response = await api<any>(`/sme/goals?sme_id=${props.smeId}`)
        goals.value = response.data || response || []
    } catch (e) {
        console.error('Failed to load SME goals for history', e)
    } finally {
        loading.value = false
    }
}

const downloadProof = (path: string) => {
    if (!path) return
    const baseUrl = config.public.apiBase.replace(/\/api\/?$/, '')
    const url = `${baseUrl}/storage/${path}`
    window.open(url, '_blank')
}

onMounted(() => {
    fetchGoals()
})

watch(() => props.smeId, () => {
    fetchGoals()
})
</script>
