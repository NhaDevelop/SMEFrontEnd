<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

        <!-- Modal Panel -->
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col">
            <!-- Header -->
            <div class="flex items-start justify-between p-6 border-b border-gray-100">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">{{ sme.name }}</h2>
                    <div class="flex items-center gap-4 mt-2">
                        <div class="flex flex-col">
                            <span class="text-3xl font-bold text-blue-600">{{ sme.score }}<span
                                    class="text-sm text-gray-400 font-normal">/100</span></span>
                            <span class="text-xs text-gray-500">Readiness Score</span>
                        </div>
                        <div class="w-px h-10 bg-gray-200"></div>
                        <div class="flex flex-col">
                            <h3 class="font-bold text-gray-900">{{ sme.industry }}</h3>
                            <span class="text-xs text-gray-500">Sector</span>
                        </div>
                        <div class="w-px h-10 bg-gray-200"></div>
                        <div class="flex flex-col">
                            <h3 class="font-bold text-gray-900">{{ growthPotential }}</h3>
                            <span class="text-xs text-gray-500">Growth Potential</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <span
                        :class="['px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1', getRiskBadgeStyles(sme.financialRisk)]">
                        <span :class="['w-1.5 h-1.5 rounded-full', getRiskDotStyles(sme.financialRisk)]"></span>
                        {{ sme.financialRisk }} Risk
                    </span>
                    <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500 p-1">
                        <XMarkIcon class="w-6 h-6" />
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div class="p-6 space-y-8 bg-gray-50/50">

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Radar Chart Card -->
                    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                        <h3 class="font-bold text-gray-900 mb-6">Pillar Scores</h3>
                        <div class="flex-1 flex items-center justify-center min-h-[300px]">
                            <RadarChart :pillars="pillars" />
                        </div>
                    </div>

                    <!-- Progress Chart Card -->
                    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                        <h3 class="font-bold text-gray-900 mb-6">Progress Over Time</h3>
                        <div class="flex-1 flex items-center justify-center min-h-[300px] w-full">
                            <ProgressChart :data="progressData" />
                        </div>
                    </div>
                </div>

                <!-- Detailed Scores Table -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pillar</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Score</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Risk Level</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Improvement Potential</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="pillar in pillars" :key="pillar.name">
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ pillar.name
                                }}</td>
                                <td class="px-6 py-4 whitespace-nowrap align-middle">
                                    <div class="flex items-center gap-3">
                                        <div class="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div class="h-full rounded-full" :class="getPillarColor(pillar.score)"
                                                :style="{ width: pillar.score + '%' }"></div>
                                        </div>
                                        <span class="text-sm text-gray-900 font-bold">{{ pillar.score }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        :class="['inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium', getRiskBadgeStyles(getRiskFromScore(pillar.score))]">
                                        <span
                                            :class="['w-1.5 h-1.5 rounded-full', getRiskDotStyles(getRiskFromScore(pillar.score))]"></span>
                                        {{ getRiskFromScore(pillar.score) }} Risk
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">
                                    <span class="flex items-center gap-1">
                                        <ArrowTrendingUpIcon class="w-4 h-4" /> +{{ pillar.potential }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-gray-200 bg-white flex items-center justify-between rounded-b-xl">
                <div>
                    <button class="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center gap-1">
                        <ArrowDownTrayIcon class="w-4 h-4" /> Export CSV
                    </button>
                </div>
                <div class="flex items-center gap-3">
                    <button @click="$emit('create-goal')"
                        class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2">
                        <LifebuoyIcon class="w-4 h-4" /> Create Goal
                    </button>
                    <button @click="navigateToProfile"
                        class="px-4 py-2 bg-[#198754] text-white rounded-lg font-medium hover:bg-[#157347] flex items-center gap-2">
                        View Full Profile
                        <ArrowLongRightIcon class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
    XMarkIcon,
    ArrowTrendingUpIcon,
    ArrowDownTrayIcon,
    LifebuoyIcon,
    ArrowLongRightIcon
} from '@heroicons/vue/24/outline'
import RadarChart from '~/components/dashboard/RadarChart.vue'
import ProgressChart from '~/components/dashboard/ProgressChart.vue'
import {
    generatePillarScores,
    generateProgressData,
    getRiskBadgeStyles,
    getRiskDotStyles,
    getRiskFromScore,
    getPillarColor
} from '~/utils/sme-data'

const props = defineProps<{
    sme: any
}>()

const emit = defineEmits(['close', 'create-goal'])
const router = useRouter()

const growthPotential = computed(() => {
    return props.sme.growthRate ? parseInt(props.sme.growthRate) : 75
})

const navigateToProfile = () => {
    router.push(`/sme/${props.sme.id}`)
}

// Use centralized pillar score generation for consistency
const pillars = computed(() => {
    return generatePillarScores(props.sme.id, props.sme.score || 50)
})

// Use centralized progress data generation
const progressData = computed(() => {
    return generateProgressData(
        props.sme.id,
        props.sme.score || 50,
        props.sme.readinessHistory
    )
})
</script>
