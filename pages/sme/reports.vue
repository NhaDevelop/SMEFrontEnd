<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Reports</h1>
                <p class="text-gray-500 mt-1">Generate and download investment readiness reports</p>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto px-8 py-8">
            <div v-if="loading" class="flex items-center justify-center py-12">
                <span class="text-gray-500">Loading reports...</span>
            </div>
            <div v-else class="max-w-7xl mx-auto space-y-8">
                <!-- Top Action Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Investment Readiness Report -->
                    <div
                        class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
                        <div class="w-12 h-12 bg-teal-50 rounded-md flex items-center justify-center mb-4">
                            <DocumentTextIcon class="w-6 h-6 text-teal-600" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Investment Readiness Report</h3>
                        <p class="text-gray-500 text-sm mb-6">Complete PDF report with scores, pillars, risks, and
                            recommendations</p>
                        <button
                            class="mt-auto text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1 transition-colors">
                            Generate PDF
                            <ArrowLongRightIcon class="w-4 h-4" />
                        </button>
                    </div>

                    <!-- Raw Scores Export -->
                    <div
                        class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow">
                        <div class="w-12 h-12 bg-blue-50 rounded-md flex items-center justify-center mb-4">
                            <DocumentChartBarIcon class="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Raw Scores Export</h3>
                        <p class="text-gray-500 text-sm mb-6">CSV export with all assessment data for analysis</p>
                        <button
                            class="mt-auto text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1 transition-colors">
                            Export CSV
                            <ArrowLongRightIcon class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <!-- Generate Report for SME -->
                <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div class="px-6 py-6 border-b border-gray-100">
                        <h2 class="text-lg font-semibold text-gray-900">Generate My Report</h2>
                        <p class="text-gray-500 text-sm mt-1">Select a report type to generate for {{ companyName }}</p>
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <!-- SME name (read-only) -->
                            <div class="relative">
                                <div
                                    class="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3 px-4 rounded-md text-sm font-medium">
                                    {{ companyName }}
                                </div>
                            </div>

                            <!-- Type Select -->
                            <div class="relative">
                                <select v-model="selectedReportType"
                                    class="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-10 rounded-md outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow cursor-pointer">
                                    <option value="">All Types</option>
                                    <option value="readiness">Investment Readiness</option>
                                    <option value="progress">Progress Report</option>
                                    <option value="comparison">Pillar Comparison</option>
                                </select>
                                <ChevronDownIcon
                                    class="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            </div>

                            <!-- Generate Button -->
                            <button @click="handleGenerateReport"
                                class="w-full py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white font-medium rounded-md flex items-center justify-center gap-2 transition-all shadow-sm">
                                <ArrowDownTrayIcon class="w-5 h-5" />
                                Generate Report
                            </button>
                        </div>
                    </div>
                </div>

                <!-- My Company Report Table -->
                <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div class="px-6 py-6 border-b border-gray-100">
                        <h2 class="text-lg font-semibold text-gray-900">My Company Report</h2>
                        <p class="text-gray-500 text-sm mt-1">Your latest investment readiness assessment summary</p>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr
                                    class="bg-white border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                                    <th class="px-6 py-4 font-medium">Company</th>
                                    <th class="px-6 py-4 font-medium">Sector</th>
                                    <th class="px-6 py-4 font-medium">Score</th>
                                    <th class="px-6 py-4 font-medium">Risk Level</th>
                                    <th class="px-6 py-4 font-medium">Last Assessment</th>
                                    <th class="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 text-sm font-medium text-teal-600">
                                        {{ companyName }}
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-900">{{ companyIndustry }}</td>
                                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ overallScore }}</td>
                                    <td class="px-6 py-4">
                                        <span
                                            class="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit"
                                            :class="riskBadgeClass">
                                            <span class="w-1.5 h-1.5 rounded-full" :class="riskDotClass"></span>
                                            {{ overallRiskLabel }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-500">{{ lastAssessmentDate }}</td>
                                    <td class="px-6 py-4 text-sm text-right">
                                        <button @click="handleDownloadPDF"
                                            class="text-teal-600 hover:text-teal-700 font-medium hover:underline transition-colors">
                                            Download PDF
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Recent Reports -->
                <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    <div class="px-6 py-6 border-b border-gray-100">
                        <h2 class="text-lg font-semibold text-gray-900">Recent Reports</h2>
                        <p class="text-gray-500 text-sm mt-1">Previously generated reports for {{ companyName }}</p>
                    </div>
                    <div class="divide-y divide-gray-100">
                        <div v-for="report in SMEReports" :key="report.id"
                            class="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0"
                                    :class="report.type === 'pdf' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'">
                                    <DocumentTextIcon v-if="report.type === 'pdf'" class="w-5 h-5" />
                                    <DocumentChartBarIcon v-else class="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 class="text-sm font-medium text-gray-900">{{ report.title }}</h4>
                                    <div class="flex items-center gap-2 mt-0.5">
                                        <span class="text-xs text-gray-500">{{ report.sme }}</span>
                                        <span class="text-gray-300 text-xs">•</span>
                                        <span class="text-xs text-gray-500 flex items-center gap-1">
                                            <CalendarIcon class="w-3 h-3" />
                                            {{ report.date }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-3">
                                <span
                                    class="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded uppercase tracking-wide">{{
                                        report.type }}</span>
                                <button class="text-sm text-teal-600 hover:text-teal-700 font-medium">Download</button>
                            </div>
                        </div>
                        <div v-if="SMEReports.length === 0" class="p-12 text-center text-gray-500">
                            No recent reports found for your company.
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
    DocumentTextIcon,
    DocumentChartBarIcon,
    ArrowLongRightIcon,
    ChevronDownIcon,
    ArrowDownTrayIcon,
    CalendarIcon,
    LockClosedIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth.store'
import { useDashboardStore } from '~/stores/dashboard.store'

definePageMeta({
    layout: 'default',
    middleware: ['auth']
})

const authStore = useAuthStore()
const dashboardStore = useDashboardStore()
const loading = ref(true)

const companyName = computed(() => authStore.companyInfo?.name || 'Your Company')
const companyIndustry = computed(() => authStore.companyInfo?.industry || 'N/A')
const overallScore = computed(() => dashboardStore.overallScore)
const overallRiskLabel = computed(() => {
    const risk = dashboardStore.overallRiskLevel
    return risk.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
})

const lastAssessmentDate = computed(() => dashboardStore.company?.lastAssessed || 'Never')

const riskBadgeClass = computed(() => {
    const risk = dashboardStore.overallRiskLevel.toLowerCase()
    if (risk === 'low') return 'bg-green-100 text-green-800'
    if (risk === 'medium') return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
})

const riskDotClass = computed(() => {
    const risk = dashboardStore.overallRiskLevel.toLowerCase()
    if (risk === 'low') return 'bg-green-400'
    if (risk === 'medium') return 'bg-yellow-400'
    return 'bg-red-400'
})

onMounted(async () => {
    try {
        if (dashboardStore.pillars.length === 0) {
            await dashboardStore.fetchDashboardData()
        }
    } finally {
        loading.value = false
    }
})

// Report generation
const selectedReportType = ref('')

const handleGenerateReport = () => {
    const type = selectedReportType.value || 'Investment Readiness'
    alert(`Generating ${type} report for ${companyName.value}...\n\nIn a live system this would generate a PDF/CSV download.`)
}

const handleDownloadPDF = () => {
    alert(`Downloading Investment Readiness PDF for ${companyName.value}...\n\nIn a live system this would trigger a PDF download.`)
}

const recentReports = [
    {
        id: 1,
        title: 'Investment Readiness Report',
        sme: 'Angkor Tech',
        date: '2024-12-10',
        type: 'pdf'
    },
    {
        id: 2,
        title: 'Portfolio Comparison',
        sme: 'Angkor Tech',
        date: '2024-12-08',
        type: 'pdf'
    },
    {
        id: 3,
        title: 'Raw Scores Export',
        sme: 'Angkor Tech',
        date: '2024-12-05',
        type: 'csv'
    },
    {
        id: 4,
        title: 'Q3 Progress Report',
        sme: 'GreenData',
        date: '2024-10-01',
        type: 'pdf'
    },
    {
        id: 5,
        title: 'Annual Readiness Summary',
        sme: 'GreenData',
        date: '2025-01-15',
        type: 'pdf'
    }
]

// Show all recent reports — relabeled with the current user's company name
const SMEReports = computed(() => {
    return recentReports
        .slice(0, 4)
        .map(r => ({ ...r, sme: companyName.value }))
})
</script>
