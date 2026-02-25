<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

        <!-- Modal -->
        <div
            class="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-fade-in-up relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 class="text-xl font-bold text-gray-900 mb-6">{{ isEditMode ? 'Edit Question' : 'Add New Question' }}
            </h2>

            <form @submit.prevent="handleSubmit" class="space-y-5">
                <!-- Pillar Selection -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Pillar *</label>
                    <select v-model="form.pillarId"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white">
                        <option disabled value="">Select pillar</option>
                        <option v-for="p in pillars" :key="p.id" :value="p.id">{{ p.name }}</option>
                    </select>
                </div>

                <!-- Question Text -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Question Text *</label>
                    <textarea v-model="form.text" rows="3"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                        placeholder="Enter your question..." required></textarea>
                </div>

                <!-- Type and Weight Row -->
                <div class="grid grid-cols-2 gap-5">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Question Type</label>
                        <select v-model="form.type"
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white">
                            <option value="Yes/No">Yes/No</option>
                            <option value="Multiple Choice">Multiple Choice</option>
                            <option value="Scale (1-10)">Scale (1-10)</option>
                            <option value="Text Input">Text Input</option>
                            <option value="Number Input">Number Input</option>
                            <option value="Dropdown Select">Dropdown Select</option>
                            <option value="File Upload">File Upload</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Weight (%)</label>
                        <div class="relative">
                            <input v-model.number="form.weight" type="number"
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none pr-8" />
                            <span class="absolute right-3 top-2 text-gray-400 text-sm">%</span>
                        </div>
                    </div>
                </div>

                <!-- Required Toggle -->
                <div class="flex items-center">
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input v-model="form.required" type="checkbox" class="sr-only peer">
                        <div
                            class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600">
                        </div>
                        <span class="ml-3 text-sm font-medium text-gray-700">Required question</span>
                    </label>
                </div>

                <!-- Helper Text -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Help Text (optional)</label>
                    <input v-model="form.helperText" type="text"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                        placeholder="Additional guidance for respondents..." />
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3 mt-8 pt-4">
                    <button type="button" @click="$emit('close')"
                        class="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors border border-gray-300">Cancel</button>
                    <button type="submit"
                        class="px-5 py-2.5 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors shadow-sm">
                        {{ isEditMode ? 'Update Question' : 'Add Question' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
    isOpen: boolean
    initialData?: any
    pillars: any[]
}>()

const emit = defineEmits(['close', 'save'])

const isEditMode = computed(() => !!props.initialData?.id)

const form = ref({
    id: undefined,
    text: '',
    pillarId: 'team',
    templateId: '',
    type: 'Yes/No',
    weight: 10,
    required: true,
    helperText: ''
})

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        if (props.initialData) {
            form.value = { ...props.initialData }
        } else {
            // Reset default
            form.value = {
                id: undefined,
                text: '',
                pillarId: props.initialData?.pillarId || 'team',
                templateId: props.initialData?.templateId, // Preserve template context
                type: 'Yes/No',
                weight: 10,
                required: true,
                helperText: ''
            }
        }
    }
})

const handleSubmit = () => {
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
