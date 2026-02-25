<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-6 py-8">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-semibold text-gray-900 mb-2">Start New Assessment</h1>
                <p class="text-gray-500">Select an assessment template to begin</p>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2 text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
                        </svg>
                        <span>Filter by:</span>
                    </div>

                    <!-- Pillars Filter -->
                    <div class="relative">
                        <label class="text-sm text-gray-700 mr-2">Pillars:</label>
                        <select v-model="selectedPillarFilter"
                            class="px-4 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none">
                            <option value="all">All</option>
                            <option value="1-4">1-4 pillars</option>
                            <option value="5-6">5-6 pillars</option>
                            <option value="7-8">7-8 pillars</option>
                        </select>
                    </div>

                    <!-- Questions Filter -->
                    <div class="relative">
                        <label class="text-sm text-gray-700 mr-2">Questions:</label>
                        <select v-model="selectedQuestionFilter"
                            class="px-4 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none">
                            <option value="all">All</option>
                            <option value="1-20">1-20 questions</option>
                            <option value="21-40">21-40 questions</option>
                            <option value="41+">41+ questions</option>
                        </select>
                    </div>
                </div>

                <div class="mt-4 text-sm text-gray-500">
                    Showing {{ filteredTemplates.length }} of {{ templates.length }} templates
                </div>
            </div>

            <!-- Templates Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="template in filteredTemplates" :key="template.id"
                    class="bg-white rounded-lg shadow-sm border border-gray-100 p-6 pb-24 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                    <!-- Template Header -->
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center gap-3">
                            <div class="p-3 bg-teal-50 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-teal-600">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                            </div>
                            <div>
                                <span :class="[
                                    'text-xs font-medium px-2 py-1 rounded',
                                    template.type === 'Quick' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                                ]">
                                    {{ template.type }}
                                </span>
                                <span class="ml-2 text-xs text-gray-500">{{ template.version }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Template Title & Description -->
                    <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                        {{ template.name }}
                    </h3>
                    <p class="text-sm text-gray-500 mb-4 line-clamp-2">{{ template.description }}</p>

                    <!-- Template Stats -->

                    <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                            </svg>
                            <span>{{ template.pillars }} pillars</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                            </svg>
                            <span>{{ template.questions }} questions</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{{ template.duration }}</span>
                        </div>
                    </div>

                    <!-- Hover Overlay with Preview Button -->

                    <div
                        class="absolute inset-x-0 bottom-0 p-6 bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto space-y-3">
                        <button @click="startAssessment(template)"
                            class="w-full px-4 py-3 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                            </svg>
                            Start Assessment
                        </button>
                        <button @click="previewTemplate(template)"
                            class="w-full px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Preview Questions
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredTemplates.length === 0" class="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-16 h-16 mx-auto text-gray-300 mb-4">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                <p class="text-gray-500">Try adjusting your filters to see more templates</p>
            </div>
        </div>
        <!-- Preview Modal -->
        <div v-if="isPreviewOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" @click="closePreview">
            </div>

            <!-- Modal Panel -->
            <div
                class="relative bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                <!-- Header -->
                <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <div>
                        <div class="flex items-center gap-3 mb-1">
                            <h2 class="text-xl font-semibold text-gray-900">{{ previewTemplateData?.name }}</h2>
                            <span
                                class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                {{ previewTemplateData?.version }}
                            </span>
                        </div>
                        <p class="text-sm text-gray-500">{{ previewTemplateData?.description }}</p>
                    </div>
                    <button @click="closePreview"
                        class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Content (Scrollable) -->
                <div class="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50">
                    <!-- Stats Bar -->
                    <div
                        class="flex items-center gap-6 text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div class="flex items-center gap-2">
                            <span class="font-semibold text-gray-900">{{ previewTemplateData?.pillars }}</span>
                            Pillars
                        </div>
                        <div class="w-px h-4 bg-gray-200"></div>
                        <div class="flex items-center gap-2">
                            <span class="font-semibold text-gray-900">{{ previewTemplateData?.questions }}</span>
                            Questions
                        </div>
                        <div class="w-px h-4 bg-gray-200"></div>
                        <div class="flex items-center gap-2">
                            <span class="font-semibold text-gray-900">{{ previewTemplateData?.duration }}</span>
                            Estimated Time
                        </div>
                    </div>

                    <!-- Pillars & Questions (Accordion) -->
                    <div v-for="(questions, pillarName) in previewQuestions" :key="pillarName"
                        class="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm transition-all duration-200">
                        <!-- Pillar Header -->
                        <button @click="togglePillar(String(pillarName))"
                            class="w-full px-6 py-4 bg-gray-50/50 hover:bg-gray-100 border-b border-gray-100 flex items-center justify-between transition-colors focus:outline-none"
                            :class="{ 'border-b-0': !expandedPillars.includes(String(pillarName)) }">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded-md bg-teal-100 text-teal-600 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                </div>
                                <h3 class="font-semibold text-gray-900">{{ pillarName }}</h3>
                            </div>
                            <div class="flex items-center gap-3">
                                <span
                                    class="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 shadow-sm">
                                    {{ questions.length }} questions
                                </span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor"
                                    class="w-5 h-5 text-gray-400 transition-transform duration-200"
                                    :class="{ 'rotate-180': expandedPillars.includes(String(pillarName)) }">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                        </button>

                        <!-- Questions List (Collapsible) -->
                        <div v-show="expandedPillars.includes(String(pillarName))"
                            class="divide-y divide-gray-100 border-t border-gray-100">
                            <div v-for="(q, idx) in questions" :key="q.id"
                                class="p-6 hover:bg-gray-50 transition-colors">
                                <div class="flex items-start gap-4">
                                    <span class="text-xs font-bold text-gray-400 mt-1">Q{{ idx + 1 }}</span>
                                    <div class="flex-1">
                                        <p class="text-sm font-medium text-gray-900 mb-2">{{ q.text }}</p>
                                        <div class="flex items-center gap-2">
                                            <span
                                                class="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                {{ q.type }}
                                            </span>
                                            <span v-if="q.required"
                                                class="px-2 py-0.5 rounded text-[10px] font-medium bg-rose-50 text-rose-600 border border-rose-100">
                                                Required
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Empty State if no questions -->
                    <div v-if="Object.keys(previewQuestions).length === 0" class="text-center py-12">
                        <p class="text-gray-500">No questions configured for this template yet.</p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3 z-10">
                    <button @click="closePreview"
                        class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                        Close
                    </button>
                    <button @click="startAssessment(previewTemplateData)"
                        class="px-6 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-md shadow-sm transition-colors flex items-center gap-2">
                        Start Assessment
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminStore } from '~/stores/admin.store'

import { onMounted } from 'vue'

import { useAuthStore } from '~/stores/auth.store'

const selectedPillarFilter = ref('all')
const selectedQuestionFilter = ref('all')
const adminStore = useAdminStore()
const authStore = useAuthStore()

// Current logged in SME (Derive from auth store, fallback to 3 for demo)
const currentSMEId = computed(() => authStore.user?.company?.id || 3)

// Computed templates from admin store
const templates = computed(() => {
    // 1. Get IDs of templates from programs the SME is enrolled in
    console.log('[Assessment] Current SME ID:', currentSMEId.value, '| Total Admin Programs Loaded:', adminStore.programs.length)

    const myProgramTemplateIds = adminStore.programs
        .filter(p => {
            const isEnrolled = p.enrolledSMEs && p.enrolledSMEs.some(id => String(id) === String(currentSMEId.value))
            if (isEnrolled) console.log(`[Assessment] SME enrolled in program: ${p.name} (Template ID: ${p.templateId})`)
            return isEnrolled
        })
        .map(p => p.templateId)

    console.log('[Assessment] Found program template IDs:', myProgramTemplateIds)

    return adminStore.templates
        .filter(t => myProgramTemplateIds.includes(t.id)) // Only show templates from enrolled programs
        .map(t => ({
            id: t.id,
            name: t.name,
            description: t.description,
            type: t.pillarCount < 5 ? 'Quick' : 'Comprehensive', // Determine type based on pillar count
            version: t.version,
            pillars: t.pillarCount,
            questions: t.questionCount,
            duration: `${t.questionCount}-${Math.round(t.questionCount * 1.5)} min` // Approximate duration
        }))
})

onMounted(async () => {
    // Ensure we have fresh data
    await adminStore.fetchProgramsData()
    await adminStore.fetchTemplatesData()
    await adminStore.fetchQuestionsData()
})

const filteredTemplates = computed(() => {
    return templates.value.filter(template => {
        // Filter by pillars
        let pillarMatch = true
        if (selectedPillarFilter.value === '1-4') {
            pillarMatch = template.pillars >= 1 && template.pillars <= 4
        } else if (selectedPillarFilter.value === '5-6') {
            pillarMatch = template.pillars >= 5 && template.pillars <= 6
        } else if (selectedPillarFilter.value === '7-8') {
            pillarMatch = template.pillars >= 7 && template.pillars <= 8
        }

        // Filter by questions
        let questionMatch = true
        if (selectedQuestionFilter.value === '1-20') {
            questionMatch = template.questions >= 1 && template.questions <= 20
        } else if (selectedQuestionFilter.value === '21-40') {
            questionMatch = template.questions >= 21 && template.questions <= 40
        } else if (selectedQuestionFilter.value === '41+') {
            questionMatch = template.questions >= 41
        }

        return pillarMatch && questionMatch
    })
})

const isPreviewOpen = ref(false)
const previewQuestions = ref<Record<string, any[]>>({})
const previewTemplateData = ref<any>(null)

const previewTemplate = (template: any) => {
    previewTemplateData.value = template
    const questions = adminStore.questions.filter(q => q.templateId === template.id)

    // Group by pillar
    const grouped: Record<string, any[]> = {}
    questions.forEach(q => {
        const pillar = adminStore.frameworkSettings.find(p => p.id === q.pillarId)
        const pillarName = pillar ? pillar.name : (q.pillarId.charAt(0).toUpperCase() + q.pillarId.slice(1))

        if (!grouped[pillarName]) grouped[pillarName] = []
        grouped[pillarName].push(q)
    })

    previewQuestions.value = grouped
    // Expand the first pillar by default
    const firstPillar = Object.keys(grouped)[0]
    if (firstPillar) {
        expandedPillars.value = [firstPillar]
    }
    isPreviewOpen.value = true
}

const expandedPillars = ref<string[]>([])

const togglePillar = (pillarName: string) => {
    if (expandedPillars.value.includes(pillarName)) {
        expandedPillars.value = expandedPillars.value.filter(p => p !== pillarName)
    } else {
        expandedPillars.value.push(pillarName)
    }
}

const closePreview = () => {
    isPreviewOpen.value = false
    previewQuestions.value = {}
    previewTemplateData.value = null
}

const startAssessment = (template: any) => {
    // Navigate to assessment page
    navigateTo(`/assessment?template=${template.id}`)
}

definePageMeta({
    layout: 'default',
    middleware: ['auth', 'sme']
})
</script>
