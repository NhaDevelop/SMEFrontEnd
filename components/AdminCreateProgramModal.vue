<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <!-- Backdrop -->
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="close"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
                  <input v-model="form.name" type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
                    placeholder="e.g. Summer Accelerator" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea v-model="form.description" rows="3"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Template</label>
                  <select v-model="form.templateId"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm">
                    <option value="">-- No Template Assigned (Draft Mode) --</option>
                    <option v-for="t in availableTemplatesWithCurrent" :key="t.id" :value="t.id">
                      {{ t.name }} ({{ t.version }})
                    </option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">Select the assessment framework for this program. Only unassigned templates are shown.</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Start Date</label>
                    <input v-model="form.startDate" type="date"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">End Date</label>
                    <input v-model="form.endDate" type="date"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Sector</label>
                    <select v-model="form.sector"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white">
                      <option value="">-- Select Sector --</option>
                      <option v-for="sector in adminStore.sectors" :key="sector.id" :value="sector.name">
                        {{ sector.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Duration</label>
                    <input v-model="form.duration" type="text"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      placeholder="e.g. 12 weeks" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Investment Amount</label>
                    <input v-model="form.investmentAmount" type="text"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      placeholder="e.g. Up to $500K" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Program Benefits (comma separated)</label>
                  <input v-model="form.benefitsRaw" type="text"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    placeholder="Benefit 1, Benefit 2, etc" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="handleSubmit" :disabled="loading || !form.name"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {{ loading ? 'Saving...' : (isEditMode ? 'Update Program' : 'Create Program') }}
          </button>
          <button type="button" @click="close"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useAdminStore } from '~/stores/admin.store'

const props = defineProps<{
  isOpen: boolean
  loading: boolean
  initialData?: any
}>()

const emit = defineEmits(['close', 'create', 'update'])
const adminStore = useAdminStore()

const availableTemplatesWithCurrent = computed(() => {
  // If editing, we must include the current template even if it's "assigned" to this program
  const available = adminStore.availableTemplates
  if (props.initialData && props.initialData.templateId) {
    const currentTemplate = adminStore.templates.find(t => String(t.id) === String(props.initialData.templateId))
    if (currentTemplate && !available.some(t => String(t.id) === String(currentTemplate.id))) {
      return [...available, currentTemplate]
    }
  }
  return available
})

onMounted(async () => {
  if (adminStore.sectors.length === 0) {
    await adminStore.fetchSectors()
  }
  if (adminStore.templates.length === 0) {
    await adminStore.fetchTemplatesData()
  }
})

const form = reactive({
  id: undefined as number | string | undefined,
  name: '',
  description: '',
  templateId: '',
  startDate: '',
  endDate: '',
  sector: '',
  duration: '',
  investmentAmount: '',
  benefitsRaw: ''
})

const isEditMode = computed(() => !!props.initialData)

// Auto-calculate duration
watch([() => form.startDate, () => form.endDate], ([start, end]) => {
  if (start && end) {
    const d1 = new Date(start)
    const d2 = new Date(end)
    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays <= 7) {
      form.duration = `${diffDays} days`
    } else {
      const weeks = Math.floor(diffDays / 7)
      form.duration = `${weeks} weeks`
    }
  }
})

// Watch for initialData changes to pre-fill form
watch(() => props.initialData, (newData) => {
  if (newData) {
    form.id = newData.id
    form.name = newData.name
    form.description = newData.description
    form.templateId = newData.templateId || ''
    form.startDate = newData.startDate || ''
    form.endDate = newData.endDate || ''
    form.sector = newData.sector || ''
    form.duration = newData.duration || ''
    form.investmentAmount = newData.investmentAmount || ''
    form.benefitsRaw = newData.benefits ? newData.benefits.join(', ') : ''
  } else {
    // Reset
    form.id = undefined
    form.name = ''
    form.description = ''
    form.templateId = ''
    form.startDate = ''
    form.endDate = ''
    form.sector = ''
    form.duration = ''
    form.investmentAmount = ''
    form.benefitsRaw = ''
  }
}, { immediate: true })

const close = () => {
  emit('close')
}

const handleSubmit = () => {
  // Look up template name for convenience
  const selectedTemplate = availableTemplatesWithCurrent.value.find((t: any) => String(t.id) === String(form.templateId))
  const benefits = form.benefitsRaw.split(',').map(b => b.trim()).filter(b => b !== '')
  const payload = {
    ...form,
    benefits,
    template: selectedTemplate ? selectedTemplate.name : undefined
  }

  if (isEditMode.value) {
    emit('update', payload)
  } else {
    emit('create', payload)
  }
}
</script>
