<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Messages</h1>
                    <p class="text-gray-500 mt-1">Secure communication with investors and SMEs</p>
                </div>
                <button @click="isComposeOpen = true"
                    class="inline-flex items-center gap-2 px-4 py-2 bg-[#198754] hover:bg-[#157347] text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                    <PencilSquareIcon class="w-4 h-4" />
                    Compose
                </button>
            </div>
        </header>

        <main class="flex-1 overflow-hidden p-8">
            <div class="h-full max-w-[1600px] mx-auto flex gap-6">
                <!-- Left Sidebar: Message List -->
                <div
                    class="w-1/3 min-w-[320px] bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                    <!-- Toggle Switch -->
                    <div class="p-4 border-b border-gray-100 bg-gray-50/50">
                        <div class="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
                            <button @click="activeFolder = 'inbox'" :class="[
                                'flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all',
                                activeFolder === 'inbox'
                                    ? 'bg-[#198754] text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            ]">
                                <InboxIcon class="w-4 h-4" />
                                Inbox
                            </button>
                            <button @click="activeFolder = 'sent'" :class="[
                                'flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all',
                                activeFolder === 'sent'
                                    ? 'bg-[#198754] text-white shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            ]">
                                <PaperAirplaneIcon class="w-4 h-4" />
                                Sent
                            </button>
                        </div>
                    </div>

                    <!-- Message List -->
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

                <!-- Right Content: Message Detail -->
                <div
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
                                            {{ (activeFolder === 'inbox' ? selectedMessage.sender :
                                            selectedMessage.recipient).charAt(0).toUpperCase() }}
                                        </div>
                                        <div>
                                            <p class="text-sm font-medium text-gray-900">
                                                {{ activeFolder === 'inbox' ? selectedMessage.sender : 'Me' }}
                                                <span class="text-gray-400 font-normal">to</span>
                                                {{ activeFolder === 'inbox' ? 'Me' : selectedMessage.recipient }}
                                            </p>
                                            <p class="text-xs text-gray-500">{{ selectedMessage.email }}</p>
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
            </div>
        </main>

        <!-- Compose Modal -->
        <Teleport to="body">
            <div v-if="isComposeOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                role="dialog" aria-modal="true">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
                    @click="isComposeOpen = false"></div>

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
    XMarkIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
    layout: 'investor',
    middleware: ['auth', 'investor']
})

// State
const activeFolder = ref<'inbox' | 'sent'>('inbox')
const selectedMessage = ref<any>(null)
const isComposeOpen = ref(false)

const newMessage = ref({
    recipient: '',
    subject: '',
    content: ''
})

// Mock Data
const inbox = ref<any[]>([])
const sent = ref<any[]>([])

// Computed
const filteredMessages = computed(() => activeFolder.value === 'inbox' ? inbox.value : sent.value)

const isValidMessage = computed(() => {
    return newMessage.value.recipient.includes('@') &&
        newMessage.value.subject.trim().length > 0 &&
        newMessage.value.content.trim().length > 0
})

// Actions
const sendMessage = () => {
    // Simulate sending
    const msg = {
        id: Date.now(),
        recipient: newMessage.value.recipient, // Used for display in Sent list
        email: newMessage.value.recipient,
        subject: newMessage.value.subject,
        preview: newMessage.value.content.substring(0, 60) + '...',
        content: newMessage.value.content,
        date: 'Just now',
        fullDate: new Date().toLocaleString(),
        read: true
    }

    sent.value.unshift(msg)

    // Reset and close
    closeCompose()

    // If we were on sent folder, auto-select the new message
    if (activeFolder.value === 'sent') {
        selectedMessage.value = msg
    }
}

const closeCompose = () => {
    isComposeOpen.value = false
    activeFolder.value = 'sent' // optional: switch to sent view to see result? Or stay. Let's switch.
    setTimeout(() => {
        newMessage.value = { recipient: '', subject: '', content: '' }
    }, 300)
}
</script>
