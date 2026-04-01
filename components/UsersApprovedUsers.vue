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
              <Menu as="div" class="relative inline-block text-left">
                <MenuButton
                  class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <EllipsisHorizontalIcon class="w-5 h-5" />
                </MenuButton>

                <transition enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0">
                  <MenuItems
                    class="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                    <div class="px-1 py-1">
                      <MenuItem v-slot="{ active }">
                      <button @click="openEditModal(user)" :class="[
                        active ? 'bg-cyan-50 text-cyan-700' : 'text-gray-900',
                        'group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors'
                      ]">
                        <UserIcon class="w-4 h-4 text-cyan-500 ml-1" />
                        Edit Profile
                      </button>
                      </MenuItem>
                    </div>
                    <div class="px-1 py-1 text-gray-900">
                      <MenuItem v-slot="{ active }">
                      <button @click="changeUserRole(user, 'sme')" :class="[
                        active ? 'bg-gray-100' : '',
                        'group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm'
                      ]">
                        <span
                          class="px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider bg-white text-gray-700 border-gray-200 min-w-[60px] text-center">SME</span>
                        Set as SME
                      </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                      <button @click="changeUserRole(user, 'investor')" :class="[
                        active ? 'bg-gray-100' : '',
                        'group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm'
                      ]">
                        <span
                          class="px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-100 min-w-[60px] text-center">Investor</span>
                        Set as Investor
                      </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                      <button @click="changeUserRole(user, 'admin')" :class="[
                        active ? 'bg-gray-100' : '',
                        'group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm'
                      ]">
                        <span
                          class="px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider bg-[#198754] text-white border-[#198754] min-w-[60px] text-center">Admin</span>
                        Set as Admin
                      </button>
                      </MenuItem>
                    </div>
                    <div class="px-1 py-1">
                      <MenuItem v-slot="{ active }">
                      <button @click="resetUserPassword(user)" :class="[
                        active ? 'bg-gray-100' : '',
                        'group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm'
                      ]">
                        <KeyIcon class="w-4 h-4 text-gray-500 ml-1" />
                        Reset Password
                      </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                      <button @click="deleteUser(user.id)" :class="[
                        active ? 'bg-red-50' : '',
                        'group flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-red-600'
                      ]">
                        <UserMinusIcon class="w-4 h-4 text-red-500 ml-1" />
                        Revoke Access
                      </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <p class="text-gray-500">No users found</p>
      </div>
    </div>

    <!-- Edit User Modal -->
    <EditUserProfileModal 
      :is-open="isEditModalOpen" 
      :loading="saving" 
      :user="selectedUser" 
      @close="isEditModalOpen = false" 
      @save="handleSaveProfile" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { 
  MagnifyingGlassIcon, 
  TrashIcon, 
  ArrowPathIcon, 
  EllipsisHorizontalIcon, 
  KeyIcon, 
  UserMinusIcon,
  UserIcon
} from '@heroicons/vue/24/outline'
import { useAdminStore } from '~/stores/admin.store'
import { useAuthStore } from '~/stores/auth.store'
import EditUserProfileModal from '~/components/EditUserProfileModal.vue'

const adminStore = useAdminStore()
const authStore = useAuthStore()
const searchQuery = ref('')
const roleFilter = ref('all')
const loading = computed(() => adminStore.loading)

// Edit Modal State
const isEditModalOpen = ref(false)
const selectedUser = ref<any>(null)
const saving = ref(false)

const fetchApproved = async () => {
  try {
    await adminStore.fetchUsersData()
  } catch (e) {
    console.error('[ApprovedUsers] Failed to fetch approved users', e)
  }
}

// Refresh button handler
const refresh = () => fetchApproved()

onMounted(() => {
  if (adminStore.users.length === 0) {
    fetchApproved()
  }
})

const filteredUsers = computed(() => {
  return adminStore.users.filter(user => {
    const matchesSearch = !searchQuery.value ||
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = roleFilter.value === 'all' || user.role === roleFilter.value
    return matchesSearch && matchesRole
  })
})

const deleteUser = async (id: number | string) => {
  if (confirm('Are you sure you want to remove this user?')) {
    try {
      await adminStore.deleteUser(id)
    } catch (e) {
      console.error('Failed to delete user:', e)
    }
  }
}

const changeUserRole = async (user: any, newRole: string) => {
  if (confirm(`Are you sure you want to change ${user.name}'s role to ${newRole.toUpperCase()}?`)) {
    try {
      await adminStore.updateUserRole(user.id, newRole)
    } catch (e) {
      console.error('Failed to update role:', e)
    }
  }
}

const resetUserPassword = async (user: any) => {
  if (confirm(`Are you sure you want to send a password reset link to ${user.email}?`)) {
    try {
      await adminStore.resetPassword(user.id)
      alert(`Password has been reset for ${user.email}`);
    } catch (e) {
      console.error('Failed to reset password:', e)
      alert(`Failed to reset password for ${user.email}`);
    }
  }
}

const openEditModal = (user: any) => {
  selectedUser.value = user
  isEditModalOpen.value = true
}

const handleSaveProfile = async (formData: any) => {
  if (!selectedUser.value) return
  
  saving.value = true
  try {
    const role = selectedUser.value.role
    await authStore.updateOtherUserProfile(selectedUser.value.id, role, formData)
    
    // Refresh the list to show updated data
    await adminStore.fetchUsersData()
    
    isEditModalOpen.value = false
    alert('User profile updated successfully!')
  } catch (e: any) {
    alert(e.message || 'Failed to update user profile')
  } finally {
    saving.value = false
  }
}

const getInitials = (name: string) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

const getRoleBadge = (role: string) => {
  switch (String(role).toLowerCase()) {
    case 'admin': return 'bg-[#198754] text-white border-[#198754]'
    case 'sme': return 'bg-white text-gray-700 border-gray-200'
    case 'investor': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    default: return 'bg-gray-50 text-gray-700 border-gray-100'
  }
}
</script>
