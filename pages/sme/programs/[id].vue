<template>
    <div class="h-full flex flex-col bg-white overflow-y-auto custom-scrollbar">
        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-40">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
            <p class="text-gray-500 font-medium">Loading program details...</p>
        </div>

        <!-- Not Found -->
        <div v-else-if="!program" class="max-w-3xl mx-auto px-8 py-24 text-center">
            <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ExclamationTriangleIcon class="w-8 h-8 text-gray-300" />
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">Program not found</h1>
            <p class="text-gray-500 mb-8">The program you're looking for might have been unpublished or removed.</p>
            <NuxtLink to="/sme/programs"
                class="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-all">
                <ArrowLeftIcon class="w-4 h-4" />
                Back to Programs
            </NuxtLink>
        </div>

        <!-- Content -->
        <div v-else class="flex-1">
            <!-- Hero Section -->
            <section class="border-b border-gray-100 bg-gray-50/30 py-16">
                <div class="max-w-6xl mx-auto px-8">
                    <NuxtLink to="/sme/programs"
                        class="inline-flex items-center gap-2 text-gray-400 hover:text-teal-600 transition-colors mb-10 group">
                        <ArrowLeftIcon class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span class="text-xs font-bold uppercase tracking-widest">Back to Programs</span>
                    </NuxtLink>

                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        <!-- Left: Main Info -->
                        <div class="lg:col-span-8">
                            <div class="flex items-center gap-3 mb-6">
                                <div
                                    class="w-14 h-14 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
                                    <component :is="getIcon(program.name)" class="w-8 h-8 text-teal-600" />
                                </div>
                                <div :class="[
                                    'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest',
                                    getStatusClass(program.enrollmentStatus)
                                ]">
                                    {{ program.enrollmentStatus === 'None' ? 'Open' : program.enrollmentStatus }}
                                </div>
                            </div>

                            <h1 class="text-4xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                                {{ program.name }}
                            </h1>
                            <p class="text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl">
                                {{ program.description }}
                            </p>

                            <div class="flex gap-4">
                                <button v-if="program.enrollmentStatus === 'None'" @click="enroll"
                                    :disabled="isApplying"
                                    class="px-8 py-4 bg-teal-600 text-white font-bold rounded-xl shadow-xl shadow-teal-600/20 hover:bg-teal-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50">
                                    {{ isApplying ? 'Applying...' : 'Apply Now' }}
                                    <ArrowRightIcon v-if="!isApplying" class="w-5 h-5" />
                                </button>
                                <div v-else
                                    class="px-8 py-4 bg-gray-100 text-teal-700 font-bold rounded-xl flex items-center gap-2 border border-teal-50 italic">
                                    <CheckCircleIcon class="w-5 h-5" />
                                    {{ program.enrollmentStatus }}
                                </div>
                                <button @click="scrollToForum"
                                    class="px-8 py-4 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all flex items-center gap-2">
                                    <ChatBubbleLeftRightIcon class="w-5 h-5 text-gray-400" />
                                    Join Discussion
                                </button>
                            </div>
                        </div>

                        <!-- Right: Quick Facts Card -->
                        <div class="lg:col-span-4">
                            <div class="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                                <h3
                                    class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-8 pb-4 border-b border-gray-50">
                                    Program Details</h3>
                                <div class="space-y-6">
                                    <div class="flex items-start gap-4">
                                        <div
                                            class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                            <GlobeAltIcon class="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <div
                                                class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                                                Sector</div>
                                            <div class="font-bold text-gray-700 leading-tight">{{ program.sector ||
                                                'General' }}</div>
                                        </div>
                                    </div>
                                    <div class="flex items-start gap-4">
                                        <div
                                            class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                            <ClockIcon class="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <div
                                                class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                                                Duration</div>
                                            <div class="font-bold text-gray-700 leading-tight">12 Weeks</div>
                                        </div>
                                    </div>
                                    <div class="flex items-start gap-4">
                                        <div
                                            class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                            <CalendarIcon class="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div>
                                            <div
                                                class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                                                Deadline</div>
                                            <div class="font-bold text-gray-700 leading-tight">{{ program.endDate ?
                                                formatDate(program.endDate) : 'March 31, 2024' }}</div>
                                        </div>
                                    </div>
                                    <div class="flex items-start gap-4">
                                        <div
                                            class="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                                            <CurrencyDollarIcon class="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <div
                                                class="text-[10px] font-bold text-teal-600/60 uppercase tracking-widest mb-0.5">
                                                Funding</div>
                                            <div class="font-bold text-teal-700 leading-tight">{{
                                                program.investment_amount || 'Up to $500K' }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Main Sections -->
            <div class="max-w-6xl mx-auto px-8 py-20 space-y-24">
                <!-- Program Benefits -->
                <section>
                    <h2 class="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Program Benefits</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="benefit in (program.benefits || defaultBenefits)" :key="benefit"
                            class="flex items-center gap-4 p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:border-teal-200 hover:shadow-md transition-all group">
                            <div
                                class="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0 group-hover:bg-teal-600 transition-colors">
                                <CheckIcon class="w-3.5 h-3.5 text-teal-600 group-hover:text-white transition-colors" />
                            </div>
                            <span class="font-bold text-gray-700 text-sm">{{ benefit }}</span>
                        </div>
                    </div>
                </section>

                <!-- Eligibility -->
                <section>
                    <h2 class="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Eligibility Requirements</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div v-for="req in defaultEligibility" :key="req"
                            class="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-xl hover:border-teal-200 hover:shadow-sm transition-all">
                            <div class="w-8 h-8 flex items-center justify-center shrink-0 text-teal-600">
                                <UserCircleIcon class="w-6 h-6 opacity-40" />
                            </div>
                            <span class="text-gray-700 font-bold text-sm leading-snug">{{ req }}</span>
                        </div>
                    </div>
                </section>

                <!-- Participants -->
                <section>
                    <h2 class="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Program Participants</h2>

                    <div v-if="program.enrollmentStatus === 'None'" class="max-w-2xl bg-white border border-gray-100 rounded-2xl p-8">
                        <p class="text-gray-500 mb-6">
                            Join this program to view participant list.
                        </p>
                        <button @click="enroll"
                            class="px-8 py-4 bg-teal-600 text-white font-bold rounded-xl shadow-xl shadow-teal-600/20 hover:bg-teal-700 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
                            :disabled="isApplying">
                            {{ isApplying ? 'Joining...' : 'Join as Participant' }}
                        </button>
                    </div>

                    <div v-else>
                        <div v-if="participantsLoading" class="max-w-2xl bg-white border border-gray-100 rounded-2xl p-8 text-gray-500">
                            Loading participants...
                        </div>

                        <div v-else-if="participants.length === 0" class="max-w-2xl bg-white border border-gray-100 rounded-2xl p-8 text-gray-500">
                            No participants yet.
                        </div>

                        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div v-for="p in participants" :key="p.id || p.user_id || p.name"
                                class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                <div class="flex items-start justify-between gap-4">
                                    <div>
                                        <div class="font-bold text-gray-900">
                                            {{ p.name || 'Participant' }}
                                        </div>
                                        <div class="text-sm text-gray-500 mt-1">
                                            {{ p.role || 'SME' }} • {{ p.status || '' }}
                                        </div>
                                        <div v-if="p.industry" class="text-xs text-gray-400 mt-2">
                                            {{ p.industry }}
                                        </div>
                                    </div>
                                    <div class="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                        {{ p.role || 'SME' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Timeline -->
                <section>
                    <h2 class="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Program Timeline</h2>
                    <div class="space-y-4 max-w-3xl">
                        <div v-for="(step, index) in defaultTimeline" :key="index" class="flex gap-6 items-start">
                            <div class="flex flex-col items-center shrink-0">
                                <div
                                    class="w-12 h-12 rounded-2xl bg-teal-800 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-teal-900/10">
                                    {{ String(index + 1).padStart(2, '0') }}
                                </div>
                                <div v-if="index < defaultTimeline.length - 1"
                                    class="w-0.5 flex-grow bg-gray-100 my-2 min-h-[32px]"></div>
                            </div>
                            <div
                                class="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 flex-grow mb-4 hover:bg-white hover:border-teal-100 hover:shadow-sm transition-all group">
                                <div class="flex items-center gap-3 mb-2">
                                    <h4 class="text-lg font-bold text-gray-900">{{ step.title }}</h4>
                                    <span
                                        class="px-2.5 py-0.5 bg-teal-50 rounded-full text-[10px] font-black text-teal-700 uppercase tracking-widest">
                                        {{ step.week }}
                                    </span>
                                </div>
                                <p class="text-sm text-gray-500 leading-relaxed">{{ step.description }}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Outcomes -->
                <section>
                    <h2 class="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Expected Outcomes</h2>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div v-for="outcome in defaultOutcomes" :key="outcome"
                            class="flex flex-col gap-4 p-8 bg-white border border-gray-200 rounded-2xl hover:border-teal-200 hover:shadow-md transition-all text-center">
                            <div
                                class="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto text-teal-600">
                                <BriefcaseIcon class="w-6 h-6" />
                            </div>
                            <span class="text-gray-900 font-bold leading-tight">{{ outcome }}</span>
                        </div>
                    </div>
                </section>

                <hr class="border-gray-100" />

                <!-- Discussion Forum -->
                <section id="discussion-forum" class="pb-24">
                    <div class="flex items-center justify-between mb-10">
                        <div>
                            <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Discussion Thread</h2>
                            <p class="text-gray-500 mt-1">Connect with program managers and fellow participants.</p>
                        </div>
                        <div
                            class="px-4 py-2 bg-purple-50 rounded-xl text-xs font-bold text-purple-700 uppercase tracking-widest border border-purple-100">
                            {{ comments.length }} Comments
                        </div>
                    </div>

                    <div class="bg-gray-50/50 rounded-3xl p-8 border border-gray-100">
                        <!-- Post Comment -->
                        <div class="mb-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4">Post a question
                                or comment</h3>
                            <textarea v-model="newComment" rows="3" placeholder="Type your message here..."
                                class="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm mb-4"></textarea>
                            <div class="flex justify-end">
                                <button @click="postComment" :disabled="!newComment.trim() || isPosting"
                                    class="px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
                                    <span v-if="isPosting">Posting...</span>
                                    <span v-else>Post Comment</span>
                                    <PaperAirplaneIcon class="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <!-- Comments List -->
                        <div v-if="comments.length > 0" class="space-y-6">
                            <div v-for="comment in comments" :key="comment.id"
                                class="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-purple-100 transition-colors">
                                <div
                                    class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-teal-50 flex items-center justify-center shrink-0 border border-purple-100">
                                    <span class="text-purple-700 font-black text-xs">{{ comment.user_name?.charAt(0) ||
                                        'U' }}</span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between mb-2">
                                        <h4 class="font-bold text-gray-900 truncate">{{ comment.user_name }}</h4>
                                        <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{
                                            formatRelativeTime(comment.created_at) }}</span>
                                    </div>
                                    <p class="text-sm text-gray-600 leading-relaxed">{{ comment.content }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-12">
                            <ChatBubbleOvalLeftEllipsisIcon class="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p class="text-gray-500 font-medium italic">No comments yet. Be the first to start the
                                conversation!</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>

        <!-- Success Toast -->
        <transition enter-active-class="transform transition duration-300 ease-out"
            enter-from-class="translate-y-12 opacity-0" enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-if="showToast"
                class="fixed bottom-8 right-8 z-50 bg-gray-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-gray-800 animate-bounce-subtle">
                <div
                    class="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                    <CheckCircleIcon class="w-6 h-6 text-green-400" />
                </div>
                <div>
                    <h4 class="font-bold text-sm">Application Successful!</h4>
                    <p class="text-xs text-gray-400">Your application has been submitted for review.</p>
                </div>
                <button @click="showToast = false" class="p-1 hover:bg-gray-800 rounded-lg transition-colors ml-4">
                    <XMarkIcon class="w-5 h-5 text-gray-500" />
                </button>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    ArrowLeftIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    GlobeAltIcon,
    ClockIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ArrowRightIcon,
    ChatBubbleLeftRightIcon,
    CheckIcon,
    UserCircleIcon,
    BriefcaseIcon,
    PaperAirplaneIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    XMarkIcon,
    CpuChipIcon,
    SparklesIcon,
    RocketLaunchIcon,
    HeartIcon,
    BuildingOfficeIcon,
    BeakerIcon
} from '@heroicons/vue/24/outline'
import { smeService } from '~/modules/sme/sme.service'
import { formatDate, formatRelativeTime } from '~/utils/format'
import { useRoute } from 'vue-router'

const route = useRoute()
const programId = route.params.id as string
const program = ref<any>(null)
const comments = ref<any[]>([])
const participants = ref<any[]>([])
const loading = ref(true)
const participantsLoading = ref(false)
const isApplying = ref(false)
const isPosting = ref(false)
const newComment = ref('')
const showToast = ref(false)

// Default Data (matching the landing page)
const defaultBenefits = ['1-on-1 mentorship', 'Investor introductions', 'Assessment coaching', 'Pitch preparation']
const defaultEligibility = ['Minimum 12 months of operations', 'Revenue-generating or strong traction', 'Full-time founding team']
const defaultTimeline = [
    { title: 'Foundation', week: 'Week 1-4', description: 'Business assessment, gap analysis, and goal setting' },
    { title: 'Development', week: 'Week 5-8', description: 'Intensive workshops, mentorship, and improvement implementation' },
    { title: 'Demo Day', week: 'Week 9-12', description: 'Investor presentations and follow-up meetings' }
]
const defaultOutcomes = ['Improved readiness score', 'Investor network access', 'Pitch-ready documentation']

const fetchData = async () => {
    loading.value = true
    try {
        const [progRes, commRes] = await Promise.all([
            smeService.fetchPrograms() as any,
            smeService.fetchProgramComments(programId) as any
        ])

        const allPrograms = progRes.data || progRes || []
        program.value = allPrograms.find((p: any) => p.id.toString() === programId)
        comments.value = commRes.data || commRes || []

        // Participants are protected on the backend:
        // - SME/Investor must be enrolled to view participants
        // Only fetch when the UI indicates they are enrolled.
        if (program.value && program.value.enrollmentStatus !== 'None') {
            participantsLoading.value = true
            try {
                const partRes = await smeService.fetchProgramParticipants(programId) as any
                participants.value = partRes.data || partRes || []
            } catch (e) {
                console.error('Failed to fetch participants', e)
                participants.value = []
            } finally {
                participantsLoading.value = false
            }
        } else {
            participants.value = []
        }
    } catch (e) {
        console.error('Failed to fetch program details', e)
    } finally {
        loading.value = false
    }
}

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Accepted': return 'bg-green-100 text-green-700 border border-green-200'
        case 'Applied': return 'bg-amber-100 text-amber-700 border border-amber-200'
        case 'Rejected': return 'bg-red-100 text-red-700 border border-red-200'
        default: return 'bg-teal-50 text-teal-700 border border-teal-100'
    }
}

const getIcon = (name: string) => {
    const n = name?.toLowerCase() || ''
    if (n.includes('digit') || n.includes('tech')) return CpuChipIcon
    if (n.includes('green') || n.includes('sustain') || n.includes('agri')) return SparklesIcon
    if (n.includes('accelerate') || n.includes('growth')) return RocketLaunchIcon
    if (n.includes('women')) return HeartIcon
    if (n.includes('real estate') || n.includes('prop')) return BuildingOfficeIcon
    return BeakerIcon
}

const enroll = async () => {
    if (!program.value || isApplying.value) return
    isApplying.value = true
    try {
        const enrollment = await smeService.enrollInProgram(programId) as any
        program.value.enrollmentStatus = enrollment?.status || 'Enrolled'
        showToast.value = true
        setTimeout(() => showToast.value = false, 5000)
    } catch (e) {
        console.error('Enrollment failed', e)
        alert('Failed to submit application. Please try again.')
    } finally {
        isApplying.value = false
    }
}

const postComment = async () => {
    if (!newComment.value.trim() || isPosting.value) return
    isPosting.value = true
    try {
        await smeService.addProgramComment(programId, newComment.value)
        newComment.value = ''
        // Refresh comments
        const commRes = await smeService.fetchProgramComments(programId) as any
        comments.value = commRes.data || commRes || []
    } catch (e) {
        console.error('Posting failed', e)
    } finally {
        isPosting.value = false
    }
}

const scrollToForum = () => {
    const el = document.getElementById('discussion-forum')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(fetchData)

definePageMeta({
    layout: 'default'
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}

@keyframes bounce-subtle {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-4px);
    }
}

.animate-bounce-subtle {
    animation: bounce-subtle 3s infinite ease-in-out;
}
</style>
