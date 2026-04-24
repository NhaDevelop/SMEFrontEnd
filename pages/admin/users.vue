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
              <button @click="loadRegistrations()"
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
            <div v-else class="space-y-4">
              <div v-for="reg in filteredPending" :key="reg.id"
                class="border rounded-2xl transition-all duration-300 overflow-hidden bg-white shadow-sm" :class="[
                  expandedId === reg.id
                    ? 'border-cyan-200 ring-1 ring-cyan-50 shadow-md'
                    : 'border-gray-100'
                ]">

                <!-- Summary Row (Click to toggle) -->
                <div @click="toggleExpand(reg.id)"
                  class="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50/50 transition-colors">
                  <div class="flex items-center gap-5">
                    <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm"
                      :class="reg.role?.toLowerCase() === 'sme' ? 'bg-teal-50 text-teal-600' : 'bg-purple-50 text-purple-600'">
                      {{ reg.name?.charAt(0)?.toUpperCase() || '?' }}
                    </div>
                    <div>
                      <h4 class="font-bold text-gray-900 flex items-center gap-2">
                        {{ reg.name }}
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          :class="reg.role?.toLowerCase() === 'sme' ? 'bg-teal-100 text-teal-700' : 'bg-purple-100 text-purple-700'">
                          {{ reg.role }}
                        </span>
                      </h4>
                      <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span class="font-medium text-gray-700">{{ reg.company || (reg.role?.toLowerCase() === 'sme' ?
                          reg.sme_profile?.company_name : reg.investor_profile?.organization_name) || 'Unknown Entity'
                          }}</span>
                        <span class="text-gray-300">|</span>
                        <span>{{ reg.email }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-4">
                    <div class="text-right hidden sm:block">
                      <p class="text-xs text-gray-400 uppercase font-semibold">Registered</p>
                      <p class="text-sm font-medium text-gray-600">{{ formatDate(reg.registered || reg.created_at) }}
                      </p>
                    </div>
                    <ChevronDownIcon class="w-5 h-5 text-gray-400 transition-transform duration-300"
                      :class="{ 'rotate-180': expandedId === reg.id }" />
                  </div>
                </div>

                <!-- Expanded Details Panel -->
                <Transition name="expand">
                  <div v-if="expandedId === reg.id" class="border-t border-gray-50 bg-gray-50/30 p-6 space-y-6">

                    <!-- SME Details -->
                    <div v-if="reg.role?.toLowerCase() === 'sme'"
                      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company Name</p>
                        <p class="text-sm font-semibold text-gray-800">{{ reg.sme_profile?.company_name || 'N/A' }}</p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Industry</p>
                        <p class="text-sm font-semibold text-gray-800">{{ reg.sme_profile?.industry || 'N/A' }}</p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Registration No.</p>
                        <p class="text-sm font-semibold text-gray-800">{{ reg.sme_profile?.registration_number || 'N/A'
                          }}</p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Business Stage</p>
                        <p class="text-sm font-semibold text-gray-800">{{ reg.sme_profile?.stage || 'N/A' }}</p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Team Size</p>
                        <p class="text-sm font-semibold text-gray-800">{{ reg.sme_profile?.team_size || 'N/A' }}
                          employees</p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Years in Business</p>
                        <p class="text-sm font-semibold text-gray-800">{{ reg.sme_profile?.years_in_business || 'N/A' }}
                        </p>
                      </div>
                      <div class="col-span-1 md:col-span-2 space-y-1">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Business Address</p>
                        <p class="text-sm font-semibold text-gray-800">{{ reg.sme_profile?.address || 'N/A' }}</p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Website</p>
                        <a v-if="reg.sme_profile?.website_url" :href="reg.sme_profile.website_url" target="_blank"
                          class="text-sm font-semibold text-cyan-600 hover:underline">
                          {{ reg.sme_profile.website_url }}
                        </a>
                        <p v-else class="text-sm font-semibold text-gray-400 italic">Not provided</p>
                      </div>
                    </div>

                    <!-- Investor Details -->
                    <div v-else-if="reg.role?.toLowerCase() === 'investor'"
                      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Organization</p>
                        <p class="text-sm font-semibold text-gray-800">{{ reg.investor_profile?.organization_name ||
                          'N/A' }}</p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Investor Type</p>
                        <p class="text-sm font-semibold text-gray-800">{{ reg.investor_profile?.investor_type || 'N/A'
                          }}</p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Industry focus</p>
                        <p class="text-sm font-semibold text-gray-800">{{ reg.investor_profile?.industry || 'N/A' }}</p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Min Ticket Size</p>
                        <p class="text-sm font-semibold text-gray-800">${{
                          reg.investor_profile?.min_ticket_size?.toLocaleString() || '0' }}</p>
                      </div>
                      <div class="space-y-1">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Max Ticket Size</p>
                        <p class="text-sm font-semibold text-gray-800">${{
                          reg.investor_profile?.max_ticket_size?.toLocaleString() || '0' }}</p>
                      </div>
                    </div>

                    <!-- Contact Details -->
                    <div class="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <PhoneIcon class="w-4 h-4" />
                        </div>
                        <div>
                          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                          <p class="text-sm font-semibold text-gray-800">{{ reg.phone || 'Not provided' }}</p>
                        </div>
                      </div>

                      <!-- Verification Document -->
                      <div v-if="reg.sme_profile?.registration_document || reg.investor_profile?.registration_document"
                        class="flex items-center gap-3">
                        <div class="p-2 bg-amber-50 text-amber-600 rounded-lg">
                          <DocumentIcon class="w-4 h-4" />
                        </div>
                        <div>
                          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verification Doc</p>
                          <a :href="getDocumentUrl(reg)" target="_blank"
                            class="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group">
                            View Certificate
                            <ArrowTopRightOnSquareIcon
                              class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <!-- Actions Row -->
                    <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div class="flex items-center gap-2 text-xs text-gray-400 italic">
                        <ShieldCheckIcon class="w-4 h-4" />
                        Review the uploaded document before approving
                      </div>
                      <div class="flex items-center gap-3">
                        <button @click.stop="handleReject(reg.id)" :disabled="processingId === reg.id"
                          class="px-6 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all disabled:opacity-40">
                          Reject registration
                        </button>
                        <button @click.stop="handleApprove(reg.id)" :disabled="processingId === reg.id"
                          class="px-8 py-2.5 text-sm bg-cyan-600 text-white hover:bg-cyan-700 shadow-lg shadow-cyan-600/20 rounded-xl font-bold transition-all disabled:opacity-40 flex items-center gap-2">
                          <span v-if="processingId === reg.id"
                            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Approve Account
                        </button>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>

              <!-- Pagination Header -->
              <div v-if="adminStore.pendingUsersMeta" class="flex items-center justify-between border-t pt-4 mt-6">
                <span class="text-sm text-gray-500">
                  Showing page <span class="font-medium text-gray-900">{{ adminStore.pendingUsersMeta.current_page }}</span>
                  of <span class="font-medium text-gray-900">{{ adminStore.pendingUsersMeta.last_page }}</span>
                </span>
                <div class="flex items-center gap-2">
                  <button @click="loadRegistrations(adminStore.pendingUsersMeta.current_page - 1)"
                    :disabled="adminStore.pendingUsersMeta.current_page <= 1"
                    class="px-3 py-1 text-sm font-medium border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                  </button>
                  <button @click="loadRegistrations(adminStore.pendingUsersMeta.current_page + 1)"
                    :disabled="adminStore.pendingUsersMeta.current_page >= adminStore.pendingUsersMeta.last_page"
                    class="px-3 py-1 text-sm font-medium border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>

          <LazyUsersApprovedUsers v-if="activeTab === 'approved'" />
          <LazyUsersAuditLogTab v-if="activeTab === 'audit'" />
        </div>
      </div>
    </main>

    <LazyUsersCreateUserModal :is-open="isCreateModalOpen" :loading="loading" @close="isCreateModalOpen = false"
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
import { useConfirm } from '~/composables/useConfirm'
import StatCard from '~/components/AdminStatCard.vue'
import {
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  UserGroupIcon,
  ExclamationCircleIcon,
  ChevronDownIcon,
  PhoneIcon,
  DocumentIcon,
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
})

const adminStore = useAdminStore()
const { ask } = useConfirm()
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
  phone?: string
  role: string
  company?: string
  registered: string
  status: string
  created_at?: string
  sme_profile?: any
  investor_profile?: any
}

const pendingRegistrations = ref<Registration[]>([])
const expandedId = ref<string | null>(null)

const toggleExpand = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch (e) {
    return dateString
  }
}
const getDocumentUrl = (reg: any) => {
  const path = reg.sme_profile?.registration_document || reg.investor_profile?.registration_document
  if (!path) return '#'

  const config = useRuntimeConfig()
  // Strip '/api' from the end of apiBase to get the root URL for storage
  const baseUrl = config.public.apiBase.replace(/\/api$/, '')
  return `${baseUrl}/storage/${path}`
}
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

const loadRegistrations = async (page: number = 1) => {
  loadingRegs.value = true
  try {
    await adminStore.fetchPendingUsers(page)
  } catch (e) {
    console.error('Failed to load registrations:', e)
  } finally {
    loadingRegs.value = false
  }
}

const handleApprove = async (id: string) => {
  const confirmed = await ask({
    title: 'Approve User Registration?',
    message: 'This will grant the user full access to their dashboard and notify them via email.',
    confirmText: 'Approve User',
    type: 'info'
  })
  if (!confirmed) return

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
  const confirmed = await ask({
    title: 'Reject Registration?',
    message: 'Are you sure you want to reject this request? This action will prevent the user from accessing the platform.',
    confirmText: 'Reject Request',
    type: 'danger'
  })
  if (!confirmed) return

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

/* Expand Transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 1000px;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  border-top-width: 0 !important;
}
</style>
