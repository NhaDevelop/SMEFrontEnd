<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-xl font-bold text-gray-900">Question Builder</h1>
                    <p class="text-sm text-gray-500 mt-1">Create and manage assessment questions</p>
                </div>
                <div class="flex items-center gap-3">
                    <select v-model="selectedTemplateId"
                        class="form-select pl-3 pr-8 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-cyan-500 focus:border-cyan-500 max-w-xs">
                        <option v-for="t in templates" :key="t.id" :value="t.id">{{ t.name }}</option>
                    </select>
                    <button
                        class="px-3 py-1.5 bg-teal-700 text-white rounded-lg text-sm font-medium hover:bg-teal-800 transition-colors flex items-center gap-2">
                        <PrinterIcon class="w-4 h-4" />
                        Save Template
                    </button>
                </div>
            </div>

            <!-- Summary Cards -->
            <div class="grid grid-cols-4 gap-3 mt-6">
                <div class="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-gray-500">Total Questions</p>
                        <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ questions.length }}</p>
                    </div>
                    <div class="p-2 bg-teal-50 rounded-lg">
                        <DocumentTextIcon class="w-5 h-5 text-teal-600" />
                    </div>
                </div>
                <div class="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-gray-500">Pillars</p>
                        <p class="text-2xl font-bold text-gray-900 mt-0.5">{{ relevantPillars.length }}</p>
                    </div>
                    <div class="p-2 bg-blue-50 rounded-lg">
                        <ListBulletIcon class="w-5 h-5 text-blue-600" />
                    </div>
                </div>
                <div class="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-gray-500">Version</p>
                        <div class="flex items-center gap-2 mt-0.5">
                            <p class="text-2xl font-bold text-gray-900">{{ selectedTemplate?.version }}</p>
                            <span
                                class="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">Active</span>
                        </div>
                    </div>
                </div>
                <div class="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p class="text-xs font-medium text-gray-500">Last Updated</p>
                        <p class="text-lg font-bold text-gray-900 mt-0.5">{{ selectedTemplate?.updatedAt || 'N/A' }}</p>
                    </div>
                </div>
            </div>
        </header>

        <div class="flex-1 flex overflow-hidden">
            <!-- Sidebar Pillars -->
            <aside class="w-64 bg-white border-r border-gray-200 overflow-y-auto p-4 flex-shrink-0">
                <h3 class="text-base font-bold text-gray-900 mb-3">Filter by Pillar</h3>

                <button @click="selectedPillar = 'all'" :class="[
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors mb-1.5',
                    selectedPillar === 'all' ? 'bg-teal-700 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                ]">
                    <span>All Pillars ({{ questions.length }})</span>
                </button>

                <div class="space-y-1">
                    <button v-for="pillar in relevantPillars" :key="pillar.id" @click="selectedPillar = pillar.id"
                        :class="[
                            'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                            selectedPillar === pillar.id ? 'bg-teal-50 text-teal-800' : 'text-gray-600 hover:bg-gray-50'
                        ]">
                        <span>{{ pillar.name }}</span>
                        <span class="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                            {{ getPillarQuestionCount(pillar.id) }}
                        </span>
                    </button>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-lg font-bold text-gray-900">Questions</h2>
                    <button @click="openCreateModal"
                        class="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-1.5 shadow-sm">
                        <PlusIcon class="w-4 h-4" />
                        Add Question
                    </button>
                </div>

                <div class="space-y-6">
                    <div v-for="(group, index) in groupedQuestions" :key="index"
                        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <!-- Group Header -->
                        <div class="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                            @click="toggleGroup(group.pillarId)">
                            <div class="flex items-center gap-3">
                                <h3 class="text-base font-bold text-gray-900">{{ group.pillarName }}</h3>
                                <span class="bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md text-xs font-semibold">
                                    {{ group.questions.length }} questions
                                </span>
                            </div>
                            <ChevronDownIcon class="w-5 h-5 text-gray-400 transition-transform duration-200"
                                :class="{ 'transform rotate-180': expandedPillars.includes(group.pillarId) }" />
                        </div>

                        <!-- Questions List -->
                        <div v-show="expandedPillars.includes(group.pillarId)" class="divide-y divide-gray-100">
                            <div v-for="q in group.questions" :key="q.id"
                                class="p-4 hover:bg-gray-50 transition-colors group relative">
                                <div class="flex items-start gap-3">
                                    <!-- Drag Handle -->
                                    <div class="mt-1 cursor-grab text-gray-300 hover:text-gray-500">
                                        <span class="sr-only">Drag</span>
                                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 5v.01M8 12v.01M8 19v.01M8 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </div>

                                    <div class="flex-1">
                                        <div class="flex items-start justify-between">
                                            <div class="flex-1 pr-6">
                                                <p class="text-gray-900 font-medium text-sm mb-2">
                                                    <span class="text-gray-400 font-normal mr-2">{{
                                                        q.id.toUpperCase()
                                                    }}</span>
                                                    {{ q.text }}
                                                </p>

                                                <div class="flex items-center gap-2 mb-1">
                                                    <span
                                                        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200 bg-white text-gray-700">
                                                        <component :is="getIconForType(q.type)" class="w-3.5 h-3.5" />
                                                        {{ q.type }}
                                                    </span>
                                                    <span
                                                        class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                        Weight: {{ q.weight }}%
                                                    </span>
                                                    <span v-if="q.required"
                                                        class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-rose-500 text-white shadow-sm">
                                                        Required
                                                    </span>
                                                </div>

                                                <p v-if="q.helperText"
                                                    class="text-xs text-gray-500 mt-2 italic flex items-center gap-1">
                                                    <InformationCircleIcon class="w-3.5 h-3.5" />
                                                    {{ q.helperText }}
                                                </p>
                                            </div>

                                            <!-- Actions -->
                                            <div
                                                class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button @click.stop="openEditModal(q)"
                                                    class="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                                                    title="Edit">
                                                    <PencilSquareIcon class="w-4 h-4" />
                                                </button>
                                                <button @click.stop="handleDuplicate(q)"
                                                    class="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                                                    title="Duplicate">
                                                    <DocumentDuplicateIcon class="w-4 h-4" />
                                                </button>
                                                <button @click.stop="handleDelete(q.id)"
                                                    class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete">
                                                    <TrashIcon class="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty State for filtered results -->
                    <div v-if="groupedQuestions.length === 0"
                        class="text-center py-8 bg-white rounded-xl border border-gray-200 border-dashed">
                        <p class="text-sm text-gray-500">No questions found for this pillar. Add one to get started.
                        </p>
                    </div>
                </div>
            </main>
        </div>

        <!-- Custom Modal -->
        <QuestionModal :is-open="showModal" :initial-data="editingQuestion" :pillars="pillars"
            @close="showModal = false" @save="handleSave" />

    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAdminStore } from '~/stores/admin.store'
import QuestionModal from '~/components/admin/QuestionModal.vue'
import {
    PlusIcon,
    PencilSquareIcon,
    DocumentTextIcon,
    ListBulletIcon,
    PrinterIcon,
    ChevronDownIcon,
    DocumentDuplicateIcon,
    TrashIcon,
    CheckCircleIcon,
    HashtagIcon,
    Bars3BottomLeftIcon,
    PaperClipIcon,
    ArrowUpCircleIcon
} from '@heroicons/vue/24/outline'



const route = useRoute()
const adminStore = useAdminStore()
const selectedPillar = ref('all')
const showModal = ref(false)
const editingQuestion = ref<any>(null)
const expandedPillars = ref<string[]>([])

const pillars = computed(() => adminStore.frameworkSettings)
const templates = computed(() => adminStore.templates)
const selectedTemplateId = ref(route.query.templateId as string || 'temp_001')

const selectedTemplate = computed(() =>
    templates.value.find(t => t.id === selectedTemplateId.value) || templates.value[0]
)

const questions = computed(() => {
    // defaults to empty string/undefined check if not migrated fully
    return adminStore.questions.filter(q =>
        q.templateId === selectedTemplateId.value ||
        (!q.templateId && selectedTemplateId.value === 'temp_001') // Backward compatibility for existing mocked data if any left
    )
})

// Only show pillars that have at least one question in the current template
const relevantPillars = computed(() => {
    const activePillarIds = new Set(questions.value.map(q => q.pillarId))
    return pillars.value.filter(p => activePillarIds.has(p.id))
})

const getPillarQuestionCount = (pillarId: string) => {
    return questions.value.filter(q => q.pillarId === pillarId).length
}

const groupedQuestions = computed(() => {
    // If filtering by a specific pillar, just show that one group
    if (selectedPillar.value !== 'all') {
        const pillar = pillars.value.find(p => p.id === selectedPillar.value)
        if (!pillar) return []
        return [{
            pillarId: pillar.id,
            pillarName: pillar.name,
            questions: questions.value.filter(q => q.pillarId === pillar.id)
        }]
    }

    // Otherwise, show all relevant pillars
    return relevantPillars.value.map(pillar => {
        return {
            pillarId: pillar.id,
            pillarName: pillar.name,
            questions: questions.value.filter(q => q.pillarId === pillar.id)
        }
    }).filter(group => group.questions.length > 0)
})

// Reset pillar filter when template changes
watch(selectedTemplateId, () => {
    selectedPillar.value = 'all'
})

const toggleGroup = (pillarId: string) => {
    if (expandedPillars.value.includes(pillarId)) {
        expandedPillars.value = expandedPillars.value.filter(id => id !== pillarId)
    } else {
        expandedPillars.value.push(pillarId)
    }
}

const getIconForType = (type: string) => {
    switch (type) {
        case 'Yes/No': return CheckCircleIcon
        case 'Scale (1-10)': return ArrowUpCircleIcon
        case 'Number': return HashtagIcon
        case 'Text': return Bars3BottomLeftIcon
        case 'Dropdown Select': return ListBulletIcon
        case 'File Upload': return PaperClipIcon
        default: return DocumentTextIcon
    }
}

const openCreateModal = () => {
    editingQuestion.value = {
        pillarId: selectedPillar.value === 'all' ? pillars.value[0]?.id : selectedPillar.value,
        templateId: selectedTemplateId.value
    }
    showModal.value = true
}

const openEditModal = (question: any) => {
    editingQuestion.value = JSON.parse(JSON.stringify(question)) // Deep copy
    showModal.value = true
}

const handleDuplicate = async (question: any) => {
    const copy = { ...question, text: `${question.text} (Copy)`, id: undefined }
    await adminStore.addQuestion(copy)
}

const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
        await adminStore.deleteQuestion(id)
    }
}

const handleSave = async (data: any) => {
    if (data.id) {
        await adminStore.updateQuestion(data)
    } else {
        await adminStore.addQuestion(data)
    }
    showModal.value = false
}

definePageMeta({
    layout: 'admin',
    middleware: ['auth', 'admin']
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>
