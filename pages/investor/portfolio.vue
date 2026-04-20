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
                  class="rounded-lg border p-6 transition-shadow cursor-pointer" :class="[
                    goal.status === 'Achieved' ? 'bg-emerald-50 border-emerald-200 hover:shadow-md' :
                      goal.status === 'Pending Verification' ? 'bg-purple-50 border-purple-200 hover:shadow-md' :
                      goal.overdue ? 'bg-red-50 border-red-200 hover:shadow-md' : 'bg-white border-gray-200 hover:shadow-md hover:border-gray-300'
                  ]" @click="openGoalDetail(goal)">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-2">
                      <BuildingOfficeIcon class="w-4 h-4 text-gray-400" />
                      <span class="text-sm font-medium text-gray-600">{{ goal.smeName }}</span>
                      <span class="px-2 py-0.5 bg-gray-100 rounded-md text-xs text-gray-500 font-medium">{{ goal.sector
                        }}</span>
                    </div>
                    <Menu as="div" class="relative">
                      <MenuButton @click.stop class="p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <EllipsisHorizontalIcon class="w-5 h-5 text-gray-400" />
                      </MenuButton>
                      <transition enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
                        <MenuItems
                          class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <MenuItem v-slot="{ active }">
                          <button @click.stop="openGoalDetail(goal)"
                            :class="[active ? 'bg-gray-100' : '', 'flex w-full items-center px-4 py-2 text-sm text-gray-700']">
                            <EyeIcon class="mr-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                            View Details
                          </button>
                          </MenuItem>
                          <MenuItem v-slot="{ active }">
                          <button @click.stop="openGoalDetail(goal)"
                            :class="[active ? 'bg-gray-100' : '', 'flex w-full items-center px-4 py-2 text-sm text-gray-700']">
                            <PencilIcon class="mr-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                            Edit
                          </button>
                          </MenuItem>
                          <MenuItem v-slot="{ active }" v-if="goal.status !== 'Achieved'">
                          <button @click.stop="handleUpdateGoalStatus({ id: goal.id, status: 'Achieved' })"
                            :class="[active ? 'bg-gray-100' : '', 'flex w-full items-center px-4 py-2 text-sm text-gray-700']">
                            <CheckCircleIcon class="mr-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                            Mark Achieved
                          </button>
                          </MenuItem>
                          <MenuItem v-slot="{ active }" v-if="goal.status !== 'Paused' && goal.status !== 'Achieved'">
                          <button @click.stop="handleUpdateGoalStatus({ id: goal.id, status: 'Paused' })"
                            :class="[active ? 'bg-gray-100' : '', 'flex w-full items-center px-4 py-2 text-sm text-gray-700']">
                            <PauseCircleIcon class="mr-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                            Pause
                          </button>
                          </MenuItem>
                          <MenuItem v-slot="{ active }">
                          <button @click.stop="handleDeleteGoal(goal.id)"
                            :class="[active ? 'bg-gray-100' : '', 'flex w-full items-center px-4 py-2 text-sm text-red-600 hover:text-red-700']">
                            <TrashIcon class="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500" aria-hidden="true" />
                            Delete
                          </button>
                          </MenuItem>
                        </MenuItems>
                      </transition>
                    </Menu>
                  </div>

                  <div class="mb-4">
                    <div class="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 class="text-lg font-bold text-gray-900">{{ goal.title }}</h3>
                      <span
                        :class="['px-2 py-0.5 rounded-md text-xs font-semibold uppercase', getStatusColor(goal.status)]">
                        {{ goal.status }}
                      </span>
                      <span v-if="goal.status === 'Achieved' && goal.proofNote"
                        class="px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                          class="w-3.5 h-3.5">
                          <path fill-rule="evenodd"
                            d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clip-rule="evenodd" />
                        </svg>
                        Verified
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

                    <!-- Proof Review Panel — visible to investor when SME submitted proof -->
                    <div v-if="goal.status?.toLowerCase() === 'pending verification'" @click.stop
                      class="mt-4 p-4 rounded-lg border border-purple-200 bg-white shadow-sm space-y-3 relative overflow-hidden">
                      <div class="absolute top-0 right-0 p-1 bg-purple-50 rounded-bl-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5 text-purple-400">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-purple-600 flex-shrink-0">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="text-xs font-semibold text-purple-700 uppercase tracking-wide">Proof Submitted — Awaiting Your Review</span>
                      </div>
                      <p v-if="goal.proofNote" class="text-sm text-gray-700 italic border-l-2 border-purple-200 pl-3">
                        "{{ goal.proofNote }}"
                      </p>
                      <a v-if="goal.proofDocument"
                        :href="getDocumentUrl(goal.proofDocument)" target="_blank"
                        class="flex items-center gap-2 text-teal-700 font-bold text-xs bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100 hover:bg-teal-100 transition-colors w-fit shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        View & Download Proof Document
                      </a>
                      <div class="flex gap-2 pt-1">
                        <button @click="handleVerifyGoal(goal.id)"
                          :disabled="verifyingGoalId === goal.id"
                          class="flex-1 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                          {{ verifyingGoalId === goal.id ? 'Approving...' : 'Approve' }}
                        </button>
                        <button @click="openRejectModal(goal.id)"
                          :disabled="verifyingGoalId === goal.id"
                          class="flex-1 py-2 text-xs font-semibold rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50 flex items-center justify-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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

    <!-- Reject Modal -->
    <div v-if="rejectModalGoalId !== null" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-4 space-y-4">
        <h3 class="text-lg font-bold text-gray-900">Reject Proof</h3>
        <p class="text-sm text-gray-500">Provide a note explaining why the proof was rejected. The SME will need to resubmit.</p>
        <textarea v-model="rejectionNote" rows="3" placeholder="e.g. The document provided is not sufficient..."
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-rose-400 focus:outline-none resize-none"></textarea>
        <div class="flex gap-3">
          <button @click="rejectModalGoalId = null; rejectionNote = ''"
            class="flex-1 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Cancel</button>
          <button @click="handleRejectGoal"
            class="flex-1 py-2 text-sm font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors">Confirm Reject</button>
        </div>
      </div>
    </div>
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
  SparklesIcon,
  EyeIcon,
  CheckCircleIcon,
  PauseCircleIcon,
  TrashIcon,
  PencilIcon
} from '@heroicons/vue/24/outline'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useInvestorStore } from '~/stores/investor.store'
import { useConfirm } from '~/composables/useConfirm'
import Marketplace from '~/components/InvestorMarketplace.vue'
import GoalDetailModal from '~/components/InvestorGoalDetailModal.vue'
import CreateGoalModal from '~/components/InvestorCreateGoalModal.vue'
import RiskGrowthScatterPlot from '~/components/InvestorRiskGrowthScatterPlot.vue'
import SmeSummaryModal from '~/components/InvestorSmeSummaryModal.vue'

const store = useInvestorStore()
const { ask } = useConfirm()
const toast = useToast()
const stats = computed(() => store.stats)

const activeTab = ref('comparison')
const activeGoalFilter = ref('all')
const isDetailOpen = ref(false)
const isCreateGoalOpen = ref(false)
const selectedGoal = ref<any>(null)
const selectedSme = ref<any>(null)
const verifyingGoalId = ref<number | null>(null)
const rejectModalGoalId = ref<number | null>(null)
const rejectionNote = ref('')

const openSmeModal = (sme: any) => {
  selectedSme.value = sme
}

const smeList = computed(() => store.dealFlow.map(sme => ({ id: sme.id, name: sme.name, score: sme.score, pillars: sme.pillars, programIds: sme.programIds || [] })))

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
  const activeCount = goals.value.filter(g => ['Active', 'ACTIVE', 'In Progress', 'Not Started'].includes(g.status)).length
  const pendingCount = goals.value.filter(g => g.status === 'Pending Verification').length
  const achievedCount = goals.value.filter(g => g.status === 'Achieved' || g.status === 'COMPLETED').length

  return [
    { id: 'active', label: 'Active', count: activeCount },
    { id: 'pending', label: 'Pending Review', count: pendingCount },
    { id: 'achieved', label: 'Achieved', count: achievedCount },
    { id: 'all', label: 'All', count: allCount }
  ]
})

const filteredGoals = computed(() => {
  if (activeGoalFilter.value === 'all') return goals.value
  if (activeGoalFilter.value === 'active') return goals.value.filter(g => ['Active', 'ACTIVE', 'In Progress', 'Not Started'].includes(g.status))
  if (activeGoalFilter.value === 'pending') return goals.value.filter(g => g.status === 'Pending Verification')
  if (activeGoalFilter.value === 'achieved') return goals.value.filter(g => g.status === 'Achieved' || g.status === 'COMPLETED')
  return goals.value
})

// Methods
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active': case 'in progress': case 'not started': return 'bg-blue-100 text-blue-700'
    case 'achieved': case 'completed': return 'bg-emerald-100 text-emerald-700'
    case 'pending verification': return 'bg-purple-100 text-purple-700'
    case 'paused': return 'bg-orange-100 text-orange-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const openGoalDetail = (goal: any) => {
  selectedGoal.value = goal
  isDetailOpen.value = true
}

const getDocumentUrl = (path: string) => {
  if (!path) return '#'
  if (path.startsWith('http')) return path
  
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase.replace('/api', '')
  return `${apiBase}/storage/${path}`
}

const handleCreateGoal = async (goalData: any) => {
  await store.createGoal(goalData)
  isCreateGoalOpen.value = false
}

const handleUpdateGoalStatus = async ({ id, status }: { id: number, status: string }) => {
  const isApproving = status.toLowerCase().includes('approved') || status.toLowerCase().includes('active')
  const actionTitle = isApproving ? 'Approve Goal?' : 'Reject Goal?'
  const actionMessage = isApproving 
    ? 'Are you sure you want to approve this goal? This will move it to the active tracking phase.' 
    : 'Are you sure you want to reject this goal? The SME will be notified to revise their target.'

  const confirmed = await ask({
    title: actionTitle,
    message: actionMessage,
    confirmText: isApproving ? 'Approve' : 'Reject',
    type: isApproving ? 'info' : 'danger'
  })
  
  if (!confirmed) return

  await store.updateGoalStatus(id, status)
  isDetailOpen.value = false
}

const handleDeleteGoal = async (id: number) => {
  const confirmed = await ask({
    title: 'Delete Goal?',
    message: 'Are you sure you want to delete this goal from the portfolio? This cannot be undone.',
    confirmText: 'Delete Goal',
    type: 'danger'
  })
  if (confirmed) {
    await store.deleteGoal(id)
  }
}

const handleVerifyGoal = async (id: number) => {
  if (verifyingGoalId.value) return
  
  const confirmed = await ask({
    title: 'Verify Goal Evidence?',
    message: 'Are you sure you want to mark this goal as verified? You should only do this if the provided evidence meets the program requirements.',
    confirmText: 'Verify Now',
    type: 'info'
  })
  
  if (!confirmed) return

  verifyingGoalId.value = id
  const api = useApi()
  try {
    const res = await api<any>(`/sme/goals/${id}/verify`, { method: 'PATCH' })
    
    // The response is usually automatically unwrapped by useApi into its data component
    // If it didn't throw an error, we treat it as a success!
    await store.fetchDealFlow(true)
    // If we are in the detail modal, update it or close it
    if (selectedGoal.value?.id === id) {
      selectedGoal.value.status = 'Achieved'
      selectedGoal.value.progress = 100
    }
  } catch (e: any) {
    console.error('Verify error:', e)
    const msg = e.data?.message || 'Failed to approve goal. This usually happens if the goal status changed recently.'
    toast.error(msg)
    // Refresh deal flow anyway to sync state
    await store.fetchDealFlow(true)
  } finally {
    verifyingGoalId.value = null
  }
}

const openRejectModal = (id: number) => {
  rejectModalGoalId.value = id
  rejectionNote.value = ''
}

const handleRejectGoal = async () => {
  const id = rejectModalGoalId.value
  if (!id) return
  verifyingGoalId.value = id
  const api = useApi()
  try {
    await api(`/sme/goals/${id}/reject`, {
      method: 'PATCH',
      body: { rejection_note: rejectionNote.value }
    })
    await store.fetchDealFlow()
    rejectModalGoalId.value = null
    rejectionNote.value = ''
  } catch (e: any) {
    toast.error(e?.data?.message || 'Failed to reject goal.')
  } finally {
    verifyingGoalId.value = null
  }
}

onMounted(async () => {
  // Ensure programs are loaded so CreateGoalModal can filter to enrolled-only
  if (store.programs.length === 0) {
    await store.fetchPrograms()
  }
  if (store.dealFlow.length === 0) {
    store.fetchDealFlow()
  }
})

definePageMeta({
  layout: 'investor',
  middleware: ['auth', 'investor']
})
</script>
