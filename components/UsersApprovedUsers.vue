<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[400px]">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="font-bold text-xl text-gray-900 mb-1">Approved Users</h3>
        <p class="text-gray-500 text-sm">Manage active platform users</p>
      </div>
      <!-- Refresh button -->
      <button @click="refresh" title="Refresh"
        class="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md transition-colors">
        <ArrowPathIcon class="w-4 h-4" :class="{ 'animate-spin': loading }" />
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="flex gap-4 mb-6">
      <div class="relative flex-1">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input v-model="searchQuery" type="text" placeholder="Search users..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
      </div>
      <select v-model="roleFilter"
        class="px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 min-w-[150px]">
        <option value="all">All Roles</option>
        <option value="sme">SME</option>
        <option value="investor">Investor</option>
        <option value="admin">Admin</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <span class="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></span>
    </div>

    <!-- Users Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-100 text-xs text-gray-500 uppercase">
            <th class="py-3 px-4 font-medium">User</th>
            <th class="py-3 px-4 font-medium">Role</th>
            <th class="py-3 px-4 font-medium">Email</th>
            <th class="py-3 px-4 font-medium">Registered</th>
            <th class="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-50">
          <tr v-for="user in filteredUsers" :key="user.id" class="group hover:bg-gray-50 transition-colors">
            <td class="py-4 px-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                  {{ getInitials(user.name) }}
                </div>
                <span class="text-sm font-medium text-gray-900">{{ user.name }}</span>
              </div>
            </td>
            <td class="py-4 px-4">
              <span :class="['px-2 py-0.5 rounded text-xs font-medium border uppercase', getRoleBadge(user.role)]">
                {{ user.role }}
              </span>
            </td>
            <td class="py-4 px-4 text-sm text-gray-600">{{ user.email }}</td>
            <td class="py-4 px-4 text-sm text-gray-600">{{ user.registered || 'N/A' }}</td>
            <td class="py-4 px-4 text-right">
              <button @click="deleteUser(user.id)" class="text-gray-400 hover:text-red-600 transition-colors p-1">
                <TrashIcon class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <p class="text-gray-500">No users found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { MagnifyingGlassIcon, TrashIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { useAdminStore } from '~/stores/admin.store'

const adminStore = useAdminStore()
const searchQuery = ref('')
const roleFilter = ref('all')
const loading = ref(false)

// ── Seed users (always present, hardcoded approved users) ─────────────────────
const seedUsers = [
  { id: 1, name: 'la', email: 'la@gmail.com', role: 'sme', status: 'active', registered: 'Jan 30, 2026' },
  { id: 2, name: 'panha pay', email: 'paypanha45@gmail.com', role: 'investor', status: 'active', registered: 'Jan 29, 2026' },
  { id: 3, name: 'Super Admin', email: 'stsmey@gmail.com', role: 'admin', status: 'active', registered: 'Jan 21, 2026' },
  { id: 4, name: 'Testing', email: 'bunphinim@gmail.com', role: 'sme', status: 'active', registered: 'Jan 17, 2026' },
  { id: 5, name: 'Testing', email: 'stsmey@gmail.com', role: 'admin', status: 'active', registered: 'Jan 16, 2026' }
]

// ── Approved registrations fetched from the real API ─────────────────────────
const approvedFromRegistrations = ref<any[]>([])

const fetchApproved = async () => {
  loading.value = true
  try {
    const data = await $fetch<{ pending: any[], approved: any[], stats: any }>('/api/registrations')
    const seedEmails = new Set(seedUsers.map(u => u.email.toLowerCase()))
    approvedFromRegistrations.value = (data.approved || [])
      .filter(r => !seedEmails.has(r.email?.toLowerCase()))
      .map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        role: r.role,
        status: 'active',
        registered: r.registered || (r.registered_at
          ? new Date(r.registered_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'N/A')
      }))
  } catch (e) {
    console.error('[ApprovedUsers] Failed to fetch approved registrations', e)
  } finally {
    loading.value = false
  }
}

// Refresh button handler (exposed for template)
const refresh = () => fetchApproved()

// Fetch on every mount (component remounts when admin switches to Approved tab)
onMounted(() => fetchApproved())

// ── Merge seed users + approved registrations ─────────────────────────────────
const allUsers = computed(() => {
  return [...seedUsers, ...approvedFromRegistrations.value]
})

const filteredUsers = computed(() => {
  return allUsers.value.filter(user => {
    const matchesSearch = !searchQuery.value ||
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = roleFilter.value === 'all' || user.role === roleFilter.value
    return matchesSearch && matchesRole
  })
})

const deleteUser = async (id: number | string) => {
  if (confirm('Are you sure you want to remove this user?')) {
    await adminStore.deleteUser(id)
    // If it was a registration-sourced user, remove from local list
    approvedFromRegistrations.value = approvedFromRegistrations.value.filter(u => u.id !== id)
  }
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-[#198754] text-white border-[#198754]'
    case 'sme': return 'bg-white text-gray-700 border-gray-200'
    case 'investor': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    default: return 'bg-gray-50 text-gray-700 border-gray-100'
  }
}
</script>
