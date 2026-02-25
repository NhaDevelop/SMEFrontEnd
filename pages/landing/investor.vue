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
                            For Investors
                        </span>
                        <h1 class="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1] mb-6">
                            Find <span class="text-teal-600">Investment-Ready</span> SMEs
                        </h1>
                        <p class="text-gray-500 text-lg leading-relaxed mb-10 max-w-lg">
                            Access pre-qualified deal flow with standardized assessment data. Make informed investment
                            decisions with our comprehensive readiness framework.
                        </p>
                        <div class="flex flex-wrap items-center gap-4">
                            <NuxtLink to="/login"
                                class="inline-flex items-center gap-2 px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-lg shadow-teal-600/20 transition-all active:scale-95">
                                Join as Investor
                                <ArrowRightIcon class="w-4 h-4" />
                            </NuxtLink>
                            <button
                                class="inline-flex items-center gap-2 px-7 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-teal-300 hover:text-teal-700 transition-all shadow-sm">
                                Schedule Demo
                            </button>
                        </div>
                    </div>

                    <!-- Right — Stats grid -->
                    <div class="flex-1 w-full">
                        <div class="grid grid-cols-2 gap-4">
                            <div v-for="stat in stats" :key="stat.label"
                                class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center hover:shadow-md transition-shadow">
                                <div class="text-3xl font-extrabold text-teal-600 mb-1">{{ stat.value }}</div>
                                <div class="text-sm text-gray-500 font-medium">{{ stat.label }}</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- ─── Why Investors Choose IRIP ─────────────────────────────── -->
        <section class="py-24 bg-white">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Why Investors Choose IRIP</h2>
                    <p class="text-gray-500 text-lg max-w-xl mx-auto">Save time on due diligence and focus on what
                        matters - finding great investments.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <NuxtLink v-for="feat in features" :key="feat.title" :to="`/landing/features/investor/${feat.slug}`"
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

        <!-- ─── Powerful Investor Tools ───────────────────────────────── -->
        <section class="py-24 bg-gray-50/60">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col lg:flex-row items-start gap-16">

                    <!-- Left: Tools list -->
                    <div class="flex-1">
                        <h2 class="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Powerful Investor Tools</h2>
                        <p class="text-gray-500 mb-10 leading-relaxed">Our platform provides everything you need to
                            discover, evaluate, and track SME investments.</p>
                        <div class="space-y-7">
                            <div v-for="tool in tools" :key="tool.title" class="flex items-start gap-4">
                                <CheckCircleIcon class="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                                <div>
                                    <h3 class="font-bold text-gray-900 mb-0.5">{{ tool.title }}</h3>
                                    <p class="text-gray-500 text-sm leading-relaxed">{{ tool.description }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Mock dashboard card -->
                    <div class="flex-1 w-full">
                        <div class="bg-white rounded-2xl border border-gray-100 shadow-xl p-6">
                            <div class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                                Deal Flow Overview
                            </div>
                            <div class="space-y-3">
                                <div v-for="sme in mockSmes" :key="sme.name"
                                    class="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-teal-100 hover:bg-teal-50/30 transition-all group">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                                            <BuildingOffice2Icon class="w-5 h-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <div class="font-semibold text-gray-900 text-sm">{{ sme.name }}</div>
                                            <div class="text-xs text-gray-400">{{ sme.sector }} • {{ sme.stage }}</div>
                                        </div>
                                    </div>
                                    <span :class="[
                                        'px-2.5 py-1 rounded-full text-xs font-bold',
                                        sme.score >= 70 ? 'bg-green-50 text-green-700' :
                                            sme.score >= 55 ? 'bg-amber-50 text-amber-700' :
                                                'bg-orange-50 text-orange-600'
                                    ]">
                                        Score: {{ sme.score }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- ─── Investor FAQs ─────────────────────────────────────────── -->
        <section class="py-24 bg-white">
            <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="text-center mb-16">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Investor FAQs</h2>
                    <p class="text-gray-500">Common questions from investors about using our platform.</p>
                </div>
                <div class="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                    <div v-for="(faq, i) in faqs" :key="i">
                        <button @click="toggleFaq(i)"
                            class="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors group">
                            <span class="font-medium text-gray-800 group-hover:text-teal-700 transition-colors">{{
                                faq.question }}</span>
                            <ChevronDownIcon
                                :class="['w-5 h-5 text-gray-400 transition-transform shrink-0 ml-4', faq.open ? 'rotate-180' : '']" />
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
                <MagnifyingGlassPlusIcon class="w-14 h-14 text-white/60 mx-auto mb-6" />
                <h2 class="text-3xl font-bold text-white mb-4 tracking-tight">Ready to Find Your Next Investment?</h2>
                <p class="text-teal-100/80 mb-10">Join our investor network and get access to pre-qualified SMEs across
                    Southeast Asia.</p>
                <div class="flex flex-wrap items-center justify-center gap-4">
                    <NuxtLink to="/login"
                        class="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-all shadow-xl active:scale-95">
                        Join as Investor
                        <ArrowRightIcon class="w-4 h-4" />
                    </NuxtLink>
                    <button
                        class="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 border border-white/30 text-white font-semibold rounded-lg hover:bg-teal-400 transition-all active:scale-95">
                        Schedule Demo
                    </button>
                </div>
            </div>
        </section>

    </div>
</template>

<script setup>
import {
    ArrowRightIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon,
    ChartBarIcon,
    FunnelIcon,
    ArrowTrendingUpIcon,
    DocumentChartBarIcon,
    ShieldCheckIcon,
    BuildingOffice2Icon,
    MagnifyingGlassPlusIcon
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'landing' })

// Modal logic removed
const stats = [
    { value: '45+', label: 'Active Investors' },
    { value: '500+', label: 'Assessed SMEs' },
    { value: '$12M+', label: 'Invested Capital' },
    { value: '8', label: 'Assessment Pillars' }
]

const features = [
    {
        slug: 'pre-qualified-deal-flow',
        title: 'Pre-Qualified Deal Flow',
        description: 'Access SMEs that have already been assessed and scored, saving you due diligence time.',
        icon: MagnifyingGlassIcon
    },
    {
        slug: 'standardized-metrics',
        title: 'Standardized Metrics',
        description: 'Compare opportunities using our consistent 8-pillar framework and scoring system.',
        icon: ChartBarIcon
    },
    {
        slug: 'smart-filtering',
        title: 'Smart Filtering',
        description: 'Filter by sector, readiness level, risk profile, and growth potential to find ideal matches.',
        icon: FunnelIcon
    },
    {
        slug: 'progress-tracking',
        title: 'Progress Tracking',
        description: 'Monitor portfolio companies and watch their readiness scores improve over time.',
        icon: ArrowTrendingUpIcon
    },
    {
        slug: 'detailed-reports',
        title: 'Detailed Reports',
        description: 'Access comprehensive assessment reports with pillar breakdowns and action plans.',
        icon: DocumentChartBarIcon
    },
    {
        slug: 'risk-visibility',
        title: 'Risk Visibility',
        description: 'Understand potential risks upfront with our risk assessment and gap analysis.',
        icon: ShieldCheckIcon
    }
]

const tools = [
    {
        title: 'Portfolio Dashboard',
        description: 'Track all your SME investments in one place with real-time readiness updates.'
    },
    {
        title: 'Comparison Tools',
        description: 'Side-by-side comparison of multiple SMEs across all assessment pillars.'
    },
    {
        title: 'What-If Scenarios',
        description: 'Model potential improvements and see projected score changes.'
    },
    {
        title: 'Program Management',
        description: 'Create and manage investment programs with custom assessment criteria.'
    }
]

const mockSmes = [
    { name: 'TechStart Cambodia', sector: 'FinTech', stage: 'Series A', score: 78 },
    { name: 'AgriGrow Solutions', sector: 'AgriTech', stage: 'Seed', score: 65 },
    { name: 'EduLearn Pro', sector: 'EdTech', stage: 'Pre-Seed', score: 52 }
]

const faqs = ref([
    {
        question: 'How are SMEs assessed and scored?',
        answer: 'SMEs complete a comprehensive assessment covering 8 pillars: Team, Business Model, Market, Financials, Operations, Legal, Digital Maturity, and Growth. Scores are calculated using weighted averages, and all assessments follow the same standardized framework for consistent comparison.',
        open: false
    },
    {
        question: 'What level of due diligence does the platform provide?',
        answer: 'Our platform provides initial screening and standardized evaluation. While this significantly reduces early-stage due diligence effort, we recommend investors conduct their own thorough due diligence before making investment decisions.',
        open: false
    },
    {
        question: 'How do I access SME data and reports?',
        answer: 'Once registered as an investor, you can browse pre-qualified SMEs, filter by various criteria, and request access to detailed assessment reports. SMEs control what information they share with potential investors.',
        open: false
    },
    {
        question: 'Is there a cost to join as an investor?',
        answer: 'Basic access to browse and filter SMEs is free. Premium features including detailed analytics, comparison tools, and program management capabilities are available through our investor partnership plans.',
        open: false
    },
    {
        question: 'Can I create my own investment programs?',
        answer: 'Yes! Our platform allows investors to create custom programs with specific criteria, timelines, and assessment requirements. You can manage applications, track participants, and monitor progress all in one place.',
        open: false
    },
    {
        question: 'How do you ensure data quality and accuracy?',
        answer: 'We use a combination of self-reporting with verification requirements, document uploads, and evaluator reviews. While we strive for accuracy, investors should always verify critical information during their due diligence process.',
        open: false
    }
])

const toggleFaq = (i) => {
    faqs.value[i].open = !faqs.value[i].open
}
</script>
