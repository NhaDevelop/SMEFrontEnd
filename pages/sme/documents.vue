<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Document Management</h1>
                    <p class="text-gray-500 mt-1">Upload, organize, and share your documents</p>
                </div>
                <button @click="isUploadModalOpen = true"
                    class="px-4 py-2 bg-teal-600 text-white rounded-md font-medium hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-sm">
                    <ArrowUpTrayIcon class="w-4 h-4" />
                    Upload Document
                </button>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto px-8 py-8">
            <div class="max-w-7xl mx-auto space-y-6">
                <!-- Search and Filter Bar -->
                <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
                    <div class="relative flex-1">
                        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input v-model="searchQuery" type="text" placeholder="Search documents..."
                            class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow outline-none" />
                    </div>
                    <div class="relative w-full sm:w-64">
                        <button @click="isFilterOpen = !isFilterOpen"
                            class="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                            <div class="flex items-center gap-2">
                                <FunnelIcon class="w-4 h-4 text-gray-500" />
                                <span class="text-gray-700 truncate">{{ selectedCategory }}</span>
                            </div>
                            <ChevronDownIcon class="w-4 h-4 text-gray-500 transition-transform duration-200"
                                :class="{ 'rotate-180': isFilterOpen }" />
                        </button>
                        <Transition enter-active-class="transition duration-100 ease-out"
                            enter-from-class="transform scale-95 opacity-0"
                            enter-to-class="transform scale-100 opacity-100"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="transform scale-100 opacity-100"
                            leave-to-class="transform scale-95 opacity-0">
                            <div v-if="isFilterOpen"
                                class="absolute right-0 mt-2 w-full bg-white rounded-md shadow-lg border border-gray-100 py-1 z-50">
                                <button v-for="category in categories" :key="category" @click="selectCategory(category)"
                                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-700 flex items-center justify-between transition-colors">
                                    <span>{{ category }}</span>
                                    <CheckIcon v-if="selectedCategory === category" class="w-4 h-4 text-teal-600" />
                                </button>
                            </div>
                        </Transition>
                    </div>
                </div>

                <!-- Document List -->
                <div class="bg-white rounded-lg border border-gray-200 shadow-sm min-h-[400px] flex flex-col">
                    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <FolderIcon class="w-5 h-5 text-gray-400" />
                            Your Documents ({{ filteredDocuments.length }})
                        </h2>
                        <span v-if="loadingDocs" class="text-sm text-gray-400 flex items-center gap-1.5">
                            <span
                                class="w-3 h-3 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></span>
                            Loading...
                        </span>
                    </div>

                    <!-- Empty State -->
                    <div v-if="!loadingDocs && filteredDocuments.length === 0"
                        class="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div
                            class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                            <DocumentIcon class="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
                        <p class="text-gray-500 max-w-sm mx-auto text-sm">
                            {{ emptyStateMessage }}
                        </p>
                        <button v-if="!searchQuery" @click="isUploadModalOpen = true"
                            class="mt-4 px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
                            <ArrowUpTrayIcon class="w-4 h-4" />
                            Upload Document
                        </button>
                    </div>

                    <!-- Document Table -->
                    <div v-else-if="filteredDocuments.length > 0" class="flex-1 overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                                    <th class="px-6 py-3 font-medium">Name</th>
                                    <th class="px-6 py-3 font-medium">Category</th>
                                    <th class="px-6 py-3 font-medium">Size</th>
                                    <th class="px-6 py-3 font-medium">Uploaded</th>
                                    <th class="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="doc in filteredDocuments" :key="doc.id"
                                    class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-9 h-9 bg-teal-50 rounded-md flex items-center justify-center text-teal-600 shrink-0">
                                                <DocumentIcon class="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div class="font-medium text-gray-900 text-sm">{{ doc.name }}</div>
                                                <div v-if="doc.description"
                                                    class="text-xs text-gray-400 truncate max-w-[200px]">{{
                                                        doc.description }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span class="px-2.5 py-1 text-xs font-medium rounded-full"
                                            :class="categoryBadgeClass(doc.category)">
                                            {{ doc.category }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-500">{{ doc.size }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-500">{{ doc.date }}</td>
                                    <td class="px-6 py-4 text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            <!-- Download -->
                                            <a :href="useRuntimeConfig().public.apiBase + '/documents/' + doc.id" download
                                                :title="'Download ' + doc.name"
                                                class="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors">
                                                <ArrowDownTrayIcon class="w-4 h-4" />
                                            </a>
                                            <!-- Delete -->
                                            <button @click="deleteDocument(doc.id)" :disabled="deletingId === doc.id"
                                                :title="'Delete ' + doc.name"
                                                class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-40">
                                                <TrashIcon v-if="deletingId !== doc.id" class="w-4 h-4" />
                                                <span v-else
                                                    class="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin inline-block"></span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>

        <!-- Upload Modal -->
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="isUploadModalOpen"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                @click.self="isUploadModalOpen = false">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                    <!-- Header -->
                    <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">Upload Document</h3>
                            <p class="text-sm text-gray-500 mt-0.5">Add a new document to your library</p>
                        </div>
                        <button @click="isUploadModalOpen = false"
                            class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                            <XMarkIcon class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="p-6 space-y-4">

                        <!-- Drop Zone -->
                        <div @dragover.prevent="isDragging = true" @dragleave="isDragging = false"
                            @drop.prevent="handleDrop"
                            :class="['border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer', isDragging ? 'border-teal-400 bg-teal-50' : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50/50']"
                            @click="fileInput && fileInput.click()">
                            <input ref="fileInput" type="file" @change="handleFileUpload" class="hidden"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip" />
                            <ArrowUpTrayIcon class="w-8 h-8 text-gray-300 mx-auto mb-3"
                                :class="{ 'text-teal-400': isDragging }" />
                            <div v-if="!newDocument.file">
                                <p class="text-sm font-medium text-gray-600">
                                    <span class="text-teal-600">Click to upload</span> or drag & drop
                                </p>
                                <p class="text-xs text-gray-400 mt-1">PDF, Word, Excel, PowerPoint, Images (max 50MB)
                                </p>
                            </div>
                            <div v-else class="flex items-center justify-center gap-2">
                                <DocumentIcon class="w-5 h-5 text-teal-600" />
                                <span class="text-sm font-medium text-teal-700 truncate max-w-[280px]">{{
                                    newDocument.file.name }}</span>
                                <CheckCircleIcon class="w-5 h-5 text-teal-500 shrink-0" />
                            </div>
                        </div>

                        <!-- Document Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">
                                Document Name <span class="text-red-400">*</span>
                            </label>
                            <input v-model="newDocument.name" type="text" placeholder="Enter document name"
                                class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm transition" />
                        </div>

                        <!-- Category -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                            <select v-model="newDocument.category"
                                class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm appearance-none cursor-pointer transition">
                                <option v-for="cat in uploadCategories" :key="cat" :value="cat">{{ cat }}</option>
                            </select>
                        </div>

                        <!-- Description -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">Description <span
                                    class="text-gray-400 font-normal">(optional)</span></label>
                            <textarea v-model="newDocument.description" rows="2"
                                placeholder="Brief description of the document"
                                class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-sm resize-none transition"></textarea>
                        </div>

                        <!-- Error -->
                        <div v-if="uploadError"
                            class="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                            <ExclamationCircleIcon class="w-4 h-4 shrink-0" />
                            {{ uploadError }}
                        </div>
                    </div>

                    <!-- Footer -->
                    <div
                        class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3 rounded-b-xl">
                        <button @click="isUploadModalOpen = false"
                            class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button @click="uploadDocument" :disabled="!newDocument.file || !newDocument.name || uploading"
                            class="px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm">
                            <span v-if="uploading"
                                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            <ArrowUpTrayIcon v-else class="w-4 h-4" />
                            {{ uploading ? 'Uploading...' : 'Upload' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
    ArrowUpTrayIcon,
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ChevronDownIcon,
    CheckIcon,
    FolderIcon,
    DocumentIcon,
    TrashIcon,
    XMarkIcon,
    CheckCircleIcon,
    ExclamationCircleIcon
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth.store'

definePageMeta({
    layout: 'default',
    middleware: ['auth']
})

const authStore = useAuthStore()
const smeId = computed(() => authStore.user?.company?.id || 1)

// ── State ─────────────────────────────────────────────────────────────────────
const searchQuery = ref('')
const selectedCategory = ref('All Categories')
const isFilterOpen = ref(false)
const isUploadModalOpen = ref(false)
const isDragging = ref(false)
const loadingDocs = ref(true)
const uploading = ref(false)
const uploadError = ref('')
const deletingId = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const categories = [
    'All Categories',
    'Financial Reports',
    'Legal Documents',
    'Business Plans',
    'Pitch Decks',
    'Assessments',
    'General'
]
const uploadCategories = categories.filter(c => c !== 'All Categories')

interface Doc {
    id: string
    name: string
    category: string
    date: string
    size: string
    description?: string
    download_url?: string
}

const documents = ref<Doc[]>([])

const newDocument = ref<{
    file: File | null
    name: string
    description: string
    category: string
}>({
    file: null,
    name: '',
    description: '',
    category: 'General'
})

// ── Computed ──────────────────────────────────────────────────────────────────
const filteredDocuments = computed(() => {
    return documents.value.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesCategory = selectedCategory.value === 'All Categories' || doc.category === selectedCategory.value
        return matchesSearch && matchesCategory
    })
})

const emptyStateMessage = computed(() =>
    searchQuery.value
        ? 'No documents match "' + searchQuery.value + '"'
        : 'Upload your first document to get started'
)

const categoryBadgeClass = (category: string) => {
    const map: Record<string, string> = {
        'Financial Reports': 'bg-blue-50 text-blue-700',
        'Legal Documents': 'bg-purple-50 text-purple-700',
        'Business Plans': 'bg-teal-50 text-teal-700',
        'Pitch Decks': 'bg-orange-50 text-orange-700',
        'Assessments': 'bg-green-50 text-green-700',
        'General': 'bg-gray-100 text-gray-600'
    }
    return map[category] || 'bg-gray-100 text-gray-600'
}

// ── Load Documents from Server ────────────────────────────────────────────────
const loadDocuments = async () => {
    loadingDocs.value = true
    const api = useApi()
    try {
        const response = await api<any>('/documents')
        const data = response.data || response || {}
        documents.value = data.documents || data || []
    } catch (e) {
        console.error('Failed to load documents:', e)
        documents.value = []
    } finally {
        loadingDocs.value = false
    }
}

onMounted(loadDocuments)

// ── Upload ────────────────────────────────────────────────────────────────────
const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.item(0)
    if (file) {
        newDocument.value.file = file
        if (!newDocument.value.name) {
            // Strip extension for display name
            newDocument.value.name = file.name.replace(/\.[^.]+$/, '')
        }
    }
}

const handleDrop = (event: DragEvent) => {
    isDragging.value = false
    const file = event.dataTransfer?.files?.item(0)
    if (file) {
        newDocument.value.file = file
        if (!newDocument.value.name) {
            newDocument.value.name = file.name.replace(/\.[^.]+$/, '')
        }
    }
}

const uploadDocument = async () => {
    if (!newDocument.value.file || !newDocument.value.name) return
    uploadError.value = ''
    uploading.value = true
    const api = useApi()

    try {
        const formData = new FormData()
        formData.append('file', newDocument.value.file)
        formData.append('name', newDocument.value.name)
        formData.append('category', newDocument.value.category)
        formData.append('description', newDocument.value.description)

        await api('/documents', {
            method: 'POST',
            body: formData
        })

        // Reload documents from server
        await loadDocuments()

        // Reset form & close
        newDocument.value = { file: null, name: '', description: '', category: 'General' }
        isUploadModalOpen.value = false
    } catch (e: any) {
        uploadError.value = e?.data?.message || 'Upload failed. Please try again.'
    } finally {
        uploading.value = false
    }
}

// ── Delete ────────────────────────────────────────────────────────────────────
const deleteDocument = async (id: string) => {
    if (!confirm('Delete this document? This cannot be undone.')) return
    deletingId.value = id
    const api = useApi()
    try {
        await api(`/documents/${id}`, { method: 'DELETE' })
        documents.value = documents.value.filter(d => d.id !== id)
    } catch (e) {
        alert('Failed to delete document.')
    } finally {
        deletingId.value = null
    }
}

// ── Misc ──────────────────────────────────────────────────────────────────────
const selectCategory = (category: string) => {
    selectedCategory.value = category
    isFilterOpen.value = false
}
</script>
