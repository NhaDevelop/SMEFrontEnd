<template>
    <div>

        <!-- ─── Hero ─────────────────────────────────────────────────── -->
        <section class="bg-gray-50/60 pt-32 pb-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <span
                    class="inline-block px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[11px] font-semibold mb-6 tracking-wide">
                    Investment Programs
                </span>
                <h1
                    class="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6 max-w-3xl">
                    Accelerate Your Growth<br class="hidden lg:block" /> with Our Programs
                </h1>
                <p class="text-gray-500 text-lg leading-relaxed max-w-2xl">
                    Join curated investment programs designed to prepare your business for funding success. Each program
                    offers tailored support, mentorship, and investor access.
                </p>
            </div>
        </section>

        <!-- ─── Programs Grid ─────────────────────────────────────────── -->
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <!-- Loading -->
                <div v-if="pending" class="flex flex-col items-center justify-center py-32">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
                    <p class="text-gray-400 text-sm">Loading programs…</p>
                </div>

                <!-- Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="program in programs" :key="program.id"
                        class="relative flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 group hover:shadow-xl hover:border-teal-100">

                        <!-- Clickable top area: navigates to detail page -->
                        <NuxtLink :to="program.slug ? `/programs/${program.slug}` : '#'"
                            class="flex flex-col p-8 pb-4 cursor-pointer">

                            <!-- Status badge -->
                            <span :class="[
                                'absolute top-6 right-6 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest',
                                program.isComingSoon
                                    ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                    : program.isFinished
                                        ? 'bg-gray-100 text-gray-400'
                                        : 'bg-teal-50 text-teal-700'
                            ]">
                                {{ program.isComingSoon ? 'Coming Soon' : program.isFinished ? 'Ended' : program.status
                                }}
                            </span>

                            <!-- Icon -->
                            <div
                                class="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-6 group-hover:bg-teal-100 group-hover:scale-110 transition-all">
                                <component :is="getIcon(program.name)" class="w-6 h-6 text-teal-600" />
                            </div>

                            <!-- Name & description -->
                            <h3
                                class="text-lg font-bold text-gray-900 mb-2 tracking-tight group-hover:text-teal-600 transition-colors leading-snug">
                                {{ program.name }}
                            </h3>
                            <p class="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">{{ program.description }}
                            </p>

                            <!-- Meta -->
                            <div class="space-y-2.5 mb-6">
                                <div class="flex items-center gap-2.5 text-sm text-gray-500">
                                    <GlobeAltIcon class="w-4 h-4 text-gray-400 shrink-0" />
                                    {{ program.sector }}
                                </div>
                                <div class="flex items-center gap-2.5 text-sm text-gray-500">
                                    <ClockIcon class="w-4 h-4 text-gray-400 shrink-0" />
                                    {{ program.duration }}
                                </div>
                                <div class="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-50">
                                    <div class="flex items-center gap-2.5 text-xs text-gray-500">
                                        <ClockIcon class="w-4 h-4 text-teal-400 shrink-0" />
                                        <span
                                            class="font-medium uppercase text-[10px] tracking-wider text-teal-600">Registration:</span>
                                        <span class="text-gray-700 font-bold tracking-tight">{{
                                            formatDate(program.startDate) }} → {{ formatDate(program.enrollmentDeadline
                                            || program.endDate) }}</span>
                                    </div>
                                    <div class="flex items-center gap-2.5 text-xs text-gray-500">
                                        <CalendarIcon class="w-4 h-4 text-indigo-400 shrink-0" />
                                        <span
                                            class="font-medium uppercase text-[10px] tracking-wider text-indigo-600">Duration:</span>
                                        <span class="text-gray-700 font-bold tracking-tight">{{
                                            formatDate(program.startDate) }} → {{ formatDate(program.endDate) }}</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2.5 text-sm text-gray-500">
                                    <CurrencyDollarIcon class="w-4 h-4 text-gray-400 shrink-0" />
                                    {{ program.investmentAmount }}
                                </div>
                            </div>

                            <!-- Benefits -->
                            <div class="flex flex-wrap gap-1.5 flex-grow">
                                <span v-for="benefit in program.benefits.slice(0, 3)" :key="benefit"
                                    class="px-2.5 py-1 bg-gray-50 text-gray-600 text-[11px] font-medium rounded-full group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                                    {{ benefit }}
                                </span>
                                <span v-if="program.benefits.length > 3"
                                    class="px-2.5 py-1 bg-gray-50 text-gray-400 text-[11px] font-medium rounded-full">
                                    +{{ program.benefits.length - 3 }} more
                                </span>
                            </div>

                        </NuxtLink>
                        <!-- ↑ NuxtLink ends here — buttons below are NOT inside the link -->

                        <!-- CTA row — standalone, never inside NuxtLink -->
                        <div class="px-8 pb-8 pt-4">

                            <!-- Coming Soon -->
                            <div v-if="program.isComingSoon"
                                class="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-amber-50 text-amber-500 border border-amber-100 cursor-not-allowed">
                                <ClockIcon class="w-4 h-4" />
                                Starts {{ formatDate(program.startDate) }}
                            </div>

                            <!-- Program Ended -->
                            <div v-else-if="program.isFinished"
                                class="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-gray-100 text-gray-400 cursor-not-allowed">
                                Program Ended
                            </div>

                            <!-- Program is LIVE -->
                            <div v-else class="flex gap-2.5">

                                <!-- View Details — navigates to detail page -->
                                <NuxtLink :to="program.slug ? `/programs/${program.slug}` : '#'"
                                    class="flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-gray-50 text-gray-700 hover:bg-teal-50 hover:text-teal-700 border border-gray-200 hover:border-teal-200 transition-all">
                                    View Details
                                </NuxtLink>

                                <!-- Guest: redirect to login -->
                                <button v-if="!auth.isAuthenticated"
                                    @click="$router.push({ path: '/login', query: { redirect: `/programs/${program.slug}` } })"
                                    class="flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/15 transition-all">
                                    <ArrowRightIcon class="w-4 h-4" />
                                    Apply Now
                                </button>

                                <!-- SME: Apply or Enrolled -->
                                <button v-else-if="auth.user?.role === 'SME'"
                                    @click="checkEnrolled(program) ? null : handleApply(program)"
                                    :disabled="checkEnrolled(program) || isApplying" :class="[
                                        'flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all',
                                        checkEnrolled(program)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                            : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/15'
                                    ]">
                                    <CheckCircleIcon v-if="checkEnrolled(program)" class="w-4 h-4" />
                                    <ArrowRightIcon v-else class="w-4 h-4" />
                                    {{ checkEnrolled(program) ? 'Enrolled' : isApplying ? 'Applying...' : 'Apply Now' }}
                                </button>

                                <!-- Investor: Enroll or Joined -->
                                <button v-else-if="auth.user?.role === 'INVESTOR'"
                                    @click="checkEnrolled(program) ? null : handleApply(program)"
                                    :disabled="checkEnrolled(program) || isApplying" :class="[
                                        'flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all',
                                        checkEnrolled(program)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                            : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/15'
                                    ]">
                                    <CheckCircleIcon v-if="checkEnrolled(program)" class="w-4 h-4" />
                                    <SparklesIcon v-else class="w-4 h-4" />
                                    {{ checkEnrolled(program) ? 'Joined' : isApplying ? 'Enrolling...' : 'Enroll' }}
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>

        <!-- ─── Program FAQs ──────────────────────────────────────────── -->
        <section class="py-24 bg-gray-50/60">
            <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Program FAQs</h2>
                    <p class="text-gray-500">Common questions about our investment programs.</p>
                </div>
                <div class="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                    <div v-for="(faq, index) in programFaqs" :key="index">
                        <button @click="toggleFaq(index)"
                            class="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/80 transition-colors group">
                            <span class="font-medium text-gray-800 group-hover:text-teal-700 transition-colors">{{
                                faq.question }}</span>
                            <ChevronDownIcon
                                :class="['w-5 h-5 text-gray-400 transition-transform shrink-0 ml-4', faq.isOpen ? 'rotate-180' : '']" />
                        </button>
                        <div v-show="faq.isOpen" class="px-6 pb-5 text-gray-500 text-sm leading-relaxed bg-gray-50/50">
                            {{ faq.answer }}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ─── Final CTA ─────────────────────────────────────────────── -->
        <section class="bg-teal-600 py-20 text-center">
            <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                <RocketLaunchIcon class="w-14 h-14 text-white/60 mx-auto mb-6" />
                <h2 class="text-3xl font-bold text-white mb-4 tracking-tight">Not Sure Which Program Fits?</h2>
                <p class="text-teal-100/80 mb-10">Take our free assessment to get personalized program recommendations
                    based on your readiness level.</p>
                <NuxtLink to="/login"
                    class="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-all shadow-xl active:scale-95">
                    Start Free Assessment
                    <ArrowRightIcon class="w-4 h-4" />
                </NuxtLink>
            </div>
        </section>

        <!-- Toast Notification -->
        <transition name="toast">
            <div v-if="toast.show" :class="[
                'fixed bottom-6 right-6 border text-white px-5 py-4 rounded-xl shadow-2xl flex items-start gap-3 z-50 max-w-sm transition-all duration-300',
                toast.type === 'success' ? 'bg-gray-900 border-teal-500/30' : 'bg-gray-900 border-red-500/30'
            ]">
                <CheckCircleIcon v-if="toast.type === 'success'" class="w-6 h-6 text-teal-400 flex-shrink-0" />
                <ExclamationTriangleIcon v-else class="w-6 h-6 text-red-400 flex-shrink-0" />

                <div class="flex-1">
                    <h4 class="text-sm font-semibold text-white mb-1">
                        {{ toast.type === 'success' ? 'Success!' : 'Action Failed' }}
                    </h4>
                    <p class="text-sm text-gray-400 leading-relaxed">{{ toast.message }}</p>
                    <div v-if="toast.type === 'success' && auth.user?.role === 'SME'" class="mt-3">
                        <NuxtLink to="/sme/assessment"
                            class="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors uppercase tracking-wide flex items-center gap-1">
                            Go to Assessments
                            <ArrowRightIcon class="w-3 h-3" />
                        </NuxtLink>
                    </div>
                </div>
                <button @click="toast.show = false" class="text-gray-500 hover:text-gray-300 transition-colors p-1">
                    <XMarkIcon class="w-5 h-5" />
                </button>
            </div>
        </transition>

    </div>
</template>

<script setup lang="ts">
import {
    ArrowRightIcon,
    GlobeAltIcon,
    ClockIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ChevronDownIcon,
    SparklesIcon,
    RocketLaunchIcon,
    BeakerIcon,
    HeartIcon,
    CpuChipIcon,
    BuildingOfficeIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/vue/24/outline'
import { useConfirm } from '~/composables/useConfirm'
import { useAuthStore } from '~/stores/auth.store'

definePageMeta({
    layout: 'landing'
})

const api = useApi()
const programs = ref<any[]>([])
const pending = ref(true)

const fetchPrograms = async () => {
    pending.value = true
    try {
        const res = await api<any>('/programs')
        programs.value = res.programs || res.data?.programs || (Array.isArray(res) ? res : [])
    } catch (e) {
        console.error('Failed to fetch programs:', e)
    } finally {
        pending.value = false
    }
}

onMounted(() => {
    fetchPrograms()
})

const programFaqs = ref([
    {
        question: "How do I know which program is right for me?",
        answer: "Each program is designed for specific sectors and growth stages. We recommend taking our free assessment first, which will generate personalized program recommendations based on your readiness level, industry, and goals.",
        isOpen: false
    },
    {
        question: "What are the eligibility requirements?",
        answer: "Requirements vary by program, but generally we look for SMEs with a proven business model, at least 6 months of operations, and a clear growth strategy. Specific requirements are listed on each program page.",
        isOpen: false
    },
    {
        question: "How long do programs typically last?",
        answer: "Program durations range from 8 to 16 weeks depending on the focus and intensity. Most programs include weekly mentorship sessions, workshops, and investor preparation activities.",
        isOpen: false
    },
    {
        question: "Is there a cost to participate?",
        answer: "Most of our programs are free for accepted participants. Some programs may have equity or revenue-sharing arrangements, which are clearly disclosed during the application process.",
        isOpen: false
    },
    {
        question: "What support do I receive during the program?",
        answer: "Participants receive 1-on-1 mentorship, group workshops, investor introductions, and access to our network of experts. You'll also get ongoing assessment support to track your improvement.",
        isOpen: false
    },
    {
        question: "Can I apply to multiple programs?",
        answer: "Yes, you can apply to multiple programs. However, you can only participate in one program at a time. Our team will help you choose the best fit if you're accepted to multiple programs.",
        isOpen: false
    }
])

const toggleFaq = (index: number) => {
    if (programFaqs.value[index]) {
        programFaqs.value[index].isOpen = !programFaqs.value[index].isOpen
    }
}

// Form and Auth Integration
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const { ask } = useConfirm()
const isApplying = ref(false)
const toast = ref({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error'
})

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    toast.value = { show: true, message, type }
    setTimeout(() => {
        toast.value.show = false
    }, 6000)
}

const checkEnrolled = (program: any) => {
    if (!auth.isAuthenticated || !program) return false

    // Always trust the backend isEnrolled flag if it exists
    if (program.isEnrolled !== undefined) {
        return !!program.isEnrolled
    }

    // Fallback logic
    const userRole = auth.user?.role
    let profileId: number | string | undefined

    if (userRole === 'SME') {
        profileId = auth.user?.sme_profile?.id || auth.user?.company?.id || auth.user?.id
    } else if (userRole === 'INVESTOR') {
        profileId = auth.user?.investor_profile?.id
    }

    if (!profileId) return false

    return (program.enrolled_smes?.some((id: any) => String(id) === String(profileId))) ||
        (program.enrolledSMEs?.some((id: any) => String(id) === String(profileId))) ||
        (program.enrolled_investors?.some((id: any) => String(id) === String(profileId)))
}

const handleApply = async (program: any) => {
    if (!auth.isAuthenticated) {
        useRouter().push({ path: '/login', query: { redirect: route.fullPath } })
        return
    }

    const userRole = auth.user?.role
    if (!['SME', 'INVESTOR'].includes(userRole as string)) {
        showToast("Only SME or Investor accounts can apply/enroll.", "error")
        return
    }

    if (!program) return

    const isInvestor = userRole === 'INVESTOR'
    const actionName = isInvestor ? 'enroll in' : 'apply for'
    const confirmText = isInvestor ? 'Enroll Now' : 'Submit Application'

    const confirmed = await ask({
        title: `Confirm: ${program.name}?`,
        message: `You are about to ${actionName} this program. Your profile will be shared with the program administrators.`,
        confirmText: confirmText,
        type: 'info'
    })
    if (!confirmed) return

    isApplying.value = true
    try {
        const endpoint = isInvestor
            ? `/investor/programs/${program.id}/enroll`
            : `/programs/${program.id}/apply`

        await api(endpoint, {
            method: 'POST'
        })

        // Refresh programs to trigger reactivity in checkEnrolled
        await fetchPrograms()

        showToast(isInvestor
            ? "You have successfully enrolled in this program."
            : "Application submitted! The assessment is now unlocked in your dashboard.")

    } catch (e: any) {
        console.error("Enrollment failed:", e)
        showToast(e.data?.message || "Something went wrong. Please try again.", "error")
    } finally {
        isApplying.value = false
    }
}

const getIcon = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('digit') || n.includes('tech')) return CpuChipIcon
    if (n.includes('green') || n.includes('sustain') || n.includes('agri')) return SparklesIcon
    if (n.includes('accelerate') || n.includes('growth')) return RocketLaunchIcon
    if (n.includes('women')) return HeartIcon
    if (n.includes('real estate') || n.includes('prop')) return BuildingOfficeIcon
    return BeakerIcon
}

const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
/* Component scoped styles if needed */
</style>
