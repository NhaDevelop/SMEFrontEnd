<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog"
        aria-modal="true">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" @click="close"></div>

        <!-- Modal Panel -->
        <div class="relative w-full max-w-lg bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                        class="w-6 h-6 text-green-600">
                        <path fill-rule="evenodd"
                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75 0 00-1.06 1.06l2.25 2.25a.75 0 001.14-.094l3.74-5.24z"
                            clip-rule="evenodd" />
                    </svg>
                    Achieve Goal
                </h2>
                <button @click="close" class="text-gray-400 hover:text-gray-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <h3 class="text-sm font-semibold text-gray-900 mb-1">Upload Proof of Achievement</h3>
                    <p class="text-sm text-gray-500">Provide evidence such as documents, screenshots, or notes so
                        investors can verify your accomplishment.</p>
                </div>

                <!-- Proof Note -->
                <div class="space-y-1">
                    <label for="proof-note" class="block text-sm font-medium text-gray-700">Completion Note *</label>
                    <textarea id="proof-note" v-model="form.proofNote" rows="3"
                        placeholder="e.g. We successfully closed our Seed round of $500k led by Acme Ventures..."
                        :class="['w-full rounded-lg shadow-sm sm:text-sm px-4 py-2.5 border', errors.proofNote ? 'border-red-500 focus:border-red-500 ring-red-500' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500']"></textarea>
                    <p v-if="errors.proofNote" class="text-xs text-red-500">A completion note is required to finalize
                        this goal.</p>
                </div>

                <!-- Proof Document -->
                <div class="space-y-1">
                    <label class="block text-sm font-medium text-gray-700">Supporting Document (Optional)</label>
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                        @click="triggerFileInput">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-8 h-8 text-gray-400 mb-2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                        <span class="text-sm font-medium text-teal-600 mb-1">Click to browse files</span>
                        <span class="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</span>
                        <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                    </div>

                    <!-- Selected File -->
                    <div v-if="form.proofDocument"
                        class="mt-3 flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div class="flex items-center gap-3 overflow-hidden">
                            <div
                                class="w-8 h-8 rounded bg-teal-50 flex items-center justify-center flex-shrink-0 text-teal-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                                </svg>
                            </div>
                            <span class="text-sm font-medium text-gray-900 truncate">{{ form.proofDocumentName }}</span>
                        </div>
                        <button @click="removeFile" class="text-gray-400 hover:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                <button @click="close"
                    class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors">
                    Cancel
                </button>
                <button @click="submitProof" :disabled="loading"
                    class="px-5 py-2.5 text-sm font-bold text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 focus:outline-none shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2">
                    <span v-if="loading"
                        class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {{ loading ? 'Finalizing...' : 'Submit & Mark Achieved' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    goalId: {
        type: [Number, String],
        required: true
    }
})

const emit = defineEmits(['close', 'confirm'])
const loading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const errors = reactive({
    proofNote: false
})

const form = reactive({
    proofNote: '',
    proofDocument: '', // Simulated Base64 or URL
    proofDocumentName: ''
})

watch(() => props.isOpen, (newValue) => {
    if (newValue) {
        errors.proofNote = false
        form.proofNote = ''
        form.proofDocument = ''
        form.proofDocumentName = ''
    }
})

const close = () => {
    if (loading.value) return
    emit('close')
}

const triggerFileInput = () => {
    fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        const file = target.files[0]
        if (!file) return

        form.proofDocumentName = file.name
        // Mock file upload: we just store the name as a mock "URL" 
        // In reality, this would trigger an upload to a bucket (Phase 7)
        form.proofDocument = `mock_url_${file.name.replace(/\s/g, '_')}`
    }
}

const removeFile = () => {
    form.proofDocument = ''
    form.proofDocumentName = ''
    if (fileInput.value) {
        fileInput.value.value = ''
    }
}

const submitProof = () => {
    errors.proofNote = !form.proofNote.trim()

    if (errors.proofNote) {
        return
    }

    loading.value = true

    // Fake upload delay to feel authentic
    setTimeout(() => {
        emit('confirm', {
            id: props.goalId,
            proofNote: form.proofNote,
            proofDocument: form.proofDocument
        })
        loading.value = false
    }, 600)
}
</script>
