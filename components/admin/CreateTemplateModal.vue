<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('cancel')"></div>
    
    <!-- Modal -->
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
           <h3 class="text-lg font-bold text-gray-900">Create New Template</h3>
           <p class="text-sm text-gray-500 mt-0.5">Start a new assessment configuration</p>
        </div>
        <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Body -->
      <form @submit.prevent="save" class="p-6 space-y-6">
        <!-- Name -->
        <div class="space-y-1.5">
          <label class="block text-sm font-semibold text-gray-700">Template Name <span class="text-red-500">*</span></label>
          <input 
            v-model="form.name"
            type="text" 
            placeholder="e.g., Q3 2024 Investment Standard" 
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-shadow"
          />
        </div>

        <!-- Description -->
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea 
            v-model="form.description"
            rows="3"
            placeholder="Briefly describe the purpose of this assessment template..." 
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-shadow resize-none"
          ></textarea>
        </div>

        <!-- Clone From -->
        <div class="space-y-1.5">
           <label class="block text-sm font-medium text-gray-700">Clone Existing (Optional)</label>
           <select 
              v-model="form.cloneFrom" 
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-shadow text-gray-700"
            >
              <option value="">-- Start from Scratch --</option>
              <option v-for="t in existingTemplates" :key="t.id" :value="t.id">{{ t.name }} ({{ t.version }})</option>
           </select>
           <p class="text-xs text-gray-500">Copy structure and questions from an existing template.</p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
             <button 
                type="button" 
                @click="$emit('cancel')"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
             >
                Cancel
             </button>
             <button 
                type="submit"
                class="px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center gap-2"
             >
                <PlusIcon class="w-4 h-4" />
                Create Template
             </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { XMarkIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { useAdminStore } from '~/stores/admin.store'

const emit = defineEmits(['cancel', 'save'])
const adminStore = useAdminStore()

const existingTemplates = computed(() => adminStore.templates)

const form = ref({
    name: '',
    description: '',
    cloneFrom: ''
})

const save = () => {
    emit('save', { ...form.value })
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}
</style>
