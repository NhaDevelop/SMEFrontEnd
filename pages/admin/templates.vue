<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Assessment Templates</h1>
                    <p class="text-gray-500 mt-1">Create, version, and publish assessment configurations</p>
                </div>
                <button @click="showCreateModal = true"
                    class="px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center gap-2">
                    <PlusIcon class="w-4 h-4" />
                    Create Template
                </button>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto custom-scrollbar px-8 py-8 w-full">
            <div class="max-w-[1600px] mx-auto space-y-8">
                <!-- Top Metrics Cards -->
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div
                        class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500 mb-1">Total Templates</p>
                            <p class="text-3xl font-bold text-gray-900">{{ metrics.total }}</p>
                        </div>
                        <div class="p-3 bg-gray-50 rounded-lg">
                            <DocumentDuplicateIcon class="w-6 h-6 text-gray-400" />
                        </div>
                    </div>
                    <div
                        class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500 mb-1">Active</p>
                            <p class="text-3xl font-bold text-green-600">{{ metrics.active }}</p>
                        </div>
                        <div class="p-3 bg-green-50 rounded-lg">
                            <CheckCircleIcon class="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <div
                        class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500 mb-1">Drafts</p>
                            <p class="text-3xl font-bold text-yellow-600">{{ metrics.drafts }}</p>
                        </div>
                        <div class="p-3 bg-yellow-50 rounded-lg">
                            <ClockIcon class="w-6 h-6 text-yellow-500" />
                        </div>
                    </div>
                    <div
                        class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500 mb-1">Total Questions</p>
                            <p class="text-3xl font-bold text-gray-900">{{ metrics.questions }}</p>
                        </div>
                        <div class="p-3 bg-gray-50 rounded-lg">
                            <QuestionMarkCircleIcon class="w-6 h-6 text-gray-400" />
                        </div>
                    </div>
                </div>

                <!-- Filter Bar -->
                <div class="flex items-center gap-4">
                    <div class="relative flex-1 max-w-md">
                        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input v-model="searchQuery" type="text" placeholder="Search templates..."
                            class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                    </div>
                    <select v-model="statusFilter"
                        class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Draft</option>
                        <option>Archived</option>
                    </select>
                    <select v-model="sortFilter"
                        class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option>Last Updated</option>
                        <option>Name (A-Z)</option>
                    </select>
                </div>

                <!-- Templates Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="template in filteredTemplates" :key="template.id"
                        @click="navigateToBuilder(template.id)"
                        class="bg-white rounded-xl border border-gray-200 p-6 flex flex-col shadow-sm hover:border-cyan-300 transition-colors relative cursor-pointer group">

                        <!-- Header: Title & Menu -->
                        <div class="flex items-start justify-between mb-3">
                            <h3 class="font-bold text-gray-900 text-lg line-clamp-1 pr-2 tracking-tight">{{
                                template.name }}</h3>

                            <div class="relative">
                                <button @click.stop="toggleMenu(template.id)"
                                    class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                    <EllipsisVerticalIcon class="w-5 h-5" />
                                </button>

                                <div v-if="activeMenuId === template.id"
                                    class="absolute right-0 top-8 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20">

                                    <button @click.stop="viewDetails(template)"
                                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                        <EyeIcon class="w-4 h-4 text-gray-500" /> View Details
                                    </button>

                                    <button @click.stop="navigateToBuilder(template.id)"
                                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                        <PencilSquareIcon class="w-4 h-4 text-gray-500" /> Edit Template
                                    </button>

                                    <button @click.stop="duplicateTemplate(template.id)"
                                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                        <DocumentDuplicateIcon class="w-4 h-4 text-gray-500" /> Duplicate
                                    </button>

                                    <button @click.stop="openVersionModal(template)"
                                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                        <ArrowPathIcon class="w-4 h-4 text-gray-500" /> Create New Version
                                    </button>

                                    <div class="border-t border-gray-100 my-1"></div>

                                    <!-- Status Transitions -->
                                    <button v-if="template.status === 'Active'"
                                        @click.stop="unpublishTemplate(template.id)"
                                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                        <NoSymbolIcon class="w-4 h-4 text-gray-500" /> Unpublish
                                    </button>

                                    <button v-if="template.status === 'Draft'"
                                        @click.stop="publishTemplate(template.id)"
                                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                        <CheckCircleIcon class="w-4 h-4 text-gray-500" /> Publish
                                    </button>

                                    <button @click.stop="archiveTemplate(template.id)"
                                        class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                                        <ArchiveBoxIcon class="w-4 h-4 text-gray-500" /> Archive
                                    </button>

                                    <div class="border-t border-gray-100 my-1"></div>

                                    <button @click.stop="deleteTemplate(template.id)"
                                        class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3">
                                        <TrashIcon class="w-4 h-4" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Status & Version -->
                        <div class="flex items-center gap-3 mb-4">
                            <span :class="[
                                'px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1.5',
                                template.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                    template.status === 'Draft' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                            ]">
                                <CheckCircleIcon v-if="template.status === 'Active'" class="w-3.5 h-3.5" />
                                <ClockIcon v-else-if="template.status === 'Draft'" class="w-3.5 h-3.5" />
                                <ArchiveBoxIcon v-else class="w-3.5 h-3.5" />
                                {{ template.status }}
                            </span>
                            <span class="text-xs text-gray-400 font-normal">{{ template.version }}</span>
                        </div>

                        <!-- Description -->
                        <p class="text-sm text-gray-500 mb-6 flex-1 line-clamp-2 leading-relaxed h-10">
                            {{ template.description }}
                        </p>

                        <!-- Stats Grid -->
                        <div class="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-100 mb-4">
                            <div>
                                <p class="text-xs text-gray-500 mb-1">Pillars</p>
                                <p class="text-lg font-semibold text-gray-900">{{ template.pillarCount }}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 mb-1">Questions</p>
                                <p class="text-lg font-semibold text-gray-900">{{ template.questionCount }}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500 mb-1">Assessments</p>
                                <p class="text-lg font-semibold text-gray-900">{{ template.usageCount }}</p>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="flex flex-col gap-1.5 pt-1">
                            <div v-if="template.updatedAt" class="flex items-center gap-2 text-xs text-gray-500">
                                <ClockIcon class="w-3.5 h-3.5 text-gray-400" />
                                Updated {{ formatTimeAgo(template.updatedAt) }}
                            </div>
                            <div v-if="template.updatedBy" class="flex items-center gap-2 text-xs text-gray-500">
                                <UserIcon class="w-3.5 h-3.5 text-gray-400" />
                                {{ template.updatedBy }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <CreateTemplateModal v-if="showCreateModal" @cancel="showCreateModal = false" @save="handleCreateTemplate" />
        <TemplateDetailsModal v-if="selectedTemplate" :template="selectedTemplate" @close="selectedTemplate = null"
            @edit="navigateToBuilder(selectedTemplate?.id); selectedTemplate = null" />
        <CreateVersionModal v-if="versionModalTemplate" :templateName="versionModalTemplate.name"
            :currentVersion="versionModalTemplate.version" @cancel="versionModalTemplate = null"
            @save="handleCreateVersion" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '~/stores/admin.store'
import CreateTemplateModal from '~/components/AdminCreateTemplateModal.vue'
import TemplateDetailsModal from '~/components/AdminTemplateDetailsModal.vue'
import CreateVersionModal from '~/components/AdminCreateVersionModal.vue'
import {
    PlusIcon,
    DocumentDuplicateIcon,
    CheckCircleIcon,
    ClockIcon,
    QuestionMarkCircleIcon,
    MagnifyingGlassIcon,
    EllipsisVerticalIcon,
    ArchiveBoxIcon,
    CalendarIcon,
    UserIcon,
    PencilSquareIcon,
    TrashIcon,
    EyeIcon,
    ArrowPathIcon,
    NoSymbolIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const adminStore = useAdminStore()
const searchQuery = ref('')
const statusFilter = ref('All Status')
const sortFilter = ref('Last Updated')
const showCreateModal = ref(false)
const activeMenuId = ref<string | null>(null)

// Modal States
const selectedTemplate = ref<any>(null)
const versionModalTemplate = ref<any>(null)

onMounted(async () => {
    await adminStore.fetchTemplatesData()
    await adminStore.fetchQuestionsData()
})

const toggleMenu = (id: string) => {
    activeMenuId.value = activeMenuId.value === id ? null : id
}

const filteredTemplates = computed(() => {
    let result = adminStore.templates

    // status
    if (statusFilter.value !== 'All Status') {
        result = result.filter(t => t.status === statusFilter.value)
    }

    // search
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        result = result.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    }

    // sort (mock logic)
    if (sortFilter.value === 'Name (A-Z)') {
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
})

const metrics = computed(() => {
    const all = adminStore.templates
    return {
        total: all.length,
        active: all.filter(t => t.status === 'Active').length,
        drafts: all.filter(t => t.status === 'Draft').length,
        questions: all.reduce((sum, t) => sum + t.questionCount, 0)
    }
})

const handleCreateTemplate = async (form: any) => {
    await adminStore.createTemplate(form)
    showCreateModal.value = false
}

const deleteTemplate = async (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
        await adminStore.deleteTemplate(id)
    }
    activeMenuId.value = null
}

const duplicateTemplate = async (id: string) => {
    await adminStore.duplicateTemplate(id)
    activeMenuId.value = null
}

const publishTemplate = async (id: string) => {
    await adminStore.updateTemplateStatus(id, 'Active')
    activeMenuId.value = null
}

const unpublishTemplate = async (id: string) => {
    await adminStore.updateTemplateStatus(id, 'Draft')
    activeMenuId.value = null
}

const archiveTemplate = async (id: string) => {
    if (confirm('Are you sure you want to archive this template?')) {
        await adminStore.updateTemplateStatus(id, 'Archived')
    }
    activeMenuId.value = null
}

const viewDetails = (template: any) => {
    selectedTemplate.value = template
    activeMenuId.value = null
}

const openVersionModal = (template: any) => {
    versionModalTemplate.value = template
    activeMenuId.value = null
}

const handleCreateVersion = async (versionData: any) => {
    if (versionModalTemplate.value) {
        await adminStore.createTemplateVersion(versionModalTemplate.value.id, versionData)
        versionModalTemplate.value = null
    }
}

const navigateToBuilder = (id: string) => {
    router.push({ path: '/admin/questions', query: { templateId: id } })
}

definePageMeta({
    layout: 'admin',
    middleware: ['auth', 'admin']
})
</script>

<style scoped>
/* Add missing styles if any */
</style>
