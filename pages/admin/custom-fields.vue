<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Custom Fields</h1>
                    <p class="text-gray-500 mt-1">Add custom data fields to SMEs, users, and programs</p>
                </div>
                <button @click="openCreateModal"
                    class="px-4 py-2 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors flex items-center gap-2">
                    <PlusIcon class="w-4 h-4" />
                    Add Field
                </button>
            </div>
        </header>

        <!-- Tabs -->
        <div class="px-8 pt-6">
            <div class="bg-gray-100 p-1 rounded-lg inline-flex">
                <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value" :class="[
                    'px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2',
                    activeTab === tab.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                ]">
                    <component :is="tab.icon" class="w-4 h-4" />
                    {{ tab.label }}
                </button>
            </div>
        </div>

        <main class="flex-1 overflow-y-auto custom-scrollbar px-8 py-6 w-full">
            <div class="max-w-[1600px]">

                <div class="mb-4">
                    <h2 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <component :is="currentTabIcon" class="w-5 h-5" />
                        {{ activeTab }} Custom Fields
                    </h2>
                    <p class="text-sm text-gray-500 mt-1">Custom fields for {{ activeTab }} profiles</p>
                </div>

                <div class="space-y-4">
                    <div v-for="field in filteredFields" :key="field.id"
                        class="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-gray-300 transition-colors group">

                        <div class="flex items-center gap-4">
                            <!-- Icon based on type -->
                            <div
                                class="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 font-bold">
                                <span v-if="field.type === 'Text'">T</span>
                                <span v-else-if="field.type === 'Number'">#</span>
                                <ListBulletIcon v-else-if="field.type === 'Dropdown'" class="w-5 h-5" />
                                <CalendarIcon v-else-if="field.type === 'Date'" class="w-5 h-5" />
                                <CheckCircleIcon v-else-if="field.type === 'Yes/No'" class="w-5 h-5" />
                            </div>

                            <div>
                                <h3 class="font-medium text-gray-900">{{ field.label }}</h3>
                                <div class="flex items-center gap-2 mt-0.5">
                                    <code
                                        class="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-mono">{{ field.name }}</code>
                                    <span class="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 capitalize">{{
                                        field.type }}</span>
                                    <span v-if="field.options && field.options.length" class="text-xs text-gray-400">{{
                                        field.options.length }} options</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-6">
                            <!-- Toggle -->
                            <button @click="toggleFieldStatus(field)"
                                :class="field.active ? 'bg-teal-600' : 'bg-gray-200'"
                                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                                <span :class="field.active ? 'translate-x-5' : 'translate-x-0'"
                                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                            </button>

                            <div class="flex items-center gap-2">
                                <button @click="editField(field)"
                                    class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                    <PencilSquareIcon class="w-5 h-5" />
                                </button>
                                <button @click="deleteField(field.id)"
                                    class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                    <TrashIcon class="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-if="filteredFields.length === 0"
                        class="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p class="text-gray-500">No custom fields found for {{ activeTab }}.</p>
                        <button @click="openCreateModal"
                            class="mt-2 text-teal-600 font-medium hover:text-teal-700">Create one now</button>
                    </div>
                </div>
            </div>
        </main>

        <CustomFieldModal v-if="showModal" :fieldData="selectedField" @cancel="closeModal" @save="handleSave" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminStore } from '~/stores/admin.store'
import { useConfirm } from '~/composables/useConfirm'
import CustomFieldModal from '~/components/AdminCustomFieldModal.vue'
import {
    PlusIcon,
    BuildingOfficeIcon,
    UserIcon,
    FolderIcon,
    ListBulletIcon,
    CalendarIcon,
    CheckCircleIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/vue/24/outline'

const adminStore = useAdminStore()
const { ask } = useConfirm()
const activeTab = ref('SME')
const showModal = ref(false)
const selectedField = ref<any>(null)

const tabs = [
    { label: 'SME', value: 'SME', icon: BuildingOfficeIcon },
    { label: 'User', value: 'User', icon: UserIcon },
    { label: 'Program', value: 'Program', icon: FolderIcon },
]

const currentTabIcon = computed(() => {
    return tabs.find(t => t.value === activeTab.value)?.icon || BuildingOfficeIcon
})

const filteredFields = computed(() => {
    return adminStore.customFields.filter(f => f.entityType === activeTab.value)
})

const openCreateModal = () => {
    selectedField.value = { entityType: activeTab.value }
    showModal.value = true
}

const editField = (field: any) => {
    // Clone to avoid direct mutation
    selectedField.value = JSON.parse(JSON.stringify(field))
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    selectedField.value = null
}

const handleSave = async (fieldData: any) => {
    if (selectedField.value) {
        // Edit
        await adminStore.updateCustomField(selectedField.value.id, fieldData)
    } else {
        // Create
        // Ensure entity type matches active tab if not set (though modal handles it)
        // Usually defaults to SME in modal so if we are in User tab, user might want to create User field.
        // I should probably switch the modal default to activeTab if creating new.
        // But for simpler implementation, the modal has a selector.
        // If the user selects a different entity type in modal than current tab, it will appear in the other tab.
        await adminStore.createCustomField(fieldData)

        // Switch tab if the created field is not in current tab?
        if (fieldData.entityType !== activeTab.value) {
            activeTab.value = fieldData.entityType
        }
    }
    closeModal()
}

const toggleFieldStatus = async (field: any) => {
    await adminStore.updateCustomField(field.id, { active: !field.active })
}

const deleteField = async (id: string) => {
    const confirmed = await ask({
        title: 'Delete Custom Field?',
        message: 'Are you sure you want to delete this custom field? This will permanently remove it from the platform records.',
        confirmText: 'Delete Field',
        type: 'danger'
    })
    
    if (confirmed) {
        await adminStore.deleteCustomField(id)
    }
}

definePageMeta({
    layout: 'admin',
    middleware: ['auth', 'admin']
})
</script>
