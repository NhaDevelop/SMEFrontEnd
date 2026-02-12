<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Backdrop -->
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="close"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ isEditMode ? 'Edit Program' : 'Create New Program' }}
              </h3>
              <div class="mt-4 space-y-4">
                <!-- Form -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Program Name</label>
                  <input v-model="form.name" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" placeholder="e.g. Summer Accelerator" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea v-model="form.description" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Template</label>
                  <select v-model="form.template" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm">
                    <option>Standard Investment Readiness Assessment</option>
                    <option>Investor Due Diligence</option>
                    <option>Quick Assessment</option>
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Start Date</label>
                    <input v-model="form.startDate" type="date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">End Date</label>
                    <input v-model="form.endDate" type="date" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            @click="handleSubmit" 
            :disabled="loading || !form.name || !form.description"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving...' : (isEditMode ? 'Update Program' : 'Create Program') }}
          </button>
          <button type="button" @click="close" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'

const props = defineProps<{
  isOpen: boolean
  loading: boolean
  initialData?: any
}>()

const emit = defineEmits(['close', 'create', 'update'])

const form = reactive({
  id: undefined as number | string | undefined,
  name: '',
  description: '',
  template: 'Standard Investment Readiness Assessment',
  startDate: '',
  endDate: ''
})

const isEditMode = computed(() => !!props.initialData)

// Watch for initialData changes to pre-fill form
watch(() => props.initialData, (newData) => {
  if (newData) {
    form.id = newData.id
    form.name = newData.name
    form.description = newData.description
    form.template = newData.template || 'Standard Investment Readiness Assessment'
    form.startDate = newData.startDate || ''
    form.endDate = newData.endDate || ''
  } else {
    // Reset
    form.id = undefined
    form.name = ''
    form.description = ''
    form.template = 'Standard Investment Readiness Assessment'
    form.startDate = ''
    form.endDate = ''
  }
}, { immediate: true })

const close = () => {
  emit('close')
}

const handleSubmit = () => {
    if (isEditMode.value) {
        emit('update', { ...form })
    } else {
        emit('create', { ...form })
    }
}
</script>
