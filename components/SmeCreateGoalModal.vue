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
                    <div class="space-y-5">
                        <div v-for="(pillar, index) in form.pillars" :key="index"
                            class="grid grid-cols-12 gap-4 items-center">
                            <div class="col-span-4 sm:col-span-3">
                                <label class="text-sm font-medium text-gray-700">{{ pillar.name }}</label>
                            </div>
                            <div class="col-span-6 sm:col-span-7">
                                <input type="range" min="0" max="100" v-model.number="pillar.target"
                                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                            </div>
                            <div class="col-span-2 text-right flex items-center justify-end gap-2 text-xs sm:text-sm">
                                <span class="text-gray-400 hover:text-gray-600 cursor-help" title="Current Score">{{
                                    pillar.score }}</span>
                                <span class="text-gray-300">→</span>
                                <span class="font-semibold text-teal-600">{{ pillar.target }}</span>
                            </div>
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
import { ref, reactive, watch, onMounted } from 'vue'
import { useDashboardStore } from '~/stores/dashboard.store'

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
    pillars: [] as { name: string, score: number, target: number }[]
})

// Initialize pillars from store data
const initializePillars = () => {
    if (dashboardStore.pillars.length > 0) {
        form.pillars = dashboardStore.pillars.map(p => ({
            name: p.name,
            score: p.score,
            target: Math.min(p.score + 10, 100) // Default target slightly higher than current
        }))
        // Calculate a reasonable default overall target score
        const avgScore = form.pillars.reduce((acc, p) => acc + p.score, 0) / form.pillars.length
        form.targetScore = Math.min(Math.round(avgScore + 10), 100)
    }
}

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
