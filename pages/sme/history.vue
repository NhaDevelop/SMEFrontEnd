<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-6 py-8">
            <!-- Header -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Assessment History</h1>
                    <p class="text-gray-500">Track your investment readiness progress over time</p>
                </div>
                <button @click="toggleCompareMode" :class="[
                    'px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2',
                    isCompareMode
                        ? 'bg-gray-800 text-white hover:bg-gray-900'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                ]">
                    <svg v-if="!isCompareMode" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {{ isCompareMode ? 'Exit Compare' : 'Compare Assessments' }}
                </button>
            </div>

            <!-- Compare Mode Banner -->
            <div v-if="isCompareMode"
                class="bg-white border border-teal-200 rounded-lg p-4 mb-6 flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-3">
                    <ChartBarIcon class="w-6 h-6 text-teal-600" />
                    <div>
                        <h3 class="font-bold text-gray-900">Compare Mode Active</h3>
                        <p class="text-sm text-gray-500">Select exactly 2 assessments from the list below to compare</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div :class="[
                        'px-3 py-1 rounded-full text-sm font-medium',
                        selectedAssessmentIds.length === 2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    ]">
                        {{ selectedAssessmentIds.length }}/2 selected
                        <span v-if="selectedAssessmentIds.length === 2"> - Ready to compare</span>
                    </div>
                    <button v-if="selectedAssessmentIds.length > 0" @click="clearSelection"
                        class="text-sm text-gray-500 hover:text-gray-700">Clear</button>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div class="flex items-center gap-3 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5 text-gray-400">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span class="text-sm text-gray-600">Assessments</span>
                    </div>
                    <div class="text-3xl font-bold text-gray-900">{{ assessments.length }}</div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div class="flex items-center gap-3 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5 text-teal-600">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-sm text-gray-600">Current Score</span>
                    </div>
                    <div class="text-3xl font-bold text-teal-600">{{ currentScore }}</div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div class="flex items-center gap-3 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5 text-green-600">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                        </svg>
                        <span class="text-sm text-gray-600">Total Change</span>
                    </div>
                    <div class="text-3xl font-bold text-green-600">+{{ totalChange }}</div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div class="flex items-center gap-3 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5 text-blue-600">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                        <span class="text-sm text-gray-600">Avg/Assessment</span>
                    </div>
                    <div class="text-3xl font-bold text-blue-600">+{{ avgChange }}</div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div class="flex items-center gap-3 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5 text-yellow-600">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                        </svg>
                        <span class="text-sm text-gray-600">Best Score</span>
                    </div>
                    <div class="text-3xl font-bold text-yellow-600">{{ bestScore }}</div>
                </div>

                <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                    <div class="flex items-center gap-3 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5 text-gray-400">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-sm text-gray-600">Lowest Score</span>
                    </div>
                    <div class="text-3xl font-bold text-gray-600">{{ lowestScore }}</div>
                </div>
            </div>

            <!-- Tabs -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-100">
                <div class="border-b border-gray-200">
                    <nav class="flex gap-8 px-6" aria-label="Tabs">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                            activeTab === tab.id
                                ? 'border-teal-600 text-teal-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        ]">
                            {{ tab.name }}
                        </button>
                    </nav>
                </div>

                <!-- Tab Content -->
                <div class="p-6">
                    <!-- Timeline Tab -->
                    <div v-if="activeTab === 'timeline'" class="space-y-4">
                        <div v-for="assessment in assessments" :key="assessment.id" :class="[
                            'bg-white rounded-lg p-6 flex items-center justify-between transition-all border',
                            selectedAssessmentIds.includes(assessment.id) ? 'border-teal-500 ring-1 ring-teal-500' : 'border-gray-200 hover:border-gray-300'
                        ]" @click="isCompareMode && toggleSelection(assessment.id)">
                            <div class="flex items-center gap-6">
                                <!-- Selection Checkbox -->
                                <div v-if="isCompareMode" class="flex-shrink-0">
                                    <div :class="[
                                        'w-6 h-6 rounded-full border flex items-center justify-center transition-colors',
                                        selectedAssessmentIds.includes(assessment.id)
                                            ? 'bg-teal-600 border-teal-600'
                                            : 'border-gray-300 bg-white'
                                    ]">
                                        <svg v-if="selectedAssessmentIds.includes(assessment.id)"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="3" stroke="currentColor" class="w-4 h-4 text-white">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </div>
                                </div>

                                <div class="text-center">
                                    <div class="text-4xl font-bold text-teal-600">{{ assessment.score }}</div>
                                    <div v-if="assessment.isLatest"
                                        class="mt-2 px-2 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded">
                                        Latest
                                    </div>
                                </div>
                                <div>
                                    <h3 class="text-lg font-bold text-gray-900 mb-1">{{ assessment.name }}</h3>
                                    <div class="flex items-center gap-2 text-sm text-gray-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                        {{ assessment.date }}
                                        <span v-if="assessment.change" :class="[
                                            'flex items-center gap-1 font-medium',
                                            assessment.change > 0 ? 'text-green-600' : 'text-red-600'
                                        ]">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    :d="assessment.change > 0 ? 'M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941' : 'M2.25 6L9 12.75l4.306-4.307a11.95 11.95 0 015.814 5.519l2.74 1.22m0 0l-5.94 2.28m5.94-2.28l-2.28-5.941'" />
                                            </svg>
                                            {{ assessment.change > 0 ? '+' : '' }}{{ assessment.change }} pts
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div class="flex gap-6 text-center">
                                    <div v-for="pillar in assessment.topPillars" :key="pillar.name">
                                        <div class="text-2xl font-bold" :class="getPillarColor(pillar.score)">{{
                                            pillar.score }}</div>
                                        <div class="text-xs text-gray-500 mt-1">{{ pillar.name }}</div>
                                    </div>
                                </div>
                                <button @click="viewDetails(assessment)"
                                    class="px-4 py-2 border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Details
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Score Trends Tab -->
                    <div v-if="activeTab === 'score-trends'">
                        <h3 class="text-lg font-bold text-gray-900 mb-2">Overall Score Trend</h3>
                        <p class="text-sm text-gray-500 mb-6">Your investment readiness score progression over time</p>
                        <div class="bg-white rounded-lg p-6">
                            <ProgressChart :data="chartData" />
                        </div>
                    </div>

                    <!-- Pillar Analysis Tab -->
                    <div v-if="activeTab === 'pillar-analysis'">
                        <h3 class="text-lg font-bold text-gray-900 mb-2">Pillar Score Progression</h3>
                        <p class="text-sm text-gray-500 mb-6">Track how each pillar has improved across assessments</p>
                        <div class="bg-white rounded-lg p-6 flex justify-center">
                            <div class="h-96 w-full">
                                <PillarComparisonChart :data="pillarChartData" />
                            </div>
                        </div>
                    </div>

                    <!-- Comparison Tab -->
                    <div v-if="activeTab === 'comparison'">
                        <div v-if="comparisonData" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <!-- Radar Chart -->
                            <div class="bg-white rounded-lg p-6 border border-gray-200 sticky top-6 self-start">
                                <h3 class="text-lg font-bold text-gray-900 mb-2">Pillar Comparison</h3>
                                <p class="text-sm text-gray-500 mb-6">{{ comparisonData.new.date }} vs {{
                                    comparisonData.old.date }}</p>
                                <div class="h-96">
                                    <ComparisonRadarChart :data="comparisonData.radarData" />
                                </div>
                                <div class="flex justify-center gap-6 mt-4">
                                    <div class="flex items-center gap-2">
                                        <div class="w-3 h-3 rounded-sm bg-teal-500"></div>
                                        <span class="text-sm text-gray-600">{{ comparisonData.new.date }}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div class="w-3 h-3 rounded-sm bg-blue-500"></div>
                                        <span class="text-sm text-gray-600">{{ comparisonData.old.date }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Detailed Table -->
                            <div class="bg-white rounded-lg p-6 border border-gray-200">
                                <h3 class="text-lg font-bold text-gray-900 mb-2">Detailed Comparison</h3>
                                <p class="text-sm text-gray-500 mb-6">Pillar-by-pillar score differences</p>

                                <div class="overflow-x-auto">
                                    <table class="w-full">
                                        <thead>
                                            <tr class="text-sm text-gray-500 border-b border-gray-100">
                                                <th class="text-left py-3 font-medium bg-white">Pillar</th>
                                                <th class="text-right py-3 font-medium bg-white">{{
                                                    comparisonData.old.date }}
                                                </th>
                                                <th class="text-right py-3 font-medium bg-white">{{
                                                    comparisonData.new.date }}
                                                </th>
                                                <th class="text-right py-3 font-medium bg-white">Change</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-50">
                                            <tr v-for="item in comparisonData.tableData" :key="item.name"
                                                class="text-sm">
                                                <td class="py-4 text-gray-900 font-medium">{{ item.name }}</td>
                                                <td class="py-4 text-gray-600 text-right">{{ item.oldScore }}</td>
                                                <td class="py-4 text-gray-600 text-right">{{ item.newScore }}</td>
                                                <td class="py-4 text-right font-medium"
                                                    :class="item.change >= 0 ? 'text-green-600' : 'text-red-600'">
                                                    {{ item.change > 0 ? '+' : '' }}{{ item.change }}
                                                </td>
                                            </tr>
                                            <!-- Overall Row -->
                                            <tr class="font-bold border-t border-gray-100">
                                                <td class="py-4 text-gray-900">Overall</td>
                                                <td class="py-4 text-gray-900 text-right">{{ comparisonData.old.score }}
                                                </td>
                                                <td class="py-4 text-gray-900 text-right">{{ comparisonData.new.score }}
                                                </td>
                                                <td class="py-4 text-right"
                                                    :class="comparisonData.new.score - comparisonData.old.score >= 0 ? 'text-green-600' : 'text-red-600'">
                                                    {{ comparisonData.new.score - comparisonData.old.score > 0 ? '+' :
                                                        '' }}{{ comparisonData.new.score - comparisonData.old.score }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center text-gray-400 py-20 bg-white rounded-md border border-gray-200">
                            <ChartBarIcon class="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p class="text-lg font-medium text-gray-900">No Comparison Selected</p>
                            <p class="text-sm mt-1">Please enable "Compare Mode" and select 2 assessments to view
                                comparison.</p>
                            <button @click="toggleCompareMode"
                                class="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700">
                                Start Comparing
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Assessment Details Modal -->
        <div v-if="selectedAssessment" @click="selectedAssessment = null"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div @click.stop class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Assessment Details</h2>
                        <p class="text-sm text-gray-500 mt-1">{{ selectedAssessment.date }}</p>
                    </div>
                    <button @click="selectedAssessment = null" class="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-6">
                    <!-- Overall Score -->
                    <div class="bg-teal-50 rounded-lg p-6 mb-6 flex items-center gap-6">
                        <div class="text-5xl font-bold text-teal-600">{{ selectedAssessment.score }}</div>
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">Overall Score</h3>
                            <p class="text-sm text-gray-600">{{ getScoreLabel(selectedAssessment.score) }}</p>
                        </div>
                    </div>

                    <!-- Pillar Scores -->
                    <h3 class="text-base font-bold text-gray-900 mb-4">Pillar Scores</h3>
                    <div class="space-y-4">
                        <div v-for="pillar in selectedAssessment.pillars" :key="pillar.name">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm font-medium text-gray-700">{{ pillar.name }}</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-bold text-gray-900">{{ pillar.score }}</span>
                                    <span :class="[
                                        'text-xs font-semibold px-2 py-1 rounded',
                                        getRiskClass(pillar.score)
                                    ]">
                                        {{ getRiskLabel(pillar.score) }}
                                    </span>
                                </div>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div :class="['h-2 rounded-full', getProgressColor(pillar.score)]"
                                    :style="{ width: `${pillar.score}%` }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import ProgressChart from '~/components/DashboardProgressChart.vue'
import PillarComparisonChart from '~/components/DashboardPillarComparisonChart.vue'
import ComparisonRadarChart from '~/components/DashboardComparisonRadarChart.vue'
import { ChartBarIcon } from '@heroicons/vue/24/outline'

const activeTab = ref('score-trends') // Default to score trends as requested
const selectedAssessment = ref<any>(null)
const isCompareMode = ref(false)
const selectedAssessmentIds = ref<number[]>([])

const tabs = [
    { id: 'timeline', name: 'Timeline' },
    { id: 'score-trends', name: 'Score Trends' },
    { id: 'pillar-analysis', name: 'Pillar Analysis' },
    { id: 'comparison', name: 'Comparison' }
]

const assessments = ref<any[]>([])
const isLoading = ref(true)

const authStore = useAuthStore()

const fetchHistory = async () => {
    isLoading.value = true
    try {
        const smeId = authStore.user?.company?.id || 3
        const data = await $fetch(`/api/assessment/history?smeId=${smeId}`)
        assessments.value = data as any[]
    } catch (e) {
        console.error('Failed to fetch history:', e)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchHistory()
})

const currentScore = computed(() => assessments.value[0]?.score || 0)
const totalChange = computed(() => {
    if (assessments.value.length < 2) return 0
    const first = assessments.value[0]
    const last = assessments.value[assessments.value.length - 1]
    return (first?.score || 0) - (last?.score || 0)
})
const avgChange = computed(() => {
    if (assessments.value.length < 2) return 0
    return Math.round(totalChange.value / (assessments.value.length - 1))
})
const bestScore = computed(() => Math.max(...assessments.value.map(a => a.score)))
const lowestScore = computed(() => Math.min(...assessments.value.map(a => a.score)))

const viewDetails = (assessment: any) => {
    selectedAssessment.value = assessment
}

const getPillarColor = (score: number) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
}

const getProgressColor = (score: number) => {
    if (score >= 70) return 'bg-green-600'
    if (score >= 50) return 'bg-yellow-600'
    return 'bg-red-600'
}

const getRiskClass = (score: number) => {
    if (score >= 70) return 'bg-green-100 text-green-700'
    if (score >= 50) return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
}

const getRiskLabel = (score: number) => {
    if (score >= 70) return 'low'
    if (score >= 50) return 'medium'
    return 'high'
}

const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Investment Ready'
    if (score >= 50) return 'Early Stage'
    return 'Needs Improvement'
}

const toggleCompareMode = () => {
    isCompareMode.value = !isCompareMode.value
    if (!isCompareMode.value) {
        selectedAssessmentIds.value = []
        if (activeTab.value === 'comparison') {
            activeTab.value = 'timeline'
        }
    } else {
        activeTab.value = 'timeline'
    }
}

const toggleSelection = (id: number) => {
    if (selectedAssessmentIds.value.includes(id)) {
        selectedAssessmentIds.value = selectedAssessmentIds.value.filter(sid => sid !== id)
    } else {
        if (selectedAssessmentIds.value.length < 2) {
            selectedAssessmentIds.value.push(id)
        }
    }
}

const clearSelection = () => {
    selectedAssessmentIds.value = []
}

// Watch selection to auto-switch to comparison tab (optional, maybe better manually)
watch(selectedAssessmentIds, (newIds) => {
    if (newIds.length === 2 && isCompareMode.value) {
        // Optional: auto-switch
        activeTab.value = 'comparison'
    }
})

// Comparison Data
const comparisonData = computed(() => {
    if (selectedAssessmentIds.value.length !== 2) return null

    // Get selected assessments
    const selected = assessments.value.filter(a => selectedAssessmentIds.value.includes(a.id))

    // Check if we have 2 found
    if (selected.length !== 2) return null

    // Sort by date ascending (Old -> New)
    const sorted = [...selected].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const [oldAss, newAss] = sorted

    if (!oldAss || !newAss) return null

    return {
        old: oldAss,
        new: newAss,
        radarData: {
            labels: oldAss.pillars.map((p: any) => p.name.split(' ')[0]),
            datasets: [
                {
                    label: newAss.date, // New (Teal)
                    data: newAss.pillars.map((p: any) => p.score),
                    backgroundColor: 'rgba(20, 184, 166, 0.2)',
                    borderColor: '#14B8A6',
                    pointBackgroundColor: '#14B8A6',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#14B8A6'
                },
                {
                    label: oldAss.date, // Old (Blue)
                    data: oldAss.pillars.map((p: any) => p.score),
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: '#3B82F6',
                    pointBackgroundColor: '#3B82F6',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#3B82F6'
                }
            ]
        },
        tableData: oldAss.pillars.map((p: any, i: number) => {
            const oldScore = p.score
            const newScore = newAss.pillars.find((np: any) => np.name === p.name)?.score || 0
            return {
                name: p.name,
                oldScore,
                newScore,
                change: newScore - oldScore
            }
        })
    }
})

// Chart Data Preparation
const chartData = computed(() => {
    // Clone and reverse to show oldest first in chart
    return [...assessments.value].reverse().map(a => ({
        date: a.date,
        score: a.score
    }))
})

const pillarChartData = computed(() => {
    // Show all assessments in the bar chart, or the selected ones if in compare mode
    const sourceAssessments = isCompareMode.value && selectedAssessmentIds.value.length > 0
        ? assessments.value.filter(a => selectedAssessmentIds.value.includes(a.id))
        : assessments.value

    // Get unique pillar names from the first assessment
    const pillarNames = sourceAssessments[0]?.pillars.map((p: any) => p.name) || []

    return {
        labels: pillarNames,
        datasets: sourceAssessments.map((assessment, index) => {
            const colors = ['#14B8A6', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B']
            const color = colors[index % colors.length]

            return {
                label: assessment.name,
                data: assessment.pillars.map((p: any) => p.score),
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1,
                barPercentage: 0.7,
                categoryPercentage: 0.8
            }
        })
    }
})

definePageMeta({
    layout: 'default',
    middleware: ['auth', 'sme']
})
</script>
