```html
<template>
    <div class="space-y-6">
        <!-- Main Table Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100">
            <!-- Toolbar -->
            <div class="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                <!-- Search -->
                <div class="relative w-72">
                    <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input v-model="filters.search" type="text" placeholder="Search SMEs..."
                        class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                </div>

                <!-- Filters & Actions -->
                <div class="flex items-center gap-3">
                    <!-- Sector Filter -->
                    <Listbox v-model="filters.industry" as="div" class="relative">
                        <ListboxButton
                            class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer min-w-[140px] justify-between">
                            {{ filters.industry }}
                            <ChevronDownIcon class="w-4 h-4 text-gray-400" />
                        </ListboxButton>
                        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
                            leave-to-class="opacity-0">
                            <ListboxOptions
                                class="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-lg shadow-lg z-20 py-1 focus:outline-none">
                                <ListboxOption v-for="sector in sectors" :key="sector" :value="sector" as="template"
                                    v-slot="{ active, selected }">
                                    <li :class="[
                                        active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900',
                                        'relative cursor-pointer select-none py-2 pl-10 pr-4 text-sm'
                                    ]">
                                        <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                                            sector }}</span>
                                        <span v-if="selected"
                                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                            <CheckIcon class="h-4 w-4" aria-hidden="true" />
                                        </span>
                                    </li>
                                </ListboxOption>
                            </ListboxOptions>
                        </transition>
                    </Listbox>

                    <!-- Risk Filter -->
                    <Listbox v-model="filters.risk" as="div" class="relative">
                        <ListboxButton
                            class="flex items-center gap-2 px-3 py-2 bg-white border border-emerald-500 rounded-lg text-sm text-gray-700 font-medium hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer min-w-[130px] justify-between shadow-sm">
                            {{ filters.risk }}
                            <ChevronDownIcon class="w-4 h-4 text-emerald-600" />
                        </ListboxButton>
                        <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
                            leave-to-class="opacity-0">
                            <ListboxOptions
                                class="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-lg z-20 py-1 focus:outline-none">
                                <ListboxOption v-for="risk in risks" :key="risk" :value="risk" as="template"
                                    v-slot="{ active, selected }">
                                    <li :class="[
                                        active ? 'bg-emerald-50 text-emerald-900' : 'text-gray-900',
                                        'relative cursor-pointer select-none py-2 pl-10 pr-4 text-sm'
                                    ]">
                                        <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{
                                            risk }}</span>
                                        <span v-if="selected"
                                            class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                                            <CheckIcon class="h-4 w-4" aria-hidden="true" />
                                        </span>
                                    </li>
                                </ListboxOption>
                            </ListboxOptions>
                        </transition>
                    </Listbox>

                    <button
                        class="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                        <ArrowDownTrayIcon class="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            <!-- Clean Table -->
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-gray-50/50 text-gray-500 border-b border-gray-100">
                        <tr>
                            <th class="px-6 py-4 font-medium cursor-pointer hover:text-gray-700 transition-colors select-none"
                                @click="toggleSort('name')">
                                <div class="flex items-center gap-1">
                                    SME Name
                                    <ChevronUpDownIcon class="w-3 h-3 opacity-40"
                                        :class="{ 'opacity-100 text-emerald-600': sortField === 'name' }" />
                                </div>
                            </th>
                            <th class="px-6 py-4 font-medium">Sector</th>
                            <th class="px-6 py-4 font-medium">Location</th>
                            <th class="px-6 py-4 font-medium cursor-pointer hover:text-gray-700 transition-colors select-none"
                                @click="toggleSort('score')">
                                <div class="flex items-center gap-1">
                                    Readiness
                                    <ChevronUpDownIcon class="w-3 h-3 opacity-40"
                                        :class="{ 'opacity-100 text-emerald-600': sortField === 'score' }" />
                                </div>
                            </th>
                            <th class="px-6 py-4 font-medium text-center">Financial Risk</th>
                            <th class="px-6 py-4 font-medium cursor-pointer hover:text-gray-700 transition-colors select-none"
                                @click="toggleSort('growthRate')">
                                <div class="flex items-center gap-1">
                                    Growth
                                    <ChevronUpDownIcon class="w-3 h-3 opacity-40"
                                        :class="{ 'opacity-100 text-emerald-600': sortField === 'growthRate' }" />
                                </div>
                            </th>
                            <th class="px-6 py-4 font-medium">Status</th>
                            <th class="px-6 py-4 font-medium text-right">Last Updated</th>
                            <th class="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="sme in startups" :key="sme.id"
                            class="group hover:bg-gray-50/50 transition-colors cursor-pointer"
                            @click="openQuickView(sme)">
                            <td class="px-6 py-4 font-medium text-gray-900">{{ sme.name }}</td>
                            <td class="px-6 py-4 text-gray-600">{{ sme.industry }}</td>
                            <td class="px-6 py-4 text-gray-600">{{ sme.location }}</td>
                            <td class="px-6 py-4 font-bold" :class="getScoreTextClass(sme.score)">
                                {{ sme.score }}
                            </td>
                            <td class="px-6 py-4">
                                <!-- Risk Dot -->
                                <div class="flex items-center justify-center">
                                    <div class="w-2.5 h-2.5 rounded-full" :class="getRiskDotClass(sme.financialRisk)">
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 font-medium text-gray-900">{{ sme.growthRate }}%</td>
                            <td class="px-6 py-4">
                                <span class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                                    :class="getStatusBadgeClass(sme.status)">
                                    {{ sme.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right text-gray-500 text-xs">{{ sme.lastUpdated }}</td>
                            <td class="px-6 py-4 text-right">
                                <button @click.stop="router.push('/sme/' + sme.id)"
                                    class="text-gray-400 hover:text-emerald-600 transition-colors p-1 rounded hover:bg-emerald-50"
                                    title="View Full Details">
                                    <ArrowTopRightOnSquareIcon class="w-4 h-4" />
                                </button>
                            </td>
                        </tr>

                        <!-- Empty State -->
                        <tr v-if="startups.length === 0">
                            <td colspan="9" class="px-6 py-12 text-center text-gray-500">
                                <p>No SMEs found matching your filters.</p>
                                <button @click="resetFilters"
                                    class="mt-2 text-emerald-600 hover:underline text-sm">Clear Filters</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Footer / Pagination (Mock) -->
            <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <div>Showing {{ startups.length }} results</div>
                <div class="flex gap-2">
                    <button class="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-50" disabled>Previous</button>
                    <button class="px-2 py-1 rounded hover:bg-gray-100">Next</button>
                </div>
            </div>
        </div>

        <!-- Quick View Modal (Removed internal handling, now emitted) -->

        <!-- Create Goal Modal -->
        <Teleport to="body">
            <CreateGoalModal :is-open="isCreateGoalOpen" :sme-list="smeList" :prefilled-sme="prefilledSme"
                @close="closeCreateGoalModal" @create="handleGoalCreated" />
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
    MagnifyingGlassIcon,
    StarIcon,
    ArrowRightIcon,
    ChevronUpDownIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    ChevronRightIcon,
    ArrowTopRightOnSquareIcon,
    ChevronDownIcon,
    CheckIcon
} from '@heroicons/vue/24/outline'
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from '@headlessui/vue'
import { useInvestorStore } from '~/stores/investor.store'
import CreateGoalModal from '~/components/InvestorCreateGoalModal.vue'
import { getReadinessColors, getRiskColors, getStatusColors } from '~/utils/sme-data'

const router = useRouter()
const store = useInvestorStore()

const emit = defineEmits(['sme-click'])

const filters = ref({
    search: store.filters.search,
    industry: store.filters.industry,
    stage: store.filters.stage,
    minScore: store.filters.minScore,
    risk: store.filters.risk || 'All Risks'
})

const sectors = ['All Sectors', 'Agriculture', 'Technology', 'Healthcare', 'CleanTech']
const risks = ['All Risks', 'Low Risk', 'Medium Risk', 'High Risk']

// Sync local state to store filter
watch(filters, (newVal) => {
    store.setFilters(newVal)
}, { deep: true })

const resetFilters = () => {
    filters.value = {
        search: '',
        industry: 'All Sectors',
        stage: 'All Stages',
        minScore: 0,
        risk: 'All Risks'
    }
}

// Sorting State
const sortField = ref<string | null>(null)
const sortDirection = ref<'asc' | 'desc'>('desc')

const toggleSort = (field: string) => {
    if (sortField.value === field) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortField.value = field
        sortDirection.value = 'desc' // Default to descending (highest first)
    }
}

const startups = computed(() => {
    const list = [...store.filteredDealFlow]
    if (!sortField.value) return list

    return list.sort((a, b) => { // 
        if (!sortField.value) return 0

        const field = sortField.value as keyof typeof a
        let valA = a[field]
        let valB = b[field]

        if (valA === undefined || valB === undefined) return 0

        // Numeric Comparison (including growthRate)
        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortDirection.value === 'asc' ? valA - valB : valB - valA
        }

        // Generic String Comparison
        if (typeof valA === 'string' && typeof valB === 'string') {
            return sortDirection.value === 'asc'
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA)
        }

        // Numeric Comparison
        if (valA < valB) return sortDirection.value === 'asc' ? -1 : 1
        if (valA > valB) return sortDirection.value === 'asc' ? 1 : -1
        return 0
    })
})

const isCreateGoalOpen = ref(false)
const prefilledSme = ref(null)

const smeList = computed(() => store.dealFlow.map(sme => ({ id: sme.id, name: sme.name })))

const openQuickView = (sme: any) => {
    emit('sme-click', sme)
}

const handleCreateGoal = () => {
    // Pre-fill the modal with the selected SME data
    // This function might need adjustment if it was relying on selectedSme referenc
    // For now we assume Create Modal is triggered differently or we pass data
    // But wait, handleCreateGoal was called from SmeSummaryModal event.
    // Since SmeSummaryModal is gone, this might be dead code HERE.
    // The parent dashboard/portfolio will handle create goal events from their modals.
    isCreateGoalOpen.value = true
}

const closeCreateGoalModal = () => {
    isCreateGoalOpen.value = false
    prefilledSme.value = null
}

const handleGoalCreated = (goalData: any) => {
    // Handle the created goal (could save to store, show notification, etc.)
    console.log('Goal created:', goalData)
    // Optionally navigate to the portfolio goals tab
    router.push('/investor/portfolio?tab=goals')
}

const isInWatchlist = (id: string | number) => store.watchlist.includes(id)

const toggleWatchlist = (id: string | number) => store.toggleWatchlist(id)

// Helpers for Clean UI
const getScoreTextClass = (score: number) => {
    if (score >= 70) return 'text-emerald-600'
    if (score >= 40) return 'text-amber-500'
    return 'text-rose-500'
}

const getRiskDotClass = (risk: string) => {
    switch (risk?.toLowerCase()) {
        case 'low': return 'bg-emerald-500'
        case 'medium': return 'bg-amber-500'
        case 'high': return 'bg-rose-500'
        default: return 'bg-gray-300'
    }
}

const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
        case 'active': return 'bg-emerald-50 text-emerald-700'
        case 'pending': return 'bg-orange-50 text-orange-700'
        default: return 'bg-gray-50 text-gray-600'
    }
}
</script>
