<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Backdrop -->
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="close"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-bold text-gray-900" id="modal-title">
                Edit User Profile
              </h3>
              <p class="text-sm text-gray-500 mt-1">Update information for {{ user?.name }}</p>
              
              <div class="mt-6 space-y-5">
                <!-- Form -->
                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input v-model="form.full_name" type="text" 
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm" 
                    placeholder="John Doe" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Address (Read-only)</label>
                  <input :value="user?.email" type="email" disabled
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed text-sm" />
                </div>

                <div>
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone Number</label>
                  <input v-model="form.phone" type="text"
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm" 
                    placeholder="+855..." />
                </div>

                <div v-if="user?.role !== 'ADMIN'">
                  <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    {{ user?.role === 'SME' ? 'Company Name' : 'Organization Name' }}
                  </label>
                  <input v-model="form.company_name" type="text"
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all text-sm" 
                    placeholder="Enter name..." />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3">
          <button 
            type="button" 
            @click="handleSubmit" 
            :disabled="loading || !form.full_name"
            class="inline-flex justify-center rounded-lg px-6 py-2.5 bg-cyan-600 text-sm font-bold text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2"
          >
            <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
          <button type="button" @click="close" 
            class="inline-flex justify-center rounded-lg px-6 py-2.5 bg-white border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  loading: boolean
  user: any
}>()

const emit = defineEmits(['close', 'save'])

const form = reactive({
  full_name: '',
  phone: '',
  company_name: ''
})

// Initialize form when modal opens or user changes
watch(() => props.isOpen, (val) => {
  if (val && props.user) {
    form.full_name = props.user.full_name || props.user.name || ''
    form.phone = props.user.phone || ''
    form.company_name = props.user.sme_profile?.company_name || props.user.investor_profile?.organization_name || ''
  }
}, { immediate: true })

const close = () => {
  emit('close')
}

const handleSubmit = () => {
  emit('save', { ...form })
}
</script>
