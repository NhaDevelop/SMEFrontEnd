<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" @click="$emit('close')"></div>

        <!-- Modal Panel -->
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden flex flex-col">
            <!-- Header -->
            <div class="p-8 pb-4">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center gap-3 mb-1">
                            <h2 class="text-2xl font-bold text-gray-900">{{ sme.name }}</h2>
                            <span
                                :class="['px-2.5 py-0.5 rounded-md text-xs font-medium border flex items-center gap-1.5', getRiskBadgeStyles(sme.financialRisk)]">
                                <span :class="['w-1.5 h-1.5 rounded-full', getRiskDotStyles(sme.financialRisk)]"></span>
                                {{ sme.financialRisk }} Risk
                            </span>
                        </div>
                        <p class="text-gray-500 text-sm">{{ sme.industry }} • {{ sme.location }}</p>
                    </div>
                    <button @click="$emit('close')" class="text-gray-400 hover:text-gray-500 p-1">
                        <XMarkIcon class="w-5 h-5" />
                    </button>
                </div>
            </div>

            <!-- Content -->
            <div class="px-8 pb-8 space-y-8">
                <!-- Scores Row -->
                <div class="flex justify-between items-baseline bg-gray-50/50 rounded-lg p-6">
                    <div>
                        <span class="block text-sm text-gray-500 mb-1">Readiness Score</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-4xl font-bold text-[#189AB4]">{{ sme.score }}</span>
                            <span class="text-sm text-gray-400">/100</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="block text-sm text-gray-500 mb-1">Growth Potential</span>
                        <span class="text-4xl font-bold text-gray-900">{{ growthPotential }}</span>
                    </div>
                </div>

                <!-- Radar Chart -->
                <div>
                    <h3 class="font-medium text-gray-900 mb-4">Pillar Breakdown</h3>
                    <div class="h-[300px] flex items-center justify-center -ml-4">
                        <RadarChart :pillars="pillars" />
                    </div>
                </div>

                <!-- Footer Buttons -->
                <div class="flex items-center gap-3 pt-4">
                    <button
                        class="flex-1 py-2.5 bg-[#198754] text-white rounded-md font-medium hover:bg-[#157347] transition-colors flex items-center justify-center gap-2">
                        <ArrowDownTrayIcon class="w-5 h-5" />
                        Download Report
                    </button>
                    <button @click="navigateToProfile"
                        class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
                        View Full Profile
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import RadarChart from '~/components/DashboardRadarChart.vue'
import { generatePillarScores, getRiskBadgeStyles, getRiskDotStyles } from '~/utils/sme-data'

const props = defineProps<{
    sme: any
}>()

const emit = defineEmits(['close'])
const router = useRouter()

const growthPotential = computed(() => {
    const val = props.sme.growthPotential || props.sme.growthRate || 75
    return `${parseInt(val)}%`
})

const navigateToProfile = () => {
    router.push(`/sme/${props.sme.id}`)
}

const pillars = computed(() => {
    return props.sme.pillars || generatePillarScores(props.sme.id, props.sme.score ?? 0)
})
</script>
