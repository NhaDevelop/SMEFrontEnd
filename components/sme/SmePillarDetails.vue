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
                        <td class="py-4 text-sm font-medium text-gray-900">{{ pillar.name }}</td>
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
                                <ArrowTrendingUpIcon class="w-3 H-3" />
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

defineProps<{
    pillars: any[]
}>()

const getScoreColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-500'
    if (score >= 40) return 'bg-amber-500'
    return 'bg-rose-500'
}

const getRiskLabel = (score: number) => {
    if (score >= 70) return 'Low'
    if (score >= 60) return 'Medium'
    return 'High'
}

const getRiskBadgeColor = (score: number) => {
    if (score >= 70) return 'bg-emerald-50 text-emerald-700'
    if (score >= 60) return 'bg-amber-50 text-amber-700'
    return 'bg-rose-50 text-rose-700'
}
</script>
