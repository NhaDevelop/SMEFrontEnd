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
                    <NuxtLink v-for="program in programs" :key="program.id"
                        :to="program.status === 'Open' && program.slug ? `/programs/${program.slug}` : '#'" :class="[
                            'relative flex flex-col bg-white border border-gray-100 rounded-2xl p-8 shadow-sm transition-all duration-300 group',
                            program.status === 'Open' && program.slug
                                ? 'hover:shadow-xl hover:border-teal-100 cursor-pointer'
                                : 'opacity-75 pointer-events-none'
                        ]">

                        <!-- Status badge -->
                        <span :class="[
                            'absolute top-6 right-6 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest',
                            program.status === 'Open' ? 'bg-teal-50 text-teal-700' : 'bg-gray-100 text-gray-400'
                        ]">
                            {{ program.status }}
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
                        <p class="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">{{ program.description }}</p>

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
                            <div class="flex items-center gap-2.5 text-sm text-gray-500">
                                <CalendarIcon class="w-4 h-4 text-gray-400 shrink-0" />
                                Deadline: {{ program.deadline }}
                            </div>
                            <div class="flex items-center gap-2.5 text-sm text-gray-500">
                                <CurrencyDollarIcon class="w-4 h-4 text-gray-400 shrink-0" />
                                {{ program.investmentAmount }}
                            </div>
                        </div>

                        <!-- Benefits -->
                        <div class="flex flex-wrap gap-1.5 mb-8 flex-grow">
                            <span v-for="benefit in program.benefits.slice(0, 3)" :key="benefit"
                                class="px-2.5 py-1 bg-gray-50 text-gray-600 text-[11px] font-medium rounded-full group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                                {{ benefit }}
                            </span>
                            <span v-if="program.benefits.length > 3"
                                class="px-2.5 py-1 bg-gray-50 text-gray-400 text-[11px] font-medium rounded-full">
                                +{{ program.benefits.length - 3 }} more
                            </span>
                        </div>

                        <!-- CTA row -->
                        <div v-if="program.status !== 'Open'"
                            class="w-full py-3.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all bg-gray-100 text-gray-400">
                            Coming Soon
                        </div>
                        <div v-else class="flex gap-3 mt-auto">
                            <!-- Show "View Details" by default for non-SMEs or general guests -->
                            <div
                                class="flex-1 py-3.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200">
                                View Details
                            </div>

                            <!-- If SME, show the direct Application control -->
                            <button v-if="auth.isAuthenticated && auth.user?.role?.toLowerCase() === 'sme'"
                                @click="(e) => checkEnrolled(program) ? e.preventDefault() : handleApply(program, e)"
                                :disabled="checkEnrolled(program) || isApplying" :class="[
                                    'flex-1 py-3.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm',
                                    checkEnrolled(program)
                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
                                        : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-600/15'
                                ]">
                                {{ checkEnrolled(program) ? 'Enrolled' : (isApplying ? 'Applying...' : 'Apply Now') }}
                                <CheckCircleIcon v-if="checkEnrolled(program)" class="w-4 h-4" />
                                <ArrowRightIcon v-else-if="!checkEnrolled(program) && !isApplying" class="w-4 h-4" />
                            </button>
                        </div>
                    </NuxtLink>
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

        <!-- Success Toast Notification -->
        <transition enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform translate-y-10 opacity-0" enter-to-class="transform translate-y-0 opacity-100"
            leave-active-class="transition duration-200 ease-in" leave-from-class="transform translate-y-0 opacity-100"
            leave-to-class="transform translate-y-10 opacity-0">
            <div v-if="showSuccessToast"
                class="fixed bottom-6 right-6 bg-gray-900 border border-gray-800 text-white px-5 py-4 rounded-xl shadow-2xl flex items-start gap-3 z-50 max-w-sm">
                <CheckCircleIcon class="w-6 h-6 text-green-400 flex-shrink-0" />
                <div class="flex-1">
                    <h4 class="text-sm font-semibold text-white mb-1">Application Successful!</h4>
                    <p class="text-sm text-gray-400">You are now enrolled in the program. The assessment has been
                        unlocked in your dashboard.</p>
                    <div class="mt-3">
                        <NuxtLink to="/sme/assessment"
                            class="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors uppercase tracking-wide flex items-center gap-1">
                            Go to Assessments
                            <ArrowRightIcon class="w-3 h-3" />
                        </NuxtLink>
                    </div>
                </div>
                <button @click="showSuccessToast = false"
                    class="text-gray-500 hover:text-gray-300 transition-colors p-1">
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
        programs.value = res.data || res || []
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
    programFaqs.value[index].isOpen = !programFaqs.value[index].isOpen
}

// Form and Auth Integration
const auth = useAuthStore()
const isApplying = ref(false)
const showSuccessToast = ref(false)
const route = useRoute()

const checkEnrolled = (program: any) => {
    const userRole = auth.user?.role
    if (!auth.isAuthenticated || String(userRole).toLowerCase() !== 'sme' || !program) return false
    const smeId = auth.user?.company?.id || auth.user?.id
    return program.enrolled_smes?.some((id: any) => String(id) === String(smeId)) || 
           program.enrolledSMEs?.some((id: any) => String(id) === String(smeId))
}

const handleApply = async (program: any, event: Event) => {
    // Prevent the NuxtLink from navigating when the button is clicked directly
    if (event) event.preventDefault()

    if (!auth.isAuthenticated) {
        useRouter().push({ path: '/login', query: { redirect: route.fullPath } })
        return
    }

    const userRole = auth.user?.role
    if (String(userRole).toLowerCase() !== 'sme') {
        alert("Only SME accounts can apply to programs.")
        return
    }

    if (!program) return

    isApplying.value = true
    try {
        await api(`/programs/${program.id}/apply`, {
            method: 'POST'
        })

        // Refresh programs to trigger reactivity in checkEnrolled
        await fetchPrograms()

        showSuccessToast.value = true
        setTimeout(() => {
            showSuccessToast.value = false
        }, 5000)

    } catch (e: any) {
        console.error("Failed to apply to program:", e)
        alert(e.data?.message || "Something went wrong while applying. Please try again.")
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
</script>

<style scoped>
/* Component scoped styles if needed */
</style>
