<template>
    <div class="h-full flex flex-col bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-8 py-6 mb-8 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Reports</h1>
                    <p class="text-gray-500 mt-1">Generate and download investment readiness reports</p>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto custom-scrollbar px-8 pb-12 w-full">
            <div class="max-w-[1600px] mx-auto space-y-8">

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
                        <button @click="generateReport('Investment Readiness Report', 'PDF')" :disabled="isGenerating"
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
                        <button @click="generateReport('Portfolio Comparison', 'PDF')" :disabled="isGenerating"
                            class="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 self-start disabled:opacity-50">
                            {{ isGenerating ? 'Rendering...' : 'Generate Report' }}
                            <ArrowLongRightIcon class="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <!-- Generate Custom Report Section -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">Generate Custom Report</h3>
                    <p class="text-gray-500 text-sm mb-6">Select an SME and report type to generate</p>

                    <div class="flex flex-col md:flex-row gap-4 items-center">
                        <!-- SME Selection Dropdown -->
                        <Listbox v-model="selectedReportSmeId" as="div" class="w-full md:w-1/3 relative z-20">
                            <ListboxButton
                                class="relative w-full rounded-lg bg-white border border-gray-200 py-2.5 pl-4 pr-10 text-left text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer">
                                <span class="block truncate">{{selectedReportSmeId ? smes.find(s => s.id ===
                                    selectedReportSmeId)?.name : 'All SMEs'}}</span>
                                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDownIcon class="h-4 w-4 text-gray-400" aria-hidden="true" />
                                </span>
                            </ListboxButton>
                            <transition leave-active-class="transition duration-100 ease-in"
                                leave-from-class="opacity-100" leave-to-class="opacity-0">
                                <ListboxOptions
                                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg border border-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <ListboxOption :value="null" v-slot="{ active, selected }">
                                        <li :class="[
                                            active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900',
                                            'relative cursor-pointer select-none py-2 pl-10 pr-4',
                                        ]">
                                            <span
                                                :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">All
                                                SMEs</span>
                                            <span v-if="selected"
                                                class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                                <CheckIcon class="h-4 w-4" aria-hidden="true" />
                                            </span>
                                        </li>
                                    </ListboxOption>
                                    <ListboxOption v-for="sme in smes" :key="sme.id" :value="sme.id"
                                        v-slot="{ active, selected }">
                                        <li :class="[
                                            active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900',
                                            'relative cursor-pointer select-none py-2 pl-10 pr-4',
                                        ]">
                                            <span
                                                :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                                                    sme.name }}</span>
                                            <span v-if="selected"
                                                class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                                <CheckIcon class="h-4 w-4" aria-hidden="true" />
                                            </span>
                                        </li>
                                    </ListboxOption>
                                </ListboxOptions>
                            </transition>
                        </Listbox>

                        <!-- Report Type Dropdown -->
                        <Listbox v-model="selectedReportType" as="div" class="w-full md:w-1/3 relative z-10">
                            <ListboxButton
                                class="relative w-full rounded-lg bg-white border border-gray-200 py-2.5 pl-4 pr-10 text-left text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer">
                                <span class="block truncate">{{ selectedReportType }}</span>
                                <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <ChevronDownIcon class="h-4 w-4 text-gray-400" aria-hidden="true" />
                                </span>
                            </ListboxButton>
                            <transition leave-active-class="transition duration-100 ease-in"
                                leave-from-class="opacity-100" leave-to-class="opacity-0">
                                <ListboxOptions
                                    class="absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-sm shadow-lg border border-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <ListboxOption v-for="type in reportTypes" :key="type" :value="type"
                                        v-slot="{ active, selected }">
                                        <li :class="[
                                            active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900',
                                            'relative cursor-pointer select-none py-2 pl-10 pr-4',
                                        ]">
                                            <span
                                                :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                                                    type }}</span>
                                            <span v-if="selected"
                                                class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                                <CheckIcon class="h-4 w-4" aria-hidden="true" />
                                            </span>
                                        </li>
                                    </ListboxOption>
                                </ListboxOptions>
                            </transition>
                        </Listbox>

                        <!-- Admin Only Button -->
                        <button
                            class="w-full md:grid-cols-1 md:w-2/3 px-4 py-2.5 bg-[#8ABFB0] text-white rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm cursor-not-allowed opacity-90 transition-colors">
                            <ArrowDownTrayIcon class="w-5 h-5 text-white" />
                            Admin Only
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

                            <div v-if="currentProgramName"
                                class="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
                                <span>Filter: {{ currentProgramName }}</span>
                                <button @click="navigateTo('/reports')" class="hover:text-emerald-900">
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
                            <tr v-for="sme in filteredSMEs" :key="sme.id" class="hover:bg-gray-50/50 transition-colors">
                                <td class="px-8 py-5 whitespace-nowrap text-sm font-medium text-[#2BB8B8]">
                                    <button @click="navigateTo('/sme/' + sme.id)" class="hover:underline text-left">
                                        {{ sme.name }}
                                    </button>
                                </td>
                                <td class="px-8 py-5 whitespace-nowrap text-sm text-gray-600">{{ sme.sector }}</td>
                                <td class="px-8 py-5 whitespace-nowrap text-sm font-bold text-gray-900">{{ sme.score }}
                                </td>
                                <td class="px-8 py-5 whitespace-nowrap">
                                    <span
                                        :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border', getRiskBadgeStyles(sme.risk)]">
                                        <span :class="['w-1.5 h-1.5 rounded-full', getRiskDotStyles(sme.risk)]"></span>
                                        {{ sme.risk }} Risk
                                    </span>
                                </td>
                                <td class="px-8 py-5 whitespace-nowrap text-sm text-gray-600">{{ sme.date }}</td>
                                <td class="px-8 py-5 whitespace-nowrap text-right text-sm">
                                    <div class="flex justify-end gap-2">
                                        <button @click="generateReport('PDF Report', sme.name)"
                                            class="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-1">
                                            <DocumentTextIcon class="w-3.5 h-3.5" /> PDF
                                        </button>
                                        <button @click="generateReport('CSV Export', sme.name)"
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
                                <button @click="generateReport('Download', report.name)"
                                    class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
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
import {
    DocumentTextIcon,
    ArrowDownTrayIcon,
    ArrowLongRightIcon,
    TableCellsIcon,
    ChartBarIcon,
    CalendarIcon,
    XMarkIcon,
    ChevronUpDownIcon,
    ChevronDownIcon,
    CheckIcon
} from '@heroicons/vue/24/outline'
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'

definePageMeta({
    layout: 'investor',
    middleware: ['auth', 'investor']
})

import { useInvestorStore } from '~/stores/investor.store'
import { onMounted } from 'vue'

const route = useRoute()
const investorStore = useInvestorStore()

onMounted(() => {
    if (investorStore.dealFlow.length === 0) {
        investorStore.fetchDealFlow()
    }
})

// Map store data to local format
const smes = computed(() => {
    return investorStore.dealFlow.map(sme => ({
        id: sme.id,
        name: sme.name,
        sector: sme.industry,
        score: sme.score,
        risk: sme.financialRisk,
        date: sme.lastAssessedDate || sme.lastUpdated,
        programIds: sme.programIds || [], // Need to ensure dealFlow has programIds or map it correctly
        status: sme.status
    }))
})

const recentReports = ref([
    { id: 1, name: 'Investment Readiness Report', company: 'Angkor Tech', date: '2024-12-10', type: 'PDF' },
    { id: 2, name: 'Portfolio Comparison', company: '', date: '2024-12-08', type: 'PDF' },
    { id: 3, name: 'Raw Scores Export', company: '', date: '2024-12-05', type: 'CSV' },
    { id: 4, name: 'Q3 Progress Report', company: 'Mekong Solutions', date: '2024-10-01', type: 'PDF' },
])

const filteredSMEs = computed(() => {
    let result = smes.value

    // Filter by Program ID (from URL)
    const programId = route.query.programId
    if (programId) {
        result = result.filter(sme => sme.programIds.includes(Number(programId)))
    }

    // Filter by Risk Level
    if (selectedRiskFilter.value) {
        result = result.filter(sme => sme.risk === selectedRiskFilter.value)
    }

    // Filter by Search Query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(sme =>
            sme.name.toLowerCase().includes(query) ||
            sme.sector.toLowerCase().includes(query)
        )
    }

    // Filter by Dropdown Selection
    if (selectedReportSmeId.value) {
        result = result.filter(sme => sme.id === selectedReportSmeId.value)
    }

    return result
})

const currentProgramName = computed(() => {
    // Keep legacy program name logic if needed, or remove if unused. 
    // Assuming we might keep it for safety.
    const programId = route.query.programId
    if (!programId) return ''
    const programs: Record<number, string> = {
        1: 'Investment Accelerator 2024',
        2: 'FinTech Growth Program',
        3: 'AgriTech Innovation Fund',
        4: 'Women Entrepreneurs Initiative'
    }
    return programs[Number(programId)] || ''
})

const reportTypes = ['All Types', 'Investment Readiness', 'Progress Report', 'Comparison']

const searchQuery = ref('')
const selectedRiskFilter = ref('')
const selectedReportSmeId = ref<number | string | null>(null)
const selectedReportType = ref('All Types')
const currentPeriod = ref('2024-07') // Keeping for now if needed elsewhere or just unused
const comparisonPeriod = ref('2024-01') // Keeping for now

const getRiskBadgeStyles = (risk: string) => {
    switch (risk) {
        case 'Low': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
        case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100'
        case 'High': return 'bg-rose-50 text-rose-600 border-rose-100'
        default: return 'bg-gray-50 text-gray-600 border-gray-100'
    }
}

const getRiskDotStyles = (risk: string) => {
    switch (risk) {
        case 'Low': return 'bg-emerald-500'
        case 'Medium': return 'bg-amber-500'
        case 'High': return 'bg-rose-500'
        default: return 'bg-gray-500'
    }
}

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'Active':
        case 'Near Ready':
            return 'bg-blue-50 text-blue-700 border-blue-200'
        case 'Open':
        case 'Investment Ready':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200'
        case 'Developing':
            return 'bg-amber-50 text-amber-700 border-amber-200'
        case 'Needs Improvement':
            return 'bg-rose-50 text-rose-700 border-rose-200'
        case 'Paused':
        case 'Early Stage':
        default:
            return 'bg-gray-50 text-gray-700 border-gray-200'
    }
}

const isGenerating = ref(false)

const generateReport = async (type: string, subject: string = '') => {
    isGenerating.value = true
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Add to recent list
    const reportName = type === 'Detailed Assessment' || type === 'Progress Report'
        ? `${type} (${currentPeriod.value} vs ${comparisonPeriod.value})`
        : type

    recentReports.value.unshift({
        id: Date.now(),
        name: reportName,
        company: subject || 'All SMEs',
        date: new Date().toISOString().slice(0, 10),
        type: type.includes('CSV') ? 'CSV' : 'PDF'
    })

    isGenerating.value = false

    // Simulate Download
    const blob = new Blob(['Mock Report Content'], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportName.replace(/\s+/g, '_')}_${subject || 'All'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
}

const navigateTo = (path: string) => {
    return navigateToNuxt(path)
}

import { useRouter } from 'vue-router'
const router = useRouter()
const navigateToNuxt = (path: string) => router.push(path)
</script>
