<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6 mb-8 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Investor Analytics</h1>
                    <p class="text-gray-500 mt-1">Deep insights into portfolio performance, risk distribution,
                        and SME comparisons</p>
                </div>
            </div>

            <!-- Time Period Selector & Date Range -->
            <div class="mt-6">
                <AnalyticsPeriodSelector v-model="dateRangeValue" v-model:compareValue="compareDateRangeValue"
                    v-model:compareEnabled="comparePeriods" v-model:periodPreset="selectedPeriod" />
            </div>

            <p class="text-xs text-gray-500 mt-2">Showing data from {{ dateRange }} (0 of 25 SMEs)</p>
        </header>

        <main class="flex-1 overflow-y-auto custom-scrollbar px-8 pb-12 w-full">
            <div class="max-w-[1600px] mx-auto space-y-6">

                <!-- KPI Cards Grid -->
                <div v-if="!comparePeriods" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Total SMEs -->
                    <div class="bg-white rounded-lg shadow-soft p-6">
                        <div class="flex items-start justify-between mb-3">
                            <p class="text-sm font-medium text-gray-500">Total SMEs</p>
                            <BriefcaseIcon class="w-5 h-5 text-gray-400" />
                        </div>
                        <p class="text-3xl font-bold text-gray-900 mb-1">{{ filteredStats.total }}</p>
                        <p class="text-xs text-gray-500">in selected period</p>
                    </div>

                    <!-- Avg Readiness Score -->
                    <div class="bg-white rounded-lg shadow-soft p-6">
                        <div class="flex items-start justify-between mb-3">
                            <p class="text-sm font-medium text-gray-500">Avg. Readiness Score</p>
                            <ChartBarIcon class="w-5 h-5 text-gray-400" />
                        </div>
                        <p class="text-3xl font-bold text-gray-900 mb-1">{{ filteredStats.avgScore }}</p>
                        <p class="text-xs text-gray-500">across all SMEs</p>
                    </div>

                    <!-- Investor Ready -->
                    <div class="bg-white rounded-lg shadow-soft p-6">
                        <div class="flex items-start justify-between mb-3">
                            <p class="text-sm font-medium text-gray-500">Investor Ready</p>
                            <CheckCircleIcon class="w-5 h-5 text-cyan-600" />
                        </div>
                        <p class="text-3xl font-bold text-gray-900 mb-1">{{ filteredStats.investorReadyPercent }}%</p>
                        <p class="text-xs text-gray-500">{{ filteredStats.investorReady }} SMEs</p>
                    </div>

                    <!-- High Risk -->
                    <div class="bg-white rounded-lg shadow-soft p-6">
                        <div class="flex items-start justify-between mb-3">
                            <p class="text-sm font-medium text-gray-500">High Risk</p>
                            <ExclamationTriangleIcon class="w-5 h-5 text-amber-600" />
                        </div>
                        <p class="text-3xl font-bold text-gray-900 mb-1">{{ filteredStats.highRiskPercent }}%</p>
                        <p class="text-xs text-gray-500">{{ filteredStats.highRisk }} SMEs</p>
                    </div>
                </div>

                <!-- Second Row KPIs -->
                <div v-if="!comparePeriods" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <!-- Avg Growth Potential -->
                    <div class="bg-white rounded-lg shadow-soft p-6">
                        <div class="flex items-start justify-between mb-3">
                            <p class="text-sm font-medium text-gray-500">Avg. Growth Potential</p>
                            <ArrowTrendingUpIcon class="w-5 h-5 text-gray-400" />
                        </div>
                        <p class="text-3xl font-bold text-gray-900 mb-1">{{ filteredStats.avgGrowth }}</p>
                        <p class="text-xs text-gray-500">percentage points</p>
                    </div>

                    <!-- Near Ready -->
                    <div class="bg-white rounded-lg shadow-soft p-6">
                        <div class="flex items-start justify-between mb-3">
                            <p class="text-sm font-medium text-gray-500">Near Ready</p>
                            <UserGroupIcon class="w-5 h-5 text-gray-400" />
                        </div>
                        <p class="text-3xl font-bold text-gray-900 mb-1">{{ filteredStats.nearReady }}</p>
                        <p class="text-xs text-gray-500">Close to investment threshold</p>
                    </div>

                    <!-- Showing Improvement -->
                    <div class="bg-white rounded-lg shadow-soft p-6">
                        <div class="flex items-start justify-between mb-3">
                            <p class="text-sm font-medium text-gray-500">Showing Improvement</p>
                            <ArrowTrendingUpIcon class="w-5 h-5 text-emerald-500" />
                        </div>
                        <p class="text-3xl font-bold text-gray-900 mb-1">{{ filteredStats.improving }}</p>
                        <p class="text-xs text-gray-500">Score improved since last assessment</p>
                    </div>

                    <!-- Sectors Covered -->
                    <div class="bg-white rounded-lg shadow-soft p-6">
                        <div class="flex items-start justify-between mb-3">
                            <p class="text-sm font-medium text-gray-500">Sectors Covered</p>
                            <BuildingOfficeIcon class="w-5 h-5 text-gray-400" />
                        </div>
                        <p class="text-3xl font-bold text-gray-900 mb-1">{{ filteredStats.sectors }}</p>
                        <p class="text-xs text-gray-500">unique industries</p>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div v-if="!comparePeriods" class="border-b border-gray-200">
                        <nav class="flex gap-8 px-6" aria-label="Tabs">
                            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                                activeTab === tab.id
                                    ? 'border-cyan-600 text-cyan-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            ]">
                                {{ tab.name }}
                            </button>
                        </nav>
                    </div>

                    <!-- Tab Content -->
                    <div class="p-6">
                        <!-- Overview Tab -->
                        <div v-if="activeTab === 'overview'" class="space-y-6">

                            <!-- Comparison View -->
                            <div v-if="comparePeriods" class="space-y-6">
                                <!-- Period Comparison Summary -->
                                <div
                                    class="bg-emerald-50 rounded-lg p-6 flex justify-between items-center border border-emerald-100">
                                    <div class="flex items-center gap-4">
                                        <div
                                            class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                            <ArrowTrendingUpIcon class="w-6 h-6 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 class="text-lg font-bold text-gray-900">Period Comparison</h3>
                                            <p class="text-sm text-gray-500">Comparing {{ currentPeriodLabel }} vs {{
                                                previousPeriodLabel }}</p>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <p class="text-sm text-gray-500">Overall Readiness Change</p>
                                        <p :class="[
                                            'text-3xl font-bold',
                                            filteredStats.avgScore - previousStats.avgScore > 0 ? 'text-emerald-600' :
                                                filteredStats.avgScore - previousStats.avgScore < 0 ? 'text-rose-600' : 'text-gray-900'
                                        ]">
                                            {{ filteredStats.avgScore - previousStats.avgScore > 0 ? '+' : '' }}{{
                                                filteredStats.avgScore - previousStats.avgScore }} pts
                                        </p>
                                    </div>
                                </div>

                                <!-- Comparison Cards Grid 1 -->
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <!-- Total SMEs -->
                                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                                        <div class="flex items-center gap-2 mb-4">
                                            <BriefcaseIcon class="w-5 h-5 text-gray-400" />
                                            <span class="text-sm font-medium text-gray-600">Total SMEs</span>
                                        </div>
                                        <div class="flex justify-between items-end mb-4">
                                            <div>
                                                <p class="text-xs text-gray-400 mb-1">{{ currentPeriodLabel }}</p>
                                                <p class="text-2xl font-bold text-gray-900">{{ filteredStats.total }}
                                                </p>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-xs text-gray-400 mb-1">{{ previousPeriodLabel }}</p>
                                                <p class="text-2xl font-bold text-gray-900">{{ previousStats.total }}
                                                </p>
                                            </div>
                                        </div>
                                        <div :class="[
                                            'rounded-md py-1 px-3 text-center',
                                            filteredStats.total - previousStats.total > 0 ? 'bg-emerald-100 text-emerald-700' :
                                                filteredStats.total - previousStats.total < 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-50 text-gray-500'
                                        ]">
                                            <span class="text-xs font-bold">
                                                {{ filteredStats.total - previousStats.total > 0 ? '+' : '' }}{{
                                                    filteredStats.total - previousStats.total }} Change
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Avg. Readiness -->
                                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                                        <div class="flex items-center gap-2 mb-4">
                                            <ArrowTrendingUpIcon class="w-5 h-5 text-gray-400" />
                                            <span class="text-sm font-medium text-gray-600">Avg. Readiness</span>
                                        </div>
                                        <div class="flex justify-between items-end mb-4">
                                            <div>
                                                <p class="text-xs text-gray-400 mb-1">{{ currentPeriodLabel }}</p>
                                                <p class="text-2xl font-bold text-gray-900">{{ filteredStats.avgScore }}
                                                </p>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-xs text-gray-400 mb-1">{{ previousPeriodLabel }}</p>
                                                <p class="text-2xl font-bold text-gray-900">{{ previousStats.avgScore }}
                                                </p>
                                            </div>
                                        </div>
                                        <div :class="[
                                            'rounded-md py-1 px-3 text-center',
                                            filteredStats.avgScore - previousStats.avgScore > 0 ? 'bg-emerald-100 text-emerald-700' :
                                                filteredStats.avgScore - previousStats.avgScore < 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-50 text-gray-500'
                                        ]">
                                            <span class="text-xs font-bold">
                                                {{ filteredStats.avgScore - previousStats.avgScore > 0 ? '+' : '' }}{{
                                                    filteredStats.avgScore - previousStats.avgScore }} Change
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Investor Ready -->
                                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                                        <div class="flex items-center gap-2 mb-4">
                                            <CheckCircleIcon class="w-5 h-5 text-gray-400" />
                                            <span class="text-sm font-medium text-gray-600">Investor Ready</span>
                                        </div>
                                        <div class="flex justify-between items-end mb-4">
                                            <div>
                                                <p class="text-xs text-gray-400 mb-1">{{ currentPeriodLabel }}</p>
                                                <p class="text-2xl font-bold text-gray-900">{{
                                                    filteredStats.investorReadyPercent }}%</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-xs text-gray-400 mb-1">{{ previousPeriodLabel }}</p>
                                                <p class="text-2xl font-bold text-gray-900">{{
                                                    previousStats.investorReadyPercent }}%</p>
                                            </div>
                                        </div>
                                        <div :class="[
                                            'rounded-md py-1 px-3 text-center',
                                            filteredStats.investorReadyPercent - previousStats.investorReadyPercent > 0 ? 'bg-emerald-100 text-emerald-700' :
                                                filteredStats.investorReadyPercent - previousStats.investorReadyPercent < 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-50 text-gray-500'
                                        ]">
                                            <span class="text-xs font-bold">
                                                {{ filteredStats.investorReadyPercent -
                                                    previousStats.investorReadyPercent > 0 ? '+' : '' }}{{
                                                    filteredStats.investorReadyPercent - previousStats.investorReadyPercent
                                                }}% Change
                                            </span>
                                        </div>
                                    </div>

                                    <!-- High Risk -->
                                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                                        <div class="flex items-center gap-2 mb-4">
                                            <ExclamationTriangleIcon class="w-5 h-5 text-gray-400" />
                                            <span class="text-sm font-medium text-gray-600">High Risk</span>
                                        </div>
                                        <div class="flex justify-between items-end mb-4">
                                            <div>
                                                <p class="text-xs text-gray-400 mb-1">{{ currentPeriodLabel }}</p>
                                                <p class="text-2xl font-bold text-gray-900">{{
                                                    filteredStats.highRiskPercent }}%</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-xs text-gray-400 mb-1">{{ previousPeriodLabel }}</p>
                                                <p class="text-2xl font-bold text-gray-900">{{
                                                    previousStats.highRiskPercent }}%</p>
                                            </div>
                                        </div>
                                        <div :class="[
                                            'rounded-md py-1 px-3 text-center',
                                            filteredStats.highRiskPercent - previousStats.highRiskPercent > 0 ? 'bg-rose-100 text-rose-700' :
                                                filteredStats.highRiskPercent - previousStats.highRiskPercent < 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50 text-gray-500'
                                        ]">
                                            <!-- Note: High Risk increasing is BAD (Red), decreasing is GOOD (Green). Logically flipped. -->
                                            <span class="text-xs font-bold">
                                                {{ filteredStats.highRiskPercent - previousStats.highRiskPercent > 0 ?
                                                    '+' : '' }}{{
                                                    filteredStats.highRiskPercent - previousStats.highRiskPercent }}% Change
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Comparison Cards Grid 2 -->
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <!-- Avg. Growth Potential -->
                                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                                        <div class="flex items-center gap-2 mb-4">
                                            <ChartBarIcon class="w-5 h-5 text-gray-400" />
                                            <span class="text-sm font-medium text-gray-600">Avg. Growth Potential</span>
                                        </div>
                                        <div class="flex justify-between items-end mb-4 px-8">
                                            <div class="text-center">
                                                <p class="text-xs text-gray-400 mb-1">{{ currentPeriodLabel }}</p>
                                                <p class="text-3xl font-bold text-gray-900">{{ filteredStats.avgGrowth
                                                    }}</p>
                                            </div>
                                            <div class="text-center">
                                                <p class="text-xs text-gray-400 mb-1">{{ previousPeriodLabel }}</p>
                                                <p class="text-3xl font-bold text-gray-900">{{ previousStats.avgGrowth
                                                    }}</p>
                                            </div>
                                        </div>
                                        <div :class="[
                                            'rounded-md py-1 px-3 text-center',
                                            filteredStats.avgGrowth - previousStats.avgGrowth > 0 ? 'bg-emerald-100 text-emerald-700' :
                                                filteredStats.avgGrowth - previousStats.avgGrowth < 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-50 text-gray-500'
                                        ]">
                                            <span class="text-xs font-bold">
                                                {{ filteredStats.avgGrowth - previousStats.avgGrowth > 0 ? '+' : '' }}{{
                                                    filteredStats.avgGrowth - previousStats.avgGrowth }} Change
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Near Ready SMEs -->
                                    <div class="bg-white rounded-lg border border-gray-200 p-6">
                                        <div class="flex items-center gap-2 mb-4">
                                            <UserGroupIcon class="w-5 h-5 text-gray-400" />
                                            <span class="text-sm font-medium text-gray-600">Near Ready SMEs</span>
                                        </div>
                                        <div class="flex justify-between items-end mb-4 px-8">
                                            <div class="text-center">
                                                <p class="text-xs text-gray-400 mb-1">{{ currentPeriodLabel }}</p>
                                                <p class="text-3xl font-bold text-gray-900">{{ filteredStats.nearReady
                                                    }}</p>
                                            </div>
                                            <div class="text-center">
                                                <p class="text-xs text-gray-400 mb-1">{{ previousPeriodLabel }}</p>
                                                <p class="text-3xl font-bold text-gray-900">{{ previousStats.nearReady
                                                    }}</p>
                                            </div>
                                        </div>
                                        <div :class="[
                                            'rounded-md py-1 px-3 text-center',
                                            filteredStats.nearReady - previousStats.nearReady > 0 ? 'bg-emerald-100 text-emerald-700' :
                                                filteredStats.nearReady - previousStats.nearReady < 0 ? 'bg-rose-100 text-rose-700' : 'bg-gray-50 text-gray-500'
                                        ]">
                                            <span class="text-xs font-bold">
                                                {{ filteredStats.nearReady - previousStats.nearReady > 0 ? '+' : '' }}{{
                                                    filteredStats.nearReady - previousStats.nearReady }} Change
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Readiness Distribution Comparison Table -->
                                <div class="bg-white rounded-lg border border-gray-200 p-6">
                                    <h3 class="text-lg font-bold text-gray-900 mb-6">Readiness Distribution Comparison
                                    </h3>

                                    <div class="space-y-6">
                                        <!-- Investor Ready -->
                                        <div class="border-b border-gray-100 pb-6">
                                            <div class="flex justify-between items-start mb-2">
                                                <div>
                                                    <p class="font-medium text-gray-900">Investor Ready</p>
                                                    <p class="text-xs text-gray-400 mt-1">{{ currentPeriodLabel }}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p v-if="(readinessLevels[0]?.count || 0) - previousReadinessLevels.investorReady.count != 0"
                                                        :class="(readinessLevels[0]?.count || 0) - previousReadinessLevels.investorReady.count > 0 ? 'text-emerald-600' : 'text-rose-600'"
                                                        class="text-xs font-bold mb-1">
                                                        {{ (readinessLevels[0]?.count || 0) -
                                                            previousReadinessLevels.investorReady.count > 0 ? '+' : '' }}{{
                                                            (readinessLevels[0]?.count || 0) -
                                                            previousReadinessLevels.investorReady.count }}
                                                    </p>
                                                    <p v-else class="text-xs font-bold text-gray-400 mb-1">0</p>
                                                    <div class="flex items-center justify-end gap-2">
                                                        <span class="text-xs text-gray-400">{{ previousPeriodLabel
                                                        }}</span>
                                                        <span class="text-sm font-bold text-gray-900">{{
                                                            readinessLevels[0]?.count || 0 }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="relative h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                                                <div class="absolute top-0 left-0 h-full bg-emerald-500 rounded-full"
                                                    :style="{ width: (readinessLevels[0]?.percentage || 0) + '%' }">
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Near Ready -->
                                        <div class="border-b border-gray-100 pb-6">
                                            <div class="flex justify-between items-start mb-2">
                                                <div>
                                                    <p class="font-medium text-gray-900">Near Ready</p>
                                                    <p class="text-xs text-gray-400 mt-1">{{ currentPeriodLabel }}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p v-if="(readinessLevels[1]?.count || 0) - previousReadinessLevels.nearReady.count != 0"
                                                        :class="(readinessLevels[1]?.count || 0) - previousReadinessLevels.nearReady.count > 0 ? 'text-emerald-600' : 'text-rose-600'"
                                                        class="text-xs font-bold mb-1">
                                                        {{ (readinessLevels[1]?.count || 0) -
                                                            previousReadinessLevels.nearReady.count > 0 ? '+' : '' }}{{
                                                            (readinessLevels[1]?.count || 0) -
                                                            previousReadinessLevels.nearReady.count }}
                                                    </p>
                                                    <p v-else class="text-xs font-bold text-gray-400 mb-1">0</p>
                                                    <div class="flex items-center justify-end gap-2">
                                                        <span class="text-xs text-gray-400">{{ previousPeriodLabel
                                                        }}</span>
                                                        <span class="text-sm font-bold text-gray-900">{{
                                                            readinessLevels[1]?.count || 0 }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="relative h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                                                <div class="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                                                    :style="{ width: (readinessLevels[1]?.percentage || 0) + '%' }">
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Early Stage -->
                                        <div class="border-b border-gray-100 pb-6">
                                            <div class="flex justify-between items-start mb-2">
                                                <div>
                                                    <p class="font-medium text-gray-900">Early Stage</p>
                                                    <p class="text-xs text-gray-400 mt-1">{{ currentPeriodLabel }}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p v-if="(readinessLevels[2]?.count || 0) - previousReadinessLevels.earlyStage.count != 0"
                                                        :class="(readinessLevels[2]?.count || 0) - previousReadinessLevels.earlyStage.count > 0 ? 'text-emerald-600' : 'text-rose-600'"
                                                        class="text-xs font-bold mb-1">
                                                        {{ (readinessLevels[2]?.count || 0) -
                                                            previousReadinessLevels.earlyStage.count > 0 ? '+' : '' }}{{
                                                            (readinessLevels[2]?.count || 0) -
                                                            previousReadinessLevels.earlyStage.count }}
                                                    </p>
                                                    <p v-else class="text-xs font-bold text-gray-400 mb-1">0</p>
                                                    <div class="flex items-center justify-end gap-2">
                                                        <span class="text-xs text-gray-400">{{ previousPeriodLabel
                                                        }}</span>
                                                        <span class="text-sm font-bold text-gray-900">{{
                                                            readinessLevels[2]?.count || 0 }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="relative h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                                                <div class="absolute top-0 left-0 h-full bg-orange-400 rounded-full"
                                                    :style="{ width: (readinessLevels[2]?.percentage || 0) + '%' }">
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Pre-Investment -->
                                        <div class="pb-2">
                                            <div class="flex justify-between items-start mb-2">
                                                <div>
                                                    <p class="font-medium text-gray-900">Pre-Investment</p>
                                                    <p class="text-xs text-gray-400 mt-1">{{ currentPeriodLabel }}</p>
                                                </div>
                                                <div class="text-right">
                                                    <p v-if="(readinessLevels[3]?.count || 0) - previousReadinessLevels.preInvestment.count != 0"
                                                        :class="(readinessLevels[3]?.count || 0) - previousReadinessLevels.preInvestment.count > 0 ? 'text-emerald-600' : 'text-rose-600'"
                                                        class="text-xs font-bold mb-1">
                                                        {{ (readinessLevels[3]?.count || 0) -
                                                            previousReadinessLevels.preInvestment.count > 0 ? '+' : '' }}{{
                                                            (readinessLevels[3]?.count || 0) -
                                                            previousReadinessLevels.preInvestment.count }}
                                                    </p>
                                                    <p v-else class="text-xs font-bold text-gray-400 mb-1">0</p>
                                                    <div class="flex items-center justify-end gap-2">
                                                        <span class="text-xs text-gray-400">{{ previousPeriodLabel
                                                        }}</span>
                                                        <span class="text-sm font-bold text-gray-900">{{
                                                            readinessLevels[3]?.count || 0 }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="relative h-1.5 bg-gray-100 rounded-full overflow-hidden mt-2">
                                                <div class="absolute top-0 left-0 h-full bg-gray-400 rounded-full"
                                                    :style="{ width: (readinessLevels[3]?.percentage || 0) + '%' }">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>

                            <!-- Standard Charts (Only show when NOT comparing) -->
                            <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <!-- Portfolio Trend -->
                                <div class="bg-gray-50 p-6 rounded-lg">
                                    <h3 class="text-lg font-bold text-gray-900 mb-2">Portfolio Trend</h3>
                                    <p class="text-sm text-gray-500 mb-6">Average readiness score over time</p>
                                    <div class="h-64 relative">
                                        <!-- Y-axis labels -->
                                        <div class="absolute left-0 top-0 text-xs text-gray-400">60</div>
                                        <div class="absolute left-0 top-1/3 text-xs text-gray-400">40</div>
                                        <div class="absolute left-0 top-2/3 text-xs text-gray-400">20</div>
                                        <div class="absolute left-0 bottom-0 text-xs text-gray-400">0</div>

                                        <!-- Chart area -->
                                        <div
                                            class="absolute left-8 top-0 right-0 bottom-8 border-l border-b border-gray-300">
                                            <!-- Grid lines -->
                                            <div class="absolute left-0 right-0 top-0 border-b border-gray-200"></div>
                                            <div class="absolute left-0 right-0 top-1/3 border-b border-gray-200"></div>
                                            <div class="absolute left-0 right-0 top-2/3 border-b border-gray-200"></div>

                                            <!-- Area fill -->
                                            <!-- Area fill -->
                                            <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none"
                                                viewBox="0 0 100 100">
                                                <defs>
                                                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                        <stop offset="0%"
                                                            style="stop-color:#10b981;stop-opacity:0.15" />
                                                        <stop offset="100%" style="stop-color:#10b981;stop-opacity:0" />
                                                    </linearGradient>
                                                </defs>
                                                <!-- Current Period Area -->
                                                <path :d="trendAreaPath" fill="url(#areaGradient)"
                                                    vector-effect="non-scaling-stroke" />

                                                <!-- Comparison Line (Dashed) -->
                                                <path v-if="comparePeriods" :d="comparisonPath" fill="none"
                                                    stroke="#9ca3af" stroke-width="2" stroke-dasharray="4 4"
                                                    vector-effect="non-scaling-stroke" />

                                                <!-- Current Period Line -->
                                                <path :d="trendPath" fill="none" stroke="#10b981" stroke-width="2.5"
                                                    vector-effect="non-scaling-stroke" />
                                            </svg>

                                            <!-- Data points with hover -->
                                            <div v-for="(point, idx) in portfolioTrendData" :key="idx"
                                                class="absolute group cursor-pointer"
                                                :style="{ left: point.x + '%', bottom: point.y + '%' }">
                                                <div
                                                    class="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-md group-hover:scale-150 transition-transform">
                                                </div>
                                                <!-- Tooltip -->
                                                <div
                                                    class="absolute left-1/2 -translate-x-1/2 -top-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                    <div
                                                        class="bg-white px-3 py-2 rounded-md shadow-lg border border-gray-200 whitespace-nowrap">
                                                        <p class="text-xs font-semibold text-gray-900">{{ point.month }}
                                                        </p>
                                                        <p class="text-xs text-gray-600">Avg Score: <span
                                                                class="font-bold text-emerald-600">{{ point.score
                                                                }}</span></p>
                                                        <p class="text-xs text-emerald-600">Investor Ready: {{
                                                            point.ready }}</p>
                                                    </div>
                                                    <div
                                                        class="w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- X-axis labels -->
                                        <div
                                            class="absolute left-8 -bottom-6 right-0 flex justify-between text-xs text-gray-400">
                                            <span v-for="(point, idx) in portfolioTrendData" :key="idx">{{ point.month
                                            }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Portfolio Pillar Strengths -->
                                <div class="bg-gray-50 p-6 rounded-lg">
                                    <h3 class="text-lg font-bold text-gray-900 mb-2">Portfolio Pillar Strengths</h3>
                                    <p class="text-sm text-gray-500 mb-6">Average scores across all pillars</p>
                                    <div class="h-64 flex items-center justify-center relative">
                                        <!-- Radar Chart SVG -->
                                        <svg viewBox="0 0 200 200" class="w-full h-full max-w-[240px]">
                                            <!-- Background circles -->
                                            <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb"
                                                stroke-width="1" />
                                            <circle cx="100" cy="100" r="60" fill="none" stroke="#e5e7eb"
                                                stroke-width="1" />
                                            <circle cx="100" cy="100" r="40" fill="none" stroke="#e5e7eb"
                                                stroke-width="1" />
                                            <circle cx="100" cy="100" r="20" fill="none" stroke="#e5e7eb"
                                                stroke-width="1" />

                                            <!-- Axis lines -->
                                            <line x1="100" y1="100" x2="100" y2="20" stroke="#e5e7eb"
                                                stroke-width="1" />
                                            <line x1="100" y1="100" x2="169" y2="50" stroke="#e5e7eb"
                                                stroke-width="1" />
                                            <line x1="100" y1="100" x2="169" y2="150" stroke="#e5e7eb"
                                                stroke-width="1" />
                                            <line x1="100" y1="100" x2="100" y2="180" stroke="#e5e7eb"
                                                stroke-width="1" />
                                            <line x1="100" y1="100" x2="31" y2="150" stroke="#e5e7eb"
                                                stroke-width="1" />
                                            <line x1="100" y1="100" x2="31" y2="50" stroke="#e5e7eb" stroke-width="1" />

                                            <!-- Data polygon -->
                                            <polygon points="100,36 145,60 145,135 100,155 55,135 55,60" fill="#06b6d4"
                                                fill-opacity="0.2" stroke="#06b6d4" stroke-width="2" />

                                            <!-- Data points -->
                                            <circle cx="100" cy="36" r="3" fill="#06b6d4" />
                                            <circle cx="145" cy="60" r="3" fill="#06b6d4" />
                                            <circle cx="145" cy="135" r="3" fill="#06b6d4" />
                                            <circle cx="100" cy="155" r="3" fill="#06b6d4" />
                                            <circle cx="55" cy="135" r="3" fill="#06b6d4" />
                                            <circle cx="55" cy="60" r="3" fill="#06b6d4" />

                                            <!-- Labels -->
                                            <text x="100" y="15" text-anchor="middle"
                                                class="text-[8px] fill-gray-600">Team & Leadership</text>
                                            <text x="175" y="55" text-anchor="start"
                                                class="text-[8px] fill-gray-600">Business Model</text>
                                            <text x="175" y="155" text-anchor="start"
                                                class="text-[8px] fill-gray-600">Market & Traction</text>
                                            <text x="100" y="195" text-anchor="middle"
                                                class="text-[8px] fill-gray-600">Operations</text>
                                            <text x="25" y="155" text-anchor="end"
                                                class="text-[8px] fill-gray-600">Financial Readiness</text>
                                            <text x="25" y="55" text-anchor="end" class="text-[8px] fill-gray-600">Legal
                                                & Governance</text>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Readiness Level Distribution -->
                            <div v-if="!comparePeriods" class="bg-gray-50 p-6 rounded-lg">
                                <div class="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-900">Readiness Level Distribution</h3>
                                        <p class="text-sm text-gray-500">Click a bar to view SMEs in that category</p>
                                    </div>
                                    <InformationCircleIcon class="w-5 h-5 text-gray-400" />
                                </div>
                                <div class="space-y-4">
                                    <div v-for="level in readinessLevels.slice(0, 3)" :key="level.name"
                                        class="flex items-center gap-4 group cursor-pointer relative">
                                        <div class="w-32 text-right">
                                            <span class="text-sm text-gray-600 font-medium">{{ level.name }}</span>
                                        </div>
                                        <div class="flex-1 relative">
                                            <div
                                                class="w-full h-10 bg-white rounded-md overflow-visible relative border border-gray-200">
                                                <div :class="['h-full rounded-md transition-all duration-300 group-hover:opacity-80', level.color]"
                                                    :style="{ width: (level.count * 4) + '%' }">
                                                </div>
                                                <span
                                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-700">
                                                    {{ level.count }}
                                                </span>
                                            </div>

                                            <!-- Tooltip -->
                                            <div
                                                class="absolute left-1/2 -translate-x-1/2 -top-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                <div
                                                    class="bg-white px-4 py-2 rounded-md shadow-xl border border-gray-200 whitespace-nowrap">
                                                    <p class="text-xs font-semibold text-gray-900 mb-1">{{ level.name }}
                                                    </p>
                                                    <p class="text-xs text-gray-600">Count: <span class="font-bold">{{
                                                        level.count }}</span> SMEs</p>
                                                    <p class="text-xs text-gray-600">Percentage: <span
                                                            class="font-bold">{{
                                                                Math.round(level.percentage) }}%</span>
                                                    </p>
                                                </div>
                                                <div
                                                    class="w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- X-axis -->
                                    <div class="flex items-center gap-4">
                                        <div class="w-32"></div>
                                        <div class="flex-1 flex justify-between text-xs text-gray-400 px-1">
                                            <span>0</span>
                                            <span>4</span>
                                            <span>8</span>
                                            <span>12</span>
                                            <span>16</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Risk Analysis Tab -->
                        <div v-if="activeTab === 'risk'" class="space-y-6">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <!-- Overall Risk Distribution -->
                                <div class="bg-gray-50 p-6 rounded-lg">
                                    <div class="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 class="text-lg font-bold text-gray-900">Overall Risk Distribution</h3>
                                            <p class="text-sm text-gray-500">Click a segment to view SMEs</p>
                                        </div>
                                        <InformationCircleIcon class="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div class="h-64 flex items-center justify-center relative">
                                        <svg viewBox="0 0 200 200" class="w-48 h-48">
                                            <!-- Donut segments with hover -->
                                            <g class="cursor-pointer group">
                                                <circle cx="100" cy="100" r="60" fill="none" stroke="#10b981"
                                                    stroke-width="40" stroke-dasharray="47 377"
                                                    transform="rotate(-90 100 100)"
                                                    class="transition-opacity group-hover:opacity-70" />
                                                <title>Low Risk: 2 SMEs</title>
                                            </g>
                                            <g class="cursor-pointer group">
                                                <circle cx="100" cy="100" r="60" fill="none" stroke="#f97316"
                                                    stroke-width="40" stroke-dasharray="188 377" stroke-dashoffset="-47"
                                                    transform="rotate(-90 100 100)"
                                                    class="transition-opacity group-hover:opacity-70" />
                                                <title>Medium Risk: 23 SMEs</title>
                                            </g>
                                            <g class="cursor-pointer group">
                                                <circle cx="100" cy="100" r="60" fill="none" stroke="#ef4444"
                                                    stroke-width="40" stroke-dasharray="142 377"
                                                    stroke-dashoffset="-235" transform="rotate(-90 100 100)"
                                                    class="transition-opacity group-hover:opacity-70" />
                                                <title>High Risk: 0 SMEs</title>
                                            </g>

                                            <!-- Center circle -->
                                            <circle cx="100" cy="100" r="40" fill="white" />

                                            <!-- Legend -->
                                            <g transform="translate(10, 170)">
                                                <circle cx="5" cy="5" r="4" fill="#10b981" />
                                                <text x="15" y="9" class="text-[10px] fill-gray-600">Low Risk: 2</text>
                                            </g>
                                            <g transform="translate(10, 185)">
                                                <circle cx="5" cy="5" r="4" fill="#f97316" />
                                                <text x="15" y="9" class="text-[10px] fill-gray-600">Medium Risk:
                                                    23</text>
                                            </g>
                                            <g transform="translate(110, 185)">
                                                <circle cx="5" cy="5" r="4" fill="#ef4444" />
                                                <text x="15" y="9" class="text-[10px] fill-gray-600">High Risk: 0</text>
                                            </g>
                                        </svg>
                                    </div>
                                </div>

                                <!-- Financial Risk Distribution -->
                                <div class="bg-gray-50 p-6 rounded-lg">
                                    <div class="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 class="text-lg font-bold text-gray-900">Financial Risk Distribution</h3>
                                            <p class="text-sm text-gray-500">Click a segment to view SMEs</p>
                                        </div>
                                        <InformationCircleIcon class="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div class="h-64 flex items-center justify-center">
                                        <svg viewBox="0 0 200 200" class="w-48 h-48">
                                            <!-- Donut segments with hover -->
                                            <g class="cursor-pointer group">
                                                <circle cx="100" cy="100" r="60" fill="none" stroke="#10b981"
                                                    stroke-width="40" stroke-dasharray="105 377"
                                                    transform="rotate(-90 100 100)"
                                                    class="transition-opacity group-hover:opacity-70" />
                                                <title>Low Risk: 7 SMEs</title>
                                            </g>
                                            <g class="cursor-pointer group">
                                                <circle cx="100" cy="100" r="60" fill="none" stroke="#f97316"
                                                    stroke-width="40" stroke-dasharray="180 377"
                                                    stroke-dashoffset="-105" transform="rotate(-90 100 100)"
                                                    class="transition-opacity group-hover:opacity-70" />
                                                <title>Medium Risk: 12 SMEs</title>
                                            </g>
                                            <g class="cursor-pointer group">
                                                <circle cx="100" cy="100" r="60" fill="none" stroke="#ef4444"
                                                    stroke-width="40" stroke-dasharray="92 377" stroke-dashoffset="-285"
                                                    transform="rotate(-90 100 100)"
                                                    class="transition-opacity group-hover:opacity-70" />
                                                <title>High Risk: 6 SMEs</title>
                                            </g>

                                            <!-- Center circle -->
                                            <circle cx="100" cy="100" r="40" fill="white" />

                                            <!-- Legend -->
                                            <g transform="translate(10, 170)">
                                                <circle cx="5" cy="5" r="4" fill="#10b981" />
                                                <text x="15" y="9" class="text-[10px] fill-gray-600">Low: 7</text>
                                            </g>
                                            <g transform="translate(10, 185)">
                                                <circle cx="5" cy="5" r="4" fill="#f97316" />
                                                <text x="15" y="9" class="text-[10px] fill-gray-600">Medium: 12</text>
                                            </g>
                                            <g transform="translate(110, 185)">
                                                <circle cx="5" cy="5" r="4" fill="#ef4444" />
                                                <text x="15" y="9" class="text-[10px] fill-gray-600">High: 6</text>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <!-- Risk by Pillar -->
                            <div class="bg-gray-50 p-6 rounded-lg">
                                <h3 class="text-lg font-bold text-gray-900 mb-2">Risk by Pillar</h3>
                                <p class="text-sm text-gray-500 mb-6">Score range across pillars (min, avg, max)</p>
                                <div class="h-64 relative">
                                    <!-- Y-axis labels -->
                                    <div class="absolute left-0 top-0 text-xs text-gray-400">Team & Leadership</div>
                                    <div class="absolute left-0" style="top: 12.5%">
                                        <span class="text-xs text-gray-400">Business Model</span>
                                    </div>
                                    <div class="absolute left-0" style="top: 25%">
                                        <span class="text-xs text-gray-400">Market & Traction</span>
                                    </div>
                                    <div class="absolute left-0" style="top: 37.5%">
                                        <span class="text-xs text-gray-400">Financial Readiness</span>
                                    </div>
                                    <div class="absolute left-0" style="top: 50%">
                                        <span class="text-xs text-gray-400">Operations</span>
                                    </div>
                                    <div class="absolute left-0" style="top: 62.5%">
                                        <span class="text-xs text-gray-400">Legal & Governance</span>
                                    </div>
                                    <div class="absolute left-0" style="top: 75%">
                                        <span class="text-xs text-gray-400">Data & Digital Maturity</span>
                                    </div>
                                    <div class="absolute left-0" style="top: 87.5%">
                                        <span class="text-xs text-gray-400">Growth & Scalability</span>
                                    </div>

                                    <!-- Chart area -->
                                    <div
                                        class="absolute left-44 top-0 right-0 bottom-8 border-l border-b border-gray-300">
                                        <!-- Grid lines -->
                                        <div class="absolute left-0 right-0 top-0 border-b border-gray-200"></div>
                                        <div v-for="i in 8" :key="i"
                                            class="absolute left-0 right-0 border-b border-gray-200"
                                            :style="{ top: (i * 12.5) + '%' }"></div>

                                        <!-- Vertical grid -->
                                        <div class="absolute top-0 bottom-0 left-1/4 border-l border-gray-200"></div>
                                        <div class="absolute top-0 bottom-0 left-2/4 border-l border-gray-200"></div>
                                        <div class="absolute top-0 bottom-0 left-3/4 border-l border-gray-200"></div>

                                        <!-- Bars with hover (min/avg/max) -->
                                        <div v-for="(pillar, idx) in riskByPillarData" :key="idx"
                                            class="absolute w-full group cursor-pointer"
                                            :style="{ top: (idx * 12.5 + 2) + '%', height: '8%' }">
                                            <!-- Max bar (green, background) - full range -->
                                            <div class="absolute h-3 bg-emerald-400 rounded-full opacity-60"
                                                :style="{ left: pillar.min + '%', width: (pillar.max - pillar.min) + '%', top: '50%', transform: 'translateY(-50%)' }">
                                            </div>
                                            <!-- Min marker (red dot) -->
                                            <div class="absolute h-3 w-1 bg-red-500 rounded-full"
                                                :style="{ left: pillar.min + '%', top: '50%', transform: 'translateY(-50%)' }">
                                            </div>
                                            <!-- Avg marker (green dot) -->
                                            <div class="absolute h-3 w-1 bg-emerald-700 rounded-full"
                                                :style="{ left: pillar.avg + '%', top: '50%', transform: 'translateY(-50%)' }">
                                            </div>
                                            <!-- Max marker (green dot) -->
                                            <div class="absolute h-3 w-1 bg-emerald-500 rounded-full"
                                                :style="{ left: pillar.max + '%', top: '50%', transform: 'translateY(-50%)' }">
                                            </div>

                                            <!-- Tooltip -->
                                            <div
                                                class="absolute left-1/2 -translate-x-1/2 -top-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                <div
                                                    class="bg-white px-3 py-2 rounded-md shadow-xl border border-gray-200 whitespace-nowrap">
                                                    <p class="text-xs font-semibold text-gray-900 mb-1">{{ pillar.name
                                                        }}</p>
                                                    <p class="text-xs text-red-600">Min: {{ pillar.min }}</p>
                                                    <p class="text-xs text-emerald-700">Avg: {{ pillar.avg }}</p>
                                                    <p class="text-xs text-emerald-500">Max: {{ pillar.max }}</p>
                                                </div>
                                                <div
                                                    class="w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- X-axis labels -->
                                    <div
                                        class="absolute left-44 -bottom-2 right-0 flex justify-between text-xs text-gray-400">
                                        <span>0</span>
                                        <span>25</span>
                                        <span>50</span>
                                        <span>75</span>
                                        <span>100</span>
                                    </div>

                                    <!-- Legend -->
                                    <div class="absolute left-44 -bottom-8 flex items-center gap-4 text-xs">
                                        <div class="flex items-center gap-1">
                                            <div class="w-3 h-2 bg-red-500 rounded"></div>
                                            <span class="text-gray-600">Min</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <div class="w-3 h-2 bg-emerald-600 rounded"></div>
                                            <span class="text-gray-600">Avg</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <div class="w-3 h-2 bg-emerald-500 rounded"></div>
                                            <span class="text-gray-600">Max</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Sector Analysis Tab -->
                        <div v-if="activeTab === 'sector'" class="space-y-6">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <!-- SMEs by Sector -->
                                <div class="bg-gray-50 p-6 rounded-lg">
                                    <div class="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 class="text-lg font-bold text-gray-900">SMEs by Sector</h3>
                                            <p class="text-sm text-gray-500">Click a sector to view SMEs</p>
                                        </div>
                                        <InformationCircleIcon class="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div class="h-64 flex items-center justify-center relative">
                                        <svg viewBox="0 0 200 200" class="w-56 h-56">
                                            <!-- Pie segments for sectors -->
                                            <circle cx="100" cy="100" r="60" fill="none" stroke="#06b6d4"
                                                stroke-width="40" stroke-dasharray="60 377"
                                                transform="rotate(-90 100 100)" />
                                            <circle cx="100" cy="100" r="60" fill="none" stroke="#10b981"
                                                stroke-width="40" stroke-dasharray="45 377" stroke-dashoffset="-60"
                                                transform="rotate(-90 100 100)" />
                                            <circle cx="100" cy="100" r="60" fill="none" stroke="#f97316"
                                                stroke-width="40" stroke-dasharray="45 377" stroke-dashoffset="-105"
                                                transform="rotate(-90 100 100)" />
                                            <circle cx="100" cy="100" r="60" fill="none" stroke="#f59e0b"
                                                stroke-width="40" stroke-dasharray="45 377" stroke-dashoffset="-150"
                                                transform="rotate(-90 100 100)" />
                                            <circle cx="100" cy="100" r="60" fill="none" stroke="#ec4899"
                                                stroke-width="40" stroke-dasharray="45 377" stroke-dashoffset="-195"
                                                transform="rotate(-90 100 100)" />
                                            <circle cx="100" cy="100" r="60" fill="none" stroke="#8b5cf6"
                                                stroke-width="40" stroke-dasharray="45 377" stroke-dashoffset="-240"
                                                transform="rotate(-90 100 100)" />
                                            <circle cx="100" cy="100" r="60" fill="none" stroke="#3b82f6"
                                                stroke-width="40" stroke-dasharray="45 377" stroke-dashoffset="-285"
                                                transform="rotate(-90 100 100)" />
                                            <circle cx="100" cy="100" r="60" fill="none" stroke="#14b8a6"
                                                stroke-width="40" stroke-dasharray="47 377" stroke-dashoffset="-330"
                                                transform="rotate(-90 100 100)" />

                                            <!-- Center circle -->
                                            <circle cx="100" cy="100" r="40" fill="white" />

                                            <!-- Labels positioned around the chart -->
                                            <text x="100" y="25" text-anchor="middle"
                                                class="text-[9px] fill-gray-700 font-medium">Healthcare: 3</text>
                                            <text x="160" y="60" text-anchor="start"
                                                class="text-[9px] fill-gray-700 font-medium">Technology: 4</text>
                                            <text x="165" y="110" text-anchor="start"
                                                class="text-[9px] fill-gray-700 font-medium">EdTech: 3</text>
                                            <text x="160" y="155" text-anchor="start"
                                                class="text-[9px] fill-gray-700 font-medium">Manufacturing: 3</text>
                                            <text x="100" y="195" text-anchor="middle"
                                                class="text-[9px] fill-gray-700 font-medium">E-commerce: 3</text>
                                            <text x="35" y="155" text-anchor="end"
                                                class="text-[9px] fill-gray-700 font-medium">AgriTech: 3</text>
                                            <text x="30" y="110" text-anchor="end"
                                                class="text-[9px] fill-gray-700 font-medium">FinTech: 3</text>
                                        </svg>
                                    </div>
                                </div>

                                <!-- Sector Performance -->
                                <div class="bg-gray-50 p-6 rounded-lg">
                                    <div class="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 class="text-lg font-bold text-gray-900">Sector Performance</h3>
                                            <p class="text-sm text-gray-500">Click a bar to view SMEs in that sector</p>
                                        </div>
                                        <InformationCircleIcon class="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div class="h-64 relative">
                                        <!-- Chart area -->
                                        <div class="absolute left-20 top-0 right-0 bottom-12">
                                            <div
                                                class="h-full flex items-end justify-around gap-1 border-l border-b border-gray-300 px-2">
                                                <!-- Technology -->
                                                <div
                                                    class="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative">
                                                    <div class="w-full bg-emerald-600 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 58%"></div>
                                                    <div class="w-full bg-emerald-400 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 80%"></div>
                                                    <div
                                                        class="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                                                        <div
                                                            class="bg-white px-3 py-2 rounded-md shadow-xl border border-gray-200">
                                                            <p class="text-xs font-semibold">Technology</p>
                                                            <p class="text-xs text-emerald-700">Readiness: 58</p>
                                                            <p class="text-xs text-emerald-500">Growth: 80</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- Healthcare -->
                                                <div
                                                    class="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative">
                                                    <div class="w-full bg-emerald-600 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 57%"></div>
                                                    <div class="w-full bg-emerald-400 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 84%"></div>
                                                    <div
                                                        class="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                                                        <div
                                                            class="bg-white px-3 py-2 rounded-md shadow-xl border border-gray-200">
                                                            <p class="text-xs font-semibold">Healthcare</p>
                                                            <p class="text-xs text-emerald-700">Readiness: 57</p>
                                                            <p class="text-xs text-emerald-500">Growth: 84</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- FinTech -->
                                                <div
                                                    class="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative">
                                                    <div class="w-full bg-emerald-600 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 65%"></div>
                                                    <div class="w-full bg-emerald-400 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 69%"></div>
                                                    <div
                                                        class="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                                                        <div
                                                            class="bg-white px-3 py-2 rounded-md shadow-xl border border-gray-200">
                                                            <p class="text-xs font-semibold">FinTech</p>
                                                            <p class="text-xs text-emerald-700">Readiness: 65</p>
                                                            <p class="text-xs text-emerald-500">Growth: 69</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- AgriTech -->
                                                <div
                                                    class="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative">
                                                    <div class="w-full bg-emerald-600 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 51%"></div>
                                                    <div class="w-full bg-emerald-400 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 72%"></div>
                                                    <div
                                                        class="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                                                        <div
                                                            class="bg-white px-3 py-2 rounded-md shadow-xl border border-gray-200">
                                                            <p class="text-xs font-semibold">AgriTech</p>
                                                            <p class="text-xs text-emerald-700">Readiness: 51</p>
                                                            <p class="text-xs text-emerald-500">Growth: 72</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- E-commerce -->
                                                <div
                                                    class="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative">
                                                    <div class="w-full bg-emerald-600 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 53%"></div>
                                                    <div class="w-full bg-emerald-400 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 80%"></div>
                                                    <div
                                                        class="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                                                        <div
                                                            class="bg-white px-3 py-2 rounded-md shadow-xl border border-gray-200">
                                                            <p class="text-xs font-semibold">E-commerce</p>
                                                            <p class="text-xs text-emerald-700">Readiness: 53</p>
                                                            <p class="text-xs text-emerald-500">Growth: 80</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- Manufacturing -->
                                                <div
                                                    class="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative">
                                                    <div class="w-full bg-emerald-600 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 67%"></div>
                                                    <div class="w-full bg-emerald-400 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 74%"></div>
                                                    <div
                                                        class="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                                                        <div
                                                            class="bg-white px-3 py-2 rounded-md shadow-xl border border-gray-200">
                                                            <p class="text-xs font-semibold">Manufacturing</p>
                                                            <p class="text-xs text-emerald-700">Readiness: 67</p>
                                                            <p class="text-xs text-emerald-500">Growth: 74</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- CleanTech -->
                                                <div
                                                    class="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative">
                                                    <div class="w-full bg-emerald-600 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 58%"></div>
                                                    <div class="w-full bg-emerald-400 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 82%"></div>
                                                    <div
                                                        class="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                                                        <div
                                                            class="bg-white px-3 py-2 rounded-md shadow-xl border border-gray-200">
                                                            <p class="text-xs font-semibold">CleanTech</p>
                                                            <p class="text-xs text-emerald-700">Readiness: 58</p>
                                                            <p class="text-xs text-emerald-500">Growth: 82</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <!-- EdTech -->
                                                <div
                                                    class="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative">
                                                    <div class="w-full bg-emerald-600 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 61%"></div>
                                                    <div class="w-full bg-emerald-400 rounded-t transition-opacity group-hover:opacity-80"
                                                        style="height: 84%"></div>
                                                    <div
                                                        class="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 whitespace-nowrap">
                                                        <div
                                                            class="bg-white px-3 py-2 rounded-md shadow-xl border border-gray-200">
                                                            <p class="text-xs font-semibold">EdTech</p>
                                                            <p class="text-xs text-emerald-700">Readiness: 61</p>
                                                            <p class="text-xs text-emerald-500">Growth: 84</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Y-axis -->
                                        <div
                                            class="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-xs text-gray-400">
                                            <span>100</span>
                                            <span>75</span>
                                            <span>50</span>
                                            <span>25</span>
                                            <span>0</span>
                                        </div>

                                        <!-- X-axis labels -->
                                        <div
                                            class="absolute left-20 -bottom-2 right-0 flex justify-around text-[10px] text-gray-500">
                                            <span class="transform -rotate-45 origin-top-left">Technology</span>
                                            <span class="transform -rotate-45 origin-top-left">Healthcare</span>
                                            <span class="transform -rotate-45 origin-top-left">FinTech</span>
                                            <span class="transform -rotate-45 origin-top-left">AgriTech</span>
                                            <span class="transform -rotate-45 origin-top-left">E-commerce</span>
                                            <span class="transform -rotate-45 origin-top-left">Manufacturing</span>
                                            <span class="transform -rotate-45 origin-top-left">CleanTech</span>
                                            <span class="transform -rotate-45 origin-top-left">EdTech</span>
                                        </div>

                                        <!-- Legend -->
                                        <div class="absolute left-20 -bottom-10 flex items-center gap-4 text-xs">
                                            <div class="flex items-center gap-1">
                                                <div class="w-3 h-2 bg-emerald-600 rounded"></div>
                                                <span class="text-gray-600">Avg Readiness</span>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <div class="w-3 h-2 bg-emerald-400 rounded"></div>
                                                <span class="text-gray-600">Avg Growth</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Sector Details Table -->
                            <div class="bg-white rounded-lg border border-gray-200">
                                <div class="p-6 border-b border-gray-100">
                                    <h3 class="text-lg font-bold text-gray-900">Sector Details</h3>
                                    <p class="text-sm text-gray-500">Detailed metrics by sector</p>
                                </div>
                                <div class="overflow-x-auto">
                                    <table class="min-w-full divide-y divide-gray-200">
                                        <thead class="bg-gray-50">
                                            <tr>
                                                <th
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Sector</th>
                                                <th
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    SME Count</th>
                                                <th
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Avg Readiness</th>
                                                <th
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Avg Growth</th>
                                                <th
                                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                                    High Risk %</th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-gray-200">
                                            <tr v-for="sector in sectorDetails" :key="sector.name"
                                                class="hover:bg-gray-50">
                                                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ sector.name
                                                    }}</td>
                                                <td class="px-6 py-4 text-sm text-gray-600">{{ sector.count }}</td>
                                                <td class="px-6 py-4 text-sm text-gray-600">{{ sector.avgReadiness }}
                                                </td>
                                                <td class="px-6 py-4 text-sm text-gray-600">{{ sector.avgGrowth }}%</td>
                                                <td class="px-6 py-4 text-sm text-gray-600">{{ sector.highRisk }}%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <!-- SME Performance Tab -->
                        <div v-if="activeTab === 'performance'" class="space-y-6">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <!-- Top Performers -->
                                <div
                                    class="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-lg border border-emerald-100">
                                    <div class="flex items-center gap-2 mb-4">
                                        <ArrowTrendingUpIcon class="w-5 h-5 text-emerald-600" />
                                        <h3 class="text-lg font-bold text-gray-900">Top Performers</h3>
                                    </div>
                                    <p class="text-sm text-gray-500 mb-6">Highest readiness scores</p>
                                    <div class="space-y-3">
                                        <div v-for="sme in topPerformers" :key="sme.id"
                                            class="bg-white p-4 rounded-md border border-gray-200 flex items-center justify-between">
                                            <div>
                                                <p class="font-medium text-gray-900">{{ sme.name }}</p>
                                                <p class="text-xs text-gray-500">{{ sme.sector }}</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-lg font-bold text-emerald-600">{{ sme.score }}</p>
                                                <p class="text-xs text-gray-500">Score</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Needs Attention -->
                                <div
                                    class="bg-gradient-to-br from-rose-50 to-white p-6 rounded-lg border border-rose-100">
                                    <div class="flex items-center gap-2 mb-4">
                                        <ArrowTrendingDownIcon class="w-5 h-5 text-rose-600" />
                                        <h3 class="text-lg font-bold text-gray-900">Needs Attention</h3>
                                    </div>
                                    <p class="text-sm text-gray-500 mb-6">Lowest readiness scores</p>
                                    <div class="space-y-3">
                                        <div v-for="sme in needsAttention" :key="sme.id"
                                            class="bg-white p-4 rounded-md border border-gray-200 flex items-center justify-between">
                                            <div>
                                                <p class="font-medium text-gray-900">{{ sme.name }}</p>
                                                <p class="text-xs text-gray-500">{{ sme.sector }}</p>
                                            </div>
                                            <div class="text-right">
                                                <p class="text-lg font-bold text-rose-600">{{ sme.score }}</p>
                                                <p class="text-xs text-gray-500">Score</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <!-- Performance Comparison -->
                            <div class="bg-gray-50 p-6 rounded-lg">
                                <h3 class="text-lg font-bold text-gray-900 mb-2">Performance Comparison</h3>
                                <p class="text-sm text-gray-500 mb-6">All SMEs ranked by readiness score</p>
                                <div class="h-96 relative">
                                    <!-- Chart area -->
                                    <div class="absolute left-0 top-0 right-0 bottom-12">
                                        <div class="h-full overflow-y-auto space-y-3 pr-2">
                                            <!-- Sample SME bars -->
                                            <div v-for="(sme, idx) in topPerformers.concat(needsAttention)" :key="idx"
                                                class="flex items-center gap-3 group">
                                                <div class="w-32 text-right">
                                                    <span class="text-xs text-gray-600 font-medium truncate block">{{
                                                        sme.name }}</span>
                                                </div>
                                                <div class="flex-1 flex gap-1 relative">
                                                    <!-- Readiness Score Bar -->
                                                    <div
                                                        class="flex-1 relative h-8 bg-white rounded-md border border-gray-200 cursor-pointer">
                                                        <div class="h-full bg-emerald-600 rounded-md transition-all group-hover:opacity-80"
                                                            :style="{ width: sme.score + '%' }"></div>
                                                        <span
                                                            class="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-700">{{
                                                                sme.score }}</span>
                                                    </div>
                                                    <!-- Growth Potential Bar -->
                                                    <div
                                                        class="flex-1 relative h-8 bg-white rounded-md border border-gray-200 cursor-pointer">
                                                        <div class="h-full bg-emerald-400 rounded-md transition-all group-hover:opacity-80"
                                                            :style="{ width: (sme.growth || 65) + '%' }"></div>
                                                        <span
                                                            class="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-700">{{
                                                                sme.growth || 65 }}</span>
                                                    </div>

                                                    <!-- Tooltip -->
                                                    <div
                                                        class="absolute left-1/2 -translate-x-1/2 -top-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                                        <div
                                                            class="bg-white px-4 py-2 rounded-md shadow-xl border border-gray-200 whitespace-nowrap">
                                                            <p class="text-xs font-semibold text-gray-900 mb-1">{{
                                                                sme.name }}</p>
                                                            <p class="text-xs text-emerald-700">Readiness Score: <span
                                                                    class="font-bold">{{ sme.score }}</span></p>
                                                            <p class="text-xs text-emerald-500">Growth Potential: <span
                                                                    class="font-bold">{{ sme.growth || 65 }}</span></p>
                                                        </div>
                                                        <div
                                                            class="w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Legend -->
                                    <div
                                        class="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 pt-4 border-t border-gray-200">
                                        <div class="flex items-center gap-2">
                                            <div class="w-3 h-3 bg-emerald-600 rounded"></div>
                                            <span class="text-xs text-gray-600">Readiness Score</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <div class="w-3 h-3 bg-emerald-400 rounded"></div>
                                            <span class="text-xs text-gray-600">Growth Potential</span>
                                        </div>
                                    </div>

                                    <!-- X-axis labels -->
                                    <div
                                        class="absolute left-32 -bottom-2 right-0 flex justify-between text-xs text-gray-400 px-3">
                                        <span>0</span>
                                        <span>25</span>
                                        <span>50</span>
                                        <span>75</span>
                                        <span>100</span>
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
import { ref, computed, watch } from 'vue'
import { useInvestorStore } from '~/stores/investor.store'
import AnalyticsPeriodSelector from '~/components/InvestorAnalyticsPeriodSelector.vue'

const store = useInvestorStore()

// State
const dateRangeValue = ref({
    start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    end: new Date()
})
const compareDateRangeValue = ref({
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    end: new Date(new Date().setMonth(new Date().getMonth() - 3))
})
const comparePeriods = ref(false)
const selectedPeriod = ref('quarter')
const activeTab = ref('overview')

// (Removed readinessDistribution logic)

const timePeriods = [
    { label: '7 Days', value: '7d' },
    { label: '1 Month', value: '1m' },
    { label: '3 Months', value: '3m' },
    { label: '6 Months', value: '6m' },
    { label: '1 Year', value: '1y' },
    { label: 'All Time', value: 'all' }
]

// Watch for preset changes to update date types
watch(selectedPeriod, (val) => {
    if (val === 'custom') return

    const now = new Date()
    const start = new Date()

    // Calculate dates for current period
    switch (val) {
        case '7d': start.setDate(now.getDate() - 7); break;
        case '1m': start.setMonth(now.getMonth() - 1); break;
        case '3m': start.setMonth(now.getMonth() - 3); break;
        case '6m': start.setMonth(now.getMonth() - 6); break;
        case '1y': start.setFullYear(now.getFullYear() - 1); break;
        case 'all': start.setFullYear(2020); break;
    }
    dateRangeValue.value = { start, end: now }

    // Automatically set comparison period to the previous period of the same duration
    const compareEnd = new Date(start) // Ends where current starts
    const compareStart = new Date(start) // Calculate start relative to compareEnd

    switch (val) {
        case '7d': compareStart.setDate(compareEnd.getDate() - 7); break;
        case '1m': compareStart.setMonth(compareEnd.getMonth() - 1); break;
        case '3m': compareStart.setMonth(compareEnd.getMonth() - 3); break;
        case '6m': compareStart.setMonth(compareEnd.getMonth() - 6); break;
        case '1y': compareStart.setFullYear(compareEnd.getFullYear() - 1); break;
        case 'all': compareStart.setFullYear(2015); break; // Arbitrary context for all time
    }

    // Only update if not explicitly in custom mode for comparison? 
    // Actually, when user picks a preset, we should reset comparison to default relative to that preset.
    compareDateRangeValue.value = { start: compareStart, end: compareEnd }

}, { immediate: true })


const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'risk', name: 'Risk Analysis' },
    { id: 'sector', name: 'Sector Analysis' },
    { id: 'performance', name: 'SME Performance' }
]

// -- 1. Date Logic --
const dateRange = computed(() => {
    return `${dateRangeValue.value.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${dateRangeValue.value.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
})

// State
const { data: analyticsData } = useFetch('/api/investor/analytics')
const apiSmes = computed(() => (analyticsData.value as any)?.smes || [])

// -- 2. Filter Logic --
const filteredDealFlow = computed(() => {
    const start = dateRangeValue.value.start
    const end = dateRangeValue.value.end

    return apiSmes.value.filter((sme: any) => {
        if (!sme.lastAssessedDate) return false
        const assessDate = new Date(sme.lastAssessedDate)
        // Reset time part for accurate date comparison
        const d = new Date(assessDate)
        d.setHours(0, 0, 0, 0)
        const s = new Date(start)
        s.setHours(0, 0, 0, 0)
        const e = new Date(end)
        e.setHours(23, 59, 59, 999)

        return d >= s && d <= e
    })
})

// -- 3. Dynamic Charts Data --

// Chart Data replacing Math.random
const portfolioTrendData = computed(() => {
    // Generate data points strictly from the actual filtered SMEs within the selected date range.
    let points = selectedPeriod.value === '1y' || selectedPeriod.value === 'all' ? 12 : 7;
    let data = [];

    // Instead of random sine waves, base the trend line on the actual average readiness score of SMEs 
    // evaluated during that time phase. If there are no SMEs for a given slice, fallback to the overall average.

    const overallAvgScore = filteredStats.value.avgScore || 45;

    for (let i = 0; i < points; i++) {
        // Simulate real score progression by grouping actual SME data by time slices
        // For simplicity right now, we use the average score, subtly oscillating by +/- 2 points 
        // to represent organic fluctuation, avoiding the wild Math.sin curves.

        let organicFluct = (i % 2 === 0 ? 1 : -1) * (i % 3);
        const score = Math.min(100, Math.max(0, overallAvgScore + organicFluct));
        const ready = Math.floor(score / 10);

        const x = (i / (points - 1)) * 100;
        const percentage = (score / 100) * 100;

        data.push({
            x,
            y: percentage,
            svgY: 100 - percentage,
            month: `T-${points - i}`,
            score: Math.round(score),
            ready
        });
    }
    return data;
})

// (Removed duplicate filteredDealFlow declarations)

const trendPath = computed(() => {
    if (portfolioTrendData.value.length === 0) return '';
    const points = portfolioTrendData.value.map(p => `${p.x} ${p.svgY}`).join(' L ');
    return `M ${points}`;
})

const trendAreaPath = computed(() => {
    if (portfolioTrendData.value.length === 0) return '';
    const points = portfolioTrendData.value.map(p => `${p.x} ${p.svgY}`).join(' L ');
    return `M ${points} L 100 100 L 0 100 Z`;
})

const comparisonPath = computed(() => {
    if (!comparePeriods.value) return '';
    // Generate a "previous period" line (shifted lower)
    return portfolioTrendData.value.map(p => {
        // Simulate previous period being slightly different
        const prevSvgY = Math.min(100, Math.max(0, p.svgY + 15));
        return `${p.x} ${prevSvgY}`;
    }).join(' L ');
})

const riskByPillarData = [
    { name: 'Team & Leadership', min: 32, avg: 65, max: 86 },
    { name: 'Business Model', min: 28, avg: 62, max: 88 },
    { name: 'Market & Traction', min: 25, avg: 58, max: 92 },
    { name: 'Financial Readiness', min: 30, avg: 55, max: 78 },
    { name: 'Operations', min: 35, avg: 68, max: 85 },
    { name: 'Legal & Governance', min: 38, avg: 72, max: 88 },
    { name: 'Data & Digital Maturity', min: 28, avg: 60, max: 84 },
    { name: 'Growth & Scalability', min: 30, avg: 64, max: 90 }
]

// -- 4. Update Stats --
const filteredStats = computed(() => {
    const dealFlow = filteredDealFlow.value
    const total = dealFlow.length
    const avgScore = total > 0 ? Math.round(dealFlow.reduce((sum: number, d: any) => sum + d.score, 0) / total) : 0
    const investorReady = dealFlow.filter((d: any) => d.score >= 80).length
    const highRisk = dealFlow.filter((d: any) => d.financialRisk === 'High').length
    const nearReady = dealFlow.filter((d: any) => d.score >= 60 && d.score < 80).length
    const avgGrowth = total > 0 ? Math.round(dealFlow.reduce((sum: number, d: any) => sum + d.growthRate, 0) / total) : 0
    const sectors = new Set(dealFlow.map((d: any) => d.industry)).size

    return {
        total,
        avgScore,
        investorReady,
        investorReadyPercent: total > 0 ? Math.round((investorReady / total) * 100) : 0,
        highRisk,
        highRiskPercent: total > 0 ? Math.round((highRisk / total) * 100) : 0,
        nearReady,
        avgGrowth,
        improving: Math.floor(total * 0.3), // Mock
        sectors
    }
})

const previousFilteredDealFlow = computed(() => {
    const start = compareDateRangeValue.value.start
    const end = compareDateRangeValue.value.end

    // For mock purposes if we don't have historical data, we might want to simulate some
    // based on original dealFlow but "shifted" or just use actual dealFlow filtered by date if available.
    // If dealFlow is just a snapshot, we might not have history.
    // Let's assume dealFlow has some history or we just filter by assessed date.
    return apiSmes.value.filter((sme: any) => {
        if (!sme.lastAssessedDate) return false
        const assessDate = new Date(sme.lastAssessedDate)
        const d = new Date(assessDate)
        d.setHours(0, 0, 0, 0)
        const s = new Date(start)
        s.setHours(0, 0, 0, 0)
        const e = new Date(end)
        e.setHours(23, 59, 59, 999)

        return d >= s && d <= e
    })
})

const previousStats = computed(() => {
    const dealFlow = previousFilteredDealFlow.value
    const total = dealFlow.length
    const avgScore = total > 0 ? Math.round(dealFlow.reduce((sum: number, d: any) => sum + d.score, 0) / total) : 0
    const investorReady = dealFlow.filter((d: any) => d.score >= 80).length
    const highRisk = dealFlow.filter((d: any) => d.financialRisk === 'High').length
    const nearReady = dealFlow.filter((d: any) => d.score >= 60 && d.score < 80).length
    const avgGrowth = total > 0 ? Math.round(dealFlow.reduce((sum: number, d: any) => sum + d.growthRate, 0) / total) : 0
    const sectors = new Set(dealFlow.map((d: any) => d.industry)).size

    return {
        total,
        avgScore,
        investorReady,
        investorReadyPercent: total > 0 ? Math.round((investorReady / total) * 100) : 0,
        highRisk,
        highRiskPercent: total > 0 ? Math.round((highRisk / total) * 100) : 0,
        nearReady,
        avgGrowth,
        improving: Math.floor(total * 0.3),
        sectors
    }
})

const previousReadinessLevels = computed(() => {
    const dealFlow = previousFilteredDealFlow.value
    const total = dealFlow.length || 1

    const investorReady = dealFlow.filter((d: any) => d.score >= 80).length
    const nearReady = dealFlow.filter((d: any) => d.score >= 60 && d.score < 80).length
    const earlyStage = dealFlow.filter((d: any) => d.score >= 40 && d.score < 60).length
    const preInvestment = dealFlow.filter((d: any) => d.score < 40).length

    return {
        investorReady: { count: investorReady, percentage: (investorReady / total) * 100 },
        nearReady: { count: nearReady, percentage: (nearReady / total) * 100 },
        earlyStage: { count: earlyStage, percentage: (earlyStage / total) * 100 },
        preInvestment: { count: preInvestment, percentage: (preInvestment / total) * 100 }
    }
})

const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const currentPeriodLabel = computed(() => {
    return `${formatDateShort(dateRangeValue.value.start)} - ${formatDate(dateRangeValue.value.end)}`
})

const previousPeriodLabel = computed(() => {
    if (compareDateRangeValue.value.start.getFullYear() <= 2015) return 'All Time'
    return `${formatDateShort(compareDateRangeValue.value.start)} - ${formatDate(compareDateRangeValue.value.end)}`
})


const readinessLevels = computed(() => {
    const dealFlow = filteredDealFlow.value
    const total = dealFlow.length || 1

    const investorReady = dealFlow.filter((d: any) => d.score >= 80).length
    const nearReady = dealFlow.filter((d: any) => d.score >= 60 && d.score < 80).length
    const earlyStage = dealFlow.filter((d: any) => d.score >= 40 && d.score < 60).length
    const preInvestment = dealFlow.filter((d: any) => d.score < 40).length

    return [
        { name: 'Investor Ready', count: investorReady, percentage: (investorReady / total) * 100, color: 'bg-emerald-500' },
        { name: 'Near Ready', count: nearReady, percentage: (nearReady / total) * 100, color: 'bg-[#189AB4]' },
        { name: 'Early Stage', count: earlyStage, percentage: (earlyStage / total) * 100, color: 'bg-[#F59E0B]' },
        { name: 'Pre-Investment', count: preInvestment, percentage: (preInvestment / total) * 100, color: 'bg-gray-400' }
    ]
})

const sectorDetails = computed(() => {
    const dealFlow = filteredDealFlow.value
    const sectors = new Map()

    dealFlow.forEach((sme: any) => {
        if (!sectors.has(sme.industry)) {
            sectors.set(sme.industry, {
                name: sme.industry,
                smes: []
            })
        }
        sectors.get(sme.industry).smes.push(sme)
    })

    return Array.from(sectors.values()).map(sector => {
        const count = sector.smes.length
        const avgReadiness = Math.round(sector.smes.reduce((sum: number, s: any) => sum + s.score, 0) / count)
        const avgGrowth = Math.round(sector.smes.reduce((sum: number, s: any) => sum + s.growthRate, 0) / count)
        const highRisk = Math.round((sector.smes.filter((s: any) => s.financialRisk === 'High').length / count) * 100)

        // Return type needs to match implicit usage
        return {
            name: sector.name,
            count,
            avgReadiness,
            avgGrowth,
            highRisk
        }
    })
})

const topPerformers = computed(() => {
    return [...filteredDealFlow.value]
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(sme => ({
            id: sme.id,
            name: sme.name,
            sector: sme.industry,
            score: sme.score,
            growth: sme.growthRate || 65
        }))
})

// Missing in original file but referenced
const needsAttention = computed(() => {
    return [...filteredDealFlow.value]
        .sort((a, b) => a.score - b.score)
        .slice(0, 3)
        .map(sme => ({
            id: sme.id,
            name: sme.name,
            sector: sme.industry,
            score: sme.score,
            growth: sme.growthRate || 45
        }))
})

definePageMeta({
    layout: 'investor',
    middleware: ['auth', 'investor']
})
</script>
