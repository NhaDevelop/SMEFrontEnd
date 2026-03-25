<template>
    <div class="flex flex-col h-full min-h-[400px]">
        <!-- Header -->
        <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-white shrink-0">
            <ChatBubbleLeftRightIcon class="w-5 h-5 text-teal-600" />
            <h3 class="font-semibold text-gray-900 text-sm">Program Discussion</h3>
            <span class="ml-auto text-xs text-gray-400">{{ comments.length }} message{{ comments.length !== 1 ? 's' : ''
            }}</span>
        </div>

        <!-- Messages Area -->
        <div ref="scrollEl" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            <!-- Empty State -->
            <div v-if="!loading && comments.length === 0"
                class="flex flex-col items-center justify-center h-full py-12 text-center">
                <div
                    class="w-14 h-14 bg-white rounded-full border border-gray-200 flex items-center justify-center mb-3 shadow-sm">
                    <ChatBubbleLeftRightIcon class="w-7 h-7 text-gray-300" />
                </div>
                <p class="text-sm font-medium text-gray-500">No messages yet</p>
                <p class="text-xs text-gray-400 mt-1">Be the first to start the conversation</p>
            </div>

            <!-- Loading -->
            <div v-else-if="loading" class="flex items-center justify-center py-12">
                <div class="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <!-- Comment Bubbles -->
            <div v-else v-for="comment in comments" :key="comment.id"
                :class="isMe(comment) ? 'items-end' : 'items-start'" class="flex flex-col gap-1">
                <!-- Author info -->
                <div :class="isMe(comment) ? 'flex-row-reverse' : 'flex-row'" class="flex items-center gap-2">
                    <!-- Avatar -->
                    <div :class="getRoleAvatarClass(comment.user?.role || comment.authorRole)"
                        class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {{ (comment.user?.full_name || comment.authorName)?.charAt(0)?.toUpperCase() || '?' }}
                    </div>
                    <span class="text-xs font-medium text-gray-700">{{ comment.user?.full_name || comment.authorName }}</span>
                    <span :class="getRoleBadgeClass(comment.user?.role || comment.authorRole)"
                        class="text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wide">
                        {{ comment.user?.role || comment.authorRole }}
                    </span>
                    <span class="text-[10px] text-gray-400">{{ formatTime(comment.created_at || comment.timestamp) }}</span>
                </div>

                <!-- Bubble -->
                <div :class="[
                    'max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm',
                    isMe(comment)
                        ? 'bg-teal-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                ]">
                    {{ comment.content || comment.text }}
                </div>
            </div>
        </div>

        <!-- Input Area -->
        <div class="shrink-0 px-4 py-3 bg-white border-t border-gray-100">
            <form @submit.prevent="postComment" class="flex items-end gap-3">
                <textarea v-model="newText" @keydown.enter.exact.prevent="postComment" rows="1"
                    placeholder="Write a message… (Enter to send)"
                    class="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow max-h-32"
                    style="min-height: 2.5rem; overflow-y: auto;" @input="autoResize" ref="textareaEl"></textarea>
                <button type="submit" :disabled="!newText.trim() || sending"
                    class="shrink-0 w-10 h-10 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors shadow-sm">
                    <PaperAirplaneIcon class="w-4 h-4" />
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '~/stores/auth.store'

const props = defineProps<{
    programId: string | number
}>()

const authStore = useAuthStore()
const comments = ref<any[]>([])
const loading = ref(false)
const sending = ref(false)
const newText = ref('')
const scrollEl = ref<HTMLElement | null>(null)
const textareaEl = ref<HTMLTextAreaElement | null>(null)

const isMe = (comment: any) =>
    String(comment.user_id || comment.authorId) === String(authStore.user?.id)

const getRoleAvatarClass = (role?: string) => {
    if (!role) return 'bg-teal-100 text-teal-700'
    const r = role.toLowerCase()
    if (r.includes('admin')) return 'bg-purple-100 text-purple-700'
    if (r.includes('investor')) return 'bg-emerald-100 text-emerald-700'
    return 'bg-teal-100 text-teal-700'
}

const getRoleBadgeClass = (role?: string) => {
    if (!role) return 'bg-teal-50 text-teal-600'
    const r = role.toLowerCase()
    if (r.includes('admin')) return 'bg-purple-50 text-purple-600'
    if (r.includes('investor')) return 'bg-emerald-50 text-emerald-600'
    return 'bg-teal-50 text-teal-600'
}

const formatTime = (iso?: string) => {
    if (!iso) return '...'
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso || '...'
    const now = new Date()
    const isToday = d.toDateString() === now.toDateString()
    return isToday
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = async () => {
    await nextTick()
    if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
}

const findComment = (commentsArray: any[], id: number): any | null => {
    for (const comment of commentsArray) {
        if (comment.id === id) return comment
        if (comment.replies) {
            const found = findComment(comment.replies, id)
            if (found) return found
        }
    }
    return null
}

const replyTo = ref<any | null>(null)

const fetchComments = async () => {
    if (!props.programId) return
    loading.value = true
    try {
        const res = await useApi()(`/programs/${props.programId}/comments`)
        comments.value = Array.isArray(res) ? res : (res?.data || [])
        await scrollToBottom()
    } catch (e) {
        console.error('[ProgramCommentThread] Failed to load comments:', e)
    } finally {
        loading.value = false
    }
}

const postComment = async () => {
    if (!newText.value.trim() || sending.value) return
    sending.value = true
    const text = newText.value.trim()

    try {
        const response: any = await useApi()(`/programs/${props.programId}/comments`, {
            method: 'POST',
            body: {
                content: text
            }
        })

        const newComment = response.data || response
        comments.value.unshift(newComment)

        newText.value = ''
        if (textareaEl.value) textareaEl.value.style.height = 'auto'
        await scrollToBottom()
    } catch (e) {
        console.error('[ProgramCommentThread] Failed to post comment:', e)
    } finally {
        sending.value = false
    }
}

const autoResize = () => {
    if (!textareaEl.value) return
    textareaEl.value.style.height = 'auto'
    textareaEl.value.style.height = Math.min(textareaEl.value.scrollHeight, 128) + 'px'
}

onMounted(fetchComments)
</script>
