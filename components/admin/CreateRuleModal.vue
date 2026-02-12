<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('cancel')"></div>
    
    <!-- Modal -->
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
           <h3 class="text-lg font-bold text-gray-900">{{ initialData ? 'Edit Scoring Rule' : 'Create Scoring Rule' }}</h3>
           <p class="text-sm text-gray-500 mt-0.5">{{ initialData ? 'Update existing rule logic' : 'Define conditions that adjust the final score' }}</p>
        </div>
        <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
      
      <!-- Body -->
      <form @submit.prevent="save" class="p-6 space-y-6">
        <!-- Rule Name -->
        <div class="space-y-1.5">
          <label class="block text-sm font-semibold text-gray-700">Rule Name <span class="text-red-500">*</span></label>
          <input 
            v-model="form.name"
            type="text" 
            placeholder="e.g., High-Growth Bonus" 
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow"
          />
        </div>

        <!-- Description -->
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-gray-700">Description</label>
          <textarea 
            v-model="form.description"
            rows="3"
            placeholder="Explain when this rule applies..." 
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow resize-none"
          ></textarea>
        </div>

        <!-- Condition -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Condition <span class="text-red-500">*</span></label>
          <input 
            v-model="form.condition"
            type="text" 
            placeholder="e.g., growthRate > 20" 
            required
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow font-mono text-sm"
          />
          <!-- Helper Chips -->
          <div class="flex flex-wrap gap-2">
              <button 
                type="button" 
                v-for="chip in helperChips" 
                :key="chip"
                @click="appendCondition(chip)"
                class="px-2 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded text-xs font-medium text-gray-600 transition-colors"
              >
                {{ chip }}
              </button>
          </div>
        </div>

        <!-- Score Modifier -->
        <div class="space-y-1.5">
             <label class="block text-sm font-medium text-gray-700">Score Modifier</label>
             <div class="flex items-center gap-4">
                 <input 
                    v-model.number="form.modifier"
                    type="number" 
                    placeholder="0" 
                    class="w-24 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow text-center font-bold"
                 />
                 <span :class="['px-3 py-1.5 rounded-full text-sm font-bold', form.modifier >= 0 ? 'bg-teal-600 text-white' : 'bg-red-500 text-white']">
                     {{ form.modifier > 0 ? '+' : '' }}{{ form.modifier }} points
                 </span>
             </div>
             <p class="text-xs text-gray-500 mt-1">Positive values add to the score, negative values subtract</p>
        </div>

        <!-- Active Toggle -->
        <div class="flex items-center gap-3">
             <button 
                type="button" 
                @click="form.isActive = !form.isActive" 
                :class="[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                   form.isActive ? 'bg-teal-600' : 'bg-gray-200'
                ]"
             >
                <span 
                    aria-hidden="true" 
                    :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                         form.isActive ? 'translate-x-5' : 'translate-x-0'
                    ]"
                />
             </button>
             <span class="text-sm font-medium text-gray-700">Active</span>
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
                class="px-6 py-2 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors flex items-center gap-2"
             >
                <BoltIcon class="w-4 h-4" />
                Save Rule
             </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XMarkIcon, BoltIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
    initialData?: any
}>()

const emit = defineEmits(['cancel', 'save'])

const form = ref({
    name: props.initialData?.name || '',
    description: props.initialData?.description || '',
    condition: props.initialData?.condition || '',
    modifier: props.initialData?.modifier !== undefined ? props.initialData.modifier : 5,
    isActive: props.initialData?.isActive !== undefined ? props.initialData.isActive : true,
    id: props.initialData?.id 
})

const helperChips = [
    'Growth Rate > X%', 
    'Revenue > $X', 
    'Team Experience > X years', 
    'Pillar Score < X'
]

const appendCondition = (text: string) => {
    form.value.condition = text
}

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
