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
                    class="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2">
                    <ArrowUpTrayIcon class="w-4 h-4" />
                    Upload Document
                </button>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto px-8 py-8">
            <div class="max-w-7xl mx-auto space-y-6">
                <!-- Search and Filter Bar -->
                <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
                    <div class="relative flex-1">
                        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input v-model="searchQuery" type="text" placeholder="Search documents..."
                            class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow outline-none" />
                    </div>
                    <div class="relative w-full sm:w-64">
                        <div class="relative">
                            <button @click="isFilterOpen = !isFilterOpen"
                                class="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors">
                                <div class="flex items-center gap-2 overflow-hidden">
                                    <FunnelIcon class="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span class="text-gray-700 truncate block">{{ selectedCategory }}</span>
                                </div>
                                <ChevronDownIcon
                                    class="w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0"
                                    :class="{ 'rotate-180': isFilterOpen }" />
                            </button>

                            <!-- Dropdown Menu -->
                            <Transition enter-active-class="transition duration-100 ease-out"
                                enter-from-class="transform scale-95 opacity-0"
                                enter-to-class="transform scale-100 opacity-100"
                                leave-active-class="transition duration-75 ease-in"
                                leave-from-class="transform scale-100 opacity-100"
                                leave-to-class="transform scale-95 opacity-0">
                                <div v-if="isFilterOpen"
                                    class="absolute right-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 origin-top-right ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <button v-for="category in categories" :key="category"
                                        @click="selectCategory(category)"
                                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-700 flex items-center justify-between group transition-colors">
                                        <span>{{ category }}</span>
                                        <CheckIcon v-if="selectedCategory === category" class="w-4 h-4 text-teal-600" />
                                    </button>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>

                <!-- Document List Section -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[400px] flex flex-col">
                    <div class="px-6 py-4 border-b border-gray-100">
                        <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <FolderIcon class="w-5 h-5 text-gray-400" />
                            Your Documents ({{ filteredDocuments.length }})
                        </h2>
                    </div>

                    <!-- Empty State -->
                    <div v-if="filteredDocuments.length === 0"
                        class="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <DocumentIcon class="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 class="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
                        <p class="text-gray-500 max-w-sm mx-auto">
                            {{ emptyStateMessage }}
                        </p>
                    </div>

                    <!-- Document List -->
                    <div v-else class="flex-1 overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="border-b border-gray-100 text-sm text-gray-500">
                                    <th class="px-6 py-3 font-medium">Name</th>
                                    <th class="px-6 py-3 font-medium">Category</th>
                                    <th class="px-6 py-3 font-medium">Date Added</th>
                                    <th class="px-6 py-3 font-medium">Size</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="doc in filteredDocuments" :key="doc.id"
                                    class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-8 h-8 bg-teal-50 rounded flex items-center justify-center text-teal-600">
                                                <DocumentIcon class="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div class="font-medium text-gray-900">{{ doc.name }}</div>
                                                <div class="text-xs text-gray-500 truncate max-w-[200px]">{{
                                                    doc.description }}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <span
                                            class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                                            {{ doc.category }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-500">{{ doc.date }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-500">{{ doc.size }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>

        <!-- Upload Modal -->
        <Transition enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isUploadModalOpen"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                @click="isUploadModalOpen = false">
                <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden" @click.stop>
                    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 class="text-lg font-semibold text-gray-900">Upload Document</h3>
                        <button @click="isUploadModalOpen = false"
                            class="text-gray-400 hover:text-gray-500 transition-colors">
                            <XMarkIcon class="w-5 h-5" />
                        </button>
                    </div>

                    <div class="p-6 space-y-4">
                        <p class="text-sm text-gray-500">Add a new document to your library</p>

                        <!-- File Input -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">File</label>
                            <div class="relative">
                                <input type="file" @change="handleFileUpload" class="hidden" id="file-upload" />
                                <label for="file-upload"
                                    class="w-full flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm text-gray-600">
                                    <span v-if="!newDocument.file" class="text-gray-400">Choose File</span>
                                    <span v-else class="text-gray-900 truncate">{{ newDocument.file.name }}</span>
                                </label>
                            </div>
                        </div>

                        <!-- Document Name -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                            <input v-model="newDocument.name" type="text" placeholder="Enter document name"
                                class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm" />
                        </div>

                        <!-- Description -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                            <textarea v-model="newDocument.description" rows="3"
                                placeholder="Brief description of the document"
                                class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm resize-none"></textarea>
                        </div>

                        <!-- Category -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select v-model="newDocument.category"
                                class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm appearance-none cursor-pointer">
                                <option v-for="cat in uploadCategories" :key="cat" :value="cat">{{ cat }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
                        <button @click="isUploadModalOpen = false"
                            class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button @click="uploadDocument" :disabled="!newDocument.file || !newDocument.name"
                            class="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
    ArrowUpTrayIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ChevronDownIcon,
    CheckIcon,
    FolderIcon,
    DocumentIcon,
    XMarkIcon
} from '@heroicons/vue/24/outline'

const searchQuery = ref('')
const selectedCategory = ref('All Categories')
const isFilterOpen = ref(false)
const isUploadModalOpen = ref(false)

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
}

const documents = ref<Doc[]>([])

const newDocument = ref<{
    file: File | null;
    name: string;
    description: string;
    category: string;
}>({
    file: null,
    name: '',
    description: '',
    category: 'General'
})

const filteredDocuments = computed(() => {
    return documents.value.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesCategory = selectedCategory.value === 'All Categories' || doc.category === selectedCategory.value
        return matchesSearch && matchesCategory
    })
})

const emptyStateMessage = computed(() => {
    return searchQuery.value
        ? `No documents match "${searchQuery.value}"`
        : 'Upload your first document to get started'
})

const selectCategory = (category: string) => {
    selectedCategory.value = category
    isFilterOpen.value = false
}

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.item(0)

    if (file) {
        newDocument.value.file = file
        if (!newDocument.value.name) {
            newDocument.value.name = file.name
        }
    }
}

const uploadDocument = () => {
    if (!newDocument.value.file || !newDocument.value.name) return

    // Mock upload - in a real app this would call an API
    setTimeout(() => {
        documents.value.unshift({
            id: Date.now().toString(),
            name: newDocument.value.name,
            category: newDocument.value.category,
            date: new Date().toLocaleDateString(),
            size: (newDocument.value.file!.size / 1024).toFixed(2) + ' KB',
            description: newDocument.value.description
        })

        // Reset form
        newDocument.value = {
            file: null,
            name: '',
            description: '',
            category: 'General'
        }
        isUploadModalOpen.value = false
    }, 500)
}

definePageMeta({
    layout: 'default',
    middleware: ['auth']
})
</script>
