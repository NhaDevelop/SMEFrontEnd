<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('cancel')"></div>

        <!-- Modal -->
        <div class="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                    <h3 class="text-lg font-bold text-gray-900">Create New Version</h3>
                    <p class="text-sm text-gray-500 mt-0.5">Create a new version of "{{ templateName }}"</p>
                </div>
                <button @click="$emit('cancel')" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <XMarkIcon class="w-5 h-5" />
                </button>
            </div>

            <!-- Body -->
            <form @submit.prevent="save" class="p-6 space-y-6">
                <!-- Version Number -->
                <div class="space-y-1.5">
                    <label class="block text-sm font-semibold text-gray-700">Version Number <span
                            class="text-red-500">*</span></label>
                    <input v-model="form.version" type="text" placeholder="e.g., 1.1" required
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow" />
                    <p class="text-xs text-gray-500">Current version: {{ currentVersion }}</p>
                </div>

                <!-- Changelog -->
                <div class="space-y-1.5">
                    <label class="block text-sm font-medium text-gray-700">Changelog</label>
                    <textarea v-model="form.changelog" rows="4" placeholder="Describe what changed in this version..."
                        class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-shadow resize-none"></textarea>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button type="button" @click="$emit('cancel')"
                        class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button type="submit"
                        class="px-6 py-2 bg-teal-600/50 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
                        :class="{ 'opacity-100 bg-teal-600': form.version }">
                        Create Version
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
    templateName: string
    currentVersion: string
}>()

const emit = defineEmits(['cancel', 'save'])

const form = ref({
    version: '',
    changelog: ''
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
