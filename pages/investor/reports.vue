<template>
    <div class="h-full flex flex-col bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-8 py-6 mb-8 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Reports</h1>
                    <p class="text-gray-500 mt-1">Generate and download investment readiness reports</p>
                </div>
                <!-- Program scope badge -->
                <div v-if="selectedProgramId" class="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-700">
                    <span>📂 {{ selectedProgramName }}</span>
                    <button @click="clearProgram" class="ml-1 hover:text-emerald-900">
                        <XMarkIcon class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto custom-scrollbar px-8 pb-12 w-full">
            <div class="max-w-[1600px] mx-auto space-y-8">

                <!-- Top Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Investment Readiness Report Card -->
                    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div class="flex items-start gap-4">
                            <div class="p-3 bg-emerald-50 rounded-lg">
                                <DocumentTextIcon class="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 class="font-bold text-gray-900">Investment Readiness Report</h3>
                                <p class="text-sm text-gray-500 mt-1">
                                    Complete PDF report with scores, pillars, risks, and recommendations
                                    <span v-if="selectedProgramId" class="block mt-1 text-emerald-600 font-medium">
                                        Scoped to: {{ selectedProgramName }}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button @click="generatePortfolioReport" :disabled="isGenerating"
                            class="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start disabled:opacity-50">
                            {{ isGenerating ? 'Generating...' : 'Generate PDF' }}
                            <ArrowLongRightIcon class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Portfolio Comparison Card -->
                    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div class="flex items-start gap-4">
                            <div class="p-3 bg-emerald-50 rounded-lg">
                                <ChartBarIcon class="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 class="font-bold text-gray-900">Portfolio Comparison</h3>
                                <p class="text-sm text-gray-500 mt-1">
                                    Compare all SME performance across your portfolio
                                    <span v-if="selectedProgramId" class="block mt-1 text-emerald-600 font-medium">
                                        Program: {{ selectedProgramName }}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <button @click="generatePortfolioReport" :disabled="isGenerating"
                            class="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start disabled:opacity-50">
                            {{ isGenerating ? 'Rendering...' : 'Generate Report' }}
                            <ArrowLongRightIcon class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Program Selector Card -->
                    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div class="flex items-start gap-4">
                            <div class="p-3 bg-blue-50 rounded-lg">
                                <FunnelIcon class="w-6 h-6 text-blue-600" />
                            </div>
                            <div class="flex-1">
                                <h3 class="font-bold text-gray-900">Program Filter</h3>
                                <p class="text-sm text-gray-500 mt-1">Show scores specific to a program's template</p>
                            </div>
                        </div>
                        <div class="mt-4">
                            <select v-model="selectedProgramId" @change="onProgramChange"
                                class="w-full rounded-lg border border-gray-200 text-sm px-3 py-2.5 focus:ring-emerald-500 focus:border-emerald-500 bg-white">
                                <option :value="null">All Programs</option>
                                <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.name }}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Quick SME Reports Table -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div class="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">Quick SME Reports</h3>
                            <p class="text-gray-500 text-sm mt-1">
                                Download individual SME reports
                                <span v-if="selectedProgramId" class="text-emerald-600 font-medium"> — {{ selectedProgramName }} scores</span>
                            </p>
                        </div>

                        <div class="flex flex-col sm:flex-row items-center gap-3">
                            <!-- Search -->
                            <div class="relative">
                                <input v-model="searchQuery" type="text" placeholder="Search SMEs..."
                                    class="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-64">
                                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <!-- Risk Filter -->
                            <select v-model="selectedRiskFilter"
                                class="py-2 pl-3 pr-8 text-sm border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white">
                                <option value="">All Risks</option>
                                <option value="Low">Low Risk</option>
                                <option value="Medium">Medium Risk</option>
                                <option value="High">High Risk</option>
                            </select>

                            <!-- Loading indicator -->
                            <div v-if="investorStore.loading" class="text-xs text-gray-400 flex items-center gap-1">
                                <span class="animate-spin inline-block w-3 h-3 border border-gray-400 border-t-transparent rounded-full"></span>
                                Loading...
                            </div>
                        </div>
                    </div>

                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-white">
                            <tr>
                                <th scope="col" class="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SME Name</th>
                                <th scope="col" class="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sector</th>
                                <th scope="col" class="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Score
                                    <span v-if="selectedProgramId" class="text-emerald-500 normal-case font-normal ml-1">({{ selectedProgramName }})</span>
                                </th>
                                <th scope="col" class="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Risk Level</th>
                                <th scope="col" class="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Assessment</th>
                                <th scope="col" class="px-8 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">
                            <tr v-if="filteredSMEs.length === 0">
                                <td colspan="6" class="px-8 py-12 text-center text-sm text-gray-400">
                                    {{ investorStore.loading ? 'Loading...' : 'No SMEs match your current filters.' }}
                                </td>
                            </tr>
                            <tr v-for="sme in filteredSMEs" :key="sme.id" class="hover:bg-gray-50/50 transition-colors">
                                <td class="px-8 py-5 whitespace-nowrap text-sm font-medium text-[#2BB8B8]">
                                    {{ sme.name }}
                                </td>
                                <td class="px-8 py-5 whitespace-nowrap text-sm text-gray-600">{{ sme.sector }}</td>
                                <td class="px-8 py-5 whitespace-nowrap">
                                    <span v-if="sme.score > 0" class="text-sm font-bold text-gray-900">{{ sme.score }}</span>
                                    <span v-else class="text-xs text-gray-400 italic">Not Assessed</span>
                                </td>
                                <td class="px-8 py-5 whitespace-nowrap">
                                    <BaseRiskBadge :level="sme.risk" />
                                </td>
                                <td class="px-8 py-5 whitespace-nowrap text-sm text-gray-600">{{ sme.date || '—' }}</td>
                                <td class="px-8 py-5 whitespace-nowrap text-right text-sm">
                                    <div class="flex justify-end gap-2">
                                        <button @click="generateSmeReport(sme)"
                                            :disabled="isGenerating || !sme.user_id"
                                            class="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed">
                                            <DocumentTextIcon class="w-3.5 h-3.5" /> PDF
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Recent Reports Section -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div class="p-8 border-b border-gray-100">
                        <h3 class="text-lg font-bold text-gray-900">Recent Reports</h3>
                        <p class="text-gray-500 text-sm mt-1">Previously generated reports this session</p>
                    </div>
                    <div v-if="recentReports.length === 0" class="p-8 text-center text-sm text-gray-400">
                        No reports generated yet. Use the buttons above to generate a report.
                    </div>
                    <div class="divide-y divide-gray-100">
                        <div v-for="report in recentReports" :key="report.id"
                            class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div class="flex items-center gap-4">
                                <div class="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                                    <DocumentTextIcon class="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 class="text-sm font-medium text-gray-900">{{ report.name }}</h4>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span class="text-xs text-gray-500">{{ report.company }}</span>
                                        <span class="text-[10px] text-gray-300">•</span>
                                        <span class="text-xs text-gray-400 flex items-center gap-1">
                                            <CalendarIcon class="w-3 h-3" /> {{ report.date }}
                                        </span>
                                        <span v-if="report.program" class="text-xs text-emerald-600 font-medium">
                                            {{ report.program }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span class="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase tracking-wide">PDF</span>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import BaseRiskBadge from '~/components/BaseRiskBadge.vue'
import { getFinancialRiskLevel } from '~/utils/helpers'
import {
    DocumentTextIcon,
    ArrowLongRightIcon,
    ChartBarIcon,
    CalendarIcon,
    XMarkIcon,
    FunnelIcon,
} from '@heroicons/vue/24/outline'

definePageMeta({
    layout: 'investor',
    middleware: ['auth', 'investor']
})

import { useInvestorStore } from '~/stores/investor.store'

const investorStore = useInvestorStore()
const config = useRuntimeConfig()
const apiBase = computed(() => (config.public.apiBase as string) || 'http://127.0.0.1:8001/api')

// ── Programs ────────────────────────────────────────────────────────────────
const selectedProgramId = ref<number | null>(null)
const programs = computed(() => investorStore.programs ?? [])
const selectedProgramName = computed(() =>
    programs.value.find((p: any) => p.id === selectedProgramId.value)?.name ?? ''
)

onMounted(async () => {
    await investorStore.fetchPrograms()
    // Initial load — no program filter
    await investorStore.fetchDealFlow(true)
})

const onProgramChange = async () => {
    // Force re-fetch with program_id so scores are template-specific
    await investorStore.fetchDealFlow(true, selectedProgramId.value ?? undefined)
}

const clearProgram = async () => {
    selectedProgramId.value = null
    await investorStore.fetchDealFlow(true)
}

// ── SME Table Data ──────────────────────────────────────────────────────────
const smes = computed(() =>
    investorStore.dealFlow.map((sme: any) => ({
        id: sme.id,
        user_id: sme.user_id,          // needed for PDF generation
        name: sme.name,
        sector: sme.industry,
        score: sme.score ?? 0,
        risk: getFinancialRiskLevel(sme.financialRisk || sme.score || 0),
        date: sme.lastAssessedDate || sme.lastUpdated,
        programIds: sme.programIds || [],
        status: sme.status,
    }))
)

const searchQuery = ref('')
const selectedRiskFilter = ref('')

const filteredSMEs = computed(() => {
    let result = smes.value

    if (selectedRiskFilter.value) {
        result = result.filter(s => s.risk === selectedRiskFilter.value)
    }

    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        result = result.filter(s =>
            s.name.toLowerCase().includes(q) ||
            (s.sector ?? '').toLowerCase().includes(q)
        )
    }

    return result
})

// ── Auth Token ──────────────────────────────────────────────────────────────
const getToken = (): string | null => {
    const cookie = useCookie('irip_access_token').value
    if (cookie) return cookie
    if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('irip_access_token')
    }
    return null
}

// ── Recent Reports (session-only) ───────────────────────────────────────────
interface RecentReport { id: number; name: string; company: string; date: string; program?: string }
const recentReports = ref<RecentReport[]>([])

const pushRecent = (name: string, company: string) => {
    recentReports.value.unshift({
        id: Date.now(),
        name,
        company,
        date: new Date().toISOString().slice(0, 10),
        program: selectedProgramName.value || undefined,
    })
}

// ── Report Generation ───────────────────────────────────────────────────────
const isGenerating = ref(false)

const buildQuery = (params: Record<string, any>) => {
    const qs = Object.entries(params)
        .filter(([, v]) => v !== null && v !== undefined)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
        .join('&')
    return qs ? '?' + qs : ''
}

/** Portfolio or all-SME batch report */
const generatePortfolioReport = async () => {
    isGenerating.value = true
    try {
        const params: Record<string, any> = {}
        const token = getToken()
        if (selectedProgramId.value) params.programId = selectedProgramId.value
        if (token) params.token = token
        window.open(`${apiBase.value}/admin/reports/portfolio${buildQuery(params)}`, '_blank')
        pushRecent('Portfolio Report', selectedProgramName.value || 'All Programs')
    } finally {
        isGenerating.value = false
    }
}

/** Individual SME readiness report */
const generateSmeReport = async (sme: { user_id?: number | string; name: string }) => {
    if (!sme.user_id) return
    isGenerating.value = true
    try {
        const params: Record<string, any> = { smeId: sme.user_id }
        const token = getToken()
        if (selectedProgramId.value) params.programId = selectedProgramId.value
        if (token) params.token = token
        window.open(`${apiBase.value}/admin/reports/readiness${buildQuery(params)}`, '_blank')
        pushRecent('Readiness Report', sme.name)
    } finally {
        isGenerating.value = false
    }
}
</script>
