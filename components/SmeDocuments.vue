<template>
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
                <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <DocumentTextIcon class="w-5 h-5 text-gray-400" />
                    SME Uploaded Documents ({{ documents.length }})
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                    Review documents that this SME has uploaded to their profile.
                </p>
            </div>
            <span v-if="loading" class="text-sm text-gray-400 flex items-center gap-1.5">
                <span class="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin"></span>
                Loading documents...
            </span>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && documents.length === 0"
            class="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-500">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <FolderIcon class="w-8 h-8 text-gray-300" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-1">No documents found</h3>
            <p class="text-sm max-w-sm mx-auto">This SME has not uploaded any documents yet.</p>
        </div>

        <!-- Document Table -->
        <div v-else-if="documents.length > 0" class="flex-1 overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[700px]">
                <thead>
                    <tr class="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                        <th class="px-6 py-3 font-semibold">Document Name</th>
                        <th class="px-6 py-3 font-semibold">Category</th>
                        <th class="px-6 py-3 font-semibold">Size</th>
                        <th class="px-6 py-3 font-semibold">Upload Date</th>
                        <th class="px-6 py-3 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="doc in documents" :key="doc.id"
                        class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-10 h-10 bg-teal-50 rounded-lg flex flex-col items-center justify-center text-teal-600 shrink-0 shadow-sm border border-teal-100/50">
                                    <DocumentIcon class="w-5 h-5" />
                                </div>
                                <div>
                                    <div class="font-bold text-gray-900 text-sm tracking-tight">{{ doc.name }}</div>
                                    <div v-if="doc.description"
                                        class="text-xs text-gray-500 truncate mt-0.5 max-w-[280px]">
                                        {{ doc.description }}
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4">
                            <span class="px-2.5 py-1 text-xs font-bold rounded-full border shadow-sm"
                                :class="categoryBadgeClass(doc.category)">
                                {{ doc.category }}
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600 font-medium">{{ doc.size }}</td>
                        <td class="px-6 py-4 text-sm text-gray-600 font-medium">{{ doc.date }}</td>
                        <td class="px-6 py-4 text-right">
                            <a :href="'/api/documents/' + doc.id" download :title="'Download ' + doc.name"
                                class="inline-flex p-2 text-teal-600 hover:text-white hover:bg-teal-600 bg-teal-50 rounded-lg transition-all shadow-sm border border-teal-100 items-center justify-center focus:ring-2 focus:ring-teal-500 outline-none">
                                <ArrowDownTrayIcon class="w-4 h-4" />
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    DocumentTextIcon,
    FolderIcon,
    DocumentIcon,
    ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
    smeId: string | number
}>()

const documents = ref<any[]>([])
const loading = ref(true)

const loadDocuments = async () => {
    loading.value = true
    try {
        const data = await $fetch<{ documents: any[] }>(`/api/documents?smeId=${props.smeId}`)
        documents.value = data.documents || []
    } catch (e) {
        console.error('Failed to load SME documents:', e)
        documents.value = []
    } finally {
        loading.value = false
    }
}

const categoryBadgeClass = (category: string) => {
    const map: Record<string, string> = {
        'Financial Reports': 'bg-blue-50 text-blue-700 border-blue-200',
        'Legal Documents': 'bg-purple-50 text-purple-700 border-purple-200',
        'Business Plans': 'bg-teal-50 text-teal-700 border-teal-200',
        'Pitch Decks': 'bg-orange-50 text-orange-700 border-orange-200',
        'Assessments': 'bg-green-50 text-green-700 border-green-200',
        'General': 'bg-gray-50 text-gray-700 border-gray-200'
    }
    return map[category] || 'bg-gray-50 text-gray-700 border-gray-200'
}

onMounted(() => {
    loadDocuments()
})
</script>
