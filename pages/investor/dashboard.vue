<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6 mb-8 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Portfolio Overview</h1>
                    <p class="text-gray-500 mt-1">Monitor and compare SME investment readiness across your portfolio</p>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto custom-scrollbar px-8 pb-12 w-full">
            <div class="max-w-[1600px] mx-auto space-y-6">

                <!-- KPI Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Total SMEs -->
                    <div class="bg-white rounded-lg shadow-soft p-6">
                        <div class="flex items-center justify-between mb-4">
                            <p class="text-sm font-medium text-gray-500">Total SMEs</p>
                            <div class="p-2 bg-gray-50 rounded-md">
                                <BriefcaseIcon class="w-5 h-5 text-gray-500" />
                            </div>
                        </div>
                        <div class="flex items-baseline gap-2">
                            <p class="text-3xl font-bold text-gray-900">{{ stats.totalDeals }}</p>
                        </div>
                        <div class="mt-2 text-xs flex items-center gap-1">
                            <span class="text-emerald-600 flex items-center">
                                <ArrowTrendingUpIcon class="w-3.5 h-3.5 mr-1" />
                                12%
                            </span>
                            <span class="text-gray-400">vs last month</span>
                        </div>
                    </div>

                    <!-- Avg Readiness Score -->
                    <div class="bg-white rounded-lg shadow-soft p-6">
                        <div class="flex items-center justify-between mb-4">
                            <p class="text-sm font-medium text-gray-500">Avg. Readiness Score</p>
                            <div class="p-2 bg-gray-50 rounded-md">
                                <ChartBarIcon class="w-5 h-5 text-gray-500" />
                            </div>
                        </div>
                        <div class="flex items-baseline gap-2">
                            <p class="text-3xl font-bold text-gray-900">{{ stats.avgScore }}</p>
                        </div>
                        <div class="mt-2 text-xs flex items-center gap-1">
                            <span class="text-emerald-600 flex items-center">
                                <ArrowTrendingUpIcon class="w-3.5 h-3.5 mr-1" />
                                5%
                            </span>
                            <span class="text-gray-400">vs last quarter</span>
                        </div>
                    </div>

                    <!-- Investor Ready -->
                    <div class="bg-white rounded-lg shadow-soft p-6">
                        <div class="flex items-center justify-between mb-4">
                            <p class="text-sm font-medium text-gray-500">Investor Ready</p>
                            <div class="p-2 bg-gray-50 rounded-md">
                                <CheckCircleIcon class="w-5 h-5 text-gray-500" />
                            </div>
                        </div>
                        <div class="flex items-baseline gap-2">
                            <p class="text-3xl font-bold text-gray-900">{{ investorReadyPercent }}%</p>
                            <span class="text-sm text-gray-500">{{ stats.readyToInvest }} SMEs</span>
                        </div>
                    </div>

                    <!-- High Risk -->
                    <div class="bg-white rounded-lg shadow-soft p-6">
                        <div class="flex items-center justify-between mb-4">
                            <p class="text-sm font-medium text-gray-500">High Risk</p>
                            <div class="p-2 bg-gray-50 rounded-md">
                                <ExclamationTriangleIcon class="w-5 h-5 text-gray-500" />
                            </div>
                        </div>
                        <div class="flex items-baseline gap-2">
                            <p class="text-3xl font-bold text-gray-900">{{ highRiskPercent }}%</p>
                            <span class="text-sm text-gray-500">{{ stats.highRisk }} SMEs</span>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Readiness Distribution -->
                    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                        <h3 class="text-lg font-bold text-gray-900 mb-6">Readiness Distribution</h3>

                        <div class="relative pt-2 pb-6 px-4">
                            <!-- Helper grid lines background -->
                            <div
                                class="absolute inset-x-8 top-0 bottom-8 flex flex-col justify-between pointer-events-none z-0">
                                <div class="border-b border-dashed border-gray-100 h-0 w-full mb-8"></div>
                                <div class="border-b border-dashed border-gray-100 h-0 w-full mb-8"></div>
                                <div class="border-b border-dashed border-gray-100 h-0 w-full mb-8"></div>
                                <div class="border-b border-dashed border-gray-100 h-0 w-full mb-8"></div>
                            </div>

                            <div class="space-y-8 relative z-10 pl-24 ml-2">
                                <!-- Investor Ready -->
                                <div class="relative flex items-center h-8 group cursor-pointer">
                                    <div class="absolute -left-28 w-24 text-right pr-2">
                                        <span
                                            class="text-xs text-gray-500 font-medium leading-tight block">Investor<br>Ready</span>
                                    </div>
                                    <div class="w-full h-8 relative flex items-center rounded-sm overflow-visible">
                                        <!-- Hover Background Track -->
                                        <div
                                            class="absolute inset-x-0 top-0 bottom-0 bg-gray-100/80 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        </div>

                                        <!-- Data Bar (Width 0% if 0) -->
                                        <div class="h-full bg-emerald-500 rounded-sm relative z-10 transition-all duration-500"
                                            :style="{ width: (readinessDistribution.investorReady / 16 * 100) + '%' }">
                                        </div>

                                        <!-- Tooltip -->
                                        <div
                                            class="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                                            <div
                                                class="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-md py-2 px-4 text-center border border-gray-100 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                                                <p class="text-xs text-gray-500 mb-0.5 font-medium">Investor Ready</p>
                                                <p class="text-sm font-bold text-gray-900">{{
                                                    readinessDistribution.investorReady }} SMEs</p>
                                            </div>
                                            <div
                                                class="w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100 absolute left-1/2 -translate-x-1/2 -bottom-1">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Near Ready -->
                                <div class="relative flex items-center h-8 group cursor-pointer">
                                    <div class="absolute -left-28 w-24 text-right pr-2">
                                        <span class="text-xs text-gray-500 font-medium leading-tight block">Near
                                            Ready</span>
                                    </div>
                                    <div class="w-full h-8 relative flex items-center rounded-sm overflow-visible">
                                        <div
                                            class="absolute inset-x-0 top-0 bottom-0 bg-gray-100/80 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        </div>
                                        <div class="h-full bg-[#189AB4] rounded-sm relative z-10 transition-all duration-500"
                                            :style="{ width: (readinessDistribution.nearReady / 16 * 100) + '%' }">
                                        </div>
                                        <div
                                            class="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                                            <div
                                                class="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-md py-2 px-4 text-center border border-gray-100 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                                                <p class="text-xs text-gray-500 mb-0.5 font-medium">Near Ready</p>
                                                <p class="text-sm font-bold text-gray-900">{{
                                                    readinessDistribution.nearReady }} SMEs</p>
                                            </div>
                                            <div
                                                class="w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100 absolute left-1/2 -translate-x-1/2 -bottom-1">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Early Stage -->
                                <div class="relative flex items-center h-8 group cursor-pointer">
                                    <div class="absolute -left-28 w-24 text-right pr-2">
                                        <span class="text-xs text-gray-500 font-medium leading-tight block">Early
                                            Stage</span>
                                    </div>
                                    <div class="w-full h-8 relative flex items-center rounded-sm overflow-visible">
                                        <div
                                            class="absolute inset-x-0 top-0 bottom-0 bg-gray-100/80 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        </div>
                                        <div class="h-full bg-[#F59E0B] rounded-sm relative z-10 transition-all duration-500"
                                            :style="{ width: (readinessDistribution.earlyStage / 16 * 100) + '%' }">
                                        </div>
                                        <div
                                            class="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                                            <div
                                                class="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-md py-2 px-4 text-center border border-gray-100 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                                                <p class="text-xs text-gray-500 mb-0.5 font-medium">Early Stage</p>
                                                <p class="text-sm font-bold text-gray-900">{{
                                                    readinessDistribution.earlyStage }} SMEs</p>
                                            </div>
                                            <div
                                                class="w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100 absolute left-1/2 -translate-x-1/2 -bottom-1">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pre-Investment -->
                                <div class="relative flex items-center h-8 group cursor-pointer">
                                    <div class="absolute -left-28 w-24 text-right pr-2">
                                        <span
                                            class="text-xs text-gray-500 font-medium leading-tight block">Pre-Investment</span>
                                    </div>
                                    <div class="w-full h-8 relative flex items-center rounded-sm overflow-visible">
                                        <div
                                            class="absolute inset-x-0 top-0 bottom-0 bg-gray-100/80 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        </div>
                                        <div class="h-full bg-gray-400 rounded-sm relative z-10 transition-all duration-500"
                                            :style="{ width: (readinessDistribution.preInvestment / 16 * 100) + '%' }">
                                        </div>
                                        <div
                                            class="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                                            <div
                                                class="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-md py-2 px-4 text-center border border-gray-100 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                                                <p class="text-xs text-gray-500 mb-0.5 font-medium">Pre-Investment</p>
                                                <p class="text-sm font-bold text-gray-900">{{
                                                    readinessDistribution.preInvestment }} SMEs</p>
                                            </div>
                                            <div
                                                class="w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100 absolute left-1/2 -translate-x-1/2 -bottom-1">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- X Axis -->
                            <div class="flex justify-between pl-24 ml-2 text-xs text-gray-400 mt-8 relative z-10">
                                <span>0</span>
                                <span>4</span>
                                <span>8</span>
                                <span>12</span>
                                <span>16</span>
                            </div>
                        </div>
                    </div>

                    <!-- Risk vs Growth -->
                    <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h3 class="text-lg font-bold text-gray-900 mb-6">Risk vs Growth Potential</h3>
                        <RiskGrowthScatterPlot :smes="store.dealFlow" @point-click="openSmeModal" />
                    </div>
                </div>

                <!-- SME Comparison Table -->
                <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div class="p-6 border-b border-gray-100">
                        <h2 class="text-lg font-bold text-gray-900">SME Comparison</h2>
                    </div>
                    <Marketplace @sme-click="openSmeModal" />
                </div>

            </div>
        </main>

        <!-- SME Dashboard Modal -->
        <SmeDashboardModal v-if="selectedSme" :sme="selectedSme" @close="selectedSme = null" />
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useInvestorStore } from '~/stores/investor.store'
import Marketplace from '~/components/InvestorMarketplace.vue'
import SmeDashboardModal from '~/components/InvestorSmeDashboardModal.vue'
import RiskGrowthScatterPlot from '~/components/InvestorRiskGrowthScatterPlot.vue'
import {
    BriefcaseIcon,
    CheckCircleIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
    ArrowTrendingUpIcon
} from '@heroicons/vue/24/outline'

const store = useInvestorStore()

// Modal state
const selectedSme = ref<any | null>(null)

const stats = computed(() => store.stats)

const investorReadyPercent = computed(() => {
    if (stats.value.totalDeals === 0) return 0
    return Math.round((stats.value.readyToInvest / stats.value.totalDeals) * 100)
})

const highRiskPercent = computed(() => {
    if (stats.value.totalDeals === 0) return 0
    return Math.round((stats.value.highRisk / stats.value.totalDeals) * 100)
})

// Calculate readiness distribution from dealflow
const readinessDistribution = computed(() => {
    const dealFlow = store.dealFlow
    return {
        investorReady: dealFlow.filter(d => d.score >= 80).length,
        nearReady: dealFlow.filter(d => d.score >= 60 && d.score < 80).length,
        earlyStage: dealFlow.filter(d => d.score >= 40 && d.score < 60).length,
        preInvestment: dealFlow.filter(d => d.score < 40).length
    }
})

// Modal functions
const openSmeModal = (sme: any) => {
    selectedSme.value = sme
}

const handleCreateGoal = () => {
    // Handle goal creation - could open another modal or navigate
    console.log('Create goal for:', selectedSme.value)
}

onMounted(() => {
    if (store.dealFlow.length === 0) {
        store.fetchDealFlow()
    }
})

definePageMeta({
    layout: 'investor'
})
</script>
