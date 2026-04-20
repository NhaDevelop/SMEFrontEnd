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
                  <p class="text-xs text-gray-500 mt-1">Select the assessment framework for this program. Only
                    unassigned templates are shown.</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Start Date</label>
                    <input v-model="form.startDate" type="date"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">End Date (Program Deadline)</label>
                    <input v-model="form.endDate" type="date"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">Enrollment Deadline</label>
                  <input v-model="form.enrollmentDeadline" type="date"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm" />
                  <p class="text-xs text-gray-500 mt-1">SMEs and Investors cannot enroll after this date. If blank,
                    defaults to End Date.</p>
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

                <!-- Readiness Thresholds Section -->
                <div class="border-t border-gray-100 pt-6 mt-6">
                  <h4 class="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <ChartBarIcon class="w-4 h-4 text-cyan-600" />
                    Readiness Score Strategy (Thread Scores)
                  </h4>
                  <p class="text-xs text-gray-500 mb-4">Define the score ranges for this specific program. These will
                    determine the SME's readiness status on their dashboard.</p>

                  <div class="space-y-4">
                    <div v-for="(t, idx) in form.thresholds" :key="t.id"
                      class="grid grid-cols-12 gap-3 items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div class="col-span-6">
                        <span class="text-xs font-bold text-gray-700 uppercase tracking-wider">{{ t.label }}</span>
                      </div>
                      <div class="col-span-3">
                        <label class="text-[10px] text-gray-400 block uppercase">Min</label>
                        <input v-model.number="t.min" type="number"
                          class="w-full border border-gray-200 rounded-md py-1 px-2 text-sm focus:ring-cyan-500 focus:border-cyan-500 outline-none" />
                      </div>
                      <div class="col-span-3">
                        <label class="text-[10px] text-gray-400 block uppercase">Max</label>
                        <input v-model.number="t.max" type="number"
                          class="w-full border border-gray-200 rounded-md py-1 px-2 text-sm focus:ring-cyan-500 focus:border-cyan-500 outline-none" />
                      </div>
                    </div>
                  </div>

                  <!-- Contiguous Range Validation Errors -->
                  <div v-if="thresholdErrors.length > 0" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div class="flex items-start gap-2">
                      <svg class="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      <div>
                        <p class="text-xs font-bold text-red-700 mb-1">Range errors detected — ranges must be contiguous
                          with no gaps or overlaps:</p>
                        <ul class="space-y-0.5">
                          <li v-for="err in thresholdErrors" :key="err" class="text-xs text-red-600">• {{ err }}</li>
                        </ul>
                        <p class="text-[10px] text-red-500 mt-1.5">Example of correct ranges: 0–39, 40–59, 60–79, 80–100
                        </p>
                      </div>
                    </div>
                  </div>
                  <div v-else class="mt-2 flex items-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="text-[11px] text-emerald-600 font-medium">Ranges are contiguous — no gaps or
                      overlaps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="handleSubmit" :disabled="loading || !form.name || thresholdErrors.length > 0"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            :title="thresholdErrors.length > 0 ? 'Fix range errors before saving' : ''">
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
import { ChartBarIcon } from '@heroicons/vue/24/outline'

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
  enrollmentDeadline: '',
  sector: '',
  duration: '',
  investmentAmount: '',
  benefitsRaw: '',
  thresholds: [
    { id: 'investor', label: 'Investment Ready', min: 80, max: 100 },
    { id: 'near', label: 'Near Ready', min: 60, max: 79 },
    { id: 'early', label: 'Early Stage', min: 40, max: 59 },
    { id: 'pre', label: 'Pre-Investment', min: 0, max: 39 }
  ] as any[]
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
    form.enrollmentDeadline = newData.enrollmentDeadline ? newData.enrollmentDeadline.split(' ')[0] : ''
    form.sector = newData.sector || ''
    form.duration = newData.duration || ''
    form.investmentAmount = newData.investmentAmount || ''
    form.benefitsRaw = newData.benefits ? newData.benefits.join(', ') : ''

    // Use thresholds from program if available, otherwise keep defaults
    if (newData.thresholds && newData.thresholds.length > 0) {
      form.thresholds = JSON.parse(JSON.stringify(newData.thresholds))
    } else {
      form.thresholds = [
        { id: 'investor', label: 'Investment Ready', min: 80, max: 100 },
        { id: 'near', label: 'Near Ready', min: 60, max: 79 },
        { id: 'early', label: 'Early Stage', min: 40, max: 59 },
        { id: 'pre', label: 'Pre-Investment', min: 0, max: 39 }
      ]
    }
  } else {
    // Reset
    form.id = undefined
    form.name = ''
    form.description = ''
    form.templateId = ''
    form.startDate = ''
    form.endDate = ''
    form.enrollmentDeadline = ''
    form.sector = ''
    form.duration = ''
    form.investmentAmount = ''
    form.benefitsRaw = ''
    form.thresholds = [
      { id: 'investor', label: 'Investment Ready', min: 80, max: 100 },
      { id: 'near', label: 'Near Ready', min: 60, max: 79 },
      { id: 'early', label: 'Early Stage', min: 40, max: 59 },
      { id: 'pre', label: 'Pre-Investment', min: 0, max: 39 }
    ]
  }
}, { immediate: true })

const close = () => {
  emit('close')
}

/**
 * Validates that thresholds are contiguous — every adjacent pair must satisfy:
 *   higher_tier.min === lower_tier.max + 1
 * Thresholds are sorted from highest min to lowest min before checking.
 */
const thresholdErrors = computed(() => {
  const errors: string[] = []
  // Sort by min descending (Investment Ready → Pre-Investment)
  const sorted = [...form.thresholds].sort((a, b) => b.min - a.min)

  for (let i = 0; i < sorted.length - 1; i++) {
    const upper = sorted[i]      // e.g. Near Ready: 60–79
    const lower = sorted[i + 1] // e.g. Early Stage: 40–59

    const expectedLowerMax = upper.min - 1 // lower's max must be exactly this

    if (lower.max > expectedLowerMax) {
      // Overlap: e.g. upper starts at 60, lower max is 62 → 60-62 overlaps
      errors.push(
        `Overlap between "${lower.label}" (max ${lower.max}) and "${upper.label}" (min ${upper.min}). ` +
        `"${lower.label}" max must be ${expectedLowerMax}.`
      )
    } else if (lower.max < expectedLowerMax) {
      // Gap: e.g. upper starts at 60, lower max is 58 → 59 is uncovered
      errors.push(
        `Gap between "${lower.label}" (max ${lower.max}) and "${upper.label}" (min ${upper.min}). ` +
        `"${lower.label}" max must be ${expectedLowerMax}.`
      )
    }
  }

  return errors
})

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
