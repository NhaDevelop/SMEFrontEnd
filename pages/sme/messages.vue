<template>
    <div class="h-full flex flex-col bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Messages</h1>
                    <p class="text-gray-500 mt-1">Secure communication with investors and program managers</p>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-hidden p-8">
            <div class="h-full max-w-[1600px] mx-auto flex gap-6">
                <!-- Left Sidebar: Folders -->
                <div class="w-64 flex-shrink-0 flex flex-col gap-6">
                    <button @click="isComposeOpen = true"
                        class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-colors shadow-sm">
                        <PencilSquareIcon class="w-5 h-5" />
                        Compose
                    </button>

                    <nav class="flex flex-col gap-1">
                        <button @click="activeFolder = 'inbox'; selectedMessage = null" :class="[
                            'flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                            activeFolder === 'inbox' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 text-gray-700'
                        ]">
                            <div class="flex items-center gap-3">
                                <InboxIcon class="w-5 h-5" />
                                Inbox
                            </div>
                            <span v-if="inboxUnreadCount > 0"
                                class="bg-teal-100 text-teal-700 py-0.5 px-2 rounded-full text-xs font-bold">{{
                                    inboxUnreadCount }}</span>
                        </button>
                        <button @click="activeFolder = 'sent'; selectedMessage = null" :class="[
                            'flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                            activeFolder === 'sent' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 text-gray-700'
                        ]">
                            <div class="flex items-center gap-3">
                                <PaperAirplaneIcon class="w-5 h-5" />
                                Sent
                            </div>
                        </button>
                        <!-- Programs Discussion Tab -->
                        <button @click="activeFolder = 'programs'; selectedMessage = null" :class="[
                            'flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                            activeFolder === 'programs' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50 text-gray-700'
                        ]">
                            <div class="flex items-center gap-3">
                                <ChatBubbleLeftRightIcon class="w-5 h-5" />
                                Programs
                            </div>
                        </button>
                    </nav>
                </div>

                <!-- Middle Pane: Message List (only for inbox/sent) -->
                <div v-if="activeFolder !== 'programs'"
                    class="w-80 min-w-[320px] bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                    <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <h2 class="font-semibold text-gray-900">{{ activeFolder === 'inbox' ? 'Inbox' : 'Sent' }}</h2>
                    </div>

                    <div class="flex-1 overflow-y-auto custom-scrollbar bg-white">
                        <div v-if="filteredMessages.length === 0"
                            class="h-full flex flex-col items-center justify-center text-center p-6 bg-white min-h-[400px]">
                            <ChatBubbleLeftRightIcon class="w-12 h-12 text-gray-300 mb-3" />
                            <p class="text-gray-500 font-medium">No messages in {{ activeFolder }}</p>
                        </div>

                        <div v-else class="divide-y divide-gray-100">
                            <div v-for="msg in filteredMessages" :key="msg.id" @click="selectedMessage = msg" :class="[
                                'p-4 cursor-pointer hover:bg-gray-50 transition-colors border-l-4',
                                selectedMessage?.id === msg.id ? 'bg-teal-50/50 border-teal-500' : 'border-transparent'
                            ]">
                                <div class="flex justify-between items-start mb-1">
                                    <h3
                                        :class="['text-sm font-semibold truncate', !msg.read && activeFolder === 'inbox' ? 'text-gray-900' : 'text-gray-700']">
                                        {{ activeFolder === 'inbox' ? msg.sender : msg.recipient }}
                                    </h3>
                                    <span class="text-xs text-gray-400 whitespace-nowrap ml-2">{{ msg.date }}</span>
                                </div>
                                <p
                                    :class="['text-sm mb-1 truncate', !msg.read && activeFolder === 'inbox' ? 'text-gray-900 font-medium' : 'text-gray-600']">
                                    {{ msg.subject }}
                                </p>
                                <p class="text-xs text-gray-400 truncate">{{ msg.preview }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Content: Message Detail or Program Thread -->
                <div v-if="activeFolder !== 'programs'"
                    class="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden relative">
                    <!-- Empty State -->
                    <div v-if="!selectedMessage"
                        class="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-gray-50/30">
                        <div
                            class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                            <ChatBubbleBottomCenterTextIcon class="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 class="text-lg font-medium text-gray-900">Select a message to view</h3>
                        <p class="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Choose a message from the list on the
                            left to read its contents.</p>
                    </div>

                    <!-- Message Content -->
                    <div v-else class="flex flex-col h-full">
                        <div class="p-6 border-b border-gray-100">
                            <div class="flex items-start justify-between mb-4">
                                <div>
                                    <h2 class="text-xl font-bold text-gray-900 mb-2">{{ selectedMessage.subject }}</h2>
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                                            {{ (activeFolder === 'inbox' ? selectedMessage.senderName :
                                                selectedMessage.recipientName)?.charAt(0)?.toUpperCase() || 'U' }}
                                        </div>
                                        <div>
                                            <p class="text-sm font-medium text-gray-900">
                                                {{ activeFolder === 'inbox' ? selectedMessage.senderName : 'Me' }}
                                                <span class="text-gray-400 font-normal">to</span>
                                                {{ activeFolder === 'inbox' ? 'Me' : selectedMessage.recipientName }}
                                            </p>
                                            <p class="text-xs text-gray-500">{{ activeFolder === 'inbox' ?
                                                selectedMessage.senderEmail : selectedMessage.recipientEmail }}</p>
                                        </div>
                                    </div>
                                </div>
                                <span class="text-sm text-gray-500">{{ selectedMessage.fullDate }}</span>
                            </div>
                        </div>

                        <div class="flex-1 p-8 overflow-y-auto">
                            <p class="text-gray-700 whitespace-pre-wrap leading-relaxed">{{ selectedMessage.content }}
                            </p>
                        </div>

                        <!-- Reply Box (only for inbox) -->
                        <div v-if="activeFolder === 'inbox'" class="p-6 bg-gray-50 border-t border-gray-200">
                            <button @click="replyToMessage"
                                class="text-sm text-teal-600 font-medium hover:text-teal-700 flex items-center gap-2">
                                <ArrowUturnLeftIcon class="w-4 h-4" /> Reply to this message
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Program Discussion Panel -->
                <div v-if="activeFolder === 'programs'"
                    class="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                    <!-- Program Picker -->
                    <div v-if="!selectedProgramId"
                        class="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div
                            class="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4 border border-teal-100">
                            <ChatBubbleLeftRightIcon class="w-8 h-8 text-teal-400" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Program Discussion</h3>
                        <p class="text-sm text-gray-500 mb-6 max-w-xs">Select a program to view and participate in the
                            shared group discussion thread.</p>
                        <div v-if="enrolledPrograms.length > 0" class="w-full max-w-sm space-y-2">
                            <button v-for="prog in enrolledPrograms" :key="prog.id"
                                @click="selectedProgramId = String(prog.id)"
                                class="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-teal-50 border border-gray-200 hover:border-teal-200 rounded-xl transition-colors text-left">
                                <div class="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                                    <span class="text-teal-700 font-bold text-sm">{{ prog.name?.charAt(0) || 'P'
                                        }}</span>
                                </div>
                                <div>
                                    <div class="text-sm font-semibold text-gray-900">{{ prog.name }}</div>
                                    <div class="text-xs text-gray-500">{{ prog.status }}</div>
                                </div>
                            </button>
                        </div>
                        <p v-else class="text-sm text-gray-400 mt-4">You are not enrolled in any programs yet.</p>
                    </div>

                    <!-- Thread View -->
                    <template v-else>
                        <div class="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-white">
                            <button @click="selectedProgramId = null" class="text-gray-400 hover:text-gray-600 mr-1">
                                <ChevronLeftIcon class="w-4 h-4" />
                            </button>
                            <span class="font-semibold text-sm text-gray-900">
                                {{enrolledPrograms.find(p => String(p.id) === selectedProgramId)?.name || 'Program'}}
                            </span>
                        </div>
                        <div class="flex-1 overflow-hidden">
                            <ProgramCommentThread :programId="selectedProgramId" :key="selectedProgramId" />
                        </div>
                    </template>
                </div>

            </div>
        </main>

        <!-- Compose Modal -->
        <Teleport to="body">
            <div v-if="isComposeOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                role="dialog" aria-modal="true">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                    @click="isComposeOpen = false">
                </div>

                <!-- Modal Panel -->
                <div
                    class="relative w-full max-w-lg bg-white rounded-xl shadow-2xl transform transition-all flex flex-col max-h-[90vh]">
                    <!-- Header -->
                    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h3 class="text-lg font-bold text-gray-900">New Message</h3>
                            <p class="text-sm text-gray-500">Send a secure message</p>
                        </div>
                        <button @click="isComposeOpen = false"
                            class="text-gray-400 hover:text-gray-600 transition-colors">
                            <XMarkIcon class="w-5 h-5" />
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="p-6 space-y-4 overflow-y-auto">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">To (email)</label>
                            <input v-model="newMessage.recipient" type="email" placeholder="Enter recipient's email"
                                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm py-2.5" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input v-model="newMessage.subject" type="text" placeholder="Enter subject"
                                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm py-2.5" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea v-model="newMessage.content" rows="6" placeholder="Write your message..."
                                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm py-2.5 resize-none"></textarea>
                            <div class="flex justify-end mt-1">
                                <div
                                    class="h-3 w-3 border border-gray-300 transform -rotate-45 translate-y-[-8px] translate-x-[-8px]">
                                </div> <!-- Aesthetic resize handle hint -->
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div
                        class="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 rounded-b-xl">
                        <button @click="isComposeOpen = false"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                            Cancel
                        </button>
                        <button @click="sendMessage" :disabled="!isValidMessage"
                            class="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            <PaperAirplaneIcon class="w-4 h-4" />
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
    PencilSquareIcon,
    InboxIcon,
    PaperAirplaneIcon,
    ChatBubbleLeftRightIcon,
    ChatBubbleBottomCenterTextIcon,
    ArrowUturnLeftIcon,
    XMarkIcon,
    ChevronLeftIcon
} from '@heroicons/vue/24/outline'
import ProgramCommentThread from '~/components/ProgramCommentThread.vue'

definePageMeta({
    layout: 'default',
    middleware: ['auth']
})


// Types
interface Message {
    id: number | string
    senderId: number | string
    recipientId: number | string
    senderName: string
    senderEmail: string
    recipientName: string
    recipientEmail: string
    subject: string
    preview: string
    content: string
    date: string
    fullDate: string
    read: boolean
    sender: string
    recipient: string
}

// State
const activeFolder = ref<'inbox' | 'sent' | 'programs'>('inbox')
const selectedMessage = ref<Message | null>(null)
const isComposeOpen = ref(false)

const newMessage = ref({
    recipient: '',
    subject: '',
    content: ''
})

// Dynamic Data
const inbox = ref<Message[]>([])
const sent = ref<Message[]>([])
const loading = ref(false)
const authStore = useAuthStore()

// Programs Discussion
const selectedProgramId = ref<string | null>(null)
const enrolledPrograms = ref<any[]>([])

const fetchEnrolledPrograms = async () => {
    try {
        const res = await $fetch<any>('/api/programs')
        const allPrograms = Array.isArray(res) ? res : (res?.programs || [])
        const smeId = authStore.user?.company?.id || authStore.user?.id
        enrolledPrograms.value = allPrograms.filter((p: any) => {
            const enrolled = p.enrolledSmes || p.smeIds || []
            return enrolled.some((id: any) => String(id) === String(smeId))
        })
        // If no filter matches, show all programs (fallback)
        if (enrolledPrograms.value.length === 0) enrolledPrograms.value = allPrograms
    } catch (e) {
        console.error('[Messages] Failed to fetch programs:', e)
    }
}

// Computed
const filteredMessages = computed(() => activeFolder.value === 'inbox' ? inbox.value : sent.value)

const inboxUnreadCount = computed(() => inbox.value.filter((m: Message) => !m.read).length)

const isValidMessage = computed(() => {
    return newMessage.value.recipient.includes('@') &&
        newMessage.value.subject.trim().length > 0 &&
        newMessage.value.content.trim().length > 0
})

// Fetch Data
const fetchMessages = async () => {
    loading.value = true
    const api = useApi()
    try {
        const response = await api<any>('/messages')
        const allMessages = response.data || response || []

        // Format to UI structure
        const formatted = allMessages.map((m: any) => {
            const isMeSender = m.sender_id === authStore.user?.id
            return {
                id: m.id,
                senderId: m.sender_id,
                recipientId: m.receiver_id,
                senderName: m.sender?.full_name || 'System',
                senderEmail: m.sender?.email || '',
                recipientName: m.receiver?.full_name || 'Recipient',
                recipientEmail: m.receiver?.email || '',
                subject: m.subject || 'Direct Message',
                preview: m.content.substring(0, 60) + '...',
                content: m.content,
                date: new Date(m.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                fullDate: new Date(m.created_at).toLocaleString(),
                read: m.read || false,
                sender: m.sender?.full_name || 'System',
                recipient: m.receiver?.full_name || 'Recipient',
            }
        })

        inbox.value = formatted.filter((m: Message) => m.recipientId === authStore.user?.id)
        sent.value = formatted.filter((m: Message) => m.senderId === authStore.user?.id)

    } catch (e) {
        console.error('Failed to fetch messages', e)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchMessages()
    fetchEnrolledPrograms()
})

// Actions
const sendMessage = async () => {
    const api = useApi()
    try {
        const userId = authStore.user?.id
        
        // Attempt to find recipient user ID
        const usersRes = await api<any>('/admin/users')
        const allUsers = usersRes.data || usersRes || []
        const targetUser = allUsers.find((u: any) => u.email === newMessage.value.recipient)

        if (!targetUser) {
            alert('Recipient not found. Please check the email address.')
            return
        }

        await api('/messages', {
            method: 'POST',
            body: {
                receiver_id: targetUser.id,
                content: newMessage.value.content,
                chat_id: `chat_${userId}_${targetUser.id}`,
                subject: newMessage.value.subject // Note: Backend store doesn't explicitly mention subject in validated, but it's good to send
            }
        })

        fetchMessages()
        closeCompose()
        activeFolder.value = 'sent'

    } catch (e: any) {
        console.error('Failed to send message', e)
        alert(e.data?.message || 'Failed to send message.')
    }
}

const closeCompose = () => {
    isComposeOpen.value = false
    setTimeout(() => {
        newMessage.value = { recipient: '', subject: '', content: '' }
    }, 300)
}

const replyToMessage = () => {
    if (!selectedMessage.value) return

    newMessage.value = {
        recipient: selectedMessage.value.senderEmail,
        subject: selectedMessage.value.subject.startsWith('Re:')
            ? selectedMessage.value.subject
            : `Re: ${selectedMessage.value.subject}`,
        content: `\n\n--- Original Message from ${selectedMessage.value.senderName} ---\n${selectedMessage.value.content}`
    }

    isComposeOpen.value = true
}
</script>
