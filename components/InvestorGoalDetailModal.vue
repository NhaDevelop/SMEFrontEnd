<template>
    <TransitionRoot as="template" :show="isOpen">
        <Dialog as="div" class="relative z-50" @close="closeModal">
            <!-- Backdrop -->
            <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0"
                enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-hidden">
                <div class="absolute inset-0 overflow-hidden">
                    <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                        <TransitionChild as="template"
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enter-from="translate-x-full" enter-to="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leave-from="translate-x-0" leave-to="translate-x-full">
                            <DialogPanel class="pointer-events-auto w-screen max-w-2xl">
                                <div class="flex h-full flex-col bg-white shadow-xl">

                                    <!-- Header Button Close -->
                                    <div
                                        class="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm z-10 sticky top-0">
                                        <div>
                                            <div class="flex items-center gap-3 mb-1">
                                                <h2 class="text-lg font-bold text-gray-900">{{ goal.title }}</h2>
                                                <span
                                                    :class="['px-2 py-0.5 rounded text-xs font-semibold uppercase', getStatusColor(goal.status)]">
                                                    {{ goal.status }}
                                                </span>
                                                <span v-if="goal.isOffTrack"
                                                    class="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-red-100 text-red-600">
                                                    Off Track
                                                </span>
                                            </div>
                                            <p class="text-sm text-gray-500">{{ goal.description }}</p>
                                        </div>
                                        <button @click="closeModal"
                                            class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                            <span class="sr-only">Close panel</span>
                                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    <!-- Main Scrollable Content -->
                                    <div class="flex-1 overflow-y-auto bg-gray-50 p-6 space-y-6">

                                        <!-- SME Info Card -->
                                        <div
                                            class="bg-white rounded-xl p-4 flex items-center justify-between border border-gray-200 shadow-sm">
                                            <div>
                                                <h3 class="font-bold text-gray-900">{{ goal.smeName }}</h3>
                                                <p class="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                                    <BuildingOfficeIcon class="w-3 h-3" /> {{ goal.sector }}
                                                    <span class="text-gray-300">|</span>
                                                    <MapPinIcon class="w-3 h-3" /> {{ goal.location }}
                                                </p>
                                            </div>
                                            <button
                                                class="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                                                View Profile
                                            </button>
                                        </div>

                                        <!-- Goal Progress Bar -->
                                        <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                            <div class="flex justify-between items-end mb-2">
                                                <span class="text-sm font-bold text-gray-900">Goal Progress</span>
                                                <span class="text-2xl font-bold text-orange-500">{{ goal.progress
                                                    }}%</span>
                                            </div>
                                            <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div class="h-full bg-emerald-600 rounded-full"
                                                    :style="{ width: goal.progress + '%' }"></div>
                                            </div>
                                            <div class="flex justify-between items-center text-xs text-gray-500 mt-4">
                                                <div class="flex items-center gap-4">
                                                    <span class="flex items-center gap-1">
                                                        <ArrowTrendingUpIcon class="w-4 h-4 text-gray-400" /> <span
                                                            class="text-gray-600">Current:</span> <span
                                                            class="font-medium text-gray-900">{{ goal.currentScore
                                                            }}</span>
                                                    </span>
                                                    <ArrowRightIcon class="w-3 h-3 text-gray-300" />
                                                    <span class="flex items-center gap-1"><span
                                                            class="w-4 h-4 rounded-full border border-emerald-500 flex items-center justify-center text-[10px] text-emerald-600">🎯</span>
                                                        <span class="text-gray-600">Target:</span> <span
                                                            class="font-bold text-gray-900">{{ goal.targetScore
                                                            }}</span></span>
                                                </div>
                                                <span class="text-red-500 font-medium flex items-center gap-1">
                                                    <CalendarIcon class="w-4 h-4" /> {{ goal.dueDate }}
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Tracking Summary Numbers -->
                                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <h4 class="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                                                <ArrowTrendingUpIcon class="w-4 h-4" /> Tracking Summary
                                            </h4>
                                            <div
                                                class="flex items-center justify-between text-center divide-x divide-gray-100">
                                                <div class="flex-1 px-4">
                                                    <p class="text-3xl font-bold text-gray-900">{{ goal.expectedScore }}
                                                    </p>
                                                    <p
                                                        class="text-[10px] uppercase tracking-wider text-gray-500 mt-1 font-medium">
                                                        Expected Now</p>
                                                </div>
                                                <div class="flex-1 px-4">
                                                    <p class="text-3xl font-bold text-orange-500">{{ goal.currentScore
                                                        }}</p>
                                                    <p
                                                        class="text-[10px] uppercase tracking-wider text-gray-500 mt-1 font-medium">
                                                        Actual Score</p>
                                                </div>
                                                <div class="flex-1 px-4">
                                                    <p class="text-3xl font-bold text-gray-900">0</p>
                                                    <p
                                                        class="text-[10px] uppercase tracking-wider text-gray-500 mt-1 font-medium">
                                                        Per Assessment</p>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Progress Trend Chart (Chart.js Line) -->
                                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <h4 class="text-lg font-medium text-gray-900 mb-4">Progress vs Expected</h4>
                                            <div class="h-64 w-full">
                                                <Line :data="trendData" :options="trendOptions" />
                                            </div>
                                        </div>

                                        <!-- Radar Chart (Chart.js Radar) -->
                                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <h4 class="text-lg font-medium text-gray-900 mb-2">Current vs Target Scores
                                            </h4>
                                            <div class="h-80 w-full flex items-center justify-center">
                                                <Radar :data="radarData" :options="radarOptions" />
                                            </div>
                                        </div>

                                        <!-- Gap Analysis (Clean Horizontal Bars) -->
                                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <h4 class="text-sm font-bold text-gray-900 mb-6 font-medium">Gap Analysis
                                            </h4>

                                            <div class="relative">
                                                <!-- Vertical Grid Lines -->
                                                <div
                                                    class="absolute inset-y-0 left-24 right-0 flex pointer-events-none pb-6 z-0">
                                                    <div class="w-1/4 border-r border-gray-100 h-full"></div>
                                                    <div class="w-1/4 border-r border-gray-100 h-full"></div>
                                                    <div class="w-1/4 border-r border-gray-100 h-full relative">
                                                        <!-- Dashed Reference Line at 75% -->
                                                        <div
                                                            class="absolute right-0 top-0 bottom-0 border-r border-dashed border-emerald-300">
                                                        </div>
                                                    </div>
                                                    <div class="w-1/4 h-full"></div>
                                                </div>

                                                <div class="space-y-3 relative z-10 text-sm">
                                                    <div v-for="cat in gapData" :key="cat.name"
                                                        class="flex items-center">
                                                        <!-- Label -->
                                                        <div
                                                            class="w-24 text-right pr-4 text-xs font-medium text-gray-500 shrink-0">
                                                            {{ cat.name }}</div>

                                                        <!-- Bar Container -->
                                                        <div
                                                            class="relative h-5 flex-1 bg-gray-50 rounded-sm flex items-center group cursor-help">
                                                            <!-- Target Bar (Background) -->
                                                            <div class="absolute top-0 left-0 h-full bg-emerald-50 rounded-sm transition-all duration-500"
                                                                :style="{ width: cat.target + '%' }"></div>

                                                            <!-- Current Bar (Foreground) -->
                                                            <div class="absolute top-0 left-0 h-full bg-[#115E59] rounded-sm transition-all duration-500 shadow-sm"
                                                                :style="{ width: cat.current + '%' }"></div>

                                                            <!-- Tooltip -->
                                                            <div
                                                                class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50 min-w-[120px] pointer-events-none">
                                                                <div
                                                                    class="bg-white rounded-lg shadow-lg border border-gray-100 p-3 text-sm text-left">
                                                                    <div
                                                                        class="font-semibold text-gray-900 mb-1.5 border-b border-gray-50 pb-1">
                                                                        {{ cat.name }}</div>
                                                                    <div class="flex flex-col gap-1">
                                                                        <span
                                                                            class="text-emerald-700 font-medium whitespace-nowrap">current
                                                                            : {{ cat.current }}</span>
                                                                        <span
                                                                            class="text-emerald-900 font-medium whitespace-nowrap">target
                                                                            : {{ cat.target }}</span>
                                                                        <span
                                                                            class="text-gray-500 whitespace-nowrap">gap
                                                                            :
                                                                            {{ Math.max(0, cat.target - cat.current)
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
                                                </div>

                                                <!-- X-Axis -->
                                                <div class="flex items-center mt-3">
                                                    <div class="w-24 shrink-0"></div>
                                                    <div
                                                        class="flex-1 flex justify-between text-[10px] text-gray-400 font-mono px-0">
                                                        <span class="translate-x-[-50%]">0</span>
                                                        <span class="translate-x-[-50%]">25</span>
                                                        <span class="translate-x-[-50%]">50</span>
                                                        <span class="translate-x-[-50%]">75</span>
                                                        <span class="translate-x-[-50%]">100</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Improvements Section -->
                                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                            <h4 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                <span class="text-orange-500">⚡</span> Priority Improvements
                                            </h4>
                                            <div class="space-y-4">
                                                <div v-for="(imp, idx) in improvements" :key="idx"
                                                    class="flex items-center justify-between group">
                                                    <div class="flex items-center gap-4">
                                                        <span
                                                            class="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">
                                                            {{ Number(idx) + 1 }}
                                                        </span>
                                                        <span class="text-sm font-medium text-gray-900">{{ imp.name
                                                            }}</span>
                                                    </div>
                                                    <div class="flex items-center gap-6 text-xs">
                                                        <div class="text-gray-500 font-medium font-mono">
                                                            {{ imp.current }} <span class="mx-1 text-gray-300">→</span>
                                                            <span class="text-emerald-600 font-bold">{{ imp.target
                                                                }}</span>
                                                        </div>
                                                        <span
                                                            class="px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-700 font-bold shadow-sm min-w-[3rem] text-center">
                                                            +{{ imp.points }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Proof of Achievement (Rendered when completed) -->
                                        <div v-if="(goal.status?.toLowerCase() === 'achieved' || goal.status?.toLowerCase() === 'pending verification') && (goal.proofNote || goal.proofDocument)"
                                            class="bg-emerald-50 rounded-xl shadow-sm border border-emerald-100 p-6 mb-6">
                                            <h4 class="text-sm font-bold text-emerald-900 mb-2 flex items-center gap-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                    fill="currentColor" class="w-5 h-5 text-emerald-600">
                                                    <path fill-rule="evenodd"
                                                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75 0 00-1.06 1.06l2.25 2.25a.75 0 001.14-.094l3.74-5.24z"
                                                        clip-rule="evenodd" />
                                                </svg>
                                                Proof of Achievement
                                            </h4>
                                            <p v-if="goal.proofNote" class="text-sm text-emerald-800 mb-4 italic">"{{
                                                goal.proofNote }}"</p>

                                            <div v-if="goal.proofDocument"
                                                class="flex items-center gap-3 p-3 bg-white rounded-lg border border-emerald-100 shadow-sm">
                                                <div
                                                    class="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-4 h-4">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                    </svg>
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <p class="text-sm font-medium text-gray-900 truncate">{{
                                                        goal.proofDocument ? goal.proofDocument.split('/').pop() :
                                                        'Attached Document' }}</p>
                                                    <p class="text-xs text-gray-500">Attached Evidence</p>
                                                </div>
                                                <a :href="getDocumentUrl(goal.proofDocument)" target="_blank"
                                                    class="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                                        class="w-3 h-3">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                    </svg>
                                                    View & Download
                                                </a>
                                            </div>
                                        </div>

                                        <!-- Footer Buttons -->
                                        <div v-if="goal.status !== 'Achieved'"
                                            class="flex justify-between gap-3 pt-6 mt-8 border-t border-gray-200 pb-4">
                                            <button v-if="goal.status === 'Active'" @click="markAsAchieved"
                                                class="flex-1 px-4 py-2.5 bg-[#115E59] text-white rounded-lg hover:bg-[#0F514C] font-medium flex items-center justify-center gap-2 shadow-sm transition-colors">
                                                <div
                                                    class="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                                                    <div class="w-2 h-2 bg-white rounded-full"></div>
                                                </div>
                                                Mark as Achieved
                                            </button>
                                            <button @click="pauseGoal" :class="[
                                                'px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 transition-colors',
                                                goal.status !== 'Active' ? 'flex-1 justify-center' : ''
                                            ]">
                                                <span class="w-4 h-4 rounded-full border-2 border-gray-400"></span>
                                                {{ goal.status === 'Paused' ? 'Resume' : 'Pause' }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
} from '@headlessui/vue'
import {
    XMarkIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    ArrowTrendingUpIcon,
    CalendarIcon,
    ArrowRightIcon
} from '@heroicons/vue/24/outline'

const getDocumentUrl = (path: string) => {
    if (!path) return '#'
    if (path.startsWith('http')) return path
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase.replace('/api', '')
    return `${apiBase}/storage/${path}`
}

// Chart.js imports
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { Radar, Line } from 'vue-chartjs'

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale
)

const props = defineProps<{
    isOpen: boolean
    goal: any
}>()

const emit = defineEmits(['close', 'update-status'])

const closeModal = () => {
    emit('close')
}

const markAsAchieved = () => {
    emit('update-status', { id: props.goal.id, status: 'Achieved' })
    closeModal()
}

const pauseGoal = () => {
    const newStatus = props.goal.status === 'Paused' ? 'Active' : 'Paused'
    emit('update-status', { id: props.goal.id, status: newStatus })
    closeModal()
}

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'active': return 'bg-blue-100 text-blue-700'
        case 'achieved': return 'bg-green-100 text-green-700'
        case 'paused': return 'bg-gray-100 text-gray-700'
        default: return 'bg-gray-100 text-gray-700'
    }
}

// Shared Computed Extractors
const targetScore = computed(() => props.goal?.targetScore || 80)
const safePillars = computed(() => {
    const pPillars = props.goal?.profilePillars || []
    const gPillars = props.goal?.goalPillars || []

    if (gPillars.length === 0) return pPillars

    return gPillars.map((gp: any) => {
        const pp = pPillars.find((p: any) => (p.name || p.pillar_name) === (gp.name || gp.pillar_name))
        return {
            ...gp,
            name: gp.name || gp.pillar_name,
            score: pp ? (pp.score || 0) : (gp.score || gp.currentScore || 0),
            target: gp.target || gp.targetScore || targetScore.value
        }
    })
})
const safeHistory = computed(() => props.goal?.readinessHistory || [])
const defaultLabels = ['Team', 'Business', 'Market', 'Financial', 'Operations', 'Legal', 'Growth', 'Data']
const fallbackScores = [35, 45, 65, 40, 48, 55, 40, 88]

const goalData = ref<any>(null)

const handleMockDownload = () => {
    alert('Document download simulated')
}

// Radar Chart Configuration
const radarData = computed(() => {
    const labels = safePillars.value.length > 0 ? safePillars.value.map((p: any) => p.name || p.pillar_name) : defaultLabels
    const currentData = safePillars.value.length > 0 ? safePillars.value.map((p: any) => p.score) : fallbackScores
    const targetData = safePillars.value.length > 0 ? safePillars.value.map((p: any) => p.target || targetScore.value) : labels.map(() => targetScore.value)

    return {
        labels,
        datasets: [
            {
                label: 'Target',
                backgroundColor: 'transparent',
                borderColor: '#10b981',
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#10b981',
                pointHoverBorderColor: '#fff',
                data: targetData,
                borderDash: [5, 5],
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4
            },
            {
                label: 'Current',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: '#10b981',
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#10b981',
                pointHoverBorderColor: '#fff',
                data: currentData,
                borderWidth: 2,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 5
            }
        ]
    }
})

const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        r: {
            angleLines: {
                display: true,
                color: '#f3f4f6'
            },
            grid: {
                color: '#e5e7eb'
            },
            pointLabels: {
                color: '#6b7280',
                font: {
                    size: 11
                }
            },
            ticks: {
                backdropColor: 'transparent',
                color: '#9ca3af',
                stepSize: 25,
                showLabelBackdrop: false
            },
            suggestedMin: 0,
            suggestedMax: 100
        }
    },
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: {
                usePointStyle: true,
                boxWidth: 8,
                padding: 20,
                color: '#374151'
            }
        },
        tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#111827',
            bodyColor: '#374151',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            callbacks: {
                labelColor: function (context: any) {
                    return {
                        borderColor: context.dataset.borderColor,
                        backgroundColor: context.dataset.borderColor,
                        borderWidth: 2,
                        borderRadius: 2,
                    };
                }
            }
        }
    }
}

// Trend Line Chart Configuration
const trendData = computed(() => {
    const history = safeHistory.value.length > 0 ? [...safeHistory.value].reverse() : [35, 36, 38, 40, 42, 45, 48, 50, 51, 51, 53]
    const labels = history.map((_, i) => i === history.length - 1 ? 'Now' : `Past ${history.length - 1 - i}`)
    const targetData = labels.map(() => targetScore.value)

    // Smooth expected line bridging the gap
    const expectedData = labels.map((_, i) => {
        const startScore = history[0] || 0
        const step = (targetScore.value - startScore) / Math.max(1, labels.length - 1)
        return Math.min(targetScore.value, Math.round(startScore + (step * i)))
    })

    return {
        labels,
        datasets: [
            {
                label: 'Target',
                data: targetData,
                borderColor: '#10b981',
                borderDash: [5, 5],
                borderWidth: 1.5,
                pointRadius: 4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#10b981',
                pointBorderWidth: 1.5,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#d1fae5',
                pointHoverBorderColor: '#10b981',
                pointHoverBorderWidth: 2,
                fill: false
            },
            {
                label: 'Expected',
                data: expectedData,
                borderColor: '#9ca3af',
                borderDash: [5, 5],
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#9ca3af',
                pointBorderWidth: 1.5,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#e5e7eb',
                pointHoverBorderColor: '#9ca3af',
                pointHoverBorderWidth: 2,
                fill: false,
                tension: 0.4
            },
            {
                label: 'Actual',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: '#10b981',
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#10b981',
                pointBorderWidth: 2,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#10b981',
                pointHoverBorderColor: '#10b981',
                data: history,
                fill: true,
                tension: 0.4
            }
        ]
    }
})

const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            max: 100,
            grid: {
                color: '#f3f4f6',
                drawBorder: false,
                borderDash: [4, 4]
            },
            ticks: {
                stepSize: 25,
                color: '#6b7280',
                font: { size: 10 }
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                color: '#6b7280',
                font: { size: 10 },
                autoSkip: true,
                maxTicksLimit: 3
            }
        }
    },
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: {
                usePointStyle: true,
                boxWidth: 8,
                padding: 20
            }
        },
        tooltip: {
            backgroundColor: '#ffffff',
            titleColor: '#111827',
            titleFont: { size: 13, weight: 'bold' as const },
            bodyColor: '#374151',
            bodyFont: { size: 12 },
            borderColor: '#e5e7eb',
            borderWidth: 1,
            padding: 10,
            boxPadding: 4,
            usePointStyle: true,
            callbacks: {
                labelColor: function (context: any) {
                    let borderColor = context.dataset.borderColor;
                    let backgroundColor = '#ffffff';

                    if (context.dataset.label === 'Actual') {
                        backgroundColor = '#10b981';
                    } else if (context.dataset.label === 'Expected') {
                        backgroundColor = '#d1d5db';
                        borderColor = '#9ca3af';
                    } else if (context.dataset.label === 'Target') {
                        backgroundColor = '#d1fae5';
                        borderColor = '#10b981';
                    }

                    return {
                        borderColor: borderColor,
                        backgroundColor: backgroundColor,
                        borderWidth: 2,
                        borderRadius: 6,
                    };
                }
            }
        }
    },
    interaction: {
        intersect: false,
        mode: 'index' as const,
    },
}

const gapData = computed(() => {
    const isAchieved = props.goal.status === 'Achieved'

    if (safePillars.value.length > 0) {
        return safePillars.value.map((p: any) => ({
            name: p.name || p.pillar_name,
            current: isAchieved ? (p.target || targetScore.value) : p.score,
            target: p.target || targetScore.value
        }))
    }
    return fallbackScores.map((score, i) => ({
        name: defaultLabels[i],
        current: isAchieved ? targetScore.value : score,
        target: targetScore.value
    }))
})

const improvements = computed(() => {
    if (props.goal.status === 'Achieved') return []

    return gapData.value
        .map((g: any) => ({
            name: g.name,
            current: g.current,
            target: g.target,
            points: Math.max(0, g.target - g.current)
        }))
        .filter((g: any) => g.points > 0)
        .sort((a: any, b: any) => b.points - a.points)
        .slice(0, 4)
})
</script>
