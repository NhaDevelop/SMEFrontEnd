<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <p class="text-gray-500 mt-1">Review and manage platform users</p>
        </div>
        <button @click="handleCreateUser"
          class="px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center gap-2">
          <PlusIcon class="w-4 h-4" />
          Create User
        </button>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto custom-scrollbar px-8 py-8 w-full">
      <div class="max-w-[1600px] mx-auto space-y-8">
        <!-- KPI Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <StatCard title="Total Users" :value="adminStore.userStats?.total || 0" />
          <div class="bg-white rounded-xl shadow-soft p-6 border-2 border-yellow-100 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4">
              <ClockIcon class="w-5 h-5 text-yellow-500" />
            </div>
            <h3 class="text-gray-500 font-medium text-sm mb-4">Pending</h3>
            <span class="text-3xl font-bold text-yellow-600">{{ adminStore.pendingUsers.length }}</span>
          </div>
          <StatCard title="SMEs" :value="adminStore.userStats?.smes || 0" />
          <StatCard title="Investors" :value="adminStore.userStats?.investors || 0" />
          <StatCard title="Admins" :value="adminStore.userStats?.admins || 0" />
        </div>

        <!-- Tabs -->
        <div class="space-y-6">
          <div class="border-b border-gray-200 flex gap-8">
            <button @click="activeTab = 'pending'"
              :class="[activeTab === 'pending' ? 'border-cyan-600 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2']">
              <ClockIcon class="w-4 h-4" />
              Pending Approval
              <span v-if="adminStore.pendingUsers.length > 0"
                class="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {{ adminStore.pendingUsers.length }}
              </span>
            </button>
            <button @click="activeTab = 'approved'"
              :class="[activeTab === 'approved' ? 'border-cyan-600 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2']">
              <CheckCircleIcon class="w-4 h-4" />
              Approved Users
            </button>
            <button @click="activeTab = 'audit'"
              :class="[activeTab === 'audit' ? 'border-cyan-600 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2']">
              <ClipboardDocumentListIcon class="w-4 h-4" />
              Audit Log
            </button>
          </div>

          <!-- Pending Tab -->
          <div v-if="activeTab === 'pending'"
            class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[400px]">
            <div class="flex items-center justify-between mb-1">
              <h3 class="font-bold text-xl text-gray-900">Pending Registrations</h3>
              <button @click="loadRegistrations"
                class="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md transition-colors"
                title="Refresh">
                <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': loadingRegs }" />
              </button>
            </div>
            <p class="text-gray-500 text-sm mb-6">Review and approve new user registrations</p>

            <!-- Search & Filter -->
            <div class="flex gap-4 mb-8">
              <div class="relative flex-1">
                <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input v-model="searchQuery" type="text" placeholder="Search users..."
                  class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <select v-model="roleFilter"
                class="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option value="">All Roles</option>
                <option value="sme">SME</option>
                <option value="investor">Investor</option>
              </select>
            </div>

            <!-- Loading -->
            <div v-if="loadingRegs" class="flex items-center justify-center py-16">
              <span class="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></span>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredPending.length === 0" class="text-center py-16">
              <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon class="w-8 h-8 text-gray-300" />
              </div>
              <p class="text-gray-500 font-medium">No pending registrations</p>
              <p class="text-gray-400 text-sm mt-1">New registrations from the landing page will appear here</p>
            </div>

            <!-- List -->
            <div v-else class="space-y-3">
              <div v-for="reg in filteredPending" :key="reg.id"
                class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                    {{ reg.name?.charAt(0)?.toUpperCase() || '?' }}
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">{{ reg.name }}</h4>
                    <p class="text-sm text-gray-500">
                      {{ reg.email }}
                      <span class="mx-1 text-gray-300">•</span>
                      <span class="capitalize font-medium"
                        :class="reg.role?.toLowerCase() === 'sme' ? 'text-teal-600' : 'text-purple-600'">
                        {{ reg.role?.toLowerCase() === 'sme' ? 'SME / Business' : 'Investor' }}
                      </span>
                      <span v-if="reg.company" class="mx-1 text-gray-300">•</span>
                      <span v-if="reg.company" class="text-gray-600">{{ reg.company }}</span>
                    </p>
                    <p class="text-xs text-gray-400 mt-0.5">Registered: {{ reg.registered }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="handleReject(reg.id)" :disabled="processingId === reg.id"
                    class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors disabled:opacity-40">
                    Reject
                  </button>
                  <button @click="handleApprove(reg.id)" :disabled="processingId === reg.id"
                    class="px-3 py-1.5 text-sm bg-cyan-600 text-white hover:bg-cyan-700 rounded-md font-medium transition-colors disabled:opacity-40 flex items-center gap-1.5">
                    <span v-if="processingId === reg.id"
                      class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ApprovedUsers v-if="activeTab === 'approved'" />
          <AuditLogTab v-if="activeTab === 'audit'" />
        </div>
      </div>
    </main>

    <CreateUserModal :is-open="isCreateModalOpen" :loading="loading" @close="isCreateModalOpen = false"
      @create="handleCreateUserSubmit" />

    <!-- Success/Error Toast -->
    <Transition name="fade">
      <div v-if="toast.message"
        class="fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 text-white"
        :class="toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'">
        <CheckCircleIcon v-if="toast.type === 'success'" class="w-5 h-5" />
        <ExclamationCircleIcon v-else class="w-5 h-5" />
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, reactive } from 'vue'
import { useAdminStore } from '~/stores/admin.store'
import StatCard from '~/components/AdminStatCard.vue'
import ApprovedUsers from '~/components/UsersApprovedUsers.vue'
import AuditLogTab from '~/components/UsersAuditLogTab.vue'
import CreateUserModal from '~/components/UsersCreateUserModal.vue'
import {
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  UserGroupIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const adminStore = useAdminStore()
const activeTab = ref('pending')
const isCreateModalOpen = ref(false)
const loading = ref(false)
const loadingRegs = ref(false)
const processingId = ref<string | null>(null)
const searchQuery = ref('')
const roleFilter = ref('')

// ── Registration data from API ─────────────────────────────────────────────────
interface Registration {
  id: string
  name: string
  email: string
  role: string
  company?: string
  industry?: string
  registered: string
  status: string
}

const pendingRegistrations = ref<Registration[]>([])
const registrationStats = reactive({
  total: 0,
  pending: 0,
  approved: 0,
  smes: 0,
  investors: 0,
  approvedSmes: 0,
  approvedInvestors: 0
})

const filteredPending = computed(() => {
  return adminStore.pendingUsers.filter(r => {
    const nameMatch = r.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) || false
    const emailMatch = r.email?.toLowerCase().includes(searchQuery.value.toLowerCase()) || false
    const companyMatch = r.company?.toLowerCase().includes(searchQuery.value.toLowerCase()) || false
    
    const matchSearch = !searchQuery.value || nameMatch || emailMatch || companyMatch
    const matchRole = !roleFilter.value || r.role?.toLowerCase() === roleFilter.value.toLowerCase()
    return matchSearch && matchRole
  })
})

const toast = reactive({ message: '', type: 'success' })
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast.message = message
  toast.type = type
  setTimeout(() => { toast.message = '' }, 3500)
}

const loadRegistrations = async () => {
  loadingRegs.value = true
  try {
    await adminStore.fetchPendingUsers()
  } catch (e) {
    console.error('Failed to load registrations:', e)
  } finally {
    loadingRegs.value = false
  }
}

const handleApprove = async (id: string) => {
  if (!confirm('Approve this user?')) return
  processingId.value = id
  try {
    await adminStore.approveUser(id)
    showToast('User approved and added to the platform!')
  } catch (e: any) {
    showToast(e.message || 'Failed to approve user.', 'error')
  } finally {
    processingId.value = null
  }
}

const handleReject = async (id: string) => {
  if (!confirm('Reject this registration?')) return
  processingId.value = id
  try {
    await adminStore.rejectUser(id)
    showToast('Registration rejected.')
  } catch (e: any) {
    showToast(e.message || 'Failed to reject registration.', 'error')
  } finally {
    processingId.value = null
  }
}

const handleCreateUser = () => {
  isCreateModalOpen.value = true
}

const handleCreateUserSubmit = async (userData: any) => {
  loading.value = true
  try {
    await adminStore.createUser(userData)
    isCreateModalOpen.value = false
    showToast(`User ${userData.name} created successfully!`)
  } catch {
    showToast('Failed to create user.', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  adminStore.fetchUsersData()
  await loadRegistrations()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
