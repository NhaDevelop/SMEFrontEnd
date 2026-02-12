<template>
    <div class="min-h-screen bg-gray-50 p-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Goals & Targets</h1>
                <p class="text-gray-500">Set and track your investment readiness goals</p>
            </div>
            <button @click="showCreateGoalModal = true"
                class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Goal
            </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <FlagIcon class="w-6 h-6" />
                </div>
                <div>
                    <div class="text-2xl font-bold text-gray-900">2</div>
                    <div class="text-sm text-gray-500">Total Goals</div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6l5.25 3.15-.75 1.23-5.5-3.3V7z" />
                    </svg>
                </div>
                <div>
                    <div class="text-2xl font-bold text-gray-900">1</div>
                    <div class="text-sm text-gray-500">Active</div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                    </svg>
                </div>
                <div>
                    <div class="text-2xl font-bold text-gray-900">1</div>
                    <div class="text-sm text-gray-500">Achieved</div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                    <BoltIcon class="w-6 h-6" />
                </div>
                <div>
                    <div class="text-2xl font-bold text-gray-900">38%</div>
                    <div class="text-sm text-gray-500">Avg Progress</div>
                </div>
            </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 mb-6">
            <button v-for="tab in filters" :key="tab" @click="activeFilter = tab" :class="[
                'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                activeFilter === tab
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
            ]">
                {{ tab }}
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Goals List -->
            <div class="lg:col-span-2 space-y-4">
                <div v-for="goal in filteredGoals" :key="goal.id" @click="selectedGoal = goal" :class="[
                    'bg-white rounded-xl p-6 border transition-all cursor-pointer',
                    selectedGoal?.id === goal.id ? 'border-teal-500 ring-1 ring-teal-500 shadow-md' : 'border-gray-200 hover:border-gray-300 shadow-sm'
                ]">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex items-center gap-3">
                            <h3 class="text-lg font-bold text-gray-900">{{ goal.title }}</h3>
                            <span :class="[
                                'px-2 py-0.5 text-xs font-semibold rounded-full',
                                goal.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                            ]">{{ goal.status }}</span>
                        </div>
                        <button class="text-gray-400 hover:text-gray-600">...</button>
                    </div>
                    <p class="text-sm text-gray-500 mb-4">{{ goal.description }}</p>

                    <div class="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                            </svg>
                            Target: <span class="font-semibold">{{ goal.targetScore }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                            </svg>
                            {{ goal.deadline }}
                        </div>
                        <div v-if="goal.overdue" class="flex items-center gap-1 text-red-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {{ goal.overdue }} days overdue
                        </div>
                    </div>

                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span class="font-medium text-gray-700">Progress to target</span>
                            <span class="font-bold text-gray-900">{{ goal.progress }}%</span>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-2 mb-1">
                            <div class="bg-teal-600 h-2 rounded-full" :style="{ width: `${goal.progress}%` }"></div>
                        </div>
                        <div class="flex justify-between text-xs text-gray-500">
                            <span>Current: {{ goal.currentScore }}</span>
                            <span>Target: {{ goal.targetScore }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Details Sidebar -->
            <div class="lg:col-span-1">
                <div v-if="selectedGoal" class="space-y-6">
                    <!-- Current vs Target Chart -->
                    <div v-if="radarData" class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 class="font-bold text-gray-900 mb-2">Current vs Target</h3>
                        <p class="text-sm text-gray-500 mb-4">Pillar score comparison</p>
                        <div class="h-64">
                            <ComparisonRadarChart :data="radarData" />
                        </div>
                        <div class="flex justify-center gap-4 mt-2">
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 bg-blue-500 rounded-sm"></div>
                                <span class="text-xs text-gray-600">Current</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 bg-green-500 rounded-sm"></div>
                                <span class="text-xs text-gray-600">Target</span>
                            </div>
                        </div>
                    </div>


                    <!-- Gap Analysis -->

                    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div class="mb-6">
                            <h3 class="font-bold text-gray-900">Gap Analysis</h3>
                            <p class="text-sm text-gray-500 mt-1">Points needed to reach target</p>
                        </div>

                        <div class="flex gap-4">
                            <!-- Y-Axis Labels -->
                            <div
                                class="flex flex-col justify-between pb-6 w-20 text-xs font-semibold text-gray-600 text-right pr-2 space-y-4">
                                <div v-for="pillar in selectedGoal.pillars" :key="pillar.name"
                                    class="h-6 flex items-center justify-end">
                                    {{ pillar.name }}
                                </div>
                            </div>

                            <!-- Chart Area -->
                            <div class="flex-1 relative">
                                <!-- Grid Lines -->
                                <div
                                    class="absolute inset-0 flex justify-between pointer-events-none pb-6 pl-0 border-l border-gray-100 border-r">
                                    <div class="w-px h-full bg-gray-100 border-r border-dashed border-gray-300"></div>
                                    <div class="w-px h-full bg-gray-100 border-r border-dashed border-gray-300"></div>
                                    <div class="w-px h-full bg-gray-100 border-r border-dashed border-gray-300"></div>
                                    <div class="w-px h-full bg-gray-100 border-r border-dashed border-gray-300"></div>
                                    <!-- 0 and 100 are handled by container borders/spacing if needed, or explicitly added -->
                                </div>

                                <!-- Bars -->
                                <div class="flex flex-col justify-between space-y-4 relative z-10">
                                    <div v-for="pillar in selectedGoal.pillars" :key="pillar.name"
                                        class="h-6 w-full bg-gray-100 rounded-r-md relative group cursor-help">
                                        <div class="h-full bg-blue-500 rounded-r-md transition-all duration-500"
                                            :style="{ width: `${pillar.score}%` }"></div>

                                        <!-- Tooltip -->
                                        <div
                                            class="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 hidden group-hover:block z-50 min-w-[120px] pointer-events-none">
                                            <div
                                                class="bg-white rounded-lg shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-gray-100 p-3 text-sm">
                                                <div
                                                    class="font-semibold text-gray-900 mb-1.5 border-b border-gray-50 pb-1">
                                                    {{ pillar.name }}</div>
                                                <div class="flex flex-col gap-1">
                                                    <span class="text-blue-600 font-medium">current : {{ pillar.score
                                                    }}</span>
                                                    <span class="text-gray-300">gap : {{ pillar.target - pillar.score
                                                    }}</span>
                                                </div>
                                            </div>
                                            <!-- Arrow -->
                                            <div
                                                class="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white drop-shadow-sm">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- X-Axis Labels -->
                                <div
                                    class="flex justify-between text-xs text-gray-400 mt-2 absolute w-full bottom-0 translate-y-full">
                                    <span>0</span>
                                    <span>25</span>
                                    <span>50</span>
                                    <span>75</span>
                                    <span>100</span>
                                </div>
                            </div>
                        </div>
                        <!-- Spacer for X-Axis labels -->
                        <div class="h-6"></div>
                    </div>

                    <!-- Priority Actions -->
                    <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 class="font-bold text-gray-900 mb-4">Priority Actions</h3>
                        <p class="text-sm text-gray-500 mb-4">Focus areas to reach your goal</p>
                        <div class="space-y-3">
                            <div v-for="(action, idx) in selectedGoal.actions" :key="idx"
                                class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div :class="[
                                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 shadow-sm',
                                    idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-orange-400' : 'bg-blue-500'
                                ]">
                                    {{ idx + 1 }}
                                </div>
                                <div>
                                    <div class="font-bold text-gray-900 text-sm mb-0.5">{{ action.title }}</div>
                                    <div class="text-xs text-gray-500 font-medium">+{{ action.points }} points needed
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else
                    class="bg-white rounded-xl p-12 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                    <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-8 h-8 text-gray-400">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900">Select a Goal</h3>
                    <p class="text-sm text-gray-500 max-w-xs mt-2">Click on a goal to view detailed progress and gap
                        analysis</p>
                </div>
            </div>
        </div>
        <CreateGoalModal :is-open="showCreateGoalModal" @close="showCreateGoalModal = false"
            @create="handleCreateGoal" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { FlagIcon, BoltIcon } from '@heroicons/vue/24/outline'
import ComparisonRadarChart from '~/components/dashboard/ComparisonRadarChart.vue'
import CreateGoalModal from '~/components/sme/CreateGoalModal.vue'

interface Pillar {
    name: string
    score: number
    target: number
}

interface Action {
    title: string
    points: number
}

interface Gap {
    pillar: string
    current: number
}

interface Goal {
    id: number
    title: string
    status: string
    description: string
    targetScore: number
    currentScore: number
    deadline: string
    overdue: number | null
    progress: number
    pillars: Pillar[]
    gaps: Gap[]
    actions: Action[]
}

definePageMeta({
    layout: 'default',
    middleware: ['auth', 'sme']
})

const activeFilter = ref('Active (1)')
const filters = ['Active (1)', 'Achieved (1)', 'All (2)']
const selectedGoal = ref<Goal | null>(null)
const showCreateGoalModal = ref(false)

const handleCreateGoal = (goalData: any) => {
    const newGoal: Goal = {
        id: goals.value.length + 1,
        title: goalData.title,
        status: 'Active',
        description: goalData.description,
        targetScore: goalData.targetScore,
        currentScore: Math.round(goalData.pillars.reduce((acc: number, p: any) => acc + p.score, 0) / goalData.pillars.length),
        deadline: new Date(goalData.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        overdue: null,
        progress: 0, // Calculate based on scores
        pillars: goalData.pillars.map((p: any) => ({
            name: p.name.split(' ')[0], // Simplify name for display consistency if needed
            score: p.score,
            target: p.target
        })),
        gaps: [],
        actions: []
    }

    // Simple progress calculation
    const progress = Math.round((newGoal.currentScore / newGoal.targetScore) * 100)
    newGoal.progress = progress > 100 ? 100 : progress

    goals.value.unshift(newGoal)
    // Update filter count logic (simplistic for demo)
    filters[0] = `Active (${goals.value.filter(g => g.status === 'Active').length})`
    filters[2] = `All (${goals.value.length})`
}

const goals = ref<Goal[]>([
    {
        id: 1,
        title: 'Investor Ready by Q4 2024',
        status: 'Active',
        description: 'Achieve investor-ready status with 80+ overall score',
        targetScore: 80,
        currentScore: 56,
        deadline: 'Dec 31, 2024',
        overdue: 405,
        progress: 38,
        pillars: [
            { name: 'Team', score: 39, target: 85 },
            { name: 'Business', score: 58, target: 80 },
            { name: 'Market', score: 77, target: 85 },
            { name: 'Financial', score: 59, target: 90 },
            { name: 'Operations', score: 66, target: 75 },
            { name: 'Legal', score: 54, target: 80 },
            { name: 'Data', score: 42, target: 70 },
            { name: 'Growth', score: 53, target: 80 }
        ],
        gaps: [
            { pillar: 'Team', current: 39 },
            { pillar: 'Business', current: 58 },
            { pillar: 'Market', current: 77 },
            { pillar: 'Financial', current: 59 },
        ],
        actions: [
            { title: 'Team & Leadership', points: 46 },
            { title: 'Data & Digital Maturity', points: 28 },
            { title: 'Growth & Scalability', points: 27 },
        ]
    },
    {
        id: 2,
        title: 'Complete Initial Assessment',
        status: 'Achieved',
        description: 'Complete all sections of the initial assessment',
        targetScore: 100,
        currentScore: 100,
        deadline: 'Jan 15, 2024',
        overdue: null,
        progress: 100,
        pillars: [
            { name: 'Team', score: 100, target: 100 },
            { name: 'Business', score: 100, target: 100 },
            { name: 'Market', score: 100, target: 100 },
            { name: 'Financial', score: 100, target: 100 },
            { name: 'Operations', score: 100, target: 100 },
            { name: 'Legal', score: 100, target: 100 },
            { name: 'Data', score: 100, target: 100 },
            { name: 'Growth', score: 100, target: 100 }
        ],
        gaps: [],
        actions: [
            { title: 'Goal Achieved', points: 0 }
        ]
    }
])

onMounted(() => {
    const firstGoal = goals.value[0]
    if (firstGoal) {
        selectedGoal.value = firstGoal
    }
})

const filteredGoals = computed(() => {
    if (activeFilter.value.startsWith('Active')) return goals.value.filter(g => g.status === 'Active')
    if (activeFilter.value.startsWith('Achieved')) return goals.value.filter(g => g.status === 'Achieved')
    return goals.value
})

const radarData = computed(() => {
    if (!selectedGoal.value) return null
    return {
        labels: selectedGoal.value.pillars.map((p: any) => p.name),
        datasets: [
            {
                label: 'Current',
                data: selectedGoal.value.pillars.map((p: any) => p.score),
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3B82F6',
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: '#fff',
            },
            {
                label: 'Target',
                data: selectedGoal.value.pillars.map((p: any) => p.target),
                backgroundColor: 'transparent',
                borderColor: '#10B981', // Green
                pointBackgroundColor: '#10B981',
                borderDash: [5, 5]
            }
        ]
    }
})
</script>
