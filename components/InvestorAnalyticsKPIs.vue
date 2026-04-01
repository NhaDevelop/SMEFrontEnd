<template>
    <div class="space-y-6">
        <!-- Normal View KPIs -->
        <template v-if="!comparePeriods">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Total SMEs -->
                <div class="bg-white rounded-lg shadow-soft p-6">
                    <div class="flex items-start justify-between mb-3">
                        <p class="text-sm font-medium text-gray-500">Total SMEs</p>
                        <BriefcaseIcon class="w-5 h-5 text-gray-400" />
                    </div>
                    <p class="text-3xl font-bold text-gray-900 mb-1">{{ stats.total }}</p>
                    <p class="text-xs text-gray-500">in selected period</p>
                </div>

                <!-- Avg Readiness Score -->
                <div class="bg-white rounded-lg shadow-soft p-6">
                    <div class="flex items-start justify-between mb-3">
                        <p class="text-sm font-medium text-gray-500">Avg. Readiness Score</p>
                        <ChartBarIcon class="w-5 h-5 text-gray-400" />
                    </div>
                    <p class="text-3xl font-bold text-gray-900 mb-1">{{ stats.avgScore }}</p>
                    <p class="text-xs text-gray-500">across all SMEs</p>
                </div>

                <!-- Investor Ready -->
                <div class="bg-white rounded-lg shadow-soft p-6">
                    <div class="flex items-start justify-between mb-3">
                        <p class="text-sm font-medium text-gray-500">Investor Ready</p>
                        <CheckCircleIcon class="w-5 h-5 text-cyan-600" />
                    </div>
                    <p class="text-3xl font-bold text-gray-900 mb-1">{{ stats.investorReadyPercent }}%</p>
                    <p class="text-xs text-gray-500">{{ stats.investorReady }} SMEs</p>
                </div>

                <!-- High Risk -->
                <div class="bg-white rounded-lg shadow-soft p-6">
                    <div class="flex items-start justify-between mb-3">
                        <p class="text-sm font-medium text-gray-500">High Risk</p>
                        <ExclamationTriangleIcon class="w-5 h-5 text-amber-600" />
                    </div>
                    <p class="text-3xl font-bold text-gray-900 mb-1">{{ stats.highRiskPercent }}%</p>
                    <p class="text-xs text-gray-500">{{ stats.highRisk }} SMEs</p>
                </div>
            </div>

            <!-- Second Row KPIs -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-white rounded-lg shadow-soft p-6">
                    <div class="flex items-start justify-between mb-3">
                        <p class="text-sm font-medium text-gray-500">Avg. Growth Potential</p>
                        <ArrowTrendingUpIcon class="w-5 h-5 text-gray-400" />
                    </div>
                    <p class="text-3xl font-bold text-gray-900 mb-1">{{ stats.avgGrowth }}</p>
                    <p class="text-xs text-gray-500">percentage points</p>
                </div>

                <div class="bg-white rounded-lg shadow-soft p-6">
                    <div class="flex items-start justify-between mb-3">
                        <p class="text-sm font-medium text-gray-500">Near Ready</p>
                        <UserGroupIcon class="w-5 h-5 text-gray-400" />
                    </div>
                    <p class="text-3xl font-bold text-gray-900 mb-1">{{ stats.nearReady }}</p>
                    <p class="text-xs text-gray-500">Close to investment threshold</p>
                </div>

                <div class="bg-white rounded-lg shadow-soft p-6">
                    <div class="flex items-start justify-between mb-3">
                        <p class="text-sm font-medium text-gray-500">Showing Improvement</p>
                        <ArrowTrendingUpIcon class="w-5 h-5 text-emerald-500" />
                    </div>
                    <p class="text-3xl font-bold text-gray-900 mb-1">{{ stats.improving }}</p>
                    <p class="text-xs text-gray-500">Score improved since last assessment</p>
                </div>

                <div class="bg-white rounded-lg shadow-soft p-6">
                    <div class="flex items-start justify-between mb-3">
                        <p class="text-sm font-medium text-gray-500">Sectors Covered</p>
                        <BuildingOfficeIcon class="w-5 h-5 text-gray-400" />
                    </div>
                    <p class="text-3xl font-bold text-gray-900 mb-1">{{ stats.sectors }}</p>
                    <p class="text-xs text-gray-500">unique industries</p>
                </div>
            </div>
        </template>

        <!-- Comparison View KPIs -->
        <template v-else>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Total SMEs Comparison -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <div class="flex items-center gap-2 mb-4">
                        <BriefcaseIcon class="w-5 h-5 text-gray-400" />
                        <span class="text-sm font-medium text-gray-600">Total SMEs</span>
                    </div>
                    <div class="flex justify-between items-end mb-4">
                        <div>
                            <p class="text-xs text-gray-400 mb-1">{{ currentLabel }}</p>
                            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-400 mb-1">{{ previousLabel }}</p>
                            <p class="text-2xl font-bold text-gray-900">{{ previousStats.total }}</p>
                        </div>
                    </div>
                    <div :class="[
                        'rounded-md py-1 px-3 text-center',
                        stats.total - previousStats.total > 0 ? 'bg-emerald-100 text-emerald-700' :
                            stats.total - previousStats.total < 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-50 text-gray-500'
                    ]">
                        <span class="text-xs font-bold">
                            {{ stats.total - previousStats.total > 0 ? '+' : '' }}{{ stats.total - previousStats.total }} Change
                        </span>
                    </div>
                </div>

                <!-- Avg Readiness Comparison -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <div class="flex items-center gap-2 mb-4">
                        <ArrowTrendingUpIcon class="w-5 h-5 text-gray-400" />
                        <span class="text-sm font-medium text-gray-600">Avg. Readiness</span>
                    </div>
                    <div class="flex justify-between items-end mb-4">
                        <div>
                            <p class="text-xs text-gray-400 mb-1">{{ currentLabel }}</p>
                            <p class="text-2xl font-bold text-gray-900">{{ stats.avgScore }}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-400 mb-1">{{ previousLabel }}</p>
                            <p class="text-2xl font-bold text-gray-900">{{ previousStats.avgScore }}</p>
                        </div>
                    </div>
                    <div :class="[
                        'rounded-md py-1 px-3 text-center',
                        stats.avgScore - previousStats.avgScore > 0 ? 'bg-emerald-100 text-emerald-700' :
                            stats.avgScore - previousStats.avgScore < 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-50 text-gray-500'
                    ]">
                        <span class="text-xs font-bold">
                            {{ stats.avgScore - previousStats.avgScore > 0 ? '+' : '' }}{{ stats.avgScore - previousStats.avgScore }} Change
                        </span>
                    </div>
                </div>

                <!-- Investor Ready Comparison -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <div class="flex items-center gap-2 mb-4">
                        <CheckCircleIcon class="w-5 h-5 text-gray-400" />
                        <span class="text-sm font-medium text-gray-600">Investor Ready</span>
                    </div>
                    <div class="flex justify-between items-end mb-4">
                        <div>
                            <p class="text-xs text-gray-400 mb-1">{{ currentLabel }}</p>
                            <p class="text-2xl font-bold text-gray-900">{{ stats.investorReadyPercent }}%</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-400 mb-1">{{ previousLabel }}</p>
                            <p class="text-2xl font-bold text-gray-900">{{ previousStats.investorReadyPercent }}%</p>
                        </div>
                    </div>
                    <div :class="[
                        'rounded-md py-1 px-3 text-center',
                        stats.investorReadyPercent - previousStats.investorReadyPercent > 0 ? 'bg-emerald-100 text-emerald-700' :
                            stats.investorReadyPercent - previousStats.investorReadyPercent < 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-50 text-gray-500'
                    ]">
                        <span class="text-xs font-bold">
                            {{ stats.investorReadyPercent - previousStats.investorReadyPercent > 0 ? '+' : '' }}{{ stats.investorReadyPercent - previousStats.investorReadyPercent }}% Change
                        </span>
                    </div>
                </div>

                <!-- High Risk Comparison -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                    <div class="flex items-center gap-2 mb-4">
                        <ExclamationTriangleIcon class="w-5 h-5 text-gray-400" />
                        <span class="text-sm font-medium text-gray-600">High Risk</span>
                    </div>
                    <div class="flex justify-between items-end mb-4">
                        <div>
                            <p class="text-xs text-gray-400 mb-1">{{ currentLabel }}</p>
                            <p class="text-2xl font-bold text-gray-900">{{ stats.highRiskPercent }}%</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-400 mb-1">{{ previousLabel }}</p>
                            <p class="text-2xl font-bold text-gray-900">{{ previousStats.highRiskPercent }}%</p>
                        </div>
                    </div>
                    <div :class="[
                        'rounded-md py-1 px-3 text-center',
                        stats.highRiskPercent - previousStats.highRiskPercent > 0 ? 'bg-rose-100 text-rose-700' :
                            stats.highRiskPercent - previousStats.highRiskPercent < 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50 text-gray-500'
                    ]">
                        <span class="text-xs font-bold">
                            {{ stats.highRiskPercent - previousStats.highRiskPercent > 0 ? '+' : '' }}{{ stats.highRiskPercent - previousStats.highRiskPercent }}% Change
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import {
    BriefcaseIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowTrendingUpIcon,
    UserGroupIcon,
    BuildingOfficeIcon
} from '@heroicons/vue/24/outline'

defineProps<{
    stats: any,
    comparePeriods: boolean,
    previousStats?: any,
    currentLabel?: string,
    previousLabel?: string
}>()
</script>
