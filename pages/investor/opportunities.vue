<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Program Management</h1>
                    <p class="text-gray-500 mt-1">Manage investment readiness programs and track progress</p>
                </div>
                <button @click="openCreateModal"
                    class="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2">
                    <PlusIcon class="w-4 h-4" />
                    Create Program
                </button>
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
                        @edit="handleEditProgram" @delete="handleDeleteProgram" @manage-smes="handleManageSmes" />
                </div>
            </div>
        </main>

        <CreateProgramModal :is-open="isCreateModalOpen" :loading="loading" :initial-data="editingProgram"
            @close="isCreateModalOpen = false" @create="handleCreateProgram" @update="handleUpdateProgram" />

        <ManageSmeEnrollmentModal :is-open="isManageSmesModalOpen" :program="selectedProgram"
            @close="isManageSmesModalOpen = false" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useAdminStore } from '~/stores/admin.store'
import StatCard from '~/components/AdminStatCard.vue'
import ProgramCard from '~/components/AdminProgramCard.vue'
import CreateProgramModal from '~/components/AdminCreateProgramModal.vue'
import ManageSmeEnrollmentModal from '~/components/AdminManageSmeEnrollmentModal.vue'
import {
    PlusIcon,
    FolderIcon,
    ChartBarIcon,
    UsersIcon,
    ClipboardDocumentCheckIcon,
    MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const adminStore = useAdminStore()

const stats = computed(() => adminStore.programStats)
const loading = computed(() => adminStore.loading)
const searchQuery = ref('')
const isCreateModalOpen = ref(false)
const isManageSmesModalOpen = ref(false)
const selectedProgram = ref(null)

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
