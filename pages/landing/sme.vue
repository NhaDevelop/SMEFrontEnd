<template>
    <div>

        <!-- ─── Hero ─────────────────────────────────────────────────── -->
        <section class="bg-gray-50/60 pt-32 pb-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col lg:flex-row items-center gap-16">

                    <!-- Left copy -->
                    <div class="flex-1">
                        <span
                            class="inline-block px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[11px] font-semibold mb-6 tracking-wide">
                            For SMEs
                        </span>
                        <h1 class="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6">
                            Become <span class="text-teal-600">Investor Ready</span>
                        </h1>
                        <p class="text-gray-500 text-lg leading-relaxed mb-10 max-w-lg">
                            Understand what investors look for, identify your gaps, and build a compelling case for
                            investment with our proven assessment framework.
                        </p>
                        <div class="flex flex-wrap items-center gap-4">
                            <NuxtLink to="/login"
                                class="inline-flex items-center gap-2 px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-lg shadow-teal-600/20 hover:shadow-teal-600/30 transition-all active:scale-95">
                                Start Free Assessment
                                <ArrowRightIcon class="w-4 h-4" />
                            </NuxtLink>
                            <NuxtLink to="/programs"
                                class="inline-flex items-center gap-2 px-7 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-teal-300 hover:text-teal-700 transition-all shadow-sm">
                                Browse Programs
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Right — Pillars card -->
                    <div class="flex-1 w-full">
                        <div class="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
                            <div class="flex items-center gap-3 mb-6">
                                <ClipboardDocumentListIcon class="w-6 h-6 text-teal-600" />
                                <h2 class="text-base font-bold text-gray-900">8 Assessment Pillars</h2>
                            </div>
                            <div class="grid grid-cols-2 gap-3">
                                <div v-for="pillar in pillars" :key="pillar"
                                    class="flex items-center gap-2 text-sm text-gray-700">
                                    <CheckCircleIcon class="w-4 h-4 text-teal-500 shrink-0" />
                                    {{ pillar }}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- ─── Why SMEs Choose IRIP ──────────────────────────────────── -->
        <section class="py-24 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Why SMEs Choose IRIP</h2>
                    <p class="text-gray-500 text-lg max-w-xl mx-auto">Our platform gives you the tools and insights to
                        present your best self to investors.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <NuxtLink v-for="feat in features" :key="feat.title" :to="`/landing/features/sme/${feat.slug}`"
                        class="p-8 border border-gray-100 rounded-2xl hover:shadow-lg hover:border-teal-100 transition-all group cursor-pointer">
                        <div
                            class="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-6 group-hover:bg-teal-100 transition-colors">
                            <component :is="feat.icon" class="w-6 h-6 text-teal-600" />
                        </div>
                        <h3
                            class="font-bold text-gray-900 mb-2 text-lg group-hover:text-teal-700 transition-colors flex items-center justify-between gap-2">
                            {{ feat.title }}
                            <ArrowRightIcon
                                class="w-4 h-4 text-gray-300 group-hover:text-teal-400 shrink-0 transition-colors" />
                        </h3>
                        <p class="text-gray-500 text-sm leading-relaxed">{{ feat.description }}</p>
                    </NuxtLink>
                </div>
            </div>
        </section>

        <!-- ─── Your Journey ──────────────────────────────────────────── -->
        <section class="py-24 bg-gray-50/60">
            <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Your Journey to Investment</h2>
                    <p class="text-gray-500 text-lg">Follow our proven 5-step process to become investment ready.</p>
                </div>
                <div class="space-y-4">
                    <div v-for="(step, i) in journey" :key="step.title"
                        class="flex items-start gap-6 bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-teal-100 transition-all">
                        <div
                            class="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
                            {{ String(i + 1).padStart(2, '0') }}
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 mb-1">{{ step.title }}</h3>
                            <p class="text-gray-500 text-sm leading-relaxed">{{ step.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ─── FAQ ───────────────────────────────────────────────────── -->
        <section class="py-24 bg-white">
            <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Questions from SMEs</h2>
                    <p class="text-gray-500">Get answers to common questions about becoming investment ready.</p>
                </div>
                <div class="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                    <div v-for="(faq, i) in faqs" :key="i">
                        <button @click="toggleFaq(i)"
                            class="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors group">
                            <span class="font-medium text-gray-800 group-hover:text-teal-700 transition-colors">{{
                                faq.question }}</span>
                            <ChevronDownIcon
                                :class="['w-5 h-5 text-gray-400 transition-transform', faq.open ? 'rotate-180' : '']" />
                        </button>
                        <div v-show="faq.open" class="px-6 pb-5 text-gray-500 text-sm leading-relaxed bg-gray-50/50">
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
                <h2 class="text-3xl font-bold text-white mb-4 tracking-tight">Ready to Take the First Step?</h2>
                <p class="text-teal-100/80 mb-10">Create your free account and complete your first assessment in under
                    an hour.</p>
                <NuxtLink to="/login"
                    class="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-all shadow-xl active:scale-95">
                    Start Free Assessment
                    <ArrowRightIcon class="w-4 h-4" />
                </NuxtLink>
            </div>
        </section>

    </div>
</template>

<script setup>
import {
    ArrowRightIcon,
    CheckCircleIcon,
    ClipboardDocumentListIcon,
    ChartBarIcon,
    LightBulbIcon,
    DocumentChartBarIcon,
    UsersIcon,
    FlagIcon,
    ShieldExclamationIcon,
    ChevronDownIcon,
    RocketLaunchIcon
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'landing' })

// Modal logic removed
const pillars = [
    'Team & Leadership',
    'Business Model',
    'Market & Traction',
    'Financial Readiness',
    'Operations',
    'Legal & Governance',
    'Data & Digital Maturity',
    'Growth & Scalability'
]

const features = [
    {
        slug: 'comprehensive-assessment',
        title: 'Comprehensive Assessment',
        description: 'Evaluate your business across 8 critical pillars: Team, Business Model, Market, Financials, Operations, Legal, Digital Maturity, and Growth.',
        icon: ChartBarIcon
    },
    {
        slug: 'actionable-insights',
        title: 'Actionable Insights',
        description: 'Receive prioritized recommendations to address gaps and improve your investment readiness score.',
        icon: LightBulbIcon
    },
    {
        slug: 'professional-reports',
        title: 'Professional Reports',
        description: 'Generate investor-ready reports that showcase your strengths and growth potential.',
        icon: DocumentChartBarIcon
    },
    {
        slug: 'investor-matching',
        title: 'Investor Matching',
        description: 'Get connected with investors whose criteria align with your readiness level and sector.',
        icon: UsersIcon
    },
    {
        slug: 'goal-tracking',
        title: 'Goal Tracking',
        description: 'Set measurable goals, track progress over time, and celebrate milestones.',
        icon: FlagIcon
    },
    {
        slug: 'risk-analysis',
        title: 'Risk Analysis',
        description: 'Identify and address potential red flags before they become deal-breakers.',
        icon: ShieldExclamationIcon
    }
]

const journey = [
    { title: 'Register Your Business', description: 'Create your account and provide basic company information to get started.' },
    { title: 'Complete Assessment', description: 'Answer questions across our 8-pillar framework. Takes about 30–45 minutes.' },
    { title: 'Review Your Score', description: 'Get your investment readiness score with detailed breakdown by pillar.' },
    { title: 'Implement Actions', description: 'Follow prioritized recommendations to improve your weak areas.' },
    { title: 'Connect with Investors', description: 'Join programs and get introduced to investors matching your profile.' }
]

const faqs = ref([
    {
        question: 'What makes an SME "investment ready"?',
        answer: 'An investment-ready SME has strong fundamentals across leadership, financials, operations, and governance — and can clearly articulate its value proposition, market opportunity, and growth plan to investors.',
        open: false
    },
    {
        question: 'How long does it take to become investment ready?',
        answer: 'It varies by business, but most SMEs see meaningful score improvements within 3–6 months of focused action on recommended areas.',
        open: false
    },
    {
        question: 'What if my score is low?',
        answer: 'A low score simply means there are clear opportunities to improve. The platform gives you a prioritized action plan so you know exactly what to work on first.',
        open: false
    },
    {
        question: 'Do I need to have revenue to use the platform?',
        answer: 'No. The platform is designed for SMEs at various stages — from early-stage startups to established businesses looking to scale with investment.',
        open: false
    },
    {
        question: 'How do I improve my readiness score?',
        answer: 'Complete the assessment, review your pillar scores, and follow the prioritized recommendations. Re-assess periodically to track your improvement.',
        open: false
    },
    {
        question: 'Will investors see my assessment data?',
        answer: 'Only with your explicit consent. You control who can view your detailed assessment data. Investors can see only what you choose to share.',
        open: false
    }
])

const toggleFaq = (i) => {
    faqs.value[i].open = !faqs.value[i].open
}
</script>
