<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-8 py-6 mb-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Portfolio Management</h1>
          <p class="text-gray-500 mt-1">Track and manage your investment portfolio</p>
        </div>
        <button @click="isCreateGoalOpen = true"
          class="px-4 py-2 bg-[#33CCCC] text-white rounded-md font-medium hover:bg-[#2BB8B8] transition-colors flex items-center gap-2">
          <PlusIcon class="w-4 h-4" /> Create Goal
        </button>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto px-8 pb-12 w-full">
      <div class="max-w-[1600px] mx-auto space-y-6">

        <!-- KPI Cards -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p class="text-sm font-medium text-gray-500 mb-1">Total SMEs</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalDeals }}</p>
          </div>
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p class="text-sm font-medium text-gray-500 mb-1">Avg. Score</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.avgScore }}</p>
          </div>
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p class="text-sm font-medium text-gray-500 mb-1">Investor Ready</p>
            <p class="text-3xl font-bold text-green-600">{{ stats.readyToInvest }}</p>
          </div>
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p class="text-sm font-medium text-gray-500 mb-1">Active Goals</p>
            <p class="text-3xl font-bold text-blue-600">{{ stats.activeGoals }}</p>
          </div>
          <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p class="text-sm font-medium text-gray-500 mb-1">Goals Achieved</p>
            <p class="text-3xl font-bold text-purple-600">{{ stats.achievedGoals }}</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="border-b border-gray-200 px-6">
            <nav class="flex gap-8">
              <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === tab.id
                  ? 'border-[#33CCCC] text-[#33CCCC]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]">
                {{ tab.label }}
              </button>
            </nav>
          </div>

          <div class="p-6">
            <!-- SME Comparison Tab -->
            <div v-if="activeTab === 'comparison'">
              <Marketplace @sme-click="openSmeModal" />
            </div>

            <!-- Goals & Targets Tab -->
            <div v-else-if="activeTab === 'goals'" class="space-y-6">
              <!-- Filter -->
              <div class="flex items-center gap-2">
                <button v-for="filter in goalFilters" :key="filter.id" @click="activeGoalFilter = filter.id" :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  activeGoalFilter === filter.id
                    ? 'bg-gray-100 text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                ]">
                  {{ filter.label }} <span class="text-xs ml-1"
                    :class="activeGoalFilter === filter.id ? 'text-gray-500' : 'text-gray-400'">({{ filter.count
                    }})</span>
                </button>
              </div>

              <!-- Goals List -->
              <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div v-for="goal in filteredGoals" :key="goal.id"
                  class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  @click="openGoalDetail(goal)">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                      <BuildingOfficeIcon class="w-4 h-4 text-gray-400" />
                      <span class="text-sm font-medium text-gray-600">{{ goal.smeName }}</span>
                      <span class="px-2 py-0.5 bg-gray-100 rounded-md text-xs text-gray-500 font-medium">{{ goal.sector
                      }}</span>
                    </div>
                    <EllipsisHorizontalIcon class="w-5 h-5 text-gray-400" />
                  </div>

                  <div class="mb-4">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-lg font-bold text-gray-900">{{ goal.title }}</h3>
                      <span
                        :class="['px-2 py-0.5 rounded-md text-xs font-semibold uppercase', getStatusColor(goal.status)]">
                        {{ goal.status }}
                      </span>
                      <span v-if="goal.isOffTrack"
                        class="px-2 py-0.5 rounded-md text-xs font-semibold uppercase bg-red-100 text-red-600">
                        Off Track
                      </span>
                    </div>
                    <p class="text-sm text-gray-500">{{ goal.description }}</p>
                  </div>

                  <div class="space-y-4">
                    <div>
                      <div class="flex justify-between items-end mb-1">
                        <span class="text-xs font-medium text-gray-500">Progress</span>
                        <span class="text-sm font-bold" :class="goal.progressColor">{{ goal.progress }}%</span>
                      </div>
                      <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full rounded-full" :class="goal.barColor" :style="{ width: goal.progress + '%' }">
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div class="flex items-center gap-4 text-xs">
                        <div class="flex items-center gap-1 text-gray-600">
                          <div
                            class="w-3 h-3 rounded-full border border-gray-300 flex items-center justify-center text-[8px]">
                            🎯</div>
                          Target: <span class="font-medium">{{ goal.targetScore }}</span>
                        </div>
                        <div class="flex items-center gap-1" :class="goal.overdue ? 'text-red-500' : 'text-gray-500'">
                          <ClockIcon class="w-3 h-3" />
                          <span v-if="goal.overdue" class="font-medium">{{ goal.overdueDays }} overdue</span>
                          <span v-else>{{ goal.dueDate }}</span>
                        </div>
                        <div v-if="goal.daysLeft" class="flex items-center gap-1 text-gray-500">
                          <ClockIcon class="w-3 h-3" />
                          <span>{{ goal.daysLeft }}</span>
                        </div>
                      </div>
                      <div class="flex items-center gap-1 text-xs text-orange-500 font-medium">
                        <SparklesIcon class="w-3 h-3" />
                        Team
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ... existing Distribution Tab code ... -->


            <!-- Distribution Tab -->
            <div v-else-if="activeTab === 'distribution'" class="space-y-6">
              <!-- Readiness Distribution -->
              <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative overflow-hidden">
                <div class="mb-6">
                  <h3 class="text-lg font-bold text-gray-900">Readiness Distribution</h3>
                  <p class="text-sm text-gray-500 mt-1">SME breakdown by investment readiness level</p>
                </div>

                <div class="relative pt-2 pb-6 px-4">
                  <!-- Helper grid lines background -->
                  <div class="absolute inset-x-8 top-0 bottom-8 flex flex-col justify-between pointer-events-none z-0">
                    <div class="border-b border-dashed border-gray-100 h-0 w-full mb-8"></div>
                    <div class="border-b border-dashed border-gray-100 h-0 w-full mb-8"></div>
                    <div class="border-b border-dashed border-gray-100 h-0 w-full mb-8"></div>
                    <div class="border-b border-dashed border-gray-100 h-0 w-full mb-8"></div>
                  </div>

                  <div class="space-y-8 relative z-10 pl-24 ml-2">
                    <!-- Investor Ready -->
                    <div class="relative flex items-center h-8 group cursor-pointer">
                      <div class="absolute -left-28 w-24 text-right pr-2">
                        <span class="text-xs text-gray-500 font-medium leading-tight block">Investor<br>Ready</span>
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
                        <span class="text-xs text-gray-500 font-medium leading-tight block">Pre-Investment</span>
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
            </div>

            <!-- Risk Matrix Tab -->
            <div v-else-if="activeTab === 'risk'"
              class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm min-h-[500px]">
              <div class="mb-6">
                <h3 class="text-lg font-bold text-gray-900">Portfolio Risk Matrix</h3>
                <p class="text-sm text-gray-500 mt-1">Visualizing risk vs growth potential across your portfolio</p>
              </div>
              <RiskGrowthScatterPlot :smes="store.dealFlow" @point-click="openSmeModal" />
            </div>
          </div>
        </div>

      </div>
    </main>

    <GoalDetailModal :is-open="isDetailOpen" :goal="selectedGoal || {}" @close="isDetailOpen = false"
      @update-status="handleUpdateGoalStatus" />
    <CreateGoalModal :is-open="isCreateGoalOpen" :sme-list="smeList" @close="isCreateGoalOpen = false"
      @create="handleCreateGoal" />
    <SmeSummaryModal v-if="selectedSme" :sme="selectedSme" @close="selectedSme = null"
      @create-goal="selectedSme = null; isCreateGoalOpen = true" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  PlusIcon,
  FlagIcon,
  BuildingOfficeIcon,
  EllipsisHorizontalIcon,
  ClockIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'
import { useInvestorStore } from '~/stores/investor.store'
import Marketplace from '~/components/InvestorMarketplace.vue'
import GoalDetailModal from '~/components/InvestorGoalDetailModal.vue'
import CreateGoalModal from '~/components/InvestorCreateGoalModal.vue'
import RiskGrowthScatterPlot from '~/components/InvestorRiskGrowthScatterPlot.vue'
import SmeSummaryModal from '~/components/InvestorSmeSummaryModal.vue'

const store = useInvestorStore()
const stats = computed(() => store.stats)

const activeTab = ref('comparison') // Default to comparison
const activeGoalFilter = ref('all')
const isDetailOpen = ref(false)
const isCreateGoalOpen = ref(false)
const selectedGoal = ref<any>(null)
const selectedSme = ref<any>(null)

const openSmeModal = (sme: any) => {
  selectedSme.value = sme
}

const smeList = computed(() => store.dealFlow.map(sme => ({ id: sme.id, name: sme.name, score: sme.score })))

const tabs = computed(() => [
  { id: 'comparison', label: 'SME Comparison' },
  { id: 'goals', label: `Goals & Targets (${store.goals.length})` },
  { id: 'distribution', label: 'Distribution' },
  { id: 'risk', label: 'Risk Matrix' }
])

const goals = computed(() => store.goals)

// Computed
const readinessDistribution = computed(() => {
  const dealFlow = store.dealFlow
  return {
    investorReady: dealFlow.filter(d => d.score >= 80).length,
    nearReady: dealFlow.filter(d => d.score >= 60 && d.score < 80).length,
    earlyStage: dealFlow.filter(d => d.score >= 40 && d.score < 60).length,
    preInvestment: dealFlow.filter(d => d.score < 40).length
  }
})

const goalFilters = computed(() => {
  const allCount = goals.value.length
  const activeCount = goals.value.filter(g => g.status === 'Active').length
  const achievedCount = goals.value.filter(g => g.status === 'Achieved').length

  return [
    { id: 'active', label: 'Active', count: activeCount },
    { id: 'achieved', label: 'Achieved', count: achievedCount },
    { id: 'all', label: 'All', count: allCount }
  ]
})

const filteredGoals = computed(() => {
  if (activeGoalFilter.value === 'all') return goals.value
  if (activeGoalFilter.value === 'active') return goals.value.filter(g => g.status === 'Active')
  if (activeGoalFilter.value === 'achieved') return goals.value.filter(g => g.status === 'Achieved')
  return goals.value
})

// Methods
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active': return 'bg-blue-100 text-blue-700'
    case 'achieved': return 'bg-emerald-100 text-emerald-700'
    case 'paused': return 'bg-gray-100 text-gray-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const openGoalDetail = (goal: any) => {
  selectedGoal.value = goal
  isDetailOpen.value = true
}

const handleCreateGoal = async (goalData: any) => {
  await store.createGoal(goalData)
  isCreateGoalOpen.value = false
}

const handleUpdateGoalStatus = async ({ id, status }: { id: number, status: string }) => {
  await store.updateGoalStatus(id, status)
  // Close modal if achieved, or update local referencing
  isDetailOpen.value = false
  // Optional: show notification
}

onMounted(() => {
  if (store.dealFlow.length === 0) {
    store.fetchDealFlow()
  }
})

definePageMeta({
  layout: 'investor',
  middleware: ['auth', 'investor']
})
</script>
