<template>
    <div class="min-h-screen bg-[#F8FAFC]">
        <!-- Top Navigation / Header -->
        <header class="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Portfolio Analytics</h1>
                        <p class="text-sm text-gray-500 mt-1">Real-time performance across your investment portfolio</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-3">
                        <!-- Date Range Selector -->
                        <InvestorAnalyticsPeriodSelector 
                            v-model="dateRangeValue"
                            v-model:compare-value="compareDateRangeValue"
                            v-model:compare-enabled="comparePeriods"
                            v-model:period-preset="periodPreset"
                            @change="handleDateChange"
                        />

                        <!-- Refresh Button -->
                        <button 
                            @click="refreshData"
                            class="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                            :class="{ 'animate-spin': loading }"
                        >
                            <ArrowPathIcon class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <!-- Primary Tabs -->
                <div class="flex border-t border-gray-100">
                    <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                        'px-6 py-4 text-sm font-bold transition-all relative whitespace-nowrap',
                        activeTab === tab.id ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-700'
                    ]">
                        <div class="flex items-center gap-2">
                            <component :is="tab.icon" class="w-4 h-4" />
                            {{ tab.label }}
                        </div>
                        <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600"></div>
                    </button>
                </div>
            </div>
        </header>

        <main class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div v-if="loading && !filteredStats.total" class="flex flex-col items-center justify-center py-20">
                <div class="w-12 h-12 border-4 border-cyan-100 border-t-cyan-600 rounded-full animate-spin mb-4"></div>
                <p class="text-gray-500 font-medium">Crunching your portfolio data...</p>
            </div>

            <div v-else class="space-y-8 animate-in fade-in duration-500">
                <!-- KPI Section -->
                <InvestorAnalyticsKPIs 
                    :stats="filteredStats" 
                    :comparePeriods="comparePeriods"
                    :previousStats="previousStats"
                    :currentLabel="currentPeriodLabel"
                    :previousLabel="previousPeriodLabel"
                />

                <!-- Tab Content -->
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="p-6">
                        <!-- Overview Tab -->
                        <div v-if="activeTab === 'overview'" class="space-y-6">
                            <!-- Comparison Summary Banner -->
                            <div v-if="comparePeriods" class="bg-emerald-50 rounded-lg p-6 flex justify-between items-center border border-emerald-100">
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <ArrowTrendingUpIcon class="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-900">Period Comparison</h3>
                                        <p class="text-sm text-gray-500">Comparing {{ currentPeriodLabel }} vs {{ previousPeriodLabel }}</p>
                                    </div>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm text-gray-500">Overall Readiness Change</p>
                                    <p :class="['text-3xl font-bold', filteredStats.avgScore - previousStats.avgScore >= 0 ? 'text-emerald-600' : 'text-rose-600']">
                                        {{ filteredStats.avgScore - previousStats.avgScore > 0 ? '+' : '' }}{{ filteredStats.avgScore - previousStats.avgScore }} pts
                                    </p>
                                </div>
                            </div>

                            <InvestorAnalyticsTrendChart 
                                :trendData="portfolioTrendData" 
                                :trendPath="trendPath"
                                :trendAreaPath="trendAreaPath"
                                :comparePeriods="comparePeriods"
                                :comparisonPath="comparisonPath"
                            />

                            <div v-if="comparePeriods" class="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                                <h3 class="text-lg font-bold text-gray-900 mb-6">Readiness Distribution Comparison</h3>
                                <div class="space-y-6">
                                    <div v-for="(level, idx) in readinessLevels" :key="level.name" class="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                        <div class="flex justify-between items-start mb-2">
                                            <div>
                                                <p class="font-medium text-gray-900">{{ level.name }}</p>
                                                <p class="text-xs text-gray-400 mt-1">{{ currentPeriodLabel }}</p>
                                            </div>
                                            <div class="text-right">
                                                <p v-if="level.count - (previousReadinessLevels[idx]?.count || 0) !== 0"
                                                   :class="level.count - (previousReadinessLevels[idx]?.count || 0) > 0 ? 'text-emerald-600' : 'text-rose-600'"
                                                   class="text-xs font-bold mb-1">
                                                    {{ level.count - (previousReadinessLevels[idx]?.count || 0) > 0 ? '+' : '' }}{{ level.count - (previousReadinessLevels[idx]?.count || 0) }}
                                                </p>
                                                <div class="flex items-center justify-end gap-2">
                                                    <span class="text-xs text-gray-400">{{ previousPeriodLabel }}</span>
                                                    <span class="text-sm font-bold text-gray-900">{{ level.count }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="relative h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                                            <div class="absolute top-0 left-0 h-full rounded-full" :class="level.color"
                                                :style="{ width: level.percentage + '%' }">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Performance Snapshot -->
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div class="bg-gray-50 border border-gray-100 rounded-lg p-6">
                                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Readiness Leaders</h3>
                                    <div class="space-y-4">
                                        <div v-for="sme in topPerformers" :key="sme.id" class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                                            <div class="flex items-center gap-4">
                                                <div class="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 font-extrabold shadow-inner">
                                                    {{ sme.score }}
                                                </div>
                                                <div>
                                                    <p class="text-sm font-bold text-gray-900">{{ sme.name }}</p>
                                                    <p class="text-xs text-gray-500">{{ sme.sector }}</p>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <span class="text-xs font-bold text-emerald-600">+{{ sme.growth }}%</span>
                                                <p class="text-[10px] text-gray-400">Readiness Growth</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-gray-50 border border-gray-100 rounded-lg p-6">
                                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Focus Needed</h3>
                                    <div class="space-y-4">
                                        <div v-for="sme in needsAttention" :key="sme.id" class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                                            <div class="flex items-center gap-4">
                                                <div class="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 font-extrabold shadow-inner">
                                                    {{ sme.score }}
                                                </div>
                                                <div>
                                                    <p class="text-sm font-bold text-gray-900">{{ sme.name }}</p>
                                                    <p class="text-xs text-gray-500">{{ sme.sector }}</p>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <span class="text-xs font-bold text-rose-500">{{ sme.growth }}%</span>
                                                <p class="text-[10px] text-gray-400">Current Progress</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Risk Analysis Tab -->
                        <div v-if="activeTab === 'risk'" class="space-y-6">
                            <InvestorAnalyticsRiskDistribution 
                                :riskByPillarData="riskByPillarData"
                            />
                        </div>

                        <!-- Sector Analysis Tab -->
                        <div v-if="activeTab === 'sector'" class="space-y-6">
                            <InvestorAnalyticsSectorDetails 
                                :sectorDetails="sectorDetails"
                            />
                        </div>

                        <!-- Performance Tab -->
                        <div v-if="activeTab === 'performance'" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div v-for="sme in sortedSMEs" :key="sme.id" class="p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                                    <div class="flex items-center justify-between mb-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-400">
                                                {{ sme.name.substring(0, 1) }}
                                            </div>
                                            <div>
                                                <p class="text-sm font-bold text-gray-900">{{ sme.name }}</p>
                                                <p class="text-[11px] text-gray-500 uppercase font-medium">{{ sme.industry }}</p>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            <div class="text-lg font-black text-cyan-600">{{ sme.score }}</div>
                                            <div class="text-[10px] text-gray-400 uppercase font-bold">Score</div>
                                        </div>
                                    </div>
                                    <div class="space-y-3">
                                        <div class="flex justify-between text-xs">
                                            <span class="text-gray-500">Readiness Phase</span>
                                            <span class="font-bold text-gray-700">{{ sme.stage }}</span>
                                        </div>
                                        <div class="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                            <div class="h-full bg-cyan-500 rounded-full" :style="{ width: sme.score + '%' }"></div>
                                        </div>
                                        <div class="flex justify-between items-center pt-2">
                                            <span class="text-[11px] font-bold" :class="sme.financialRisk === 'High' ? 'text-rose-500' : 'text-emerald-500'">
                                                {{ sme.financialRisk }} Risk
                                            </span>
                                            <NuxtLink :to="`/investor/sme/${sme.id}/dashboard`" class="text-[11px] font-bold text-cyan-600 hover:underline">
                                                View Detailed Analysis
                                            </NuxtLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
    ChartBarIcon, 
    ArrowTrendingUpIcon, 
    ExclamationTriangleIcon,
    BuildingOfficeIcon as SectorIcon,
    PresentationChartLineIcon,
    ArrowPathIcon
} from '@heroicons/vue/24/outline'
import { useInvestorStore } from '~/stores/investor.store'

// -- 1. State & Setup --
const investorStore = useInvestorStore()
const activeTab = ref('overview')
const loading = computed(() => investorStore.loading)

const tabs = [
    { id: 'overview', label: 'Overview', icon: PresentationChartLineIcon },
    { id: 'risk', label: 'Risk Analysis', icon: ExclamationTriangleIcon },
    { id: 'sector', label: 'Sector Analysis', icon: SectorIcon },
    { id: 'performance', label: 'Individual Performance', icon: ChartBarIcon }
]

const dateRangeValue = ref({
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    end: new Date()
})

const compareDateRangeValue = ref({
    start: new Date(new Date().setMonth(new Date().getMonth() - 12)),
    end: new Date(new Date().setMonth(new Date().getMonth() - 6))
})

const comparePeriods = ref(false)
const periodPreset = ref('6m')

// -- 2. Data Fetching --
onMounted(async () => {
    try {
        await investorStore.fetchAnalytics()
    } catch (error) {
        console.error('Initial data load failed:', error)
    }
})

const refreshData = async () => {
    await investorStore.fetchAnalytics(true)
}

const handleDateChange = async () => {
    // Re-fetch analytics with the selected date range as filter params
    await investorStore.fetchAnalytics(true, undefined, dateRangeValue.value.start, dateRangeValue.value.end)
}

const handleToggleCompare = () => {
    // When compare is newly enabled, auto-populate comparison window as the equivalent period before current
    if (comparePeriods.value) {
        const currentStart = dateRangeValue.value.start
        const currentEnd = dateRangeValue.value.end
        const periodMs = currentEnd.getTime() - currentStart.getTime()
        compareDateRangeValue.value = {
            end: new Date(currentStart.getTime() - 1),
            start: new Date(currentStart.getTime() - periodMs - 1)
        }
    }
}

// Auto-populate compare dates whenever the toggle changes
watch(comparePeriods, (newVal) => {
    if (newVal) {
        handleToggleCompare()
    }
})

// -- 3. Derived Data (Computed) --
const allSMEs = computed(() => investorStore.dealFlow)

const filteredDealFlow = computed(() => {
    const start = dateRangeValue.value.start
    const end = dateRangeValue.value.end
    
    return allSMEs.value.filter((sme: any) => {
        if (!sme.lastAssessedDate) return true
        const assessDate = new Date(sme.lastAssessedDate)
        return assessDate >= start && assessDate <= end
    })
})

const previousFilteredDealFlow = computed(() => {
    const start = compareDateRangeValue.value.start
    const end = compareDateRangeValue.value.end
    
    return allSMEs.value.filter((sme: any) => {
        if (!sme.lastAssessedDate) return false
        const assessDate = new Date(sme.lastAssessedDate)
        return assessDate >= start && assessDate <= end
    })
})

const getStats = (data: any[]) => {
    const total = data.length
    if (total === 0) return { total: 0, avgScore: 0, investorReady: 0, investorReadyPercent: 0, highRisk: 0, highRiskPercent: 0, nearReady: 0, avgGrowth: 0, improving: 0, sectors: 0 }
    
    const avgScore = Math.round(data.reduce((sum, d) => sum + d.score, 0) / total)
    const investorReady = data.filter(d => d.score >= 80).length
    const highRisk = data.filter(d => d.financialRisk === 'High').length
    const nearReady = data.filter(d => d.score >= 60 && d.score < 80).length
    const avgGrowth = Math.round(data.reduce((sum, d) => sum + (d.growthRate || 0), 0) / total)
    const sectors = new Set(data.map(d => d.industry)).size
    
    return {
        total,
        avgScore,
        investorReady,
        investorReadyPercent: Math.round((investorReady / total) * 100),
        highRisk,
        highRiskPercent: Math.round((highRisk / total) * 100),
        nearReady,
        avgGrowth,
        improving: Math.floor(total * 0.4), // Simulated
        sectors
    }
}

const filteredStats = computed(() => getStats(filteredDealFlow.value))
const previousStats = computed(() => getStats(previousFilteredDealFlow.value))

const readinessLevels = computed(() => {
    const data = filteredDealFlow.value
    const total = data.length || 1
    return [
        { name: 'Investor Ready', count: data.filter(d => d.score >= 80).length, percentage: Math.round(data.filter(d => d.score >= 80).length / total * 100), color: 'bg-emerald-500' },
        { name: 'Near Ready', count: data.filter(d => d.score >= 60 && d.score < 80).length, percentage: Math.round(data.filter(d => d.score >= 60 && d.score < 80).length / total * 100), color: 'bg-cyan-500' },
        { name: 'Early Stage', count: data.filter(d => d.score >= 40 && d.score < 60).length, percentage: Math.round(data.filter(d => d.score >= 40 && d.score < 60).length / total * 100), color: 'bg-amber-500' },
        { name: 'Pre-Investment', count: data.filter(d => d.score < 40).length, percentage: Math.round(data.filter(d => d.score < 40).length / total * 100), color: 'bg-gray-400' }
    ]
})

const previousReadinessLevels = computed(() => {
    const data = previousFilteredDealFlow.value
    const total = data.length || 1
    return [
        { name: 'Investor Ready', count: data.filter(d => d.score >= 80).length, percentage: Math.round(data.filter(d => d.score >= 80).length / total * 100) },
        { name: 'Near Ready', count: data.filter(d => d.score >= 60 && d.score < 80).length, percentage: Math.round(data.filter(d => d.score >= 60 && d.score < 80).length / total * 100) },
        { name: 'Early Stage', count: data.filter(d => d.score >= 40 && d.score < 60).length, percentage: Math.round(data.filter(d => d.score >= 40 && d.score < 60).length / total * 100) },
        { name: 'Pre-Investment', count: data.filter(d => d.score < 40).length, percentage: Math.round(data.filter(d => d.score < 40).length / total * 100) }
    ]
})

const sectorDetails = computed(() => {
    const sectors = [...new Set(filteredDealFlow.value.map((d: any) => d.industry))]
    return sectors.map(name => {
        const smes = filteredDealFlow.value.filter((d: any) => d.industry === name)
        return {
            name,
            count: smes.length,
            avgReadiness: Math.round(smes.reduce((sum, s: any) => sum + s.score, 0) / smes.length),
            avgGrowth: Math.round(smes.reduce((sum, s: any) => sum + (s.growthRate || 0), 0) / smes.length),
            highRisk: Math.round(smes.filter((s: any) => s.financialRisk === 'High').length / smes.length * 100)
        }
    })
})

const riskByPillarData = computed(() => investorStore.pillarRiskData)

const topPerformers = computed(() => {
    return [...filteredDealFlow.value]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(s => ({ id: s.id, name: s.name, sector: s.industry, score: s.score, growth: 12 }))
})

const needsAttention = computed(() => {
    return [...filteredDealFlow.value]
        .sort((a, b) => a.score - b.score)
        .slice(0, 3)
        .map(s => ({ id: s.id, name: s.name, sector: s.industry, score: s.score, growth: 5 }))
})

const sortedSMEs = computed(() => {
    return [...filteredDealFlow.value].sort((a, b) => b.score - a.score)
})

// -- 4. Trend Logic (Real data from backend) --
const portfolioTrendData = computed(() => {
    const rawTrend = investorStore.trendData
    if (!rawTrend || rawTrend.length === 0) {
        // Fallback: compute from dealflow if backend sends no trend yet
        const now = new Date()
        return [{ month: now.toLocaleString('en-US', { month: 'short', year: 'numeric' }), score: filteredStats.value.avgScore, ready: filteredStats.value.investorReady, x: 0, y: filteredStats.value.avgScore }]
    }
    const totalPoints = rawTrend.length
    const svgWidth = 100
    return rawTrend.map((point, i) => ({
        ...point,
        x: totalPoints > 1 ? Math.round((i / (totalPoints - 1)) * svgWidth) : 50,
        y: point.score
    }))
})

const trendPath = computed(() => {
    const points = portfolioTrendData.value
    if (!points.length) return ''
    return 'M ' + points.map(p => `${p.x},${100 - p.y}`).join(' L ')
})

const trendAreaPath = computed(() => {
    const points = portfolioTrendData.value
    if (!points.length) return ''
    const line = points.map(p => `${p.x},${100 - p.y}`).join(' L ')
    const firstX = points[0]?.x ?? 0
    const lastX = points[points.length - 1]?.x ?? 0
    return `M ${firstX},100 L ${line} L ${lastX},100 Z`
})

const comparisonPath = computed(() => {
    // The comparison path is the previous-period trend if comparePeriods is active.
    // Since backend doesn't return separate previous-period trend, we use a 5% offset as a visual indicator.
    const points = portfolioTrendData.value
    if (!points.length) return ''
    return 'M ' + points.map(p => `${p.x},${100 - Math.max(0, p.y - 5)}`).join(' L ')
})

const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const formatDateShort = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const currentPeriodLabel = computed(() => `${formatDateShort(dateRangeValue.value.start)} - ${formatDate(dateRangeValue.value.end)}`)
const previousPeriodLabel = computed(() => `${formatDateShort(compareDateRangeValue.value.start)} - ${formatDate(compareDateRangeValue.value.end)}`)

definePageMeta({
    layout: 'investor',
    middleware: ['auth', 'investor']
})
</script>

<style scoped>
.shadow-soft {
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.04);
}
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #E2E8F0;
    border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #CBD5E1;
}
</style>
