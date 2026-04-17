<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog"
        aria-modal="true">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" @click="close"></div>

        <!-- Modal Panel -->
        <div class="relative w-full max-w-2xl bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 class="text-lg font-semibold text-gray-900">Set your investment readiness targets</h2>
                <button @click="close" class="text-gray-400 hover:text-gray-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
                <!-- Quick Templates -->
                <div v-if="quickTemplates.length > 0" class="-mx-2 px-2">
                    <h3 class="text-sm font-medium text-gray-700 mb-3 block">Quick Templates (Based on Assessment Gaps)</h3>
                    <div class="flex overflow-x-auto pb-4 gap-3 custom-scrollbar">
                        <button v-for="template in quickTemplates" :key="template.id" @click="applyTemplate(template)"
                            class="flex-shrink-0 w-64 p-3 text-left border rounded-lg hover:border-teal-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer group"
                            :class="template.pillarRisk === 'high' || template.priority === 'high' ? 'border-rose-200 bg-rose-50/50' : 'border-amber-200 bg-amber-50/50'">
                            <div class="flex items-center gap-1.5 mb-1.5">
                                <span class="w-1.5 h-1.5 rounded-full" :class="template.pillarRisk === 'high' || template.priority === 'high' ? 'bg-rose-500' : 'bg-amber-500'"></span>
                                <span class="text-[10px] font-bold uppercase tracking-wider" :class="template.pillarRisk === 'high' || template.priority === 'high' ? 'text-rose-700' : 'text-amber-700'">{{ template.pillar }}</span>
                            </div>
                            <p class="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-teal-700 transition-colors">{{ template.title }}</p>
                        </button>
                    </div>
                </div>

                <!-- Goal Name -->
                <div class="space-y-1">
                    <label for="goal-name" class="block text-sm font-medium text-gray-700">Goal Name *</label>
                    <input type="text" id="goal-name" v-model="form.title" placeholder="e.g., Investor Ready by Q4 2024"
                        :class="['w-full rounded-lg shadow-sm focus:ring-teal-500 sm:text-sm px-4 py-2.5 border', errors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-teal-500']" />
                    <p v-if="errors.title" class="text-xs text-red-500">Goal name is required</p>
                </div>

                <!-- Description -->
                <div class="space-y-1">
                    <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" v-model="form.description" rows="3"
                        placeholder="Describe what you want to achieve..."
                        class="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm px-4 py-2.5 border"></textarea>
                </div>

                <!-- Target Date & Overall Score -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div class="space-y-1">
                        <label for="target-date" class="block text-sm font-medium text-gray-700">Target Date *</label>
                        <input type="date" id="target-date" v-model="form.deadline"
                            :class="['w-full rounded-lg shadow-sm focus:ring-teal-500 sm:text-sm px-4 py-2.5 border', errors.deadline ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-teal-500']" />
                        <p v-if="errors.deadline" class="text-xs text-red-500">Target date is required</p>
                    </div>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <label class="block text-sm font-medium text-gray-700">Overall Target Score</label>
                            <span class="text-sm font-bold text-gray-900">{{ form.targetScore }}</span>
                        </div>
                        <input type="range" min="0" max="100" v-model.number="form.targetScore"
                            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                    </div>
                </div>

                <!-- Pillar Targets -->
                <div>
                    <h3 class="text-base font-semibold text-gray-900 mb-4">Pillar Targets</h3>
                    <p class="text-sm text-gray-500 mb-4">Set individual targets for each pillar. Current scores are
                        shown for reference.</p>
                    <div class="space-y-4">
                        <div v-for="pillar in form.pillars" :key="pillar.name" class="space-y-1">
                            <div class="flex items-center justify-between text-sm">
                                <span class="font-medium text-gray-900">{{ pillar.name }}</span>
                                <div class="flex items-center gap-2 text-xs">
                                    <span class="text-gray-500">{{ pillar.score }}</span>
                                    <span class="text-gray-300">→</span>
                                    <span class="text-teal-600 font-semibold">{{ pillar.target }}</span>
                                    <span v-if="pillar.target > pillar.score" class="text-orange-500 font-medium">
                                        (+{{ pillar.target - pillar.score }})
                                    </span>
                                </div>
                            </div>
                            <input type="range" v-model.number="pillar.target" min="0" max="100" step="1"
                                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                <button @click="close"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors">
                    Cancel
                </button>
                <button @click="createGoal" :disabled="loading"
                    class="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-50 flex items-center gap-2">
                    <span v-if="loading"
                        class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {{ loading ? 'Creating...' : 'Create Goal' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from 'vue'
import { useDashboardStore } from '~/stores/dashboard.store'
import { calculateOverallScore } from '~/utils/helpers'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close', 'create'])
const dashboardStore = useDashboardStore()
const loading = ref(false)
const errors = reactive({
    title: false,
    deadline: false
})

const form = reactive({
    title: '',
    description: '',
    deadline: '',
    targetScore: 80,
    pillars: [] as { name: string, score: number, target: number, weight: number }[]
})

// Quick Templates Logic
const quickTemplates = computed(() => {
    return dashboardStore.actions.filter((a: any) => a.priority === 'high' || a.priority === 'medium' || a.pillarRisk === 'high' || a.pillarRisk === 'medium')
})

function applyTemplate(template: any) {
    if (!template) return
    form.title = template.title

    let desc = `Context: ${template.description}\n\nCurrent Status: ${template.userAnswer}`
    if (template.bestOption) {
        desc += `\nTarget Objective: ${template.bestOption}`
    }
    form.description = desc

    if (template.pillar && form.pillars.length) {
        const pillarNode = form.pillars.find(p => p.name.toLowerCase() === template.pillar.toLowerCase())
        if (pillarNode) {
            // Boost pillar target exactly by the framework impact, safely bounded.
            const boost = Math.ceil(template.impact || 0)
            const targetBefore = pillarNode.target
            pillarNode.target = Math.min(100, Math.round(pillarNode.score + boost))
        }
    }
}

// Initialize pillars from store data
const initializePillars = () => {
    if (dashboardStore.pillars.length > 0) {
        form.pillars = dashboardStore.pillars.map(p => {
            const safeScore = Math.min(100, p.score)
            return {
                name: p.name,
                score: safeScore,
                target: Math.min(safeScore + 10, 100), // Default target slightly higher than current
                weight: p.weight || 0
            }
        })
        // Accurately calculate initial weighted target score
        form.targetScore = calculateOverallScore(form.pillars.map(p => ({ score: p.target, weight: p.weight })))
    }
}

let isSyncing = false

watch(() => form.targetScore, (newVal) => {
    if (isSyncing || form.pillars.length === 0) return
    isSyncing = true

    const currentAvg = calculateOverallScore(form.pillars.map(p => ({ score: p.target, weight: p.weight })))
    const diff = newVal - currentAvg

    if (Math.abs(diff) >= 0.5) {
        // Find total points to distribute
        let remainingPointsToDistribute = diff * form.pillars.length
        
        // Loop up to 5 times to distribute points that hit the 100 cap
        let passes = 0
        while (Math.abs(remainingPointsToDistribute) > 0.1 && passes < 5) {
            let activePillars = 0
            if (remainingPointsToDistribute > 0) {
                activePillars = form.pillars.filter(p => p.target < 100).length
            } else {
                activePillars = form.pillars.filter(p => p.target > 0).length
            }

            if (activePillars === 0) break // All capped! Unsolvable limit

            const share = remainingPointsToDistribute / activePillars
            remainingPointsToDistribute = 0

            form.pillars.forEach((p) => {
                if ((share > 0 && p.target < 100) || (share < 0 && p.target > 0)) {
                    let newScore = p.target + share
                    if (newScore > 100) {
                        remainingPointsToDistribute += newScore - 100
                        newScore = 100
                    } else if (newScore < 0) {
                        remainingPointsToDistribute += newScore
                        newScore = 0
                    }
                    p.target = newScore
                }
            })
            passes++
        }
        
        form.pillars.forEach((p) => { p.target = Math.max(0, Math.min(100, Math.round(p.target))) })
    }

    setTimeout(() => { isSyncing = false }, 10)
})

watch(() => form.pillars, (newPillars) => {
    if (isSyncing || newPillars.length === 0) return
    isSyncing = true

    form.targetScore = calculateOverallScore(newPillars.map(p => ({ score: p.target, weight: p.weight })))

    setTimeout(() => { isSyncing = false }, 10)
}, { deep: true })

// Watch for modal opening to refresh data
watch(() => props.isOpen, async (newValue) => {
    if (newValue) {
        errors.title = false
        errors.deadline = false
        if (dashboardStore.pillars.length === 0) {
            await dashboardStore.fetchDashboardData()
        }
        initializePillars()
    }
})

onMounted(async () => {
    if (dashboardStore.pillars.length === 0) {
        try {
            await dashboardStore.fetchDashboardData()
            initializePillars()
        } catch (error) {
            console.error('Failed to load pillar data for goals', error)
        }
    } else {
        initializePillars()
    }
})

function close() {
    if (loading.value) return
    emit('close')
}

async function createGoal() {
    // Reset errors
    errors.title = !form.title
    errors.deadline = !form.deadline

    if (errors.title || errors.deadline) {
        return
    }

    loading.value = true
    try {
        await emit('create', { ...form })
        // Parent caller handles closing and fetching
    } catch (e) {
        console.error('Goal creation failed', e)
    } finally {
        loading.value = false
    }
}
</script>
