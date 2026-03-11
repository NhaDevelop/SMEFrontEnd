<template>
    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
        <div class="mb-6 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">Pillar Analysis</h3>
            <button class="text-sm text-cyan-600 font-medium hover:underline">Download Breakdowns</button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-gray-100 text-xs text-gray-500 uppercase">
                        <th class="py-3 font-medium">Pillar</th>
                        <th class="py-3 font-medium w-1/3">Score</th>
                        <th class="py-3 font-medium">Risk Level</th>
                        <th class="py-3 font-medium text-right">Improvement Potential</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr v-for="pillar in pillars" :key="pillar.name" class="group hover:bg-gray-50 transition-colors">
                        <td class="py-4 text-sm font-medium text-gray-900">
                            <div class="flex flex-col gap-1">
                                <span>{{ pillar.name }}</span>
                                <div v-if="pillar.score < 50"
                                    class="flex items-start gap-1 text-xs text-rose-600 font-normal max-w-xs leading-relaxed mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                        class="w-3.5 h-3.5 mt-0.5 shrink-0">
                                        <path fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Recommendation: Focus on strengthening readiness here to improve overall score.
                                </div>
                            </div>
                        </td>
                        <td class="py-4 pr-8">
                            <div class="flex items-center gap-3">
                                <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full rounded-full transition-all duration-500"
                                        :class="getScoreColor(pillar.score)" :style="{ width: `${pillar.score}%` }">
                                    </div>
                                </div>
                                <span class="text-sm font-bold text-gray-700 w-8 text-right">{{ pillar.score }}</span>
                            </div>
                        </td>
                        <td class="py-4">
                            <span :class="['px-2 py-0.5 rounded text-xs font-medium', getRiskBadgeColor(pillar.score)]">
                                {{ getRiskLabel(pillar.score) }} Risk
                            </span>
                        </td>
                        <td class="py-4 text-right text-sm font-bold text-emerald-600">
                            <span class="flex items-center justify-end gap-1">
                                <ArrowTrendingUpIcon class="w-3 h-3" />
                                +{{ pillar.potential || Math.round((100 - pillar.score) * 0.3) }}
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowTrendingUpIcon } from '@heroicons/vue/24/outline'
import { ref, onMounted } from 'vue'

defineProps<{
    pillars: any[]
}>()

const thresholds = ref<any[]>([])

onMounted(async () => {
    const settings = await $fetch<any>('/api/admin/settings').catch(() => null)
    if (settings && settings.thresholds) thresholds.value = settings.thresholds
})

const getScoreColor = (score: number) => {
    const matched = thresholds.value.find(t => score >= t.min && score <= t.max)
    if (matched) return matched.colorBg || 'bg-emerald-500'
    if (score >= 70) return 'bg-emerald-500'
    if (score >= 40) return 'bg-amber-500'
    return 'bg-rose-500'
}

const getRiskLabel = (score: number) => {
    const matched = thresholds.value.find(t => score >= t.min && score <= t.max)
    if (matched) return matched.label
    if (score >= 70) return 'Low'
    if (score >= 60) return 'Medium'
    return 'High'
}

const getRiskBadgeColor = (score: number) => {
    const matched = thresholds.value.find(t => score >= t.min && score <= t.max)
    if (matched) {
        if (matched.id === 'investor' || matched.id === 'near') return 'bg-emerald-50 text-emerald-700'
        if (matched.id === 'early') return 'bg-amber-50 text-amber-700'
        return 'bg-rose-50 text-rose-700'
    }
    if (score >= 70) return 'bg-emerald-50 text-emerald-700'
    if (score >= 60) return 'bg-amber-50 text-amber-700'
    return 'bg-rose-50 text-rose-700'
}
</script>
