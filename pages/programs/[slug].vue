<template>
    <div class="pt-20">
        <!-- Loading State -->
        <div v-if="pending" class="flex flex-col items-center justify-center py-40">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mb-4"></div>
            <p class="text-gray-500 tracking-tight">Loading program details...</p>
        </div>

        <!-- Not Found State -->
        <div v-else-if="!program" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-40 text-center">
            <div class="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-8">
                <ExclamationTriangleIcon class="w-10 h-10 text-gray-400" />
            </div>
            <h1 class="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Program Not Found</h1>
            <p class="text-gray-500 mb-10 max-w-md mx-auto">
                We couldn't find the program you're looking for. It may have been moved or is no longer available.
            </p>
            <NuxtLink to="/programs"
                class="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg shadow-xl shadow-teal-600/20 hover:bg-teal-700 transition-all active:scale-95">
                <ArrowLeftIcon class="w-5 h-5" />
                Back to Programs
            </NuxtLink>
        </div>

        <!-- Main Content -->
        <div v-else>
            <!-- Back Button -->
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <NuxtLink to="/programs"
                    class="inline-flex items-center gap-2 text-gray-400 hover:text-teal-600 transition-colors group">
                    <ArrowLeftIcon class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span class="text-sm font-semibold uppercase tracking-widest">Back to Programs</span>
                </NuxtLink>
            </div>
            <!-- ... existing hero section content ... -->
            <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <!-- Left: Name & Description -->
                    <div class="lg:col-span-7">
                        <div class="flex items-center gap-3 mb-6">
                            <div class="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                                <component :is="getIcon(program.name)" class="w-6 h-6 text-gray-500" />
                            </div>
                            <div
                                class="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-semibold uppercase tracking-widest rounded-full">
                                {{ program.status }}
                            </div>
                        </div>
                        <h1 class="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                            {{ program.name }}
                        </h1>
                        <p class="text-lg text-gray-500 leading-relaxed mb-10 max-w-2xl">
                            {{ program.description }}
                        </p>
                        <!-- CTA: respects admin-set dates and user role -->

                        <!-- Coming Soon -->
                        <div v-if="program.isComingSoon"
                            class="inline-flex items-center gap-2.5 px-8 py-4 bg-amber-50 text-amber-600 font-semibold rounded-lg border border-amber-200">
                            <ClockIcon class="w-5 h-5" />
                            Opens {{ formatDate(program.startDate) }}
                        </div>

                        <!-- Program Ended -->
                        <div v-else-if="program.isFinished"
                            class="inline-flex items-center gap-2.5 px-8 py-4 bg-gray-100 text-gray-400 font-semibold rounded-lg cursor-not-allowed">
                            Program Ended
                        </div>

                        <!-- Program Live -->
                        <template v-else>
                            <!-- Admin: view only, no action -->
                            <div v-if="auth.user?.role?.toUpperCase() === 'ADMIN'"
                                class="inline-flex items-center gap-2.5 px-8 py-4 bg-gray-50 text-gray-400 font-semibold rounded-xl cursor-default border border-gray-200">
                                Admin View Only
                            </div>

                            <!-- User not enrolled / Guest -->
                            <template v-else-if="!hasEnrolled">
                                <!-- Guest / SME -->
                                <button v-if="!auth.isAuthenticated || auth.user?.role === 'SME'" 
                                    @click="handleApply" :disabled="isApplying"
                                    class="px-8 py-4 bg-teal-600 text-white font-semibold rounded-xl shadow-xl shadow-teal-600/20 hover:bg-teal-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50">
                                    {{ isApplying ? 'Applying...' : 'Apply Now' }}
                                    <ArrowRightIcon v-if="!isApplying" class="w-5 h-5" />
                                    <div v-else class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                </button>

                                <!-- Investor -->
                                <button v-else-if="auth.user?.role === 'INVESTOR'" 
                                    @click="handleApply" :disabled="isApplying"
                                    class="px-8 py-4 bg-teal-600 text-white font-semibold rounded-xl shadow-xl shadow-teal-600/20 hover:bg-teal-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50">
                                    {{ isApplying ? 'Enrolling...' : 'Enroll' }}
                                    <SparklesIcon v-if="!isApplying" class="w-5 h-5" />
                                    <div v-else class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                </button>
                            </template>

                            <!-- User already enrolled -->
                            <div v-else
                                class="inline-flex items-center gap-2.5 px-8 py-4 bg-gray-50 text-teal-700 font-semibold rounded-xl border border-teal-100 cursor-default">
                                <CheckCircleIcon class="w-5 h-5" />
                                {{ auth.user?.role === 'INVESTOR' ? 'Joined' : 'Already Enrolled' }}
                            </div>
                        </template>
                    </div>

                    <!-- Right: Program Details Card -->
                    <div class="lg:col-span-5">
                        <div class="bg-white border border-gray-100 rounded-xl p-10 shadow-sm">
                            <h3 class="text-xl font-semibold text-gray-900 mb-8">Program Details</h3>
                            <div class="space-y-8">
                                <div class="flex items-start gap-4">
                                    <div
                                        class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                        <GlobeAltIcon class="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <div
                                            class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                            Sector</div>
                                        <div class="font-semibold text-gray-700">{{ program.sector || 'Agnostic' }}</div>
                                    </div>
                                </div>
                                <div class="flex items-start gap-4">
                                    <div
                                        class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                        <ClockIcon class="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <div
                                            class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                            Duration</div>
                                        <div class="font-semibold text-gray-700">{{ program.duration || 'Not specified' }}</div>
                                    </div>
                                </div>
                                <div class="flex items-start gap-4" v-if="program.startDate && program.endDate">
                                    <div
                                        class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                        <CalendarIcon class="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <div
                                            class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                            Program Period</div>
                                        <div class="font-semibold text-gray-700">{{ formatDate(program.startDate) }} - {{ formatDate(program.endDate) }}</div>
                                    </div>
                                </div>
                                <div class="flex items-start gap-4">
                                    <div
                                        class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                        <ExclamationTriangleIcon class="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <div
                                            class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                            Application Deadline</div>
                                        <div class="font-semibold text-gray-700">{{ program.enrollmentDeadline ? formatDate(program.enrollmentDeadline) : 'Open Until Filled' }}</div>
                                    </div>
                                </div>
                                <div class="flex items-start gap-4">
                                    <div
                                        class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                        <CurrencyDollarIcon class="w-5 h-5 text-teal-600" />
                                    </div>
                                    <div>
                                        <div
                                            class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                            Funding Available</div>
                                        <div class="font-semibold text-teal-600">{{ program.investmentAmount || 'Varies' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Enrolled Users Section -->
                        <div v-if="program.enrolled_smes?.length || program.enrolledSMEs?.length" class="bg-white border border-gray-100 rounded-xl p-8 shadow-sm mt-6">
                            <div class="flex items-center justify-between mb-6">
                                <h3 class="text-lg font-semibold text-gray-900">Enrolled Participants</h3>
                                <span class="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full">
                                    {{ (program.enrolled_smes?.length || 0) + (program.enrolledSMEs?.length || 0) }}
                                </span>
                            </div>
                            <div class="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                                <div v-for="(smeId, index) in (program.enrolled_smes || program.enrolledSMEs || []).slice(0, 5)" :key="index"
                                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div class="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">
                                        {{ String(smeId).charAt(0) }}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-medium text-gray-700 truncate">Participant {{ Number(index) + 1 }}</p>
                                        <p class="text-xs text-gray-500">ID: {{ String(smeId).slice(-6) }}</p>
                                    </div>
                                </div>
                                <div v-if="(program.enrolled_smes?.length || program.enrolledSMEs?.length || 0) > 5" 
                                    class="text-center py-2 text-sm text-gray-500">
                                    +{{ (program.enrolled_smes?.length || program.enrolledSMEs?.length || 0) - 5 }} more participants
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Program Benefits -->
            <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24" v-if="program.benefits?.length">
                <h2 class="text-3xl font-bold text-gray-900 mb-12 tracking-tight">Program Benefits</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="benefit in program.benefits" :key="benefit"
                        class="flex items-center gap-4 p-6 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-white hover:border-teal-200 hover:shadow-md transition-all group">
                        <div
                            class="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center shrink-0 group-hover:bg-teal-600 transition-colors">
                            <CheckIcon class="w-3.5 h-3.5 text-teal-600 group-hover:text-white transition-colors" />
                        </div>
                        <span class="font-medium text-gray-700">{{ benefit }}</span>
                    </div>
                </div>
            </section>

            <!-- Eligibility Requirements -->
            <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <h2 class="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Eligibility Requirements</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="req in (program.eligibility || ['Registered business entity', 'Minimum 1 year of operation', 'Clear business model', 'Commitment to program duration'])" :key="req"
                        class="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:border-teal-200 hover:shadow-sm transition-all">
                        <div class="w-8 h-8 flex items-center justify-center shrink-0 text-teal-600">
                            <UserCircleIcon class="w-6 h-6" />
                        </div>
                        <span class="text-gray-700 font-medium leading-snug">{{ req }}</span>
                    </div>
                </div>
            </section>

            <!-- Program Timeline -->
            <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <h2 class="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Program Timeline</h2>
                <div class="space-y-4 max-w-2xl">
                    <div v-for="(step, index) in (program.timeline || [
                        { title: 'Application Period', week: 'Phase 1', description: 'Submit your profile and initial documentation for review.' },
                        { title: 'Assessment & Selection', week: 'Phase 2', description: 'Complete the readiness assessment matrix and initial evaluations.' },
                        { title: 'Program Onboarding', week: 'Phase 3', description: 'Kick-off session to align goals, mentors, and program access.' },
                        { title: 'Growth & Investment Ready', week: 'Phase 4', description: 'Final pitch, graduation, and connecting with our investor network.' }
                    ])" :key="index" class="flex gap-5 items-start">
                        <!-- Step number circle -->
                        <div class="flex flex-col items-center shrink-0">
                            <div
                                class="w-11 h-11 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
                                {{ String(Number(index) + 1).padStart(2, '0') }}
                            </div>
                            <div v-if="Number(index) < 3"
                                class="w-0.5 flex-grow bg-gray-100 my-1 min-h-[24px]"></div>
                        </div>
                        <!-- Step card -->
                        <div
                            class="bg-white border border-gray-200 rounded-lg p-5 flex-grow mb-2 hover:border-teal-200 hover:shadow-sm transition-all">
                            <div class="flex items-center gap-3 mb-1">
                                <h4 class="text-base font-bold text-gray-900">{{ step.title }}</h4>
                                <span
                                    class="px-2.5 py-0.5 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                                    {{ step.week }}
                                </span>
                            </div>
                            <p class="text-sm text-gray-500 leading-relaxed">{{ step.description }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Expected Outcomes -->
            <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <h2 class="text-3xl font-bold text-gray-900 mb-10 tracking-tight">Expected Outcomes</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="outcome in (program.outcomes || ['Investment Readiness Certification', 'Access to exclusive investor networks', 'Optimized operational workflows', 'Strategic growth roadmap'])" :key="outcome"
                        class="flex items-start gap-4 p-5 bg-white border border-gray-200 rounded-lg hover:border-teal-200 hover:shadow-sm transition-all">
                        <div class="w-8 h-8 flex items-center justify-center shrink-0 text-teal-600 mt-0.5">
                            <BriefcaseIcon class="w-6 h-6" />
                        </div>
                        <span class="text-gray-700 font-medium leading-snug">{{ outcome }}</span>
                    </div>
                </div>
            </section>

            <!-- bottom CTA -->
            <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="bg-teal-700 rounded-xl p-10 text-center relative overflow-hidden group">
                    <div
                        class="absolute inset-0 bg-gradient-to-br from-teal-800/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    </div>
                    <div class="relative z-10">
                        <div class="inline-flex p-3 bg-teal-600/30 rounded-full mb-4">
                            <UserGroupIcon class="w-7 h-7 text-white" />
                        </div>
                        <h2 class="text-2xl lg:text-3xl font-bold text-white mb-3 tracking-tight leading-tight">
                            Ready to Join {{ program.name }}?
                        </h2>
                        <p class="text-base text-teal-100/80 mb-8 max-w-xl mx-auto leading-relaxed">
                            Take the first step towards becoming investment ready. Apply now and transform your
                            business.
                        </p>
                        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <!-- Coming Soon -->
                            <div v-if="program.isComingSoon"
                                class="inline-flex items-center gap-2 px-8 py-3 bg-amber-50 text-amber-600 font-semibold rounded-lg border border-amber-200">
                                <ClockIcon class="w-4 h-4" />
                                Opens {{ formatDate(program.startDate) }}
                            </div>
                            <!-- Program Ended -->
                            <div v-else-if="program.isFinished"
                                class="inline-flex items-center gap-2 px-8 py-3 bg-white/10 text-white font-semibold rounded-lg cursor-not-allowed opacity-60">
                                Program Ended
                            </div>
                            <!-- Admin: no action -->
                            <div v-else-if="auth.user?.role?.toUpperCase() === 'ADMIN'"
                                class="inline-flex items-center gap-2 px-8 py-3 bg-white/10 text-white font-semibold rounded-lg cursor-default border border-white/20">
                                Admin View Only
                            </div>
                            <!-- User already enrolled -->
                            <div v-else-if="hasEnrolled"
                                class="w-full sm:w-auto px-8 py-3 bg-white/10 text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-default border border-white/20">
                                <CheckCircleIcon class="w-4 h-4" />
                                {{ auth.user?.role === 'INVESTOR' ? 'Joined' : 'Already Enrolled' }}
                            </div>
                            <!-- Apply / Guest -->
                            <button v-else @click="handleApply" :disabled="isApplying"
                                class="w-full sm:w-auto px-8 py-3 bg-white text-teal-900 font-semibold rounded-xl hover:bg-teal-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10 disabled:opacity-50 group">
                                {{ isApplying ? (auth.user?.role === 'INVESTOR' ? 'Enrolling...' : 'Applying...') : (auth.user?.role === 'INVESTOR' ? 'Enroll Now' : 'Apply Now') }}
                                <ArrowRightIcon v-if="!isApplying" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                <div v-else class="animate-spin rounded-full h-4 w-4 border-2 border-teal-900 border-t-transparent"></div>
                            </button>
                            <NuxtLink to="/programs"
                                class="w-full sm:w-auto px-8 py-3 bg-teal-600/30 text-white font-semibold rounded-lg hover:bg-teal-600/50 transition-all border border-teal-500/30">
                                View All Programs
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <!-- Toast Notification -->
        <transition name="toast">
            <div v-if="toast.show"
                :class="[
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
                <button @click="toast.show = false"
                    class="text-gray-500 hover:text-gray-300 transition-colors p-1">
                    <XMarkIcon class="w-5 h-5" />
                </button>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'landing'
})
import {
    ChartBarIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    GlobeAltIcon,
    ClockIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    CheckIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    UserCircleIcon,
    BriefcaseIcon,
    SparklesIcon,
    RocketLaunchIcon,
    CpuChipIcon,
    BeakerIcon,
    HeartIcon,
    BuildingOfficeIcon,
    ExclamationTriangleIcon,
    CheckCircleIcon,
    XMarkIcon
} from '@heroicons/vue/24/outline'
import { useConfirm } from '~/composables/useConfirm'
import { useAuthStore } from '~/stores/auth.store'

const route = useRoute()
const api = useApi()
const allPrograms = ref<any[]>([])
const pending = ref(true)

const fetchPrograms = async () => {
    pending.value = true
    try {
        const res = await api<any>('/programs')
        allPrograms.value = res.programs || res.data?.programs || (Array.isArray(res) ? res : [])
    } catch (e) {
        console.error('Failed to fetch programs:', e)
    } finally {
        pending.value = false
    }
}

onMounted(() => {
    fetchPrograms()
})

const program = computed<any>(() => {
    if (!allPrograms.value) return null
    const found = allPrograms.value.find((p: any) => p.slug === route.params.slug)
    return found || null
})

const getIcon = (name: string) => {
    const n = name?.toLowerCase() || ''
    if (n.includes('digit') || n.includes('tech')) return CpuChipIcon
    if (n.includes('green') || n.includes('sustain') || n.includes('agri')) return SparklesIcon
    if (n.includes('accelerate') || n.includes('growth')) return RocketLaunchIcon
    if (n.includes('women')) return HeartIcon
    if (n.includes('real estate') || n.includes('prop')) return BuildingOfficeIcon
    return BeakerIcon
}

const auth = useAuthStore()
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

    // Fallback logic for manual check
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

const hasEnrolled = computed(() => checkEnrolled(program.value))

const handleApply = async () => {
    if (!auth.isAuthenticated) {
        useRouter().push({ path: '/login', query: { redirect: route.fullPath } })
        return
    }

    const userRole = auth.user?.role
    if (!['SME', 'INVESTOR'].includes(userRole as string)) {
        showToast("Only SME or Investor accounts can apply/enroll.", "error")
        return
    }

    if (!program.value) return

    const isInvestor = userRole === 'INVESTOR'
    const actionName = isInvestor ? 'enroll in' : 'apply for'
    const confirmText = isInvestor ? 'Enroll Now' : 'Submit Application'

    const confirmed = await ask({
        title: `Confirm: ${program.value.name}?`,
        message: `You are about to ${actionName} this program. Your profile will be shared with the program administrators.`,
        confirmText: confirmText,
        type: 'info'
    })
    if (!confirmed) return

    isApplying.value = true
    try {
        const endpoint = isInvestor 
            ? `/investor/programs/${program.value.id}/enroll` 
            : `/programs/${program.value.id}/apply`

        await api(endpoint, {
            method: 'POST'
        })

        // Refresh programs data
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

const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
