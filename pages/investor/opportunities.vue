<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900 text-teal-600">Investment Programs</h1>
                    <p class="text-gray-500 mt-1">Discover and enroll in investment readiness programs</p>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto custom-scrollbar px-8 py-8 w-full">
            <div class="max-w-[1600px] mx-auto space-y-8">
                <!-- KPI Stats -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total Programs" :value="stats?.total || 0" :icon="FolderIcon" />
                    <StatCard title="Active Programs" :value="stats?.active || 0" :icon="ChartBarIcon" trend="+1"
                        :trendIsPositive="true" />
                    <StatCard title="SMEs Enrolled" :value="stats?.enrolled || 0" :icon="UsersIcon" />
                    <StatCard title="Avg. Score" :value="stats?.avgScore || 0" :icon="ClipboardDocumentCheckIcon" />
                </div>

                <!-- Search & Filters -->
                <div class="flex items-center gap-4">
                    <div class="relative flex-1">
                        <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input v-model="searchQuery" type="text" placeholder="Search programs..."
                            class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-sm" />
                    </div>

                    <!-- View Toggle -->
                    <div class="flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                        <button @click="viewMode = 'grid'" :class="[
                            'px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium',
                            viewMode === 'grid' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                        ]">
                            <Squares2X2Icon class="w-4 h-4" />
                            Grid
                        </button>
                        <button @click="viewMode = 'list'" :class="[
                            'px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium',
                            viewMode === 'list' ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                        ]">
                            <ListBulletIcon class="w-4 h-4" />
                            List
                        </button>
                    </div>
                </div>

                <!-- Programs -->
                <div v-if="loading && !programs.length" class="text-center py-12">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                </div>

                <div v-else-if="programs.length > 0">
                    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <ProgramCard v-for="program in programs" :key="program.id" :program="program"
                            @view="handleViewProgram" @discuss="handleDiscussProgram" @enroll="handleEnrollProgram" />
                    </div>
                    <div v-else class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <div class="overflow-x-auto custom-scrollbar">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-gray-50/50 border-b border-gray-200">
                                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Program</th>
                                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">SMEs</th>
                                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Avg Score</th>
                                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Progress</th>
                                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                        <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr v-for="program in programs" :key="program.id" class="group hover:bg-gray-50/50 transition-colors">
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-3">
                                                <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                                                    {{ program.name?.charAt(0) }}
                                                </div>
                                                <div>
                                                    <div class="text-sm font-bold text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-1 truncate max-w-[300px]">{{ program.name }}</div>
                                                    <div class="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-[200px]">{{ program.description }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-center">
                                            <span class="text-sm font-bold text-gray-900">{{ program.smesCount ?? 0 }}</span>
                                        </td>
                                        <td class="px-6 py-4 text-center">
                                            <span class="text-sm font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">{{ program.avgScore ?? 0 }}</span>
                                        </td>
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-3">
                                                <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[80px]">
                                                    <div class="h-full bg-teal-500 rounded-full transition-all duration-700" :style="{ width: `${program.progress ?? program.completion ?? 0}%` }"></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4">
                                            <span :class="[
                                                'px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap',
                                                program.status === 'Active' || program.status === 'Published' ? 'bg-green-100 text-green-700 border-green-200' : 
                                                program.status === 'Finished' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                                            ]">{{ program.status }}</span>
                                        </td>
                                        <td class="px-6 py-4 text-right">
                                            <div class="flex items-center justify-end gap-1.5">
                                                <button @click="handleViewProgram(program)" class="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all" title="View Details">
                                                    <EyeIcon class="w-4 h-4" />
                                                </button>
                                                <button @click="handleDiscussProgram(program)" class="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all" title="Open Discussion">
                                                    <ChatBubbleLeftRightIcon class="w-4 h-4" />
                                                </button>
                                                <button v-if="!program.isEnrolled && !program.isEnrollmentClosed && !program.isFinished" @click="handleEnrollProgram(program.id)" class="px-3 py-1.5 text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-all text-xs font-bold ml-2">
                                                    Enroll Now
                                                </button>
                                                <div v-else-if="!program.isEnrolled && (program.isEnrollmentClosed || program.isFinished)" class="px-2 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100 ml-2 whitespace-nowrap">
                                                    {{ program.isFinished ? 'Finished' : 'Closed' }}
                                                </div>
                                                <div v-else class="px-2 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-bold border border-green-100 flex items-center gap-1.5 ml-2 whitespace-nowrap">
                                                    <CheckCircleIcon class="w-3.5 h-3.5" /> Enrolled
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>


        <!-- View Details Slide-Over -->
        <Teleport to="body">
            <div v-if="viewingProgram" class="fixed inset-0 z-50 flex">
                <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="viewingProgram = null"></div>
                <div class="relative ml-auto w-full max-w-lg bg-white shadow-2xl flex flex-col h-full">
                    <!-- Header -->
                    <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                                <span class="text-teal-700 font-bold text-lg">{{ viewingProgram.name?.charAt(0) || 'P'
                                    }}</span>
                            </div>
                            <div>
                                <h2 class="font-bold text-gray-900 text-lg">{{ viewingProgram.name }}</h2>
                                <span
                                    :class="viewingProgram.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                                    class="text-xs font-semibold px-2 py-0.5 rounded-full">{{ viewingProgram.status
                                    }}</span>
                            </div>
                        </div>
                        <button @click="viewingProgram = null"
                            class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <XMarkIcon class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="flex-1 overflow-y-auto p-6 space-y-6">
                        <!-- Description -->
                        <div>
                            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description
                            </h3>
                            <p class="text-sm text-gray-700 leading-relaxed">
                                <span v-if="viewingProgram?.description">{{ viewingProgram.description }}</span>
                                <span v-else>No description provided.</span>
                            </p>
                        </div>

                        <!-- Stats Grid -->
                        <div class="grid grid-cols-3 gap-4">
                            <div class="bg-gray-50 rounded-xl p-4 text-center">
                                <div class="text-2xl font-bold text-gray-900">{{ viewingProgram?.smesCount || 0 }}
                                </div>
                                <div class="text-xs text-gray-500 mt-1 font-medium">SMEs Enrolled</div>
                            </div>
                            <div class="bg-gray-50 rounded-xl p-4 text-center">
                                <div class="text-2xl font-bold text-gray-900">{{ viewingProgram?.avgScore || 0 }}</div>
                                <div class="text-xs text-gray-500 mt-1 font-medium">Avg Score</div>
                            </div>
                            <div class="bg-gray-50 rounded-xl p-4 text-center">
                                <div class="text-2xl font-bold text-gray-900">{{ viewingProgram?.progress || 0 }}%</div>
                                <div class="text-xs text-gray-500 mt-1 font-medium">Completion</div>
                            </div>
                        </div>

                        <!-- Progress Bar -->
                        <div>
                            <div class="flex justify-between text-xs mb-2">
                                <span class="text-gray-500 font-medium">Overall Progress</span>
                                <span class="font-semibold text-gray-900">{{ viewingProgram?.progress || 0 }}%</span>
                            </div>
                            <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div class="h-full bg-teal-500 rounded-full transition-all duration-700"
                                    :style="{ width: `${viewingProgram?.progress || 0}%` }">
                                </div>
                            </div>
                        </div>

                        <!-- Details -->
                        <div class="space-y-3">
                            <div v-if="viewingProgram.template" class="flex items-center gap-3 text-sm">
                                <DocumentDuplicateIcon class="w-4 h-4 text-gray-400 shrink-0" />
                                <span class="text-gray-500">Template:</span>
                                <span class="font-medium text-gray-900">{{ viewingProgram.template }}</span>
                            </div>
                             <div v-if="viewingProgram.startDate || viewingProgram.endDate"
                                 class="flex items-center gap-3 text-sm">
                                 <CalendarIcon class="w-4 h-4 text-gray-400 shrink-0" />
                                 <span class="text-gray-500">Duration:</span>
                                 <span class="font-medium text-gray-900">
                                     {{ viewingProgram.startDate || '—' }} → {{ viewingProgram.endDate || '—' }}
                                 </span>
                             </div>
                             <div v-if="viewingProgram.enrollmentDeadline"
                                 class="flex items-center gap-3 text-sm">
                                 <ClockIcon class="w-4 h-4 text-gray-400 shrink-0" />
                                 <span class="text-gray-500">Enrollment Deadline:</span>
                                 <span :class="['font-medium', viewingProgram.isEnrollmentClosed ? 'text-red-500' : 'text-teal-600']">
                                     {{ viewingProgram.enrollmentDeadline.split(' ')[0] }}
                                 </span>
                             </div>
                        </div>

                        <!-- Quick Actions -->
                        <div class="border-t border-gray-100 pt-4 space-y-2">
                            <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Actions
                            </h3>
                            <button @click="handleDiscussProgram(viewingProgram); viewingProgram = null"
                                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-purple-100 hover:bg-purple-50 transition-colors text-sm font-medium text-purple-700">
                                <ChatBubbleLeftRightIcon class="w-4 h-4 text-purple-400" /> Open Discussion Thread
                            </button>
                        </div>

                        <!-- Participants Section -->
                        <div class="border-t border-gray-100 pt-6">
                            <h3
                                class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center justify-between">
                                Enrolled Participants
                                <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px]">{{
                                    investorStore.programParticipants.length }}</span>
                            </h3>

                            <ProgramParticipantList :participants="investorStore.programParticipants" :loading="investorStore.loading" />
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Program Discussion Slide-Over -->
        <Teleport to="body">
            <div v-if="discussingProgram" class="fixed inset-0 z-50 flex">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="discussingProgram = null"></div>
                <!-- Panel -->
                <div class="relative ml-auto w-full max-w-md bg-white shadow-2xl flex flex-col h-full">
                    <!-- Panel Header -->
                    <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div>
                            <h2 class="font-bold text-gray-900">{{ discussingProgram.name }}</h2>
                            <p class="text-xs text-gray-500 mt-0.5">Program Discussion Thread</p>
                        </div>
                        <button @click="discussingProgram = null"
                            class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <XMarkIcon class="w-5 h-5" />
                        </button>
                    </div>
                    <!-- Thread -->
                    <div class="flex-1 overflow-hidden">
                        <ProgramCommentThread :programId="String(discussingProgram.id)"
                            :key="String(discussingProgram.id)" />
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInvestorStore } from '~/stores/investor.store'
import { useConfirm } from '~/composables/useConfirm'
import StatCard from '~/components/AdminStatCard.vue'
import ProgramCard from '~/components/ProgramCard.vue'
import ProgramParticipantList from '~/components/ProgramParticipantList.vue'
import ProgramCommentThread from '~/components/ProgramCommentThread.vue'
import {
    PlusIcon,
    FolderIcon,
    ChartBarIcon,
    UsersIcon,
    ClipboardDocumentCheckIcon,
    MagnifyingGlassIcon,
    XMarkIcon,
    PencilSquareIcon,
    ChatBubbleLeftRightIcon,
    CalendarIcon,
    DocumentDuplicateIcon,
    Squares2X2Icon,
    ListBulletIcon,
    EyeIcon,
    CheckCircleIcon
} from '@heroicons/vue/24/outline'

const investorStore = useInvestorStore()
const { ask } = useConfirm()

const stats = computed(() => investorStore.programStats)
const loading = computed(() => investorStore.loading)
const searchQuery = ref('')
const viewingProgram = ref<any>(null)
const discussingProgram = ref<any>(null)
const viewMode = ref<'grid' | 'list'>('grid')
const router = useRouter()

// Filter programs locally for search
const programs = computed(() => {
    if (!searchQuery.value) return investorStore.programs
    const q = searchQuery.value.toLowerCase()
    return investorStore.programs.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    )
})

const handleViewProgram = (program: any) => {
    viewingProgram.value = program
    investorStore.fetchParticipants(program.id)
}

const handleDiscussProgram = (program: any) => {
    discussingProgram.value = program
}

const handleEnrollProgram = async (id: string | number) => {
    const confirmed = await ask({
        title: 'Enroll in Program?',
        message: 'Are you sure you want to enroll in this investment program? Your investor profile will be shared with the program managers.',
        confirmText: 'Yes, Enroll Now',
        type: 'info'
    })
    if (!confirmed) return

    try {
        await investorStore.enrollInProgram(id)
    } catch (e) {
        console.error('Enrollment failed', e)
    }
}

onMounted(() => {
    investorStore.fetchPrograms()
})

definePageMeta({
    layout: 'investor',
    middleware: ['auth', 'investor']
})
</script>
