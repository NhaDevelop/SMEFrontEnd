<template>
    <div class="h-full flex flex-col bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-8 py-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Reports</h1>
                    <p class="text-gray-500 mt-1">Generate and download investment readiness reports</p>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto p-8">
            <div class="max-w-[1400px] mx-auto space-y-8">

                <!-- Top Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Investment Readiness Report Card -->
                    <div
                        class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div class="flex items-start gap-4">
                            <div class="p-3 bg-emerald-50 rounded-lg">
                                <DocumentTextIcon class="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 class="font-bold text-gray-900">Investment Readiness Report</h3>
                                <p class="text-sm text-gray-500 mt-1">Complete PDF report with scores, pillars, risks,
                                    and recommendations</p>
                            </div>
                        </div>
                        <button
                            @click="generateReport('Investment Readiness Report', 'PDF', null, selectedTableProgramId)"
                            :disabled="isGenerating"
                            class="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start disabled:opacity-50">
                            {{ isGenerating ? 'Generating...' : 'Generate PDF' }}
                            <ArrowLongRightIcon class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Raw Scores Export Card -->
                    <div
                        class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div class="flex items-start gap-4">
                            <div class="p-3 bg-blue-50 rounded-lg">
                                <TableCellsIcon class="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 class="font-bold text-gray-900">Raw Scores Export</h3>
                                <p class="text-sm text-gray-500 mt-1">CSV export with all assessment data for analysis
                                </p>
                            </div>
                        </div>
                        <button @click="generateReport('Raw Scores Export', 'CSV')" :disabled="isGenerating"
                            class="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start disabled:opacity-50">
                            {{ isGenerating ? 'Exporting...' : 'Export CSV' }}
                            <ArrowLongRightIcon class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Portfolio Comparison Card -->
                    <div
                        class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div class="flex items-start gap-4">
                            <div class="p-3 bg-emerald-50 rounded-lg">
                                <ChartBarIcon class="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 class="font-bold text-gray-900">Portfolio Comparison</h3>
                                <p class="text-sm text-gray-500 mt-1">Compare SME performance across the portfolio</p>
                            </div>
                        </div>
                        <button @click="generateReport('Portfolio Comparison', 'PDF', null, selectedTableProgramId)"
                            :disabled="isGenerating"
                            class="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start disabled:opacity-50">
                            {{ isGenerating ? 'Rendering...' : 'Generate Report' }}
                            <ArrowLongRightIcon class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <!-- Generate Custom Report Section -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Generate Custom Report</h3>
                    <p class="text-gray-500 text-sm mb-6">Select an SME, program scope, and report type to generate</p>

                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <!-- SME Selector -->
                        <div>
                            <label
                                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">SME</label>
                            <select v-model="selectedReportSmeId"
                                class="w-full rounded-lg border border-gray-300 text-sm px-3 py-2.5 focus:ring-emerald-500 focus:border-emerald-500">
                                <option :value="null">All SMEs</option>
                                <option v-for="sme in smes" :key="sme.id" :value="sme.id">{{ sme.name }}</option>
                            </select>
                        </div>
                        <!-- Program Filter -->
                        <div>
                            <label
                                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Program
                                (Optional)</label>
                            <select v-model="selectedProgramId"
                                class="w-full rounded-lg border border-gray-300 text-sm px-3 py-2.5 focus:ring-emerald-500 focus:border-emerald-500">
                                <option :value="null">All Programs</option>
                                <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.name }}</option>
                            </select>
                        </div>
                        <!-- Report Type -->
                        <div>
                            <label
                                class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Report
                                Type</label>
                            <select v-model="selectedReportType"
                                class="w-full rounded-lg border border-gray-300 text-sm px-3 py-2.5 focus:ring-emerald-500 focus:border-emerald-500">
                                <option>Detailed Assessment</option>
                                <option>Executive Summary</option>
                                <option>Progress Report</option>
                            </select>
                        </div>
                        <!-- Generate Button -->
                        <button @click="generateCustomReport()" :disabled="isGenerating"
                            class="w-full px-4 py-2.5 bg-[#198754] text-white rounded-lg font-medium hover:bg-[#157347] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50">
                            <ArrowDownTrayIcon class="w-5 h-5 text-white" />
                            {{ isGenerating ? 'Generating...' : 'Generate Report' }}
                        </button>
                    </div>
                </div>

                <!-- Quick SME Reports Table -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div
                        class="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">Quick SME Reports</h3>
                            <p class="text-gray-500 text-sm mt-1">Download reports for individual SMEs</p>
                        </div>

                        <div class="flex flex-wrap items-center gap-3">
                            <!-- Search -->
                            <div class="relative">
                                <input v-model="searchQuery" type="text" placeholder="Search SMEs..."
                                    class="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-56">
                                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>

                            <!-- Program Filter (real data) -->
                            <select v-model="selectedTableProgramId" @change="onProgramFilterChange"
                                class="py-2 pl-3 pr-8 text-sm border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white">
                                <option :value="null">All Programs</option>
                                <option v-for="p in programs" :key="p.id" :value="p.id">{{ p.name }}</option>
                            </select>

                            <!-- Risk Filter -->
                            <select v-model="selectedRiskFilter"
                                class="py-2 pl-3 pr-8 text-sm border border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-white">
                                <option value="">All Risks</option>
                                <option value="Safe to Invest">Safe to Invest</option>
                                <option value="Low Risk">Low Risk</option>
                                <option value="Medium Risk">Medium Risk</option>
                                <option value="High Risk">High Risk</option>
                            </select>

                            <!-- Active filter badge -->
                            <div v-if="currentProgramName"
                                class="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                                <span>Filter: {{ currentProgramName }}</span>
                                <button @click="selectedTableProgramId = null; clearRouteProgram()"
                                    class="hover:text-emerald-900">
                                    <XMarkIcon class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-white">
                            <tr>
                                <th scope="col"
                                    class="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    SME Name</th>
                                <th scope="col"
                                    class="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Sector</th>
                                <th scope="col"
                                    class="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Score</th>
                                <th scope="col"
                                    class="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Risk Level</th>
                                <th scope="col"
                                    class="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Last Assessment</th>
                                <th scope="col"
                                    class="px-8 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">
                            <tr v-if="filteredSMEs.length === 0">
                                <td colspan="6" class="px-8 py-12 text-center text-sm text-gray-400">No SMEs match your
                                    current filters.</td>
                            </tr>
                            <tr v-for="sme in filteredSMEs" :key="sme.id" class="hover:bg-gray-50/50 transition-colors">
                                <td class="px-8 py-5 whitespace-nowrap text-sm font-medium text-[#2BB8B8]">
                                    <button @click="router.push('/sme/' + sme.id)" class="hover:underline text-left">{{
                                        sme.name }}</button>
                                </td>
                                <td class="px-8 py-5 whitespace-nowrap">
                                    <span v-if="sme.sector"
                                        :style="`${getSectorStyle(sme.sector).bg}; ${getSectorStyle(sme.sector).text}; ${getSectorStyle(sme.sector).border}`"
                                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border">
                                        <span :style="getSectorStyle(sme.sector).dot"
                                            class="w-1.5 h-1.5 rounded-full"></span>
                                        {{ sme.sector }}
                                    </span>
                                    <span v-else class="text-sm text-gray-400">Not Assigned</span>
                                </td>
                                <td class="px-8 py-5 whitespace-nowrap text-sm font-bold text-gray-900">
                                    {{ sme.score !== null ? Math.round(sme.score) : '—' }}
                                </td>
                                <td class="px-8 py-5 whitespace-nowrap">
                                    <BaseRiskBadge :level="sme.risk" />
                                </td>
                                <td class="px-8 py-5 whitespace-nowrap text-sm text-gray-600">{{ sme.date }}</td>
                                <td class="px-8 py-5 whitespace-nowrap text-right text-sm">
                                    <div class="flex justify-end gap-2">
                                        <button
                                            @click="generateReport('PDF Report', sme.name, sme.id, selectedTableProgramId)"
                                            class="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-1">
                                            <DocumentTextIcon class="w-3.5 h-3.5" /> PDF
                                        </button>
                                        <button
                                            @click="generateReport('CSV Export', sme.name, sme.id, selectedTableProgramId)"
                                            class="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-1">
                                            <TableCellsIcon class="w-3.5 h-3.5" /> CSV
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
                        <p class="text-gray-500 text-sm mt-1">Previously generated reports</p>
                    </div>
                    <div v-if="recentReports.length === 0" class="p-8 text-center text-sm text-gray-400">No reports
                        generated yet.</div>
                    <div class="divide-y divide-gray-100">
                        <div v-for="report in recentReports" :key="report.id"
                            class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div class="flex items-center gap-4">
                                <div class="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                                    <DocumentTextIcon v-if="report.type === 'PDF'" class="w-6 h-6" />
                                    <TableCellsIcon v-else class="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h4 class="text-sm font-medium text-gray-900">{{ report.name }}</h4>
                                    <div class="flex items-center gap-2 mt-1">
                                        <span class="text-xs text-gray-500">{{ report.company }}</span>
                                        <span class="text-[10px] text-gray-300">•</span>
                                        <span class="text-xs text-gray-400 flex items-center gap-1">
                                            <CalendarIcon class="w-3 h-3" /> {{ report.date }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <span
                                    class="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase tracking-wide">{{
                                        report.type }}</span>
                                <button v-if="report.smeId"
                                    @click="generateReport('PDF Report', report.company, report.smeId)"
                                    class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                                    title="Regenerate">
                                    <ArrowDownTrayIcon class="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseRiskBadge from '~/components/BaseRiskBadge.vue'
import { getFinancialRiskLevel } from '~/utils/helpers'
import {
    DocumentTextIcon,
    ArrowDownTrayIcon,
    ArrowLongRightIcon,
    TableCellsIcon,
    ChartBarIcon,
    CalendarIcon,
    XMarkIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
    layout: 'admin',
    middleware: ['auth', 'admin']
})

import { useAdminStore } from '~/stores/admin.store'

const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

const recentReports = ref<any[]>([])
const sectorsList = ref<any[]>([])
const programs = ref<{ id: number; name: string }[]>([])

onMounted(async () => {
    await adminStore.fetchSmesData()
    await loadReportLogs()
    await loadPrograms()
    try {
        const api = useApi()
        sectorsList.value = await api('/admin/sectors')
    } catch (e) { console.error('Failed to load sectors', e) }

    // If URL has programId, sync to table filter
    if (route.query.programId) {
        selectedTableProgramId.value = Number(route.query.programId)
    }
})

const loadPrograms = async () => {
    try {
        const api = useApi()
        const res = await api<any>('/admin/programs')
        programs.value = (res?.programs ?? res ?? []).map((p: any) => ({ id: p.id, name: p.name }))
    } catch (e) {
        console.error('Failed to load programs', e)
    }
}

const getSectorStyle = (sectorName: string) => {
    const sector = sectorsList.value.find(s => s.name === sectorName)
    if (sector && sector.color) {
        return {
            bg: `background-color: ${sector.color}15`,
            text: `color: ${sector.color}`,
            border: `border-color: ${sector.color}30`,
            dot: `background-color: ${sector.color}`
        }
    }
    return {
        bg: 'background-color: #f3f4f6',
        text: 'color: #4b5563',
        border: 'border-color: #e5e7eb',
        dot: 'background-color: #9ca3af'
    }
}

const loadReportLogs = async () => {
    try {
        const api = useApi()
        const res = await api<any>('/admin/reports/logs')
        const logs = res?.data ?? res ?? [] // Handle both {data:[]} and direct []
        
        recentReports.value = logs.filter((log: any) => 
            ['GENERATED_REPORT', 'GENERATED_PORTFOLIO_REPORT', 'EXPORTED_DATA'].includes(log.action)
        ).map((log: any) => {
            const details = typeof log.details === 'string' ? JSON.parse(log.details) : log.details
            return {
                id: log.id,
                name: details?.report_type || log.action.replace(/_/g, ' '),
                company: details?.sme_name || details?.company_name || 'All SMEs',
                date: new Date(log.created_at).toLocaleDateString('en-GB', { 
                    day: '2-digit', 
                    month: 'short', 
                    year: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                }),
                type: details?.format || (log.action === 'EXPORTED_DATA' ? 'CSV' : 'PDF'),
                smeId: details?.sme_id || log.target_id
            }
        })
    } catch (e) {
        console.error('Failed to load report logs:', e)
    }
}

// Map store data to local format
const smes = computed(() => {
    return adminStore.smes.map(sme => {
        let dateStr = '—'
        const assessDate = sme.last_assessed || sme.lastAssessed;
        if (assessDate && String(assessDate) !== 'null' && String(assessDate) !== 'undefined') {
            const parsedDate = new Date(assessDate)
            if (!isNaN(parsedDate.getTime())) {
                dateStr = parsedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
            }
        }

        let displayScore: number | null = sme.latest_score !== undefined && sme.latest_score !== null ? sme.latest_score : (sme.score ?? null)
        let displayRisk = sme.latest_risk_level || getFinancialRiskLevel(displayScore || 0, adminStore.frameworkThresholds)

        if (selectedTableProgramId.value && sme.latest_score === null) {
            displayScore = null
            displayRisk = 'Not Assessed'
        }

        return {
            id: sme.id,
            name: sme.company_name || sme.name,
            sector: sme.industry,
            score: displayScore as any,
            risk: displayRisk,
            date: dateStr,
            programIds: sme.programs ? sme.programs.map((p: any) => p.program_id) : (sme.programIds ?? [])
        } as any
    })
})

const searchQuery = ref('')
const selectedRiskFilter = ref('')
const selectedReportSmeId = ref<number | string | null>(null)
const selectedReportType = ref('Detailed Assessment')
const selectedProgramId = ref<number | null>(null)       // custom report program filter
const selectedTableProgramId = ref<number | null>(null)  // table row program filter

const filteredSMEs = computed(() => {
    let result = smes.value

    if (selectedRiskFilter.value) {
        result = result.filter(sme => sme.risk === selectedRiskFilter.value)
    }

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(sme =>
            sme.name.toLowerCase().includes(query) ||
            (sme.sector ?? '').toLowerCase().includes(query)
        )
    }

    return result
})

const currentProgramName = computed(() => {
    const id = selectedTableProgramId.value ?? (route.query.programId ? Number(route.query.programId) : null)
    if (!id) return ''
    return programs.value.find(p => p.id === id)?.name ?? ''
})

const onProgramFilterChange = async () => {
    await adminStore.fetchSmesData(selectedTableProgramId.value || undefined)
}

const clearRouteProgram = async () => {
    router.replace({ query: {} })
    await onProgramFilterChange()
}

// Badge styling logic removed in favor of BaseRiskBadge.vue

const isGenerating = ref(false)

const getToken = () => {
    const cookie = useCookie('irip_access_token').value
    if (cookie) return cookie
    if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('irip_access_token')
    }
    return null
}

const generateCustomReport = () => {
    const smeName = selectedReportSmeId.value
        ? smes.value.find(s => s.id === selectedReportSmeId.value)?.name ?? 'SME'
        : 'All SMEs'
    generateReport(selectedReportType.value, smeName, selectedReportSmeId.value, selectedProgramId.value)
}

const generateReport = async (
    type: string,
    subject: string = '',
    smeId?: number | string | null,
    programId?: number | null
) => {
    isGenerating.value = true
    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase as string
    const token = getToken()

    const buildQuery = (params: Record<string, any>) => {
        const qs = Object.entries(params)
            .filter(([, v]) => v !== null && v !== undefined)
            .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
            .join('&')
        return qs ? '?' + qs : ''
    }

    try {
        if (type === 'Raw Scores Export' || type === 'CSV Export' || type === 'CSV') {
            const params: any = { type: 'sme', format: 'excel' }
            if (smeId) params.id = smeId
            if (token) params.token = token
            const url = `${apiBase}/admin/reports/export${buildQuery(params)}`
            const a = document.createElement('a')
            a.href = url
            a.download = smeId ? `sme_${smeId}_report.csv` : 'all_smes_report.csv'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        } else if (type === 'Portfolio Comparison' || type === 'Portfolio') {
            const params: any = {}
            if (programId) params.programId = programId
            if (token) params.token = token
            window.open(`${apiBase}/admin/reports/portfolio${buildQuery(params)}`, '_blank')
        } else {
            // Readiness / custom — individual or all SMEs
            const params: any = {}
            if (smeId) params.smeId = smeId
            if (programId) params.programId = programId
            if (token) params.token = token
            window.open(`${apiBase}/admin/reports/readiness${buildQuery(params)}`, '_blank')
        }

        await loadReportLogs()
    } finally {
        isGenerating.value = false
    }
}
</script>
