<template>
  <div v-if="!loading" class="h-full">
    <!-- Admin Dashboard -->
    <AdminDashboard v-if="isAdmin" />

    <!-- SME Dashboard -->
    <div v-else class="flex flex-col h-full">
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
            <!-- Left Column: Pillar Summary -->
            <div class="card lg:col-span-2 h-fit">
              <h3 class="text-lg font-semibold text-gray-900 mb-6">Pillar Summary</h3>
              <PillarSummary :pillars="pillars" />
            </div>

            <!-- Right Column: Active Goals & Recommended Actions -->
            <div class="space-y-6">
              <!-- Active Goals -->
              <div class="card cursor-pointer hover:shadow-md transition-shadow group relative overflow-hidden"
                @click="goToGoals">
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-2">
                    <div class="bg-teal-50 p-1.5 rounded-lg">
                      <CheckCircleIcon class="w-5 h-5 text-teal-600" />
                    </div>
                    <h3 class="font-semibold text-gray-900">Active Goals</h3>
                  </div>
                  <button class="text-sm text-gray-500 flex items-center group-hover:text-teal-600 transition-colors">
                    View All
                    <ChevronRightIcon class="w-4 h-4 ml-1" />
                  </button>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-3 gap-3 mb-6">
                  <div class="bg-blue-50 rounded-xl p-3 text-center">
                    <div class="text-blue-600 font-bold text-xl">1</div>
                    <div class="text-[10px] uppercase tracking-wide text-blue-600 font-semibold mt-1">Active</div>
                  </div>
                  <div class="bg-emerald-50 rounded-xl p-3 text-center">
                    <div class="text-emerald-600 font-bold text-xl">1</div>
                    <div class="text-[10px] uppercase tracking-wide text-emerald-600 font-semibold mt-1">Achieved</div>
                  </div>
                  <div class="bg-orange-50 rounded-xl p-3 text-center">
                    <div class="text-orange-600 font-bold text-xl">39%</div>
                    <div class="text-[10px] uppercase tracking-wide text-orange-600 font-semibold mt-1">Progress</div>
                  </div>
                </div>

                <!-- Featured Goal -->
                <div
                  class="bg-white rounded-lg border border-gray-100 p-4 relative shadow-sm group-hover:border-teal-100 transition-colors">
                  <!-- Status Badge -->
                  <div
                    class="absolute -top-2.5 left-3 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-200 shadow-sm">
                    Active
                  </div>

                  <h4 class="font-bold text-gray-900 text-sm mt-3 mb-1">Investor Ready by Q4 2024</h4>

                  <div class="flex items-baseline justify-between mb-3">
                    <div class="flex items-center gap-3 text-xs text-gray-500">
                      <span class="flex items-center gap-1">
                        <CheckCircleIcon class="w-3.5 h-3.5 text-gray-400" /> Target: 80
                      </span>
                      <span
                        class="flex items-center gap-1 text-rose-500 font-medium bg-rose-50 px-1.5 py-0.5 rounded-md">
                        <ClockIcon class="w-3.5 h-3.5" /> 406d overdue
                      </span>
                    </div>
                    <span class="text-lg font-bold text-orange-500">39%</span>
                  </div>

                  <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div class="h-full bg-teal-500 rounded-full" style="width: 39%"></div>
                  </div>

                  <div class="flex items-center gap-1.5 text-xs text-gray-500">
                    <SparklesIcon class="w-3.5 h-3.5 text-orange-400" />
                    <span class="truncate">Focus: Market (+37 needed)</span>
                  </div>
                </div>
              </div>

              <!-- Recommended Actions -->
              <div class="card h-fit">
                <h3 class="text-lg font-semibold text-gray-900 mb-6">Recommended Actions</h3>
                <RecommendedActions :actions="recommendedActions" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '~/stores/auth.store'
import { useDashboardStore } from '~/stores/dashboard.store'
import { getReadinessStatus } from '~/utils/helpers'
import RiskBadge from '~/components/common/RiskBadge.vue'
import RadarChart from '~/components/dashboard/RadarChart.vue'
import ProgressChart from '~/components/dashboard/ProgressChart.vue'
import PillarSummary from '~/components/dashboard/PillarSummary.vue'
import RecommendedActions from '~/components/dashboard/RecommendedActions.vue'
import AdminDashboard from '~/components/admin/AdminDashboard.vue'
import {
  BuildingOfficeIcon,
  BriefcaseIcon,
  CalendarIcon,
  InformationCircleIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'DashboardPage',
  components: {
    RiskBadge,
    RadarChart,
    ProgressChart,
    PillarSummary,
    RecommendedActions,
    AdminDashboard,
    BuildingOfficeIcon,
    BriefcaseIcon,
    CalendarIcon,
    InformationCircleIcon,
    ChartBarIcon,
    ExclamationTriangleIcon,
    ArrowTrendingUpIcon,
    CheckCircleIcon,
    ChevronRightIcon,
    ClockIcon,
    SparklesIcon
  },
  setup() {
    definePageMeta({
      middleware: 'auth'
    })
    const authStore = useAuthStore()
    const dashboardStore = useDashboardStore()
    const loading = ref(true)

    const isAdmin = computed(() => authStore.userRole === 'ADMIN')

    onMounted(async () => {
      // Redirect investors to their own dashboard
      if (authStore.userRole === 'INVESTOR') {
        return navigateTo('/investor/dashboard')
      }

      try {
        if (!isAdmin.value) {
          await dashboardStore.fetchDashboardData()
        }
      } finally {
        loading.value = false
      }
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

    const readinessStatus = computed(() => {
      const score = overallScore.value
      if (score >= 70) return 'Investment Ready'
      if (score >= 50) return 'Developing'
      return 'Needs Improvement'
    })

    return {
      loading,
      isAdmin,
      companyInfo,
      pillars,
      progressData,
      overallScore,
      growthPotential,
      overallRiskLevel,
      scoreChange,
      actionsCount,
      recommendedActions,
      readinessStatus,
      goToGoals: () => navigateTo('/sme/goals')
    }
  }
}
</script>
