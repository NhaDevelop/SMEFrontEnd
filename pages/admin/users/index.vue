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
          <StatCard title="Total Users" :value="stats?.total || 0" />
          <div class="bg-white rounded-xl shadow-soft p-6 border-2 border-yellow-100 relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4">
              <ClockIcon class="w-5 h-5 text-yellow-500" />
            </div>
            <h3 class="text-gray-500 font-medium text-sm mb-4">Pending</h3>
            <span class="text-3xl font-bold text-yellow-600">{{ stats?.pending || 0 }}</span>
          </div>
          <StatCard title="SMEs" :value="stats?.smes || 0" />
          <StatCard title="Investors" :value="stats?.investors || 0" />
          <StatCard title="Admins" :value="stats?.admins || 0" />
        </div>

        <!-- Content Area -->
        <div class="space-y-6">
          <!-- Tabs -->
          <div class="border-b border-gray-200 flex gap-8">
            <button @click="activeTab = 'pending'"
              :class="[activeTab === 'pending' ? 'border-cyan-600 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300', 'pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2']">
              <ClockIcon class="w-4 h-4" />
              Pending Approval
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
            <h3 class="font-bold text-xl text-gray-900 mb-1">Pending Registrations</h3>
            <p class="text-gray-500 text-sm mb-6">Review and approve new user registrations</p>

            <!-- Search & Filter -->
            <div class="flex gap-4 mb-12">
              <div class="relative flex-1">
                <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search users..."
                  class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              </div>
              <select
                class="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option>All Roles</option>
              </select>
            </div>

            <!-- Empty State -->
            <div v-if="pendingUsers.length === 0" class="text-center py-12">
              <p class="text-gray-500">No pending registrations</p>
            </div>

            <!-- List -->
            <div v-else class="space-y-4">
              <div v-for="user in pendingUsers" :key="user.id"
                class="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div class="flex items-center gap-4">
                  <div
                    class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {{ user.name.charAt(0) }}
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900">{{ user.name }}</h4>
                    <p class="text-sm text-gray-500">{{ user.email }} • <span class="capitalize">{{ user.role }}</span>
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="handleReject(user.id)"
                    class="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors">
                    Reject
                  </button>
                  <button @click="handleApprove(user.id)"
                    class="px-3 py-1.5 text-sm bg-cyan-600 text-white hover:bg-cyan-700 rounded-md font-medium transition-colors">
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

    <!-- Success Message -->
    <Transition name="fade">
      <div v-if="successMessage"
        class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
        <CheckCircleIcon class="w-5 h-5" />
        {{ successMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useAdminStore } from '~/stores/admin.store'
import StatCard from '~/components/admin/StatCard.vue'
import ApprovedUsers from '~/components/users/ApprovedUsers.vue'
import AuditLogTab from '~/components/users/AuditLogTab.vue'
import CreateUserModal from '~/components/users/CreateUserModal.vue'
import {
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const adminStore = useAdminStore()
const activeTab = ref('pending')
const stats = computed(() => adminStore.userStats)
const pendingUsers = computed(() => adminStore.pendingUsersList)

const handleApprove = async (id: number | string) => {
  if (confirm('Approve this user?')) {
    await adminStore.approveUser(id)
  }
}

const handleReject = async (id: number | string) => {
  if (confirm('Reject this user?')) {
    await adminStore.rejectUser(id)
  }
}

const isCreateModalOpen = ref(false)
const loading = ref(false)
const successMessage = ref('')

const handleCreateUser = () => {
  isCreateModalOpen.value = true
}

const handleCreateUserSubmit = async (userData: any) => {
  loading.value = true
  try {
    await adminStore.createUser(userData)
    isCreateModalOpen.value = false
    // Show success message
    successMessage.value = `User ${userData.name} created successfully!`
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    alert('Failed to create user')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  adminStore.fetchUsersData()
})

definePageMeta({
  layout: 'admin',
  middleware: ['auth', 'admin']
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
