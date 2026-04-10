<template>
    <div class="h-full flex flex-col bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Messages</h1>
                    <p class="text-gray-500 mt-1">Secure communication with investors and SMEs</p>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-hidden p-8">
            <div class="h-full max-w-[1600px] mx-auto flex gap-6">
                <!-- Left Sidebar: Folders -->
                <div class="w-64 flex-shrink-0 flex flex-col gap-6">
                    <button @click="isComposeOpen = true"
                        class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#198754] hover:bg-[#157347] text-white font-medium rounded-xl transition-colors shadow-sm">
                        <PencilSquareIcon class="w-5 h-5" />
                        Compose
                    </button>

                    <nav class="flex flex-col gap-1">
                        <button @click="activeFolder = 'inbox'; selectedMessage = null" :class="[
                            'flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                            activeFolder === 'inbox' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 text-gray-700'
                        ]">
                            <div class="flex items-center gap-3">
                                <InboxIcon class="w-5 h-5" />
                                Inbox
                            </div>
                            <span v-if="inboxUnreadCount > 0"
                                class="bg-emerald-100 text-emerald-700 py-0.5 px-2 rounded-full text-xs font-bold">{{
                                    inboxUnreadCount }}</span>
                        </button>
                        <button @click="activeFolder = 'sent'; selectedMessage = null" :class="[
                            'flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                            activeFolder === 'sent' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 text-gray-700'
                        ]">
                            <div class="flex items-center gap-3">
                                <PaperAirplaneIcon class="w-5 h-5" />
                                Sent
                            </div>
                        </button>
                        <!-- Programs Discussion Tab -->
                        <button @click="activeFolder = 'programs'; selectedMessage = null" :class="[
                            'flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                            activeFolder === 'programs' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 text-gray-700'
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
                                selectedMessage?.id === msg.id ? 'bg-emerald-50/50 border-emerald-500' : 'border-transparent'
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
                                            class="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
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
                            <button
                                class="text-sm text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-2">
                                <ArrowUturnLeftIcon class="w-4 h-4" /> Reply to this message
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Program Discussion Panel -->
                <div v-if="activeFolder === 'programs'"
                    class="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                    <div v-if="!selectedProgramId"
                        class="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div
                            class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
                            <ChatBubbleLeftRightIcon class="w-8 h-8 text-emerald-400" />
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900 mb-2">Program Discussion</h3>
                        <p class="text-sm text-gray-500 mb-6 max-w-xs">Select a program to view and participate in the
                            shared group discussion thread.</p>
                        <div v-if="enrolledPrograms.length > 0" class="w-full max-w-sm space-y-2">
                            <button v-for="prog in enrolledPrograms" :key="prog.id"
                                @click="selectedProgramId = String(prog.id)"
                                class="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-200 rounded-xl transition-colors text-left">
                                <div
                                    class="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                                    <span class="text-emerald-700 font-bold text-sm">{{ prog.name?.charAt(0) || 'P'
                                        }}</span>
                                </div>
                                <div>
                                    <div class="text-sm font-semibold text-gray-900">{{ prog.name }}</div>
                                    <div class="text-xs text-gray-500">{{ prog.status }}</div>
                                </div>
                            </button>
                        </div>
                        <p v-else class="text-sm text-gray-400 mt-4">No programs available.</p>
                    </div>
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
                                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm py-2.5" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input v-model="newMessage.subject" type="text" placeholder="Enter subject"
                                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm py-2.5" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea v-model="newMessage.content" rows="6" placeholder="Write your message..."
                                class="w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm py-2.5 resize-none"></textarea>
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
                            class="px-4 py-2 text-sm font-medium text-white bg-[#198754] rounded-lg hover:bg-[#157347] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
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
    layout: 'investor',
    middleware: ['auth', 'investor']
})

// State
const activeFolder = ref<'inbox' | 'sent' | 'programs'>('inbox')
const selectedMessage = ref<any>(null)
const isComposeOpen = ref(false)

const newMessage = ref({
    recipient: '',
    subject: '',
    content: ''
})

// Dynamic Data
const inbox = ref<any[]>([])
const sent = ref<any[]>([])
const loading = ref(false)
const authStore = useAuthStore()
const toast = useToast()

// Programs Discussion
const selectedProgramId = ref<string | null>(null)
const enrolledPrograms = ref<any[]>([])

const fetchEnrolledPrograms = async () => {
    try {
        const res = await useApi()('/investor/programs') as any
        enrolledPrograms.value = Array.isArray(res) ? res : (res?.programs || [])
    } catch (e) {
        console.error('[Investor Messages] Failed to fetch programs:', e)
    }
}

// Computed
const filteredMessages = computed(() => activeFolder.value === 'inbox' ? inbox.value : sent.value)

const inboxUnreadCount = computed(() => inbox.value.filter(m => !m.read).length)

const isValidMessage = computed(() => {
    return newMessage.value.recipient.includes('@') &&
        newMessage.value.subject.trim().length > 0 &&
        newMessage.value.content.trim().length > 0
})

// Fetch Data
const fetchMessages = async () => {
    loading.value = true
    try {
        const userId = authStore.user?.id

        // Fetch users using useApi()(). Laravel response is wrapped in data, useApi unwraps it.
        const usersResponse = await useApi()('/admin/users')
        const allUsers = usersResponse || []

        const me = (allUsers as any[]).find((u: any) => u.id === userId) || authStore.user

        let allMessages: any[] = []
        try {
            allMessages = await useApi()('/messages')
        } catch (e) { /* fallback if api not ready */ }

        const formatted = allMessages.map(m => {
            const senderUser = (allUsers as any[]).find((u: any) => u.id === m.senderId)
            const recpUser = (allUsers as any[]).find((u: any) => u.id === m.recipientId)

            return {
                id: m.id,
                senderId: m.senderId,
                recipientId: m.recipientId,
                senderName: senderUser?.full_name || senderUser?.name || 'Unknown User',
                senderEmail: senderUser?.email || m.senderEmail,
                recipientName: recpUser?.full_name || recpUser?.name || 'Unknown User',
                recipientEmail: recpUser?.email || m.recipientEmail,
                subject: m.subject || 'Direct Message',
                preview: m.text?.substring(0, 60) + '...',
                content: m.text,
                date: new Date(m.timestamp || m.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                fullDate: new Date(m.timestamp || m.created_at).toLocaleString(),
                read: m.read || false,
                sender: senderUser?.full_name || senderUser?.name || m.senderEmail,
                recipient: recpUser?.full_name || recpUser?.name || m.recipientEmail,
            }
        })

        inbox.value = formatted.filter(m => m.recipientEmail === me?.email)
        sent.value = formatted.filter(m => m.senderEmail === me?.email)

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
    try {
        const userId = authStore.user?.id
        const userEmail = authStore.user?.email

        const usersResponse = await useApi()('/admin/users')
        const allUsers = usersResponse || []
        const targetUser = (allUsers as any[]).find((u: any) => u.email === newMessage.value.recipient)

        await useApi()('/messages', {
            method: 'POST',
            body: {
                senderId: userId,
                senderEmail: userEmail,
                recipientId: targetUser?.id || 0,
                recipientEmail: newMessage.value.recipient,
                subject: newMessage.value.subject,
                text: newMessage.value.content,
                chatId: `chat_${userId}_${targetUser?.id || 'unknown'}`
            }
        })

        fetchMessages()
        closeCompose()
        activeFolder.value = 'sent'

    } catch (e) {
        console.error('Failed to send message', e)
        toast.error('Failed to send message. Please try again.')
    }
}

const closeCompose = () => {
    isComposeOpen.value = false
    setTimeout(() => {
        newMessage.value = { recipient: '', subject: '', content: '' }
    }, 300)
}
</script>
