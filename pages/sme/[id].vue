<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6 mb-8 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button @click="$router.back()" class="text-gray-400 hover:text-gray-600">
                        <ArrowLeftIcon class="w-5 h-5" />
                    </button>

                    <div>
                        <div class="flex items-center gap-3">
                            <h1 class="text-2xl font-bold text-gray-900">{{ smeData.name }}</h1>
                            <span :class="[
                                'px-2.5 py-0.5 rounded-full text-xs font-bold border',
                                getRiskBadgeClass(smeData.riskLevel)
                            ]">
                                {{ smeData.riskLevel }} Risk
                            </span>
                            <span :class="[
                                'px-2.5 py-0.5 rounded-full text-xs font-bold border',
                                getStageBadgeClass(smeData.readinessStatus)
                            ]">
                                {{ smeData.readinessStatus || 'Early Stage' }}
                            </span>
                        </div>
                        <div class="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span class="flex items-center gap-1">
                                <BuildingOfficeIcon class="w-4 h-4" />
                                {{ smeData.industry }}
                            </span>
                            <span class="flex items-center gap-1">
                                <MapPinIcon class="w-4 h-4" />
                                {{ smeData.location }}
                            </span>
                            <span class="flex items-center gap-1">
                                <CalendarIcon class="w-4 h-4" />
                                Last assessed: {{ smeData.lastAssessed }}
                            </span>
                        </div>
                    </div>
                </div>

                <button @click="handleDownloadReport" :disabled="isDownloading"
                    class="px-4 py-2 bg-[#198754] text-white rounded-lg font-medium hover:bg-[#157347] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
                    <ArrowDownTrayIcon class="w-4 h-4" />
                    {{ isDownloading ? 'Downloading...' : 'Download Report' }}
                </button>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto custom-scrollbar px-8 pb-12">
            <div class="max-w-[1600px] mx-auto space-y-6">

                <!-- Top Metrics Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <!-- Readiness Score -->
                    <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
                        <div class="flex items-center gap-6">
                            <div>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-5xl font-bold text-amber-500">{{ smeData.score }}</span>
                                    <span class="text-sm text-gray-400 font-medium">/100</span>
                                </div>
                                <p class="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wide">Investment
                                    Readiness Score</p>
                            </div>
                            <div class="h-12 w-px bg-gray-100"></div>
                            <div>
                                <span :class="[
                                    'px-3 py-1 rounded-full text-xs font-bold border',
                                    getStageBadgeClass(smeData.readinessStatus)
                                ]">
                                    {{ smeData.readinessStatus || 'Early Stage' }}
                                </span>
                                <p class="text-xs text-gray-500 mt-2">Based on 8 readiness pillars</p>
                                <p class="text-xs text-red-500 mt-0.5 font-bold">-15 pts since first assessment</p>
                            </div>
                        </div>
                    </div>

                    <!-- Growth Potential -->
                    <div
                        class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                        <span class="text-3xl font-bold text-[#198754]">{{ smeData.growthPotential }}</span>
                        <p class="text-xs text-gray-500 mt-1 font-medium">Growth Potential</p>
                    </div>

                    <!-- Financial Risk -->
                    <div
                        class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                        <span :class="[
                            'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mb-1 border',
                            getRiskBadgeClass(smeData.riskLevel)
                        ]">
                            <span :class="['w-1.5 h-1.5 rounded-full', getRiskDotClass(smeData.riskLevel)]"></span>
                            {{ smeData.riskLevel }} Risk
                        </span>
                        <p class="text-xs text-gray-500 mt-1 font-medium">Financial Risk</p>
                    </div>

                    <!-- Stats -->
                    <div
                        class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                        <span class="text-2xl font-bold text-gray-900">{{ assessmentCount }}</span>
                        <p class="text-xs text-gray-500 mt-1 font-medium">Assessments</p>
                    </div>

                    <div
                        class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
                        <span class="text-2xl font-bold text-gray-900">{{ actions.length }}</span>
                        <p class="text-xs text-gray-500 mt-1 font-medium">Action Items</p>
                    </div>
                </div>

                <!-- Navigation Tabs -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm px-2">
                    <nav class="flex space-x-1">
                        <button @click="activeTab = 'overview'"
                            :class="[activeTab === 'overview' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50', 'px-4 py-3 rounded-lg text-sm flex items-center gap-2 transition-all my-1']">
                            <ChartBarIcon class="w-4 h-4" /> Overview
                        </button>
                        <button @click="activeTab = 'info'"
                            :class="[activeTab === 'info' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50', 'px-4 py-3 rounded-lg text-sm flex items-center gap-2 transition-all my-1']">
                            <BuildingOfficeIcon class="w-4 h-4" /> Company Info
                        </button>
                        <button @click="activeTab = 'pillars'"
                            :class="[activeTab === 'pillars' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50', 'px-4 py-3 rounded-lg text-sm flex items-center gap-2 transition-all my-1']">
                            <ListBulletIcon class="w-4 h-4" /> Pillar Details
                        </button>
                        <button @click="activeTab = 'actions'"
                            :class="[activeTab === 'actions' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50', 'px-4 py-3 rounded-lg text-sm flex items-center gap-2 transition-all my-1']">
                            <ClipboardDocumentCheckIcon class="w-4 h-4" /> Actions ({{ actions.length }})
                        </button>
                        <button @click="activeTab = 'notes'"
                            :class="[activeTab === 'notes' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50', 'px-4 py-3 rounded-lg text-sm flex items-center gap-2 transition-all my-1']">
                            <DocumentTextIcon class="w-4 h-4" /> Notes
                        </button>
                        <button @click="activeTab = 'history'"
                            :class="[activeTab === 'history' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50', 'px-4 py-3 rounded-lg text-sm flex items-center gap-2 transition-all my-1']">
                            <ClockIcon class="w-4 h-4" /> History ({{ assessmentCount }})
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                <div v-show="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Radar Chart -->
                    <div class="bg-white p-8 rounded-xl border border-gray-200 shadow-sm min-h-[400px] flex flex-col">
                        <div class="mb-4">
                            <h3 class="text-xl font-bold text-gray-900">Readiness Radar</h3>
                            <p class="text-sm text-gray-500 mt-1">Score breakdown across 8 pillars</p>
                        </div>
                        <div class="flex-1 flex items-center justify-center">
                            <RadarChart :pillars="pillars" />
                        </div>
                    </div>

                    <!-- Progress Chart -->
                    <div class="bg-white p-8 rounded-xl border border-gray-200 shadow-sm min-h-[400px] flex flex-col">
                        <div class="mb-4">
                            <h3 class="text-xl font-bold text-gray-900">Progress Over Time</h3>
                            <p class="text-sm text-gray-500 mt-1">Readiness score trend across assessments</p>
                        </div>
                        <div class="flex-1 flex items-center justify-center w-full">
                            <ProgressChart :data="progressData" />
                        </div>
                    </div>

                    <!-- Bottom Row Priority Actions Preview -->
                    <div class="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                            <div>
                                <h3 class="text-xl font-bold text-gray-900">Top Priority Actions</h3>
                                <p class="text-sm text-gray-500 mt-1">High-impact improvements to focus on</p>
                            </div>
                            <button @click="activeTab = 'actions'"
                                class="text-sm font-bold text-[#198754] hover:text-[#157347] flex items-center gap-1 group">
                                View All
                                <ArrowLongRightIcon class="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>

                        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                            <div v-for="(action, idx) in actions.slice(0, 4)" :key="idx"
                                class="border border-gray-200 rounded-xl p-5 flex items-start gap-4 bg-white hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer group">
                                <span
                                    class="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border bg-amber-50 text-amber-700 border-amber-100 mt-0.5">{{
                                        action.priority }}</span>
                                <div class="flex-1">
                                    <h4
                                        class="text-sm font-bold text-gray-900 group-hover:text-[#198754] transition-colors">
                                        {{ action.title }}</h4>
                                    <p class="text-xs text-gray-500 mt-1">{{ action.pillar }}</p>
                                </div>
                                <span
                                    class="text-xs font-bold text-[#198754] self-center bg-emerald-50 px-2 py-1 rounded-lg">+{{
                                        action.points }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <SmeCompInfo v-if="activeTab === 'info'" :sme="smeData" :highest="highestPillar" :lowest="lowestPillar"
                    :assessmentCount="assessmentCount" :actionCount="actions.length" />
                <SmePillarDetails v-if="activeTab === 'pillars'" :pillars="pillars" />
                <SmeActions v-if="activeTab === 'actions'" :actions="actions" />
                <SmeNotes v-if="activeTab === 'notes'" :smeName="smeData.name" />

                <div v-if="activeTab === 'history'"
                    class="bg-white p-12 text-center rounded-xl border border-gray-200 text-gray-500 mt-6 shadow-sm">
                    <ClockIcon class="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 class="text-lg font-medium text-gray-900">Assessment History</h3>
                    <p class="mt-1">View past assessment results and compare progress.</p>
                </div>

            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
    ArrowLeftIcon,
    BuildingOfficeIcon,
    MapPinIcon,
    CalendarIcon,
    ArrowDownTrayIcon,
    ChartBarIcon,
    ListBulletIcon,
    ClipboardDocumentCheckIcon,
    DocumentTextIcon,
    ClockIcon,
    ArrowLongRightIcon
} from '@heroicons/vue/24/outline'
import RadarChart from '~/components/DashboardRadarChart.vue'
import ProgressChart from '~/components/DashboardProgressChart.vue'
import SmeCompInfo from '~/components/SmeCompInfo.vue'
import SmePillarDetails from '~/components/SmePillarDetails.vue'
import SmeActions from '~/components/SmeActions.vue'
import SmeNotes from '~/components/SmeNotes.vue'

import { useInvestorStore } from '~/stores/investor.store'
import {
    generatePillarScores,
    generateProgressData
} from '~/utils/sme-data'

const route = useRoute()
const adminStore = useAdminStore()
const investorStore = useInvestorStore()
const isDownloading = ref(false)

const handleDownloadReport = async () => {
    isDownloading.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    isDownloading.value = false
    alert(`Report for ${smeData.value.name} has been downloaded.`)
}

const activeTab = ref('overview')

// Get SME ID from route
const smeId = computed(() => Array.isArray(route.params.id) ? route.params.id[0] : route.params.id)

// Fetch SME from store
const smeData = computed(() => {
    const id = smeId.value || ''

    // Try Admin Store first
    const adminSme = adminStore.getSmeById(id)
    if (adminSme) return adminSme


    // Try Investor Store
    const investorSme = investorStore.dealFlow.find(s => s.id == id)
    if (investorSme) {
        return {
            id: investorSme.id,
            name: investorSme.name,
            industry: investorSme.industry,
            location: investorSme.location,
            lastAssessed: investorSme.lastUpdated, // Map to lastAssessed
            riskLevel: investorSme.financialRisk, // Map to riskLevel
            readinessStatus: investorSme.stage, // Map to readinessStatus
            score: investorSme.score,
            growthPotential: investorSme.growthRate || 75, // Map or default
            readinessHistory: investorSme.readinessHistory || [],
            pillars: (investorSme as any).pillars
        }
    }

    // Fallback if not found (or while loading)
    return {
        id: id,
        name: 'Unknown SME',
        industry: '-',
        location: '-',
        lastAssessed: '-',
        riskLevel: 'Medium',
        readinessStatus: 'Unknown',
        score: 0,
        growthPotential: 0,
        readinessHistory: [] as number[],
        pillars: undefined as any[] | undefined
    }
})

// Deterministic random generator based on seed (ID) - for actions only
const seededRandom = (seed: number) => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// Use centralized pillar score generation for consistency
const pillars = computed(() => {
    const scores = smeData.value.pillars || generatePillarScores(smeData.value.id, smeData.value.score ?? 0)
    // Add fullMark property for radar chart compatibility
    return scores.map((pillar: any) => ({
        ...pillar,
        fullMark: 100
    }))
})

// Use centralized progress data generation
const progressData = computed(() => {
    return generateProgressData(
        smeData.value.id,
        smeData.value.score ?? 0,
        smeData.value.readinessHistory
    )
})

// Actions Logic
interface ActionItem {
    title: string
    priority: 'high' | 'medium' | 'low'
    pillar: string
    points: number
    completed: boolean
}

const actions = ref<ActionItem[]>([])


const assessmentCount = computed(() => smeData.value.readinessHistory?.length || 1)

const highestPillar = computed(() => {
    if (!pillars.value || pillars.value.length === 0) return { name: 'N/A', score: 0 }
    return pillars.value.reduce((prev: any, current: any) => (prev.score > current.score) ? prev : current)
})

const lowestPillar = computed(() => {
    if (!pillars.value || pillars.value.length === 0) return { name: 'N/A', score: 0 }
    return pillars.value.reduce((prev: any, current: any) => (prev.score < current.score) ? prev : current)
})

// Style Helpers
const getRiskBadgeClass = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
        case 'high':
            return 'bg-rose-100 text-rose-700 border-rose-200'
        case 'medium':
            return 'bg-amber-100 text-amber-700 border-amber-200'
        case 'low':
        default:
            return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    }
}

const getRiskDotClass = (riskLevel: string) => {
    switch (riskLevel?.toLowerCase()) {
        case 'high':
            return 'bg-rose-500'
        case 'medium':
            return 'bg-amber-500'
        case 'low':
        default:
            return 'bg-emerald-500'
    }
}

const getStageBadgeClass = (stage: string) => {
    switch (stage?.toLowerCase()) {
        case 'scaling':
            return 'bg-indigo-100 text-indigo-700 border-indigo-200'
        case 'growth':
            return 'bg-blue-100 text-blue-700 border-blue-200'
        case 'early stage':
        default:
            return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
}

const fetchRealActions = async () => {
    if (!smeId.value) return
    try {
        const res: any = await $fetch(`/api/dashboard?smeId=${smeId.value}`)
        if (res && res.actions) {
            actions.value = res.actions.map((a: any) => ({
                title: a.title,
                priority: a.priority,
                pillar: a.pillar,
                points: a.impact || 10,
                completed: a.status === 'completed'
            }))
        }
    } catch (e) {
        console.error('Failed to fetch real actions:', e)
    }
}

onMounted(() => {
    // Fetch real actions to match SME portal exactly
    fetchRealActions()
})

watch(() => smeId.value, () => {
    fetchRealActions()
})

// Dynamically set layout based on user role
const authStore = useAuthStore()
const userRole = computed(() => authStore.user?.role)

definePageMeta({
    layout: false, // We'll set it dynamically
    middleware: 'auth'
})

// Set layout dynamically based on role
onMounted(() => {
    const role = authStore.user?.role
    if (role === 'INVESTOR') {
        // Use investor layout for investors
        setPageLayout('investor')
    } else if (role === 'ADMIN') {
        // Use admin layout for admins
        setPageLayout('admin')
    } else {
        // Use default layout for SME users
        setPageLayout('default')
    }
})
</script>
