<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('cancel')"></div>
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h3 class="text-lg font-bold text-gray-900">{{ isEdit ? 'Edit Custom Field' : 'Create Custom Field'
                        }}</h3>
                    <p class="text-sm text-gray-500 mt-0.5">Define a new custom field for data collection</p>
                </div>
                <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <XMarkIcon class="w-5 h-5" />
                </button>
            </div>

            <form @submit.prevent="save" class="p-6 space-y-5">

                <!-- Entity Type -->
                <div class="space-y-1.5">
                    <label class="block text-sm font-semibold text-gray-700">Entity Type <span
                            class="text-red-500">*</span></label>
                    <select v-model="form.entityType" required
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white">
                        <option value="SME">SME</option>
                        <option value="User">User</option>
                        <option value="Program">Program</option>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <!-- Field Name (Identifier) -->
                    <div class="space-y-1.5">
                        <label class="block text-sm font-semibold text-gray-700">Field Name <span
                                class="text-red-500">*</span></label>
                        <input v-model="form.name" type="text" placeholder="e.g., taxId" required
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none" />
                        <p class="text-xs text-gray-500">Used as the field identifier</p>
                    </div>

                    <!-- Display Label -->
                    <div class="space-y-1.5">
                        <label class="block text-sm font-semibold text-gray-700">Display Label <span
                                class="text-red-500">*</span></label>
                        <input v-model="form.label" type="text" placeholder="e.g., Tax ID Number" required
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none" />
                        <p class="text-xs text-gray-500">Shown in forms</p>
                    </div>
                </div>

                <!-- Field Type -->
                <div class="space-y-1.5">
                    <label class="block text-sm font-semibold text-gray-700">Field Type <span
                            class="text-red-500">*</span></label>
                    <div class="relative">
                        <select v-model="form.type" required
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-white appearance-none">
                            <option value="Text">Text</option>
                            <option value="Number">Number</option>
                            <option value="Date">Date</option>
                            <option value="Dropdown">Dropdown</option>
                            <option value="Yes/No">Yes/No</option>
                        </select>
                        <ChevronDownIcon
                            class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <!-- Options for Dropdown -->
                <div v-if="form.type === 'Dropdown'" class="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <label class="block text-sm font-semibold text-gray-700">Options <span
                            class="text-red-500">*</span></label>
                    <div class="space-y-2">
                        <div v-for="(opt, idx) in form.options" :key="idx" class="flex items-center gap-2">
                            <input v-model="form.options[idx]" type="text" placeholder="Option label"
                                class="flex-1 px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:ring-1 focus:ring-cyan-500 outline-none" />
                            <button type="button" @click="removeOption(idx)"
                                class="text-gray-400 hover:text-red-500 p-1">
                                <XMarkIcon class="w-4 h-4" />
                            </button>
                        </div>
                        <button type="button" @click="addOption"
                            class="text-sm text-cyan-600 hover:text-cyan-700 font-medium flex items-center gap-1">
                            <PlusIcon class="w-3.5 h-3.5" /> Add Option
                        </button>
                    </div>
                </div>

                <!-- Toggles -->
                <div class="flex items-center justify-between pt-2">
                    <div class="flex items-center gap-3">
                        <button type="button" @click="form.required = !form.required"
                            :class="form.required ? 'bg-cyan-600' : 'bg-gray-200'"
                            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                            <span :class="form.required ? 'translate-x-5' : 'translate-x-0'"
                                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                        </button>
                        <span class="text-sm font-medium text-gray-700">Required field</span>
                    </div>

                    <div class="flex items-center gap-3">
                        <button type="button" @click="form.active = !form.active"
                            :class="form.active ? 'bg-teal-600' : 'bg-gray-200'"
                            class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                            <span :class="form.active ? 'translate-x-5' : 'translate-x-0'"
                                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                        </button>
                        <span class="text-sm font-medium text-gray-700">Active</span>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button type="button" @click="$emit('cancel')"
                        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit"
                        class="px-6 py-2 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors flex items-center gap-2">
                        <FolderArrowDownIcon v-if="isEdit" class="w-4 h-4" />
                        <PlusIcon v-else class="w-4 h-4" />
                        {{ isEdit ? 'Save Field' : 'Create Field' }}
                    </button>
                </div>

            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { XMarkIcon, PlusIcon, ChevronDownIcon, FolderArrowDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
    fieldData?: any
}>()

const emit = defineEmits(['cancel', 'save'])

const isEdit = computed(() => !!props.fieldData?.id)

const form = ref({
    entityType: 'SME',
    name: '',
    label: '',
    type: 'Text',
    required: false,
    active: true,
    options: [] as string[]
})

onMounted(() => {
    if (props.fieldData) {
        form.value = { ...props.fieldData }
    }
})

const addOption = () => {
    form.value.options.push('')
}

const removeOption = (idx: number) => {
    form.value.options.splice(idx, 1)
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
