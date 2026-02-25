<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">What-If Scenario Analysis</h1>
                    <p class="text-gray-500 mt-1">Explore how improvements affect your investment readiness score</p>
                </div>
                <div class="flex gap-3">
                    <button @click="resetScenarios"
                        class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <ArrowPathIcon class="w-4 h-4" />
                        Reset
                    </button>
                    <button @click="saveScenario"
                        class="px-4 py-2 bg-teal-600 text-white rounded-md font-medium hover:bg-teal-700 transition-colors flex items-center gap-2">
                        <bookmark-icon class="w-4 h-4" />
                        Save Scenario
                    </button>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto px-8 py-8">
            <div class="max-w-7xl mx-auto space-y-6">
                <!-- Score Card -->
                <div class="bg-teal-50/50 rounded-lg p-8 border border-teal-100">
                    <div class="flex items-center justify-around">
                        <div class="text-center">
                            <div class="text-sm text-gray-500 mb-2">Current Score</div>
                            <div class="text-5xl font-bold text-gray-900 mb-2">{{ currentOverallScore }}</div>
                            <div
                                class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                {{ getReadinessLevel(currentOverallScore) }}
                            </div>
                        </div>

                        <div class="flex flex-col items-center">
                            <ArrowLongRightIcon class="w-12 h-12 text-teal-600" />
                            <span v-if="projectedOverallScore !== currentOverallScore" class="font-bold text-lg"
                                :class="projectedOverallScore > currentOverallScore ? 'text-teal-600' : 'text-red-500'">
                                {{ projectedOverallScore > currentOverallScore ? '+' : '' }}{{ projectedOverallScore -
                                    currentOverallScore }} pts
                            </span>
                        </div>

                        <div class="text-center">
                            <div class="text-sm text-gray-500 mb-2">Projected Score</div>
                            <div class="text-5xl font-bold text-gray-900 mb-2 transition-all duration-300"
                                :class="{ 'text-teal-600': projectedOverallScore > currentOverallScore }">
                                {{ projectedOverallScore }}
                            </div>
                            <div
                                class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                {{ getReadinessLevel(projectedOverallScore) }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Adjust Pillar Scores -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div class="flex items-center gap-2 mb-1">
                            <CalculatorIcon class="w-5 h-5 text-gray-400" />
                            <h2 class="text-lg font-bold text-gray-900">Adjust Pillar Scores</h2>
                        </div>
                        <p class="text-gray-500 text-sm mb-6">Manually adjust each pillar to see the impact</p>

                        <div class="space-y-8">
                            <div v-for="(pillar, index) in pillars" :key="index">
                                <div class="flex justify-between mb-2">
                                    <span class="font-medium text-gray-700">{{ pillar.name }}</span>
                                    <div class="flex gap-2 text-sm items-center">
                                        <span class="text-gray-400">{{ pillar.current }}</span>
                                        <span class="text-gray-400">→</span>
                                        <span class="font-bold w-6 text-right"
                                            :class="{ 'text-teal-600': pillar.projected > pillar.current, 'text-red-600': pillar.projected < pillar.current, 'text-gray-900': pillar.projected === pillar.current }">
                                            {{ pillar.projected }}
                                        </span>
                                        <span v-if="pillar.projected !== pillar.current"
                                            class="text-xs px-1.5 py-0.5 rounded flex items-center font-bold"
                                            :class="pillar.projected > pillar.current ? 'bg-teal-100 text-teal-700' : 'bg-red-100 text-red-700'">
                                            {{ pillar.projected > pillar.current ? '+' : '' }}{{ pillar.projected -
                                                pillar.current }}
                                        </span>
                                    </div>
                                </div>
                                <div class="relative h-2 bg-gray-100 rounded-full">
                                    <!-- Background Track (Current) -->
                                    <div class="absolute h-full bg-gray-300 rounded-full"
                                        :style="{ width: `${pillar.current}%` }"></div>
                                    <!-- Active Track (Projected) -->
                                    <div class="absolute h-full bg-teal-600 rounded-full transition-all duration-300 opacity-50"
                                        :style="{ width: `${pillar.projected}%` }"></div>
                                    <!-- Input Slider -->
                                    <input type="range" v-model.number="pillar.projected" min="0" max="100"
                                        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    <!-- Thumb (Custom visual if needed, but opacity-0 input covers interaction) -->
                                    <div class="absolute h-4 w-4 bg-white border-2 border-teal-600 rounded-full top-1/2 -translate-y-1/2 -ml-2 shadow pointer-events-none transition-all duration-300"
                                        :style="{ left: `${pillar.projected}%` }"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Apply Action Items -->
                    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div class="flex items-center gap-2 mb-1">
                            <LightBulbIcon class="w-5 h-5 text-gray-400" />
                            <h2 class="text-lg font-bold text-gray-900">Apply Action Items</h2>
                        </div>
                        <p class="text-gray-500 text-sm mb-6">Select actions to see their combined impact ({{
                            selectedActionsCount }} selected)</p>

                        <div class="space-y-4">
                            <div v-for="action in actionItems" :key="action.id"
                                class="border rounded-lg p-4 transition-all duration-200 cursor-pointer hover:border-teal-200"
                                :class="action.selected ? 'bg-teal-50 border-teal-200 ring-1 ring-teal-200' : 'border-gray-200'"
                                @click="toggleAction(action)">
                                <div class="flex items-start gap-4">
                                    <div class="mt-1">
                                        <div class="w-5 h-5 rounded border flex items-center justify-center transition-colors"
                                            :class="action.selected ? 'bg-teal-600 border-teal-600' : 'border-gray-300 bg-white'">
                                            <CheckIcon v-if="action.selected" class="w-3.5 h-3.5 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 class="font-medium text-gray-900 mb-2">{{ action.title }}</h3>
                                        <div class="flex items-center gap-2 flex-wrap">
                                            <span
                                                class="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded border border-gray-200">
                                                {{ action.pillar }}
                                            </span>
                                            <span
                                                class="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded border border-orange-200">
                                                {{ action.difficulty }}
                                            </span>
                                            <span class="text-teal-600 text-xs font-bold">
                                                +{{ action.points }} pts
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Save Scenario -->
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div class="flex items-center gap-2 mb-6">
                        <div class="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                            <div class="w-2.5 h-2.5 bg-gray-600 rounded-full"></div>
                        </div>
                        <h2 class="text-lg font-bold text-gray-900">Save This Scenario</h2>
                    </div>

                    <div class="flex gap-4">
                        <input ref="scenarioInput" v-model="scenarioName" type="text"
                            placeholder="Enter scenario name (e.g., 'Q2 Improvement Plan')"
                            class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500" />
                        <button @click="saveScenario"
                            class="px-6 py-2 bg-teal-600 text-white rounded-md font-medium hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-2">
                            <bookmark-icon class="w-4 h-4" />
                            Save Scenario
                        </button>
                    </div>
                </div>
            </div>
        </main>

        <!-- Toast Notification -->
        <Transition enter-active-class="transform ease-out duration-300 transition"
            enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
            leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-if="showToast"
                class="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div class="p-4">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <CheckCircleIcon v-if="toastType === 'success'" class="h-6 w-6 text-green-400"
                                aria-hidden="true" />
                            <ExclamationCircleIcon v-else class="h-6 w-6 text-red-400" aria-hidden="true" />
                        </div>
                        <div class="ml-3 w-0 flex-1 pt-0.5">
                            <p class="text-sm font-medium text-gray-900">
                                {{ toastMessage }}
                            </p>
                        </div>
                        <div class="ml-4 flex-shrink-0 flex">
                            <button @click="showToast = false"
                                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                <span class="sr-only">Close</span>
                                <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
    ArrowPathIcon,
    ArrowLongRightIcon,
    CalculatorIcon,
    LightBulbIcon,
    CheckIcon,
    BookmarkIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/vue/24/outline'
import { useDashboardStore } from '~/stores/dashboard.store'
import { calculateOverallScore } from '~/utils/helpers'

const dashboardStore = useDashboardStore()
const loading = ref(true)

const scenarioInput = ref<HTMLInputElement | null>(null)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
let toastTimeout: any = null

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true

    if (toastTimeout) clearTimeout(toastTimeout)
    toastTimeout = setTimeout(() => {
        showToast.value = false
    }, 3000)
}

const scenarioName = ref('')

interface PillarScenario {
    id: string | number
    name: string
    current: number
    projected: number
    weight?: number
}

const pillars = ref<PillarScenario[]>([])

interface ActionScenario {
    id: string | number
    title: string
    pillar: string
    difficulty: string
    points: number
    selected: boolean
}

const actionItems = ref<ActionScenario[]>([])

const initializeData = () => {
    // Initialize pillars from store
    pillars.value = dashboardStore.pillars.map(p => ({
        id: p.id,
        name: p.name,
        current: p.score,
        projected: p.score,
        weight: p.weight
    }))

    // Initialize action items from store recommendations
    actionItems.value = dashboardStore.actions
        .filter(a => a.status !== 'completed')
        .map(a => ({
            id: a.id,
            title: a.title,
            pillar: a.pillar,
            difficulty: a.priority || 'medium',
            points: a.impact || 5,
            selected: false
        }))
}

onMounted(async () => {
    try {
        if (dashboardStore.pillars.length === 0) {
            await dashboardStore.fetchDashboardData()
        }
        initializeData()
    } finally {
        loading.value = false
    }
})

// If dashboard data changes, we might want to re-initialize if not already manually edited
watch(() => dashboardStore.pillars, (newPillars) => {
    if (newPillars.length > 0 && pillars.value.length === 0) {
        initializeData()
    }
}, { deep: true })

const currentOverallScore = computed(() => {
    if (pillars.value.length === 0) return 0
    return calculateOverallScore(pillars.value.map(p => ({ score: p.current, weight: p.weight })))
})

const projectedOverallScore = computed(() => {
    if (pillars.value.length === 0) return 0
    return calculateOverallScore(pillars.value.map(p => ({ score: p.projected, weight: p.weight })))
})

const selectedActionsCount = computed(() => actionItems.value.filter(a => a.selected).length)

const toggleAction = (action: ActionScenario) => {
    action.selected = !action.selected
    const pillar = pillars.value.find(p => p.name === action.pillar)
    if (pillar) {
        if (action.selected) {
            pillar.projected = Math.min(100, pillar.projected + action.points)
        } else {
            pillar.projected = Math.max(0, pillar.projected - action.points)
        }
    }
}

const resetScenarios = () => {
    pillars.value.forEach(p => p.projected = p.current)
    actionItems.value.forEach(a => a.selected = false)
    scenarioName.value = ''
}

const saveScenario = () => {
    if (!scenarioName.value.trim()) {
        showNotification('Please enter a scenario name', 'error')
        if (scenarioInput.value) {
            scenarioInput.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
            scenarioInput.value.focus()
        }
        return
    }
    // Logic to save scenario would go here
    showNotification('Scenario saved successfully!', 'success')
    scenarioName.value = ''
}

const getReadinessLevel = (score: number) => {
    if (score >= 80) return 'Ready'
    if (score >= 60) return 'Near Ready'
    if (score >= 40) return 'Developing'
    return 'Early Stage'
}

definePageMeta({
    layout: 'default',
    middleware: ['auth']
})
</script>
