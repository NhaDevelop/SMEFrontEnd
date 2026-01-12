<template>
  <MainLayout>
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-8 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div>
            <div class="flex items-center gap-3">
              <BuildingOfficeIcon class="w-6 h-6 text-gray-600" />
              <h1 class="text-2xl font-bold text-gray-900">{{ companyInfo?.name }}</h1>
              <RiskBadge :level="overallRiskLevel" />
            </div>
            <div class="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span class="flex items-center gap-1">
                <BriefcaseIcon class="w-4 h-4" />
                {{ companyInfo?.industry }}
              </span>
              <span class="flex items-center gap-1">
                <CalendarIcon class="w-4 h-4" />
                Last assessed: {{ companyInfo?.lastAssessed }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto custom-scrollbar p-8">
      <div class="max-w-7xl mx-auto space-y-6">
        <!-- Top Metrics Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Investment Readiness Score -->
          <div class="card md:col-span-1">
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-600">Investment Readiness Score</h3>
              <InformationCircleIcon class="w-5 h-5 text-gray-400" />
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-5xl font-bold text-cyan-600">{{ overallScore }}</span>
              <span class="text-lg text-gray-500">/100</span>
              <span class="text-sm font-medium text-green-600 ml-2">+{{ scoreChange }}</span>
            </div>
            <div class="mt-3 flex items-center gap-2">
              <span class="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                {{ readinessStatus }}
              </span>
              <span class="text-xs text-gray-500 flex items-center gap-1">
                <ArrowTrendingUpIcon class="w-4 h-4" />
                +{{ scoreChange }} since last assessment
              </span>
            </div>
          </div>

          <!-- Growth Potential -->
          <div class="card">
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-600">Growth Potential</h3>
              <ChartBarIcon class="w-5 h-5 text-gray-400" />
            </div>
            <div class="text-5xl font-bold text-gray-900">{{ growthPotential }}</div>
            <p class="text-sm text-gray-500 mt-2">Average improvement potential across pillars</p>
          </div>

          <!-- Actions Needed -->
          <div class="card">
            <div class="flex items-start justify-between mb-4">
              <h3 class="text-sm font-medium text-gray-600">Actions Needed</h3>
              <ExclamationTriangleIcon class="w-5 h-5 text-gray-400" />
            </div>
            <div class="text-5xl font-bold text-gray-900">{{ actionsCount }}</div>
            <p class="text-sm text-gray-500 mt-2">Recommended improvement actions</p>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Readiness by Pillar -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Readiness by Pillar</h3>
            <RadarChart :pillars="pillars" />
          </div>

          <!-- Progress Over Time -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Progress Over Time</h3>
            <ProgressChart :data="progressData" />
          </div>
        </div>

        <!-- Bottom Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Pillar Summary -->
          <div class="card lg:col-span-2">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Pillar Summary</h3>
            <PillarSummary :pillars="pillars" />
          </div>

          <!-- Recommended Actions -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-6">Recommended Actions</h3>
            <RecommendedActions :actions="recommendedActions" />
          </div>
        </div>
      </div>
    </main>
  </MainLayout>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/modules/auth/store'
import { useDashboardStore } from '../store'
import { getReadinessStatus } from '@/shared/utils/helpers'
import MainLayout from '@/shared/components/layout/MainLayout.vue'
import RiskBadge from '@/shared/components/ui/RiskBadge.vue'
import RadarChart from '../components/RadarChart.vue'
import ProgressChart from '../components/ProgressChart.vue'
import PillarSummary from '../components/PillarSummary.vue'
import RecommendedActions from '../components/RecommendedActions.vue'
import {
  BuildingOfficeIcon,
  BriefcaseIcon,
  CalendarIcon,
  InformationCircleIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'DashboardPage',
  components: {
    MainLayout,
    RiskBadge,
    RadarChart,
    ProgressChart,
    PillarSummary,
    RecommendedActions,
    BuildingOfficeIcon,
    BriefcaseIcon,
    CalendarIcon,
    InformationCircleIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
    ArrowTrendingUpIcon
  },
  setup() {
    const authStore = useAuthStore()
    const dashboardStore = useDashboardStore()

    onMounted(async () => {
      await dashboardStore.fetchDashboardData()
    })

    const companyInfo = computed(() => authStore.companyInfo)
    const pillars = computed(() => dashboardStore.pillars)
    const progressData = computed(() => dashboardStore.progressData)
    const overallScore = computed(() => dashboardStore.overallScore)
    const growthPotential = computed(() => dashboardStore.growthPotential)
    const overallRiskLevel = computed(() => dashboardStore.overallRiskLevel)
    const scoreChange = computed(() => dashboardStore.scoreChange)
    const actionsCount = computed(() => dashboardStore.actionsCount)
    const recommendedActions = computed(() => dashboardStore.actions)
    const readinessStatus = computed(() => getReadinessStatus(overallScore.value))

    return {
      companyInfo,
      pillars,
      progressData,
      overallScore,
      growthPotential,
      overallRiskLevel,
      scoreChange,
      actionsCount,
      recommendedActions,
      readinessStatus
    }
  }
}
</script>
