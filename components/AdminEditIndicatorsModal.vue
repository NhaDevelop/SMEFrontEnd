<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>
    
    <!-- Modal -->
    <div class="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-900">Edit Indicators</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>

      <div class="p-6">
        <p class="text-sm text-gray-500 mb-4">Manage indicators for <strong>{{ pillarName }}</strong></p>
        
        <div class="space-y-3">
             <div v-for="(ind, index) in indicators" :key="index" class="flex items-center gap-2">
                 <input 
                    v-model="indicators[index]"
                    type="text" 
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                 />
                 <button @click="removeIndicator(index)" class="text-gray-400 hover:text-red-500">
                     <TrashIcon class="w-4 h-4" />
                 </button>
             </div>
        </div>

        <button 
            @click="addIndicator"
            class="mt-4 w-full py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-teal-600 hover:border-teal-300 hover:bg-teal-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
            <PlusIcon class="w-4 h-4" />
            Add Indicator
        </button>

        <div class="flex justify-end gap-3 mt-6">
             <button @click="$emit('close')" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium">Cancel</button>
             <button @click="save" class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { XMarkIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  isOpen: boolean
  pillarName: string
  initialIndicators: string[]
}>()

const emit = defineEmits(['close', 'save'])

const indicators = ref<string[]>([])

watch(() => props.isOpen, (val) => {
    if (val) {
        indicators.value = [...(props.initialIndicators || [])]
    }
})

const addIndicator = () => {
    indicators.value.push('')
}

const removeIndicator = (index: number) => {
    indicators.value.splice(index, 1)
}

const save = () => {
    emit('save', indicators.value.filter(i => i.trim() !== ''))
}
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}
</style>
