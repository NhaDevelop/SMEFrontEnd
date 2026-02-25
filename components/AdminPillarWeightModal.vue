<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in-up">
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h3 class="text-lg font-bold text-gray-900">Pillar Scoring Weights</h3>
                    <p class="text-sm text-gray-500 mt-0.5">Adjust the relative importance of each pillar</p>
                </div>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <XMarkIcon class="w-5 h-5" />
                </button>
            </div>

            <!-- Body -->
            <div class="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                <!-- Total Weight Warning -->
                <div v-if="totalWeight !== 100" class="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                    <div class="flex">
                        <div class="flex-shrink-0">
                            <ExclamationTriangleIcon class="h-5 w-5 text-amber-500" />
                        </div>
                        <div class="ml-3">
                            <p class="text-sm text-amber-700">
                                Total weight must equal 100%. Current total: <span class="font-bold">{{ totalWeight
                                }}%</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div v-for="pillar in localPillars" :key="pillar.id" class="space-y-2">
                        <div class="flex items-center justify-between">
                            <label class="text-sm font-medium text-gray-700">{{ pillar.name }}</label>
                            <span class="text-sm font-bold text-cyan-700">{{ pillar.weight }}%</span>
                        </div>
                        <input type="range" v-model.number="pillar.weight" min="0" max="100" step="5"
                            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600" />
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                <button @click="$emit('close')"
                    class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-white transition-colors">
                    Cancel
                </button>
                <button @click="saveWeights" :disabled="totalWeight !== 100"
                    class="px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    <CheckCircleIcon class="w-4 h-4" />
                    Save Configuration
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
    isOpen: boolean
    pillars: any[]
}>()

const emit = defineEmits(['close', 'save'])

const localPillars = ref<any[]>([])

// Initialize local copy when modal opens
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        localPillars.value = JSON.parse(JSON.stringify(props.pillars))
    }
})

const totalWeight = computed(() => {
    return localPillars.value.reduce((sum, p) => sum + p.weight, 0)
})

const saveWeights = () => {
    emit('save', localPillars.value)
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
