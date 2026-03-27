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
                        <button v-if="hasEnrolled" disabled
                            class="px-8 py-4 bg-gray-100 text-gray-500 font-semibold rounded-lg flex items-center gap-2 cursor-not-allowed">
                            <CheckIcon class="w-5 h-5 text-teal-600" />
                            Already Enrolled
                        </button>
                        <button v-else @click="handleApply" :disabled="isApplying"
                            class="px-8 py-4 bg-teal-600 text-white font-semibold rounded-lg shadow-xl shadow-teal-600/20 hover:bg-teal-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50">
                            {{ isApplying ? 'Enrolling...' : 'Apply Now' }}
                            <ArrowRightIcon v-if="!isApplying" class="w-5 h-5" />
                            <div v-else
                                class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent">
                            </div>
                        </button>
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
                                        <div class="font-semibold text-gray-700">{{ program.sector }}</div>
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
                                        <div class="font-semibold text-gray-700">{{ program.duration }}</div>
                                    </div>
                                </div>
                                <div class="flex items-start gap-4">
                                    <div
                                        class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                                        <CalendarIcon class="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <div
                                            class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
                                            Application Deadline</div>
                                        <div class="font-semibold text-gray-700">{{ program.deadline }}</div>
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
                                        <div class="font-semibold text-teal-600">{{ program.investmentAmount }}
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
            <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
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
                    <div v-for="req in program.eligibility" :key="req"
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
                    <div v-for="(step, index) in program.timeline" :key="index" class="flex gap-5 items-start">
                        <!-- Step number circle -->
                        <div class="flex flex-col items-center shrink-0">
                            <div
                                class="w-11 h-11 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
                                {{ String(Number(index) + 1).padStart(2, '0') }}
                            </div>
                            <div v-if="Number(index) < program.timeline.length - 1"
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
                    <div v-for="outcome in program.outcomes" :key="outcome"
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
                            <button v-if="hasEnrolled" disabled
                                class="w-full sm:w-auto px-8 py-3 bg-white/10 text-white font-semibold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed opacity-80">
                                <CheckIcon class="w-4 h-4" />
                                Enrolled
                            </button>
                            <button v-else @click="handleApply" :disabled="isApplying"
                                class="w-full sm:w-auto px-8 py-3 bg-white text-teal-900 font-semibold rounded-lg hover:bg-teal-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10 disabled:opacity-50">
                                {{ isApplying ? 'Enrolling...' : 'Apply Now' }}
                                <ArrowRightIcon v-if="!isApplying" class="w-4 h-4" />
                                <div v-else
                                    class="animate-spin rounded-full h-4 w-4 border-2 border-teal-900 border-t-transparent">
                                </div>
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
                    <p class="text-sm text-gray-400">You are now enrolled. The program assessment has been unlocked in
                        your dashboard.</p>
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

const route = useRoute()
const api = useApi()
const allPrograms = ref<any[]>([])
const pending = ref(true)

const fetchPrograms = async () => {
    pending.value = true
    try {
        const res = await api<any>('/programs')
        allPrograms.value = res.data || res || []
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
const isApplying = ref(false)

// Modal triggers removed
const hasEnrolled = computed(() => {
    const userRole = auth.user?.role
    if (!auth.isAuthenticated || String(userRole).toLowerCase() !== 'sme' || !program.value) return false
    const smeId = auth.user?.company?.id || auth.user?.id
    return program.value.enrolled_smes?.some((id: any) => String(id) === String(smeId)) || 
           program.value.enrolledSMEs?.some((id: any) => String(id) === String(smeId))
})

const handleApply = async () => {
    if (!auth.isAuthenticated) {
        useRouter().push({ path: '/login', query: { redirect: route.fullPath } })
        return
    }

    const userRole = auth.user?.role
    if (String(userRole).toLowerCase() !== 'sme') {
        alert("Only SME accounts can apply to programs.")
        return
    }

    if (!program.value) return

    isApplying.value = true
    try {
        await api(`/programs/${program.value.id}/apply`, {
            method: 'POST'
        })

        // Refresh programs data
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
const showSuccessToast = ref(false)

</script>
