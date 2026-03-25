<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Notification Settings</h1>
                    <p class="text-gray-500 mt-1">Configure email, in-app, and SMS notification templates</p>
                </div>
                <button @click="openAddModal"
                    class="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2">
                    <PlusIcon class="w-4 h-4" />
                    Add Template
                </button>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto px-8 py-8">
            <div class="max-w-5xl mx-auto">
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div class="px-6 py-5 border-b border-gray-100">
                        <h2 class="font-bold text-lg text-gray-900">Notification Templates</h2>
                        <p class="text-gray-500 text-sm mt-0.5">Manage automated notifications for various events</p>
                    </div>

                    <!-- Table -->
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead>
                                <tr class="border-b border-gray-100 text-xs text-gray-500 uppercase text-left">
                                    <th class="px-6 py-4 font-medium">Name</th>
                                    <th class="px-6 py-4 font-medium">Type</th>
                                    <th class="px-6 py-4 font-medium">Trigger</th>
                                    <th class="px-6 py-4 font-medium">Subject</th>
                                    <th class="px-6 py-4 font-medium">Status</th>
                                    <th class="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                <tr v-for="tpl in templates" :key="tpl.id"
                                    class="hover:bg-gray-50 transition-colors group">
                                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ tpl.name }}</td>
                                    <td class="px-6 py-4">
                                        <span
                                            :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', typeBadge(tpl.type)]">
                                            <component :is="typeIcon(tpl.type)" class="w-3 h-3" />
                                            {{ tpl.type }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-gray-600">{{ tpl.trigger }}</td>
                                    <td class="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{{ tpl.subject }}
                                    </td>
                                    <td class="px-6 py-4">
                                        <!-- Toggle -->
                                        <button @click="toggleActive(tpl)"
                                            :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none', tpl.active ? 'bg-teal-500' : 'bg-gray-200']">
                                            <span
                                                :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', tpl.active ? 'translate-x-6' : 'translate-x-1']" />
                                        </button>
                                    </td>
                                    <td class="px-6 py-4 text-right">
                                        <div class="flex items-center justify-end gap-1">
                                            <button @click="openPreview(tpl)" title="Preview"
                                                class="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors">
                                                <EyeIcon class="w-4 h-4" />
                                            </button>
                                            <button @click="openEdit(tpl)" title="Edit"
                                                class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                                                <PencilSquareIcon class="w-4 h-4" />
                                            </button>
                                            <button @click="deleteTemplate(tpl.id)" title="Delete"
                                                class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                                <TrashIcon class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>

                                <tr v-if="templates.length === 0">
                                    <td colspan="6" class="px-6 py-16 text-center text-gray-400 text-sm">
                                        No notification templates yet. Click <strong>Add Template</strong> to create
                                        one.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>

        <!-- ── Preview Modal ─────────────────────────────────────────────── -->
        <Transition name="modal">
            <div v-if="previewTpl" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="previewTpl = null" />
                <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
                    <button @click="previewTpl = null"
                        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                        <XMarkIcon class="w-5 h-5" />
                    </button>
                    <h3 class="text-lg font-bold text-gray-900 mb-0.5">Preview: {{ previewTpl.name }}</h3>
                    <p class="text-teal-600 text-sm mb-5">How the notification will appear</p>
                    <div
                        class="bg-gray-50 border border-gray-100 rounded-xl p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        <p class="font-bold text-gray-900 mb-3">{{ previewTpl.subject }}</p>
                        <p>{{ previewTpl.body }}</p>
                    </div>
                    <p class="mt-3 text-xs text-gray-400">
                        Available variables:
                        <code
                            v-pre>{{sme_name}}, {{score}}, {{report_link}}, {{action_description}}, {{user_name}}</code>
                    </p>
                </div>
            </div>
        </Transition>

        <!-- ── Add / Edit Modal ────────────────────────────────────────────── -->
        <Transition name="modal">
            <div v-if="editModal.open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal" />
                <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10">
                    <!-- Modal header -->
                    <div class="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">{{ editModal.isNew ? 'Add' : 'Edit' }}
                                Notification Template</h3>
                            <p class="text-teal-600 text-sm mt-0.5">Configure when and how notifications are sent</p>
                        </div>
                        <button @click="closeModal"
                            class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                            <XMarkIcon class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Form -->
                    <div class="px-6 py-5 space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <!-- Template Name -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Template Name <span
                                        class="text-red-500">*</span></label>
                                <input v-model="editModal.form.name" type="text" placeholder="e.g. Assessment Completed"
                                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                            </div>
                            <!-- Type -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">Type <span
                                        class="text-red-500">*</span></label>
                                <select v-model="editModal.form.type"
                                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                                    <option value="email">Email</option>
                                    <option value="in-app">In-App</option>
                                    <option value="sms">SMS</option>
                                </select>
                            </div>
                        </div>

                        <!-- Trigger Event -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">Trigger Event <span
                                    class="text-red-500">*</span></label>
                            <select v-model="editModal.form.trigger"
                                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                                <option v-for="t in triggerEvents" :key="t" :value="t">{{ t }}</option>
                            </select>
                        </div>

                        <!-- Subject (only for email/sms) -->
                        <div v-if="editModal.form.type !== 'in-app'">
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">Subject Line <span
                                    class="text-red-500">*</span></label>
                            <input v-model="editModal.form.subject" type="text" placeholder="Email subject..."
                                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
                        </div>

                        <!-- Message Body -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">Message Body <span
                                    class="text-red-500">*</span></label>
                            <textarea v-model="editModal.form.body" rows="5"
                                placeholder="Write the notification message..."
                                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
                            <p class="text-xs text-gray-400 mt-1">
                                Available variables: <code class="bg-gray-100 px-1 rounded"
                                    v-pre>{{sme_name}}, {{score}}, {{report_link}}, {{action_description}}, {{user_name}}</code>
                            </p>
                        </div>

                        <!-- Active Toggle -->
                        <div class="flex items-center gap-3">
                            <button @click="editModal.form.active = !editModal.form.active"
                                :class="['relative inline-flex h-6 w-11 items-center rounded-full transition-colors', editModal.form.active ? 'bg-teal-500' : 'bg-gray-200']">
                                <span
                                    :class="['inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', editModal.form.active ? 'translate-x-6' : 'translate-x-1']" />
                            </button>
                            <span class="text-sm text-gray-700 font-medium">{{ editModal.form.active ? 'Active' :
                                'Inactive' }}</span>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
                        <button @click="closeModal"
                            class="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                            Cancel
                        </button>
                        <button @click="saveTemplate"
                            class="px-5 py-2 bg-teal-600 text-white text-sm rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2">
                            <BookmarkIcon class="w-4 h-4" />
                            Save Template
                        </button>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Toast -->
        <Transition name="fade">
            <div v-if="toast"
                class="fixed bottom-4 right-4 px-5 py-3 rounded-xl shadow-lg bg-teal-600 text-white text-sm font-medium flex items-center gap-2 z-50">
                <CheckCircleIcon class="w-4 h-4" />
                {{ toast }}
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
    PlusIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    XMarkIcon,
    BookmarkIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    BellIcon,
    DevicePhoneMobileIcon
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'admin', middleware: ['auth', 'admin'] })

// ── Types ──────────────────────────────────────────────────────────────────────
interface NotificationTemplate {
    id: string
    name: string
    type: 'email' | 'in-app' | 'sms'
    trigger: string
    subject: string
    body: string
    active: boolean
}

// ── Trigger events ─────────────────────────────────────────────────────────────
const triggerEvents = [
    'Assessment Completed',
    'Assessment Started',
    'Action Assigned',
    'Action Completed',
    'Score Threshold Crossed',
    'Weekly Digest',
    'Program Started',
    'Program Completed',
    'User Invited',
    'Registration Approved',
    'Registration Rejected'
]

// ── Fetch templates ──────────────────────────────────────────────────────────
const loading = ref(true)
const templates = ref<NotificationTemplate[]>([])

const loadTemplates = async () => {
    loading.value = true
    const api = useApi()
    try {
        const response = await api<any>('/admin/notification-templates')
        templates.value = response.data || response || []
    } catch (e) {
        console.error('Failed to load templates:', e)
    } finally {
        loading.value = false
    }
}

onMounted(loadTemplates)

// ── Preview ───────────────────────────────────────────────────────────────────
const previewTpl = ref<NotificationTemplate | null>(null)
const openPreview = (tpl: NotificationTemplate) => { previewTpl.value = tpl }

// ── Toggle active ─────────────────────────────────────────────────────────────
const toggleActive = async (tpl: NotificationTemplate) => {
    const api = useApi()
    try {
        const newStatus = !tpl.active
        // Optimistic UI update
        tpl.active = newStatus

        await api(`/admin/notification-templates/${tpl.id}`, {
            method: 'PUT',
            body: {
                is_active: newStatus
            }
        })
        showToast(`Template "${tpl.name}" ${newStatus ? 'activated' : 'deactivated'}`)
    } catch (error) {
        // Revert on failure
        tpl.active = !tpl.active
        console.error('Failed to update template status', error)
        alert('Failed to update template status. Please try again.')
    }
}

// ── Edit / Add modal ──────────────────────────────────────────────────────────
const emptyForm = (): Omit<NotificationTemplate, 'id'> => ({
    name: '', type: 'email', trigger: 'Assessment Completed',
    subject: '', body: '', active: true
})

const editModal = reactive({
    open: false,
    isNew: false,
    editingId: '',
    form: emptyForm()
})

const openAddModal = () => {
    editModal.isNew = true
    editModal.editingId = ''
    editModal.form = emptyForm()
    editModal.open = true
}

const openEdit = (tpl: NotificationTemplate) => {
    editModal.isNew = false
    editModal.editingId = tpl.id
    editModal.form = { name: tpl.name, type: tpl.type, trigger: tpl.trigger, subject: tpl.subject, body: tpl.body, active: tpl.active }
    editModal.open = true
}

const closeModal = () => { editModal.open = false }

const saveTemplate = async () => {
    if (!editModal.form.name || !editModal.form.body) {
        alert('Please fill in all required fields.')
        return
    }

    const api = useApi()
    try {
        if (editModal.isNew) {
            await api('/admin/notification-templates', {
                method: 'POST',
                body: {
                    name: editModal.form.name,
                    type: editModal.form.type,
                    trigger_event: editModal.form.trigger,
                    subject: editModal.form.subject,
                    body: editModal.form.body,
                    is_active: editModal.form.active
                }
            })
            showToast('Template created successfully!')
        } else {
            await api(`/admin/notification-templates/${editModal.editingId}`, {
                method: 'PUT',
                body: {
                    name: editModal.form.name,
                    type: editModal.form.type,
                    trigger_event: editModal.form.trigger,
                    subject: editModal.form.subject,
                    body: editModal.form.body,
                    is_active: editModal.form.active
                }
            })
            showToast('Template updated successfully!')
        }
        await loadTemplates()
        closeModal()
    } catch (error) {
        console.error('Failed to save template', error)
        alert('An error occurred while saving the template. Please check the log.')
    }
}

const deleteTemplate = async (id: string) => {
    if (!confirm('Delete this notification template?')) return

    const api = useApi()
    try {
        await api(`/admin/notification-templates/${id}`, {
            method: 'DELETE'
        })
        await loadTemplates()
        showToast('Template deleted.')
    } catch (error) {
        console.error('Failed to delete template', error)
        alert('An error occurred while deleting the template. Please try again.')
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const typeBadge = (type: string) => {
    switch (type) {
        case 'email': return 'bg-blue-50 text-blue-600 border-blue-100'
        case 'in-app': return 'bg-teal-50 text-teal-600 border-teal-100'
        case 'sms': return 'bg-purple-50 text-purple-600 border-purple-100'
        default: return 'bg-gray-50 text-gray-600 border-gray-100'
    }
}

const typeIcon = (type: string) => {
    switch (type) {
        case 'email': return EnvelopeIcon
        case 'in-app': return BellIcon
        case 'sms': return DevicePhoneMobileIcon
        default: return EnvelopeIcon
    }
}

// ── Toast ─────────────────────────────────────────────────────────────────────
const toast = ref('')
const showToast = (msg: string) => {
    toast.value = msg
    setTimeout(() => { toast.value = '' }, 3000)
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
