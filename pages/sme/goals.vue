<template>
    <div class="min-h-screen bg-gray-50 p-8">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
            <div>
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Goals & Targets</h1>
                <p class="text-gray-500">Set and track your investment readiness goals</p>
            </div>
            <button @click="showCreateGoalModal = true"
                class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Goal
            </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 rounded-md bg-gray-50 flex items-center justify-center text-gray-400">
                    <FlagIcon class="w-6 h-6" />
                </div>
                <div>
                    <div class="text-2xl font-bold text-gray-900">{{ goals.length }}</div>
                    <div class="text-sm text-gray-500">Total Goals</div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 rounded-md bg-blue-50 flex items-center justify-center text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                        <path
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6l5.25 3.15-.75 1.23-5.5-3.3V7z" />
                    </svg>
                </div>
                <div>
                    <div class="text-2xl font-bold text-gray-900">{{goals.filter(g => g.status === 'Active').length}}
                    </div>
                    <div class="text-sm text-gray-500">Active</div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 rounded-md bg-green-50 flex items-center justify-center text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                    </svg>
                </div>
                <div>
                    <div class="text-2xl font-bold text-gray-900">{{goals.filter(g => g.status === 'Achieved' || g.status === 'COMPLETED').length
                    }}</div>
                    <div class="text-sm text-gray-500">Achieved</div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 rounded-md bg-purple-50 flex items-center justify-center text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <div class="text-2xl font-bold text-gray-900">{{ goals.filter(g => g.status === 'Pending Verification').length }}</div>
                    <div class="text-sm text-gray-500">Pending Review</div>
                </div>
            </div>
            <div class="bg-white p-6 rounded-lg border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 rounded-md bg-orange-50 flex items-center justify-center text-orange-500">
                    <BoltIcon class="w-6 h-6" />
                </div>
                <div>
                    <div class="text-2xl font-bold text-gray-900">{{ avgProgress }}%</div>
                    <div class="text-sm text-gray-500">Avg Progress</div>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap items-center gap-4 mb-6 pb-2 border-b border-gray-100">
            <!-- Status Tabs -->
            <div class="flex bg-gray-100 p-1 rounded-lg">
                <button v-for="tab in filters" :key="tab" @click="activeFilter = tab" :class="[
                    'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                    activeFilter === tab
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                ]">
                    {{ tab }}
                </button>
            </div>

            <div class="h-6 w-px bg-gray-200 hidden sm:block"></div>

            <!-- Creator Tabs -->
            <div class="flex gap-2">
                <button v-for="tab in creatorFilters" :key="tab" @click="activeCreatorFilter = tab" :class="[
                    'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                    activeCreatorFilter === tab
                        ? 'bg-teal-50 text-teal-700 border-teal-200 shadow-sm'
                        : 'bg-white border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                ]">
                    {{ tab }}
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Goals List -->
            <div class="lg:col-span-2 space-y-4">
                <!-- Empty State -->
                <div v-if="filteredGoals.length === 0"
                    class="bg-white rounded-lg p-12 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                    <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <FlagIcon class="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 class="text-lg font-bold text-gray-900">No goals found</h3>
                    <p class="text-sm text-gray-500 max-w-sm mt-2 mb-6">There are no goals matching your current
                        filters. Create a new goal or adjust your filters.</p>
                    <button @click="showCreateGoalModal = true"
                        class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Create Goal
                    </button>
                </div>

                <template v-else>
                    <div v-for="goal in filteredGoals" :key="goal.id" @click="selectGoal(goal)" :class="[
                        'rounded-lg p-6 border transition-all cursor-pointer',
                        goal.status === 'Achieved' ? 'bg-emerald-50 border-emerald-200' :
                            goal.overdue ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm',
                        selectedGoal?.id === goal.id ? 'ring-2 ring-teal-500 shadow-md' : ''
                    ]">
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex flex-col gap-2">
                                <div class="flex items-center gap-3">
                                    <h3 class="text-lg font-bold text-gray-900">{{ goal.title }}</h3>
                                    <span :class="[
                                        'px-2 py-0.5 text-xs font-semibold rounded-full border',
                                        goal.status === 'Active' || goal.status === 'ACTIVE' || goal.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            goal.status === 'Achieved' ? 'bg-green-50 text-green-700 border-green-100' :
                                            goal.status === 'Pending Verification' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                'bg-orange-50 text-orange-700 border-orange-100'
                                    ]">{{ goal.status === 'COMPLETED' ? 'Achieved' : goal.status }}</span>
                                </div>
                                <div v-if="goal.createdBy === 'investor' && (goal.investorCompany || goal.investorName)"
                                    class="flex items-center gap-1.5 text-xs text-indigo-700 font-medium bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 w-fit">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                        class="w-3.5 h-3.5">
                                        <path
                                            d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
                                    </svg>
                                    Assigned by {{ goal.investorCompany || goal.investorName }}
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <Menu as="div" class="relative inline-block text-left">
                                    <MenuButton @click.stop
                                        class="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
                                        <EllipsisHorizontalIcon class="w-6 h-6" />
                                    </MenuButton>

                                    <transition enter-active-class="transition duration-100 ease-out"
                                        enter-from-class="transform scale-95 opacity-0"
                                        enter-to-class="transform scale-100 opacity-100"
                                        leave-active-class="transition duration-75 ease-in"
                                        leave-from-class="transform scale-100 opacity-100"
                                        leave-to-class="transform scale-95 opacity-0">
                                        <MenuItems
                                            class="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                                            <div class="px-1 py-1">
                                                <MenuItem v-slot="{ active }" v-if="goal.status !== 'Pending Verification' && goal.status !== 'Achieved' && goal.status !== 'COMPLETED'">
                                                <button @click.stop="openProofModal(goal.id)" :class="[
                                                    active ? 'bg-teal-50 text-teal-700' : 'text-gray-700',
                                                    'group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                                                ]">
                                                    <CheckCircleIcon class="mr-2 h-4 w-4" />
                                                    Submit Proof & Complete
                                                </button>
                                                </MenuItem>
                                                <MenuItem v-slot="{ active }">
                                                <button @click.stop="pauseGoal(goal.id, goal.status)" :class="[
                                                    active ? 'bg-orange-50 text-orange-700' : 'text-gray-700',
                                                    'group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                                                ]">
                                                    <ClockIcon class="mr-2 h-4 w-4" />
                                                    {{ goal.status === 'Paused' ? 'Resume Goal' : 'Pause Goal' }}
                                                </button>
                                                </MenuItem>
                                            </div>
                                            <div class="px-1 py-1">
                                                <MenuItem v-slot="{ active }">
                                                <button @click.stop="deleteGoal(goal.id)" :class="[
                                                    active ? 'bg-red-50 text-red-700' : 'text-red-600',
                                                    'group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                                                ]" class="text-red-500">
                                                    <TrashIcon class="mr-2 h-4 w-4" />
                                                    Delete Goal
                                                </button>
                                                </MenuItem>
                                            </div>
                                        </MenuItems>
                                    </transition>
                                </Menu>
                            </div>
                        </div>
                        <p class="text-sm text-gray-500 mb-4">{{ goal.description }}</p>

                        <div class="flex items-center gap-6 text-sm text-gray-600 mb-4">
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                                </svg>
                                Target: <span class="font-semibold">{{ goal.targetScore }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                </svg>
                                {{ goal.deadline }}
                            </div>
                            <div v-if="goal.overdue" class="flex items-center gap-1 text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {{ goal.overdue }} days overdue
                            </div>
                        </div>

                        <div>
                            <div class="flex justify-between text-sm mb-1">
                                <span class="font-medium text-gray-700">Progress to target</span>
                                <span class="font-bold text-gray-900">{{ goal.progress }}%</span>
                            </div>
                            <div class="w-full bg-gray-100 rounded-full h-2 mb-1">
                                <div class="bg-teal-600 h-2 rounded-full" :style="{ width: `${goal.progress}%` }"></div>
                            </div>
                            <div class="flex justify-between text-xs text-gray-500">
                                <span>Current: {{ goal.currentScore }}</span>
                                <span>Target: {{ goal.targetScore }}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- Details Sidebar -->
            <div class="lg:col-span-1">
                <!-- Sidebar: Detailed Analysis -->
                <div v-if="selectedGoal" class="space-y-6">
                    <!-- Status & Actions -->
                    <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <h3 class="font-bold text-gray-900 mb-6">Goal Achievement</h3>

                        <!-- Pending Verification State -->
                        <div v-if="selectedGoal.status === 'Pending Verification'" class="text-center py-4 space-y-3">
                            <div class="w-12 h-12 mx-auto bg-purple-50 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-purple-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p class="text-sm font-semibold text-purple-700">Awaiting Investor Review</p>
                            <p class="text-xs text-gray-500">Your proof has been submitted. The investor will review and approve or reject it.</p>
                        </div>

                        <!-- Achieved State -->
                        <div v-else-if="selectedGoal.status === 'Achieved' || selectedGoal.status === 'COMPLETED'" class="text-center py-4 space-y-2">
                            <div class="w-12 h-12 mx-auto bg-emerald-50 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-emerald-600">
                                    <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.74-5.24z" clip-rule="evenodd"/>
                                </svg>
                            </div>
                            <p class="text-sm font-semibold text-emerald-700">Investor Verified!</p>
                            <p class="text-xs text-gray-500">This goal was successfully verified and completed.</p>
                        </div>

                        <!-- Active — can submit proof -->
                        <div v-else class="space-y-4">
                            <!-- Rejection Notice -->
                            <div v-if="selectedGoal.rejectionNote" class="p-3 rounded-lg bg-rose-50 border border-rose-100 mb-2">
                                <div class="flex gap-2 items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                    <div>
                                        <p class="text-xs font-bold text-rose-700 uppercase">Proof Not Accepted</p>
                                        <p class="text-[11px] text-rose-600 italic mt-0.5">"{{ selectedGoal.rejectionNote }}"</p>
                                    </div>
                                </div>
                            </div>

                            <p class="text-sm text-gray-500">Ready to finalize this goal? Upload your proof {{ selectedGoal.createdBy === 'investor' || selectedGoal.createdBy === 'admin' ? 'and the investor will verify it.' : 'to instantly complete it.' }}</p>
                            <button @click="openProofModal(selectedGoal.id)" :disabled="loading"
                                class="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-50">
                                <BoltIcon class="w-5 h-5" />
                                <span>{{ selectedGoal.createdBy === 'investor' || selectedGoal.createdBy === 'admin' ? 'Submit Proof for Review' : 'Upload Proof & Complete Goal' }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Current vs Target Chart -->
                    <div v-if="radarData" class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <h3 class="font-bold text-gray-900 mb-2">Current vs Target</h3>
                        <p class="text-sm text-gray-500 mb-4">Pillar score comparison</p>
                        <div class="h-80">
                            <ComparisonRadarChart :data="radarData" />
                        </div>
                        <div class="flex justify-center gap-4 mt-2">
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 bg-blue-500 rounded-sm"></div>
                                <span class="text-xs text-gray-600">Current</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 bg-green-500 rounded-sm"></div>
                                <span class="text-xs text-gray-600">Target</span>
                            </div>
                        </div>
                    </div>


                    <!-- Gap Analysis -->

                    <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <div class="mb-6">
                            <h3 class="font-bold text-gray-900">Gap Analysis</h3>
                            <p class="text-sm text-gray-500 mt-1">Points needed to reach target</p>
                        </div>

                        <div class="flex gap-4">
                            <!-- Y-Axis Labels -->
                            <div
                                class="flex flex-col justify-between pb-6 w-20 text-xs font-semibold text-gray-600 text-right pr-2 space-y-4">
                                <div v-for="pillar in selectedGoal.pillars" :key="pillar.name"
                                    class="h-6 flex items-center justify-end">
                                    {{ pillar.name }}
                                </div>
                            </div>

                            <!-- Chart Area -->
                            <div class="flex-1 relative">
                                <!-- Grid Lines -->
                                <div
                                    class="absolute inset-0 flex justify-between pointer-events-none pb-6 pl-0 border-l border-gray-100 border-r">
                                    <div class="w-px h-full bg-gray-100 border-r border-dashed border-gray-300"></div>
                                    <div class="w-px h-full bg-gray-100 border-r border-dashed border-gray-300"></div>
                                    <div class="w-px h-full bg-gray-100 border-r border-dashed border-gray-300"></div>
                                    <div class="w-px h-full bg-gray-100 border-r border-dashed border-gray-300"></div>
                                    <!-- 0 and 100 are handled by container borders/spacing if needed, or explicitly added -->
                                </div>

                                <!-- Bars -->
                                <div class="flex flex-col justify-between space-y-4 relative z-10">
                                    <div v-for="pillar in selectedGoal.pillars" :key="pillar.name"
                                        class="h-6 w-full bg-gray-100 rounded-r-sm relative group cursor-help">
                                        <div class="h-full bg-blue-500 rounded-r-md transition-all duration-500"
                                            :style="{ width: `${pillar.score}%` }"></div>

                                        <!-- Tooltip -->
                                        <div
                                            class="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 hidden group-hover:block z-50 min-w-[120px] pointer-events-none">
                                            <div
                                                class="bg-white rounded-lg shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-gray-100 p-3 text-sm">
                                                <div
                                                    class="font-semibold text-gray-900 mb-1.5 border-b border-gray-50 pb-1">
                                                    {{ pillar.name }}</div>
                                                <div class="flex flex-col gap-1">
                                                    <span class="text-blue-600 font-medium whitespace-nowrap">current :
                                                        {{ pillar.score
                                                        }}</span>
                                                    <span class="text-blue-800 font-medium whitespace-nowrap">target :
                                                        {{ pillar.target }}</span>
                                                    <span class="text-gray-400 whitespace-nowrap">gap : {{ Math.max(0,
                                                        pillar.target - pillar.score)
                                                    }}</span>
                                                </div>
                                            </div>
                                            <!-- Arrow -->
                                            <div
                                                class="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white drop-shadow-sm">
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- X-Axis Labels -->
                                <div
                                    class="flex justify-between text-xs text-gray-400 mt-2 absolute w-full bottom-0 translate-y-full">
                                    <span>0</span>
                                    <span>25</span>
                                    <span>50</span>
                                    <span>75</span>
                                    <span>100</span>
                                </div>
                            </div>
                        </div>
                        <!-- Spacer for X-Axis labels -->
                        <div class="h-6"></div>
                    </div>

                    <!-- Priority Actions -->
                    <div class="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                        <h3 class="font-bold text-gray-900 mb-4">Priority Actions</h3>
                        <p class="text-sm text-gray-500 mb-4">Focus areas to reach your goal</p>
                        <div class="space-y-3">
                            <div v-for="(action, idx) in selectedGoal.actions" :key="idx"
                                class="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div :class="[
                                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 shadow-sm',
                                    idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-orange-400' : 'bg-blue-500'
                                ]">
                                    {{ idx + 1 }}
                                </div>
                                <div>
                                    <div class="font-bold text-gray-900 text-sm mb-0.5">{{ action.title }}</div>
                                    <div class="text-xs text-gray-500 font-medium">+{{ action.points }} points needed
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else
                    class="bg-white rounded-lg p-12 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                    <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-8 h-8 text-gray-400">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900">Select a Goal</h3>
                    <p class="text-sm text-gray-500 max-w-xs mt-2">Click on a goal to view detailed progress and gap
                        analysis</p>
                </div>
            </div>
        </div>
        <CreateGoalModal :is-open="showCreateGoalModal" @close="showCreateGoalModal = false"
            @create="handleCreateGoal" />

        <SmeGoalProofModal :is-open="showProofModal" :goal-id="goalIdToComplete" @close="showProofModal = false"
            @confirm="submitProofAndAchieve" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useConfirm } from '~/composables/useConfirm'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { FlagIcon, BoltIcon, EllipsisHorizontalIcon, CheckCircleIcon, ClockIcon, TrashIcon } from '@heroicons/vue/24/outline'
import ComparisonRadarChart from '~/components/DashboardComparisonRadarChart.vue'
import CreateGoalModal from '~/components/SmeCreateGoalModal.vue'
import SmeGoalProofModal from '~/components/SmeGoalProofModal.vue'
import { useAuthStore } from '~/stores/auth.store'
import { useToast } from '~/composables/useToast'

interface Pillar {
    name: string
    score: number
    target: number
}

interface Action {
    title: string
    points: number
}

interface Gap {
    pillar: string
    current: number
}

interface Goal {
    id: number
    title: string
    status: string
    description: string
    targetScore: number
    currentScore: number
    deadline: string
    overdue: number | null
    progress: number
    pillars: Pillar[]
    gaps: Gap[]
    actions: Action[]
    createdBy: string
    investorName?: string
    investorCompany?: string
    rejectionNote?: string
}

definePageMeta({
    layout: 'default',
    middleware: ['auth', 'sme']
})

const authStore = useAuthStore()
const activeFilter = ref('Active (0)')
const filters = ref(['Active (0)', 'Pending Review (0)', 'Achieved (0)'])
const creatorFilters = ref(['All Goals', 'Assigned by Investor', 'Self-Created'])
const activeCreatorFilter = ref('All Goals')
const selectedGoal = ref<Goal | null>(null)
const showCreateGoalModal = ref(false)
const showProofModal = ref(false)
const goalIdToComplete = ref<number | string>('')
const { ask } = useConfirm()
const toast = useToast()
const goals = ref<Goal[]>([])
const loading = ref(false)

const currentSmeId = computed(() => authStore.user?.company?.id || 2)

const fetchGoals = async () => {
    loading.value = true
    const api = useApi()
    try {
        const data = await api<any[]>('/sme/goals')
        // Data Mapping
        goals.value = (data || []).map((g: any) => {
            const dueDate = g.due_date ? new Date(g.due_date) : null
            const now = new Date()
            let overdue: number | null = null
            let formattedDate = 'No date'

            if (dueDate) {
                formattedDate = dueDate.toLocaleDateString()
                const diffDays = Math.ceil((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
                if (diffDays > 0) {
                    overdue = diffDays
                }
            }

            let status = g.status || 'Active'
            if (status === 'Not Started') status = 'Active'

            let mappedPillars = []
            if (g.pillar_targets && Array.isArray(g.pillar_targets)) {
                mappedPillars = g.pillar_targets.map((pt: any) => ({
                    name: pt.name,
                    score: pt.currentScore || 0,
                    target: pt.targetScore || 0
                }))
            }

            return {
                id: g.id,
                title: g.title,
                status: status,
                description: g.description,
                targetScore: parseFloat(g.target_score) || 0,
                currentScore: parseFloat(g.current_score) || 0,
                deadline: formattedDate,
                overdue: overdue,
                progress: (status.toLowerCase() === 'achieved' || status.toLowerCase() === 'completed') ? 100 : (g.progress_percentage || 0),
                pillars: mappedPillars,
                gaps: [],
                actions: [],
                createdBy: g.created_by_role || (g.created_by === currentSmeId.value ? 'sme' : 'investor'),
                investorName: g.investor_name,
                investorCompany: g.investor_company,
                rejectionNote: g.rejection_note
            }
        })

        // Auto-select first goal if none selected
        if (goals.value.length > 0 && !selectedGoal.value) {
            const first = goals.value[0]
            if (first) selectGoal(first)
        } else if (selectedGoal.value) {
            // Update selected goal from new data
            const updated = goals.value.find(g => g.id === selectedGoal.value?.id)
            if (updated) selectGoal(updated)
        }

        updateFilterCounts()
    } catch (e) {
        console.error('Failed to fetch goals', e)
    } finally {
        loading.value = false
    }
}

const updateFilterCounts = () => {
    const active = goals.value.filter(g => ['active', 'paused', 'in progress', 'not started'].includes(g.status?.toLowerCase())).length
    const pending = goals.value.filter(g => g.status?.toLowerCase() === 'pending verification').length
    const achieved = goals.value.filter(g => ['achieved', 'completed'].includes(g.status?.toLowerCase())).length

    filters.value[0] = `Active (${active})`
    filters.value[1] = `Pending Review (${pending})`
    filters.value[2] = `Achieved (${achieved})`

    // Maintain active filter if possible
    if (activeFilter.value.startsWith('Active')) activeFilter.value = filters.value[0]
    else if (activeFilter.value.startsWith('Pending')) activeFilter.value = filters.value[1]
    else if (activeFilter.value.startsWith('Achieved')) activeFilter.value = filters.value[2]
}

const selectGoal = async (goal: Goal) => {
    selectedGoal.value = { ...goal }
    const api = useApi()
    try {
        const detail = await api<any>(`/sme/goals/${goal.id}`)
        if (detail && selectedGoal.value?.id === goal.id) {

            // Reconcile current pillars from details with target pillars
            const currentPillars = detail.current_pillars || []
            const targetPillars = detail.goal_pillars || []

            const mappedPillars = targetPillars.map((tp: any) => {
                const current = currentPillars.find((cp: any) => cp.name === tp.name || cp.pillar_name === tp.name)
                return {
                    name: tp.name,
                    score: current ? (current.score || 0) : (tp.currentScore || 0),
                    target: tp.targetScore || 0
                }
            })

            // Generate actions implicitly based on gaps
            const actions = mappedPillars
                .map((p: any) => ({ title: `Improve ${p.name}`, points: Math.max(0, p.target - p.score) }))
                .filter((a: any) => a.points > 0)
                .sort((a: any, b: any) => b.points - a.points)
                .slice(0, 3)

            selectedGoal.value = {
                ...selectedGoal.value,
                pillars: mappedPillars,
                actions: actions
            }
        }
    } catch (e) {
        console.error('Failed to load goal details', e)
    }
}

const handleCreateGoal = async (goalData: any) => {
    const api = useApi()
    
    // Map frontend modal structure to backend structure
    const payload = {
        title: goalData.title,
        description: goalData.description,
        targetDate: goalData.deadline,
        targetScore: goalData.targetScore,
        pillarTargets: goalData.pillars?.map((p: any) => ({
            name: p.name,
            currentScore: p.score,
            targetScore: p.target
        }))
    }

    try {
        const result = await api<any>('/sme/goals', {
            method: 'POST',
            body: payload
        })

        if (result) {
            await fetchGoals()
            showCreateGoalModal.value = false
            toast.success('Goal created successfully!')
        }
    } catch (e: any) {
        console.error('Failed to create goal', e)
        toast.error(e.data?.message || 'Failed to save goal. Please try again.')
    }
}

const openProofModal = (id: number) => {
    goalIdToComplete.value = id
    showProofModal.value = true
}

const submitProofAndAchieve = async (payload: { id: number, proofNote: string, proofDocument: any }) => {
    const confirmed = await ask({
        title: 'Submit Evidence?',
        message: 'Are you sure you want to submit this evidence for verification? The goal status will be set to Pending Verification.',
        confirmText: 'Submit Now',
        type: 'info'
    })
    if (!confirmed) return

    loading.value = true
    const api = useApi()

    // Use FormData for file upload support
    const formData = new FormData()
    formData.append('_method', 'PATCH') // Workaround for PHP PATCH with multipart/form-data
    formData.append('status', 'Pending Verification')
    formData.append('proof_note', payload.proofNote)

    if (payload.proofDocument instanceof File) {
        formData.append('proof_document', payload.proofDocument)
    }

    try {
        await api(`/sme/goals/${payload.id}`, {
            method: 'POST', // POST with _method PATCH
            body: formData
        })

        await fetchGoals()
        showProofModal.value = false
        toast.success('Evidence submitted successfully!')
    } catch (e: any) {
        console.error('Failed to update goal', e)
        toast.error(e.data?.message || 'Failed to update goal status.')
    } finally {
        loading.value = false
    }
}

const pauseGoal = async (id: number, currentStatus: string) => {
    loading.value = true
    const api = useApi()
    try {
        const newStatus = ['Paused', 'PAUSED'].includes(currentStatus) ? 'ACTIVE' : 'PAUSED'
        await api(`/sme/goals/${id}`, {
            method: 'PATCH',
            body: { status: newStatus }
        })

        await fetchGoals()
        toast.success(newStatus === 'PAUSED' ? 'Goal paused successfully.' : 'Goal resumed successfully.')
    } catch (e: any) {
        console.error('Failed to update goal status', e)
        toast.error(e.data?.message || 'Failed to update goal status.')
    } finally {
        loading.value = false
    }
}

const deleteGoal = async (id: number) => {
    const confirmed = await ask({
        title: 'Delete Goal?',
        message: 'Are you sure you want to delete this goal? This action will remove it from your tracker and cannot be undone.',
        confirmText: 'Delete Goal',
        type: 'danger'
    })
    if (!confirmed) return

    loading.value = true
    const api = useApi()
    try {
        await api(`/sme/goals/${id}`, {
            method: 'DELETE'
        })

        await fetchGoals()
        if (selectedGoal.value?.id === id) {
            selectedGoal.value = goals.value[0] || null
        }
        toast.success('Goal deleted successfully.')
    } catch (e: any) {
        console.error('Failed to delete goal', e)
        toast.error(e.data?.message || 'Failed to delete goal.')
    } finally {
        loading.value = false
    }
}


onMounted(() => {
    fetchGoals()
})

const filteredGoals = computed(() => {
    let result = goals.value

    // 1. Status Filter
    if (activeFilter.value.startsWith('Active')) {
        result = result.filter(g => ['active', 'paused', 'in progress', 'not started'].includes(g.status?.toLowerCase()))
    } else if (activeFilter.value.startsWith('Pending')) {
        result = result.filter(g => g.status?.toLowerCase() === 'pending verification')
    } else if (activeFilter.value.startsWith('Achieved')) {
        result = result.filter(g => ['achieved', 'completed'].includes(g.status?.toLowerCase()))
    }

    // 2. Creator Filter
    if (activeCreatorFilter.value === 'Assigned by Investor') {
        result = result.filter(g => g.createdBy === 'investor')
    } else if (activeCreatorFilter.value === 'Self-Created') {
        result = result.filter(g => g.createdBy === 'sme')
    }

    return result
})

watch(filteredGoals, (newGoals) => {
    if (newGoals.length === 0) {
        selectedGoal.value = null
    } else if (selectedGoal.value && !newGoals.some(g => g.id === selectedGoal.value?.id)) {
        if (newGoals[0]) selectGoal(newGoals[0])
    }
})

const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'active':
        case 'active':
        case 'in progress':
        case 'not started':
            return 'bg-blue-100 text-blue-700'
        case 'achieved':
        case 'completed':
            return 'bg-emerald-100 text-emerald-700'
        case 'pending verification':
            return 'bg-purple-100 text-purple-700'
        case 'paused':
            return 'bg-orange-100 text-orange-700'
        default:
            return 'bg-gray-100 text-gray-700'
    }
}

const avgProgress = computed(() => {
    if (goals.value.length === 0) return 0
    const sum = goals.value.reduce((acc, g) => acc + g.progress, 0)
    return Math.round(sum / goals.value.length)
})

const radarData = computed(() => {
    if (!selectedGoal.value || !selectedGoal.value.pillars || selectedGoal.value.pillars.length === 0) return null
    return {
        labels: selectedGoal.value.pillars.map((p: any) => p.name),
        datasets: [
            {
                label: 'Current',
                data: selectedGoal.value.pillars.map((p: any) => p.score),
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3B82F6',
                pointBackgroundColor: '#3B82F6',
                pointBorderColor: '#fff',
            },
            {
                label: 'Target',
                data: selectedGoal.value.pillars.map((p: any) => p.target),
                backgroundColor: 'transparent',
                borderColor: '#10B981', // Green
                pointBackgroundColor: '#10B981',
                borderDash: [5, 5]
            }
        ]
    }
})
</script>
