<template>
    <div class="h-full flex flex-col bg-gray-50/30">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Investment Programs</h1>
                    <p class="text-gray-500 mt-1">Accelerate your growth with curated programs and mentorship.</p>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto custom-scrollbar px-8 py-8">
            <div class="max-w-[1600px] mx-auto space-y-8">
                <!-- KPI Stats -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Total Programs" :value="stats.total" :icon="FolderIcon" />
                    <StatCard title="My Enrollments" :value="stats.enrolled" :icon="CheckCircleIcon" />
                    <StatCard title="Available Now" :value="stats.available" :icon="SparklesIcon" />
                </div>

                <!-- Search & Filters -->
                <div class="flex flex-col md:flex-row gap-6 items-center">
                    <div class="relative flex-1">
                        <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input v-model="searchQuery" type="text" placeholder="Search programs..."
                            class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-sm" />
                    </div>

                    <div class="flex gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                        <button v-for="filter in filters" :key="filter.id" @click="activeFilter = filter.id" :class="[
                            'px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all',
                            activeFilter === filter.id
                                ? 'bg-teal-600 text-white shadow-md'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        ]">
                            {{ filter.label }}
                        </button>
                    </div>
                </div>

                <!-- Programs Grid -->
                <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Skeleton loading state as in previous version but improved -->
                    <div v-for="i in 6" :key="i"
                        class="bg-white rounded-2xl p-8 border border-gray-100 shadow-md animate-pulse">
                        <div class="w-12 h-12 bg-gray-100 rounded-xl mb-6"></div>
                        <div class="h-6 bg-gray-100 rounded w-3/4 mb-4"></div>
                        <div class="h-20 bg-gray-50 rounded-xl mb-6"></div>
                        <div class="flex gap-3">
                            <div class="h-10 bg-gray-100 rounded-lg flex-1"></div>
                            <div class="h-10 bg-gray-100 rounded-lg flex-1"></div>
                        </div>
                    </div>
                </div>

                <div v-else-if="filteredPrograms.length === 0"
                    class="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                    <div class="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
                        <ArchiveBoxIcon class="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 class="text-xl font-bold text-gray-900">No programs found</h3>
                    <p class="text-gray-500 mt-2">Try adjusting your filters or search keywords.</p>
                </div>

                <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <ProgramCard v-for="program in filteredPrograms" :key="program.id" :program="program"
                        @enroll="enroll(program)" @view="handleViewDetails(program)"
                        @discuss="discussingProgram = program" />
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
                                <span :class="[
                                    'text-xs font-semibold px-2 py-0.5 rounded-full',
                                    'bg-teal-100 text-teal-700'
                                ]">{{ viewingProgram.enrollmentStatus === 'None' ? 'Open' :
                                    viewingProgram.enrollmentStatus }}</span>
                            </div>
                        </div>
                        <button @click="viewingProgram = null"
                            class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <XMarkIcon class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                        <!-- Tabs Navigation -->
                        <div class="flex items-center gap-8 px-8 border-b border-gray-100 bg-white sticky top-0 z-10 pt-4">
                            <button @click="activeSlideTab = 'general'"
                                :class="activeSlideTab === 'general' ? 'text-teal-600 border-teal-600' : 'text-gray-500 border-transparent hover:text-gray-700'"
                                class="pb-4 text-xs font-bold border-b-2 transition-colors uppercase tracking-widest">
                                General Info
                            </button>
                            <button @click="activeSlideTab = 'participants'"
                                :class="activeSlideTab === 'participants' ? 'text-teal-600 border-teal-600' : 'text-gray-500 border-transparent hover:text-gray-700'"
                                class="pb-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 uppercase tracking-widest">
                                Participants
                                <span class="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg text-[10px]">{{ viewingProgram.smesCount ?? 0 }}</span>
                            </button>
                        </div>

                        <div class="p-8 space-y-8 flex-1">
                            <!-- General Info Tab -->
                            <div v-if="activeSlideTab === 'general'" class="space-y-8 animate-in fade-in duration-300">
                                <!-- Description -->
                                <div>
                                    <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Description</h3>
                                    <p class="text-sm text-gray-700 leading-relaxed">{{ viewingProgram.description }}</p>
                                </div>

                                <!-- Progress (if enrolled) -->
                                <div v-if="viewingProgram.enrollmentStatus !== 'None' && viewingProgram.enrollmentStatus !== 'Applied'">
                                    <div class="flex justify-between text-[10px] mb-3 uppercase tracking-widest">
                                        <span class="text-gray-400 font-bold">Overall Program Progress</span>
                                        <span class="font-bold text-teal-600">{{ viewingProgram.progress || 0 }}%</span>
                                    </div>
                                    <div class="h-2.5 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                                        <div class="h-full bg-teal-500 rounded-full transition-all duration-700 shadow-sm"
                                            :style="{ width: `${viewingProgram.progress || 0}%` }"></div>
                                    </div>
                                </div>

                                <!-- Details Grid -->
                                <div class="grid grid-cols-1 gap-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50">
                                    <div class="flex items-center gap-4 text-sm text-gray-600">
                                        <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                                            <GlobeAltIcon class="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sector</span>
                                            <span class="text-gray-900 font-bold">{{ viewingProgram.sector || 'General' }}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-4 text-sm text-gray-600">
                                        <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                                            <CurrencyDollarIcon class="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Investment</span>
                                            <span class="text-gray-900 font-bold">{{ viewingProgram.investment_amount || 'TBA' }}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-4 text-sm text-gray-600">
                                        <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                                            <CalendarIcon class="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timeline</span>
                                            <span class="text-gray-900 font-bold">
                                                {{ viewingProgram.startDate ? formatDate(viewingProgram.startDate) : 'TBA' }}
                                                <span v-if="viewingProgram.endDate" class="text-gray-300 mx-1">→</span>
                                                <span v-if="viewingProgram.endDate">{{ formatDate(viewingProgram.endDate) }}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div v-if="viewingProgram.templateName" class="flex items-center gap-4 text-sm text-gray-600">
                                        <div class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                                            <DocumentDuplicateIcon class="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div class="flex flex-col">
                                            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Assessment Framework</span>
                                            <span class="text-gray-900 font-bold">{{ viewingProgram.templateName }}</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Benefits -->
                                <div v-if="viewingProgram.benefits?.length">
                                    <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Core Benefits</h3>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div v-for="benefit in viewingProgram.benefits" :key="benefit"
                                            class="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-teal-200 transition-colors group">
                                            <div class="w-2 h-2 rounded-full bg-teal-400 group-hover:scale-125 transition-transform"></div>
                                            <span class="text-xs font-bold text-gray-700 tracking-tight">{{ benefit }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Participants Tab -->
                            <div v-else-if="activeSlideTab === 'participants'" class="animate-in fade-in duration-300">
                                <div class="mb-6 flex items-center justify-between">
                                    <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <UserGroupIcon class="w-4 h-4" />
                                        Cohort Directory
                                    </h3>
                                    <span class="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg border border-teal-100">{{ store.participants.length }} Enrolled</span>
                                </div>

                                <div v-if="viewingProgram.enrollmentStatus === 'None' || viewingProgram.enrollmentStatus === 'Applied'"
                                    class="p-10 bg-gray-50/80 rounded-3xl border border-dashed border-gray-200 text-center flex flex-col items-center">
                                    <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm mb-6">
                                        <UserGroupIcon class="w-8 h-8 text-gray-300" />
                                    </div>
                                    <h4 class="text-sm font-bold text-gray-900 mb-2 uppercase tracking-widest">Cohort Protected</h4>
                                    <p class="text-xs text-gray-500 leading-relaxed max-w-[240px] mx-auto">
                                        Full participant details and networking options are available once your application is approved.
                                    </p>
                                </div>
                                <ProgramParticipantList v-else :participants="store.participants" :loading="store.participantsLoading" />
                            </div>
                        </div>

                        <!-- Actions (Sticky Footer) -->
                        <div class="p-8 border-t border-gray-100 bg-white sticky bottom-0 z-10 bg-white/95 backdrop-blur-md">
                            <button v-if="viewingProgram.enrollmentStatus === 'None'"
                                @click="enroll(viewingProgram); viewingProgram = null"
                                class="w-full py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-teal-600/30 active:scale-95 text-sm uppercase tracking-widest">
                                Apply for this Program
                                <ArrowRightIcon class="w-5 h-5 shadow-sm" />
                            </button>
                            <div v-else class="text-center p-5 bg-teal-50/50 rounded-2xl border border-teal-100 flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-xl bg-white border border-teal-100 flex items-center justify-center">
                                        <CheckCircleIcon class="w-6 h-6 text-teal-600" />
                                    </div>
                                    <div class="text-left">
                                        <p class="text-[10px] text-teal-600/60 font-black uppercase tracking-widest mb-0.5">Application Status</p>
                                        <p class="text-sm font-black text-teal-800 tracking-tight">{{ viewingProgram.enrollmentStatus }}</p>
                                    </div>
                                </div>
                                <div class="text-[10px] font-black text-teal-600 bg-white px-3 py-1.5 rounded-lg border border-teal-100 uppercase tracking-widest shadow-sm">
                                    Secured
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

        <!-- Program Discussion Slide-Over -->
        <Teleport to="body">
            <div v-if="discussingProgram" class="fixed inset-0 z-50 flex">
                <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="discussingProgram = null"></div>
                <div class="relative ml-auto w-full max-w-md bg-white shadow-2xl flex flex-col h-full">
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
import { ref, computed, onMounted } from 'vue'
import {
    MagnifyingGlassIcon,
    ArchiveBoxIcon,
    GlobeAltIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    FolderIcon,
    SparklesIcon,
    XMarkIcon,
    DocumentDuplicateIcon,
    UserGroupIcon
} from '@heroicons/vue/24/outline'
import { useSmeProgramStore } from '~/stores/smeProgram.store'
import { storeToRefs } from 'pinia'
import { formatDate } from '~/utils/format'
import StatCard from '~/components/AdminStatCard.vue'
import ProgramCard from '~/components/ProgramCard.vue'
import ProgramParticipantList from '~/components/ProgramParticipantList.vue'
import ProgramCommentThread from '~/components/ProgramCommentThread.vue'

const store = useSmeProgramStore()
const { programs, loading } = storeToRefs(store)

const searchQuery = ref('')
const activeFilter = ref('all')
const viewingProgram = ref<any | null>(null)
const discussingProgram = ref<any | null>(null)
const activeSlideTab = ref('general')

const filters = [
    { id: 'all', label: 'All Programs' },
    { id: 'available', label: 'Available' },
    { id: 'enrolled', label: 'My Enrollments' }
]

const stats = computed(() => {
    return {
        total: programs.value.length,
        enrolled: programs.value.filter(p => p.enrollmentStatus !== 'None').length,
        available: programs.value.filter(p => p.enrollmentStatus === 'None').length
    }
})

const filteredPrograms = computed(() => {
    return programs.value.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            (p.description && p.description.toLowerCase().includes(searchQuery.value.toLowerCase()))

        let matchesFilter = true
        if (activeFilter.value === 'available') {
            matchesFilter = p.enrollmentStatus === 'None'
        } else if (activeFilter.value === 'enrolled') {
            matchesFilter = p.enrollmentStatus !== 'None'
        }

        return matchesSearch && matchesFilter
    })
})

const fetchPrograms = async () => {
    await store.fetchPrograms()
}

const enroll = async (program: any) => {
    if (!confirm(`Are you sure you want to apply for ${program.name}?`)) return

    try {
        await store.applyToProgram(program.id)
    } catch (e) {
        console.error('Failed to enroll', e)
        alert('Failed to submit application. Please try again.')
    }
}

const handleViewDetails = async (program: any) => {
    viewingProgram.value = program
    // Clear old participants from store state first if needed or just fetch
    await store.fetchParticipants(program.id)
}

onMounted(fetchPrograms)

definePageMeta({
    layout: 'default'
})
</script>

<style scoped>
.transition-all {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
