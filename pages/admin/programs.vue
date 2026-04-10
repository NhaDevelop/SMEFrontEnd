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
          class="px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center gap-2">
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
        <div class="flex items-center gap-4">
          <div class="relative flex-1">
            <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input v-model="searchQuery" type="text" placeholder="Search programs..."
              class="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white shadow-sm" />
          </div>

          <!-- View Toggle -->
          <div class="flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
            <button @click="viewMode = 'grid'" :class="[
              'px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium',
              viewMode === 'grid' ? 'bg-cyan-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
            ]">
              <Squares2X2Icon class="w-4 h-4" />
              Grid
            </button>
            <button @click="viewMode = 'list'" :class="[
              'px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium',
              viewMode === 'list' ? 'bg-cyan-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'
            ]">
              <ListBulletIcon class="w-4 h-4" />
              List
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div v-if="loading && !programs.length" class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto"></div>
        </div>

        <div v-else-if="programs.length > 0">
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ProgramCard v-for="program in programs" :key="program.id" :program="program" @edit="handleEditProgram"
              @view="handleViewProgram" @manage-smes="handleManageSmes" @delete="handleDeleteProgram"
              @discuss="handleDiscuss" />
          </div>

          <!-- List View -->
          <div v-else class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div class="overflow-x-auto custom-scrollbar">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50/50 border-b border-gray-200">
                    <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Program</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">SMEs
                    </th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                      Investors</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Avg
                      Score</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Progress</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="program in programs" :key="program.id" class="group hover:bg-gray-50/50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold text-sm shadow-sm">
                          {{ program.name?.charAt(0) }}
                        </div>
                        <div>
                          <div class="text-sm font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">{{
                            program.name }}</div>
                          <div class="text-xs text-gray-500 mt-0.5 line-clamp-1 max-w-[200px]">{{ program.description }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="text-sm font-bold text-gray-900">{{ program.smesCount ?? 0 }}</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="text-sm font-bold text-indigo-600">{{ program.investorsCount ?? 0 }}</span>
                    </td>
                    <td class="px-6 py-4 text-center">
                      <span class="text-sm font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-lg">{{ program.avgScore
                        ?? 0 }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[80px]">
                          <div class="h-full bg-green-500 rounded-full" :style="{ width: `${program.progress ?? 0}%` }">
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span :class="[
                        'px-2.5 py-1 rounded-full text-xs font-bold border',
                        ['published', 'active', 'accepted'].includes(program.status?.toLowerCase())
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : ['draft', 'review', 'pending'].includes(program.status?.toLowerCase())
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                      ]">
                        {{ program.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex items-center justify-end gap-1.5">
                        <button @click="handleViewProgram(program)"
                          class="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                          title="View Details">
                          <EyeIcon class="w-4 h-4" />
                        </button>
                        <button @click="handleEditProgram(program)"
                          class="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                          title="Edit Program">
                          <PencilSquareIcon class="w-4 h-4" />
                        </button>
                        <button @click="handleManageSmes(program)"
                          class="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-all"
                          title="Manage Enrollment">
                          <UserGroupIcon class="w-4 h-4" />
                        </button>
                        <button @click="handleDiscuss(program)"
                          class="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                          title="Open Discussion">
                          <ChatBubbleLeftRightIcon class="w-4 h-4" />
                        </button>
                        <button @click="handleDeleteProgram(program.id)"
                          class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Program">
                          <TrashIcon class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- No Data State -->
        <div v-else-if="!loading" class="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
          <FolderIcon class="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 class="text-lg font-bold text-gray-900">No programs found</h3>
          <p class="text-gray-500 mt-2">Try adjusting your search or create a new program.</p>
          <button @click="openCreateModal"
            class="mt-8 px-6 py-2.5 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 transition-all shadow-md active:scale-95 flex items-center gap-2 mx-auto">
            <PlusIcon class="w-5 h-5" />
            Create Your First Program
          </button>
        </div>
      </div>
    </main>

    <!-- Modals & Overlays -->
    <CreateProgramModal :is-open="isCreateModalOpen" :loading="loading" :initial-data="editingProgram"
      @close="isCreateModalOpen = false" @create="handleCreateProgram" @update="handleUpdateProgram" />

    <ManageSmeEnrollmentModal :is-open="isManageSmesModalOpen" :program="selectedProgram"
      @close="isManageSmesModalOpen = false" />

    <!-- View Details Slide-Over -->
    <Teleport to="body">
      <div v-if="viewingProgram" class="fixed inset-0 z-50 flex">
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" @click="viewingProgram = null"></div>
        <div
          class="relative ml-auto w-full max-w-lg bg-white shadow-2xl flex flex-col h-full transform transition-transform duration-300">
          <!-- Slideover Header -->
          <div class="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center font-bold text-cyan-600 text-xl shadow-sm">
                {{ viewingProgram.name?.charAt(0) || 'P' }}
              </div>
              <div>
                <h2 class="font-bold text-gray-900 text-xl">{{ viewingProgram.name }}</h2>
                <div class="flex items-center gap-2 mt-1">
                  <span :class="[
                    'text-xs font-bold px-2 py-0.5 rounded-full border',
                    ['published', 'active', 'accepted'].includes(viewingProgram.status?.toLowerCase())
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : ['draft', 'review', 'pending'].includes(viewingProgram.status?.toLowerCase())
                        ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                  ]">{{ viewingProgram.status }}</span>
                </div>
              </div>
            </div>
            <button @click="viewingProgram = null"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>

          <!-- Slideover Body -->
          <div class="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            <!-- Tabs Navigation -->
            <div class="flex items-center gap-8 border-b border-gray-100 mb-8">
              <button @click="activeTab = 'general'"
                :class="activeTab === 'general' ? 'text-cyan-600 border-cyan-600' : 'text-gray-500 border-transparent hover:text-gray-700'"
                class="pb-4 text-sm font-bold border-b-2 transition-colors">
                General Info
              </button>
              <button @click="activeTab = 'participants'"
                :class="activeTab === 'participants' ? 'text-cyan-600 border-cyan-600' : 'text-gray-500 border-transparent hover:text-gray-700'"
                class="pb-4 text-sm font-bold border-b-2 transition-colors flex items-center gap-2">
                Participants
                <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg text-xs">
                  {{ (viewingProgram.smesCount ?? 0) + (viewingProgram.investorsCount ?? 0) }}
                </span>
              </button>
            </div>

            <div v-if="activeTab === 'general'" class="space-y-8 animate-in fade-in duration-300">
              <!-- Description -->
              <div>
                <h3 class="text-xs font-bold text-gray-400 mb-2">Description</h3>
                <p class="text-sm text-gray-700 leading-relaxed">{{ viewingProgram.description || 'No description provided.' }}</p>
              </div>

              <!-- Stats Grid -->
              <div class="grid grid-cols-3 gap-4">
                <div class="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
                  <div class="text-2xl font-bold text-gray-900">{{ (viewingProgram.smesCount ?? 0) + (viewingProgram.investorsCount ?? 0) }}</div>
                  <div class="text-xs text-gray-500 mt-1 font-medium">Total Participants</div>
                </div>
                <div class="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
                  <div class="text-2xl font-bold text-cyan-600">{{ viewingProgram.avgScore ?? 0 }}</div>
                  <div class="text-xs text-gray-500 mt-1 font-medium">Avg Score</div>
                </div>
                <div class="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
                  <div class="text-2xl font-bold text-green-600">{{ viewingProgram.progress ?? viewingProgram.completion
                    ?? 0 }}%</div>
                  <div class="text-xs text-gray-500 mt-1 font-medium">Completion</div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest">Enrollment Progress</h3>
                  <span class="text-sm font-bold text-gray-900">{{ viewingProgram.progress ?? viewingProgram.completion
                    ?? 0 }}%</span>
                </div>
                <div class="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                  <div class="h-full bg-cyan-500 rounded-full transition-all duration-1000"
                    :style="{ width: `${viewingProgram.progress ?? viewingProgram.completion ?? 0}%` }"></div>
                </div>
              </div>

              <!-- Details -->
              <div class="space-y-4 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 class="text-xs font-bold text-gray-400 mb-4">Details</h3>
                <div v-if="viewingProgram.template" class="flex items-center gap-4 text-sm">
                  <DocumentDuplicateIcon class="w-5 h-5 text-gray-400" />
                  <div class="flex-1">
                    <span class="text-gray-500">Framework:</span>
                    <span class="ml-2 font-bold text-gray-900">{{ viewingProgram.template }}</span>
                  </div>
                </div>
                <div v-if="viewingProgram.duration" class="flex items-center gap-4 text-sm">
                  <ClockIcon class="w-5 h-5 text-gray-400" />
                  <div class="flex-1">
                    <span class="text-gray-500">Duration:</span>
                    <span class="ml-2 font-bold text-gray-900">{{ viewingProgram.duration }}</span>
                  </div>
                </div>
                <div v-if="viewingProgram.startDate" class="flex items-center gap-4 text-sm">
                  <CalendarIcon class="w-5 h-5 text-gray-400" />
                  <div class="flex-1">
                    <span class="text-gray-500">Schedule:</span>
                    <span class="ml-2 font-bold text-gray-900">{{ viewingProgram.startDate }} → {{
                      viewingProgram.endDate || 'TBD' }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="border-t border-gray-100 pt-8 mt-12 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <button @click="handleEditProgram(viewingProgram); viewingProgram = null"
                    class="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700 shadow-sm active:scale-95">
                    <PencilSquareIcon class="w-5 h-5 text-gray-400" /> Edit
                  </button>
                  <button @click="handleManageSmes(viewingProgram); viewingProgram = null"
                    class="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700 shadow-sm active:scale-95">
                    <UsersIcon class="w-5 h-5 text-gray-400" /> Manage
                  </button>
                </div>
                <button @click="handleDiscuss(viewingProgram); viewingProgram = null"
                  class="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors text-sm font-bold active:scale-95">
                  <ChatBubbleLeftRightIcon class="w-5 h-5 text-purple-400" /> Open Discussion
                </button>
              </div>
            </div>

            <!-- Participants Tab Content -->
            <div v-else-if="activeTab === 'participants'" class="space-y-6">
              <div v-if="adminStore.loading" class="text-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
                <p class="text-xs text-gray-500 mt-4 font-bold uppercase tracking-widest">Loading directory...</p>
              </div>
              <div v-else-if="!adminStore.participants.length"
                class="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <UserGroupIcon class="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p class="text-sm text-gray-500 font-bold">No participants enrolled yet.</p>
                <button @click="handleManageSmes(viewingProgram); viewingProgram = null"
                  class="mt-4 text-xs font-bold text-cyan-600 hover:underline uppercase tracking-widest">
                  Enroll Candidates
                </button>
              </div>
              <div v-else class="space-y-4">
                <div v-for="p in adminStore.participants" :key="p.id"
                  class="flex items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-cyan-100 transition-all bg-white group shadow-sm">
                  <div class="flex items-center gap-4">
                    <div
                      class="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-sm font-bold text-gray-400 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-all shadow-sm">
                      {{ p.name?.charAt(0) }}
                    </div>
                    <div>
                      <h4 class="text-sm font-bold text-gray-900">{{ p.name }}</h4>
                      <div class="flex items-center gap-2 mt-1">
                        <span
                          :class="p.role === 'SME' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'"
                          class="text-[10px] font-bold px-1.5 py-0.5 rounded border">{{ p.role }}</span>
                        <span class="text-[10px] text-gray-400 font-medium">Joined {{ p.enrolled_at ? new
                          Date(p.enrolled_at).toLocaleDateString() : 'TBD' }}</span>
                      </div>
                    </div>
                  </div>
                  <div :class="[
                    'text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm',
                    ['Accepted', 'Enrolled', 'Active'].includes(p.status) ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  ]">{{ p.status }}</div>
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
        <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm shadow-inner" @click="discussingProgram = null">
        </div>
        <div class="relative ml-auto w-full max-w-lg bg-white shadow-2xl flex flex-col h-full">
          <!-- Forum Header -->
          <div
            class="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white shadow-sm sticky top-0 z-10">
            <div>
              <h2 class="font-bold text-gray-900 text-lg uppercase tracking-tight">{{ discussingProgram.name }}</h2>
              <div class="flex items-center gap-2 mt-1">
                <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <p class="text-xs text-gray-500 font-bold uppercase tracking-wider">Live Discussion Thread</p>
              </div>
            </div>
            <button @click="discussingProgram = null"
              class="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all active:scale-95">
              <XMarkIcon class="w-6 h-6" />
            </button>
          </div>
          <!-- Thread Container -->
          <div class="flex-1 overflow-hidden bg-gray-50/50">
            <ProgramCommentThread :programId="String(discussingProgram.id)" :key="String(discussingProgram.id)" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'
import { useAdminStore } from '~/stores/admin.store'
import { useConfirm } from '~/composables/useConfirm'
import StatCard from '~/components/AdminStatCard.vue'
import ProgramCard from '~/components/ProgramCard.vue'
import CreateProgramModal from '~/components/AdminCreateProgramModal.vue'
import ManageSmeEnrollmentModal from '~/components/AdminManageSmeEnrollmentModal.vue'
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
  UserGroupIcon,
  TrashIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import ProgramCommentThread from '~/components/ProgramCommentThread.vue'

const adminStore = useAdminStore()
const { ask } = useConfirm()
const toast = useToast()

const stats = computed(() => adminStore.programStats)
const loading = computed(() => adminStore.loading)
const searchQuery = ref('')
const isCreateModalOpen = ref(false)
const isManageSmesModalOpen = ref(false)
const selectedProgram = ref<any>(null)
const discussingProgram = ref<any>(null)
const viewingProgram = ref<any>(null)
const activeTab = ref('general')
const viewMode = ref<'grid' | 'list'>('grid')

const handleViewProgram = async (program: any) => {
  viewingProgram.value = program
  activeTab.value = 'general'
  await adminStore.fetchParticipants(program.id)
  
  // Refresh the viewingProgram reference to get updated counts from store
  const updated = adminStore.programs.find(p => p.id == program.id)
  if (updated) viewingProgram.value = updated
}

watch(activeTab, async (newTab) => {
  if (newTab === 'participants' && viewingProgram.value) {
    await adminStore.fetchParticipants(viewingProgram.value.id)
  }
})

const handleDiscuss = (program: any) => {
  discussingProgram.value = program
}

const programs = computed(() => adminStore.filteredPrograms(searchQuery.value))
const editingProgram = ref(null)

const openCreateModal = () => {
  editingProgram.value = null
  isCreateModalOpen.value = true
}

const handleCreateProgram = async (programData: any) => {
  try {
    await adminStore.createProgram(programData)
    isCreateModalOpen.value = false
  } catch (error) {
    toast.error('Failed to create program')
  }
}

const handleEditProgram = (program: any) => {
  editingProgram.value = program
  isCreateModalOpen.value = true
}

const handleManageSmes = (program: any) => {
  selectedProgram.value = program
  isManageSmesModalOpen.value = true
}

const handleUpdateProgram = async (programData: any) => {
  try {
    await adminStore.updateProgram(programData)
    isCreateModalOpen.value = false
    editingProgram.value = null
  } catch (error) {
    toast.error('Failed to update program')
  }
}

const handleDeleteProgram = async (id: number | string) => {
  const confirmed = await ask({
    title: 'Delete Program?',
    message: 'Are you sure you want to delete this investment program? This action will remove all associated participant records and cannot be undone.',
    confirmText: 'Delete Program',
    type: 'danger'
  })
  if (confirmed) {
    await adminStore.deleteProgram(id)
  }
}

onMounted(() => {
  adminStore.fetchProgramsData()
})

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})
</script>
