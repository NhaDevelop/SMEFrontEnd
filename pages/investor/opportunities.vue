<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Program Management</h1>
                    <p class="text-gray-500 mt-1">Manage investment readiness programs and track progress</p>
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
                <div class="relative">
                    <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input v-model="searchQuery" type="text" placeholder="Search programs..."
                        class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-sm" />
                </div>

                <!-- Programs Grid -->
                <div v-if="loading && !programs.length" class="text-center py-12">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                </div>

                <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <ProgramCard v-for="program in programs" :key="program.id" :program="program"
                        @view="handleViewProgram" @edit="handleEditProgram" @delete="handleDeleteProgram"
                        @manage-smes="handleManageSmes" @discuss="handleDiscussProgram" />
                </div>
            </div>
        </main>

        <CreateProgramModal :is-open="isCreateModalOpen" :loading="loading" :initial-data="editingProgram"
            @close="isCreateModalOpen = false" @create="handleCreateProgram" @update="handleUpdateProgram" />

        <ManageSmeEnrollmentModal :is-open="isManageSmesModalOpen" :program="selectedProgram"
            @close="isManageSmesModalOpen = false" />

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
import { useAdminStore } from '~/stores/admin.store'
import StatCard from '~/components/AdminStatCard.vue'
import ProgramCard from '~/components/AdminProgramCard.vue'
import CreateProgramModal from '~/components/AdminCreateProgramModal.vue'
import ManageSmeEnrollmentModal from '~/components/AdminManageSmeEnrollmentModal.vue'
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
    DocumentDuplicateIcon
} from '@heroicons/vue/24/outline'

const adminStore = useAdminStore()

const stats = computed(() => adminStore.programStats)
const loading = computed(() => adminStore.loading)
const searchQuery = ref('')
const isCreateModalOpen = ref(false)
const isManageSmesModalOpen = ref(false)
const selectedProgram = ref(null)
const viewingProgram = ref<any>(null)
const discussingProgram = ref<any>(null)
const router = useRouter()

// Use the getter for filtering
const programs = computed(() => adminStore.filteredPrograms(searchQuery.value))
const editingProgram = ref(null)

const openCreateModal = () => {
    editingProgram.value = null
    isCreateModalOpen.value = true
}

const handleEditProgram = (program: any) => {
    editingProgram.value = program
    isCreateModalOpen.value = true
}

const handleManageSmes = (program: any) => {
    selectedProgram.value = program
    isManageSmesModalOpen.value = true
}

const handleViewProgram = (program: any) => {
    viewingProgram.value = program
}

const handleDiscussProgram = (program: any) => {
    discussingProgram.value = program
}

const handleCreateProgram = async (programData: any) => {
    await adminStore.createProgram(programData)
    isCreateModalOpen.value = false
}

const handleUpdateProgram = async (programData: any) => {
    await adminStore.updateProgram(programData)
    isCreateModalOpen.value = false
}

const handleDeleteProgram = async (id: string | number) => {
    if (confirm('Are you sure you want to delete this program?')) {
        await adminStore.deleteProgram(id)
    }
}

onMounted(() => {
    adminStore.fetchProgramsData()
})

definePageMeta({
    layout: 'investor',
    middleware: ['auth', 'investor']
})
</script>
