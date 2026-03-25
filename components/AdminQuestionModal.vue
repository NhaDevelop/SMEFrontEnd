<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

        <!-- Modal -->
        <div
            class="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-fade-in-up relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <h2 class="text-xl font-bold text-gray-900 mb-6">{{ isEditMode ? 'Edit Question' : 'Add New Question' }}
            </h2>

            <div v-if="errorMessage"
                class="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
                <ExclamationTriangleIcon class="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{{ errorMessage }}</span>
            </div>

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
                            <option value="Single Choice">Single Choice</option>
                            <option value="Multiple Choice">Multiple Choice</option>
                            <option value="Scale (1-10)">Scale (1-10)</option>
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

                <!-- Dynamic Options for Multiple Choice and Dropdown -->
                <div v-if="form.type === 'Single Choice' || form.type === 'Multiple Choice' || form.type === 'Dropdown Select'"
                    class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div class="flex items-center justify-between mb-3">
                        <label class="block text-sm font-medium text-gray-700">Answer Options *</label>
                        <button type="button" @click="addOption"
                            class="text-xs font-medium text-teal-600 hover:text-teal-700 flex items-center gap-1">
                            <PlusIcon class="w-3.5 h-3.5" />
                            Add Option
                        </button>
                    </div>

                    <div class="space-y-3">
                        <div v-for="(option, idx) in form.options" :key="idx"
                            class="flex gap-3 items-start bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                            <div class="flex-1 space-y-3">
                                <div>
                                    <label class="block text-xs font-medium text-gray-500 mb-1">Option Text</label>
                                    <input v-model="option.label" type="text"
                                        class="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                        :placeholder="`Option ${idx + 1}`" required />
                                </div>
                                <div class="flex items-center gap-3">
                                    <label class="block text-xs font-medium text-gray-500 w-20">Points (0-10):</label>
                                    <input type="range" v-model.number="option.points" min="0" max="10" step="1"
                                        class="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600">
                                    <span class="text-sm font-semibold text-teal-700 w-6 text-center">{{ option.points
                                        }}</span>
                                </div>
                            </div>
                            <button type="button" @click="removeOption(idx)"
                                class="mt-6 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                :disabled="form.options.length <= 1">
                                <TrashIcon class="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <p v-if="form.options.length === 0" class="text-xs text-gray-500 italic mt-3">Click "Add Option" to
                        create choices for this question.</p>
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
import { PlusIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
    isOpen: boolean
    initialData?: any
    pillars: any[]
    errorMessage?: string
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
    helperText: '',
    options: [{ label: 'Option 1', points: 10 }]
})

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        if (props.initialData) {
            const mappedOptions = props.initialData.options ? props.initialData.options.map((opt: any) => {
                if (typeof opt === 'string') return { label: opt, points: 10 }
                return { label: opt.label || '', points: typeof opt.points === 'number' ? opt.points : 10 }
            }) : [{ label: 'Option 1', points: 10 }]

            form.value = {
                ...props.initialData,
                options: mappedOptions
            }
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
                helperText: '',
                options: [{ label: 'Option 1', points: 10 }]
            }
        }
    }
})

const addOption = () => {
    form.value.options.push({ label: `Option ${form.value.options.length + 1}`, points: 10 })
}

const removeOption = (index: number) => {
    if (form.value.options.length > 1) {
        form.value.options.splice(index, 1)
    }
}

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
