<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 min-h-[400px]">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="font-bold text-xl text-gray-900 mb-1">Approved Users</h3>
        <p class="text-gray-500 text-sm">Manage active platform users</p>
      </div>
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

    <!-- Users Table -->
    <div class="overflow-x-auto">
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
import { ref, computed } from 'vue'
import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useAdminStore } from '~/stores/admin.store'

const adminStore = useAdminStore()
const searchQuery = ref('')
const roleFilter = ref('all')

const users = computed(() => adminStore.approvedUsersList)

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = roleFilter.value === 'all' || user.role === roleFilter.value
    return matchesSearch && matchesRole
  })
})

const deleteUser = async (id: number | string) => {
  if (confirm('Are you sure you want to remove this user?')) {
    await adminStore.deleteUser(id)
  }
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-[#198754] text-white border-[#198754]' // Solid Green
    case 'sme': return 'bg-white text-gray-700 border-gray-200' // White/Gray
    case 'investor': return 'bg-emerald-50 text-emerald-700 border-emerald-100' // Light Green
    default: return 'bg-gray-50 text-gray-700 border-gray-100'
  }
}
</script>
