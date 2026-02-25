<template>
    <div v-if="feature">

        <!-- ─── Hero ─────────────────────────────────────────────────── -->
        <section class="bg-gray-50/60 pt-28 pb-20">
            <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                <!-- Back -->
                <NuxtLink to="/landing/investor"
                    class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-teal-600 transition-colors mb-10">
                    <ArrowLeftIcon class="w-4 h-4" />
                </NuxtLink>

                <div class="text-center">
                    <!-- Icon -->
                    <div
                        class="w-20 h-20 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <component :is="feature.icon" class="w-10 h-10 text-teal-600" />
                    </div>

                    <span
                        class="inline-block px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[11px] font-semibold mb-5 tracking-wide">
                        For Investors
                    </span>

                    <h1 class="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.1]">
                        {{ feature.title }}
                    </h1>
                    <p class="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto">
                        {{ feature.description }}
                    </p>
                </div>
            </div>
        </section>

        <!-- ─── Key Benefits ──────────────────────────────────────────── -->
        <section class="py-20 bg-white">
            <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-10 text-center tracking-tight">Key Benefits</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-5">
                    <div v-for="benefit in feature.benefits" :key="benefit"
                        class="flex items-start gap-3 text-sm text-gray-700">
                        <CheckCircleIcon class="w-5 h-5 text-teal-500 shrink-0 mt-0.5" />
                        <span>{{ benefit }}</span>
                    </div>
                </div>
            </div>
        </section>

        <!-- ─── How It Works ──────────────────────────────────────────── -->
        <section class="py-20 bg-gray-50/60">
            <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-2xl font-bold text-gray-900 mb-10 text-center tracking-tight">How It Works</h2>
                <div class="space-y-4">
                    <div v-for="(step, i) in feature.steps" :key="step.title"
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

        <!-- ─── CTA ───────────────────────────────────────────────────── -->
        <section class="bg-teal-600 py-20 text-center">
            <div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl font-bold text-white mb-4 tracking-tight">Ready to Get Started?</h2>
                <p class="text-teal-100/80 mb-10">Join our investor network and access pre-qualified SMEs today.</p>
                <NuxtLink to="/login"
                    class="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-all shadow-xl active:scale-95">
                    Join as Investor
                    <ArrowRightIcon class="w-4 h-4" />
                </NuxtLink>
            </div>
        </section>

    </div>

    <!-- 404 fallback -->
    <div v-else class="flex flex-col items-center justify-center py-40 text-center">
        <p class="text-gray-400 mb-6">Feature not found.</p>
        <NuxtLink to="/landing/investor" class="text-teal-600 font-semibold hover:underline flex items-center gap-2">
            <ArrowLeftIcon class="w-4 h-4" /> Back to For Investors
        </NuxtLink>
    </div>
</template>

<script setup>
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    MagnifyingGlassIcon,
    ChartBarIcon,
    FunnelIcon,
    ArrowTrendingUpIcon,
    DocumentChartBarIcon,
    ShieldCheckIcon
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'landing' })

const route = useRoute()

// Modal logic removed
const allFeatures = [
    {
        slug: 'pre-qualified-deal-flow',
        title: 'Pre-Qualified Deal Flow',
        icon: MagnifyingGlassIcon,
        description: 'Access a curated pipeline of SMEs that have already completed our rigorous assessment process. Save time on initial screening and focus on opportunities that match your investment criteria.',
        benefits: [
            'Pre-screened investment opportunities',
            'Standardized assessment data',
            'Reduced due diligence time',
            'Quality deal flow from multiple sectors',
            'Regular updates on new opportunities',
            'Filter by readiness score and sector'
        ],
        steps: [
            { title: 'Browse', description: 'Explore pre-qualified SMEs in your focus areas.' },
            { title: 'Filter', description: 'Narrow down by sector, stage, and score.' },
            { title: 'Review', description: 'Access detailed assessment reports.' },
            { title: 'Connect', description: 'Request introductions to promising SMEs.' }
        ]
    },
    {
        slug: 'standardized-metrics',
        title: 'Standardized Metrics',
        icon: ChartBarIcon,
        description: 'Our standardized 8-pillar framework provides consistent, comparable metrics across all SMEs. Make apples-to-apples comparisons and identify the best opportunities with confidence.',
        benefits: [
            'Consistent scoring methodology',
            'Comparable data across all SMEs',
            'Clear pillar-by-pillar breakdown',
            'Industry benchmarking',
            'Historical score tracking',
            'Objective, data-driven insights'
        ],
        steps: [
            { title: 'Select SMEs', description: 'Choose SMEs you want to compare.' },
            { title: 'View Metrics', description: 'Access standardized scores across all pillars.' },
            { title: 'Compare', description: 'Side-by-side analysis of multiple opportunities.' },
            { title: 'Decide', description: 'Make informed investment decisions.' }
        ]
    },
    {
        slug: 'smart-filtering',
        title: 'Smart Filtering',
        icon: FunnelIcon,
        description: 'Find exactly what you\'re looking for with our powerful filtering tools. Filter by sector, readiness score, risk level, growth potential, and more to quickly identify the best matches for your portfolio.',
        benefits: [
            'Multi-criteria filtering',
            'Save and reuse filter presets',
            'Real-time results',
            'Export filtered lists',
            'Custom filter combinations',
            'Instant notifications for new matches'
        ],
        steps: [
            { title: 'Set Criteria', description: 'Define your investment preferences.' },
            { title: 'Filter', description: 'Apply multiple filters simultaneously.' },
            { title: 'Review', description: 'Explore matching opportunities.' },
            { title: 'Save', description: 'Save searches for future use.' }
        ]
    },
    {
        slug: 'progress-tracking',
        title: 'Progress Tracking',
        icon: ArrowTrendingUpIcon,
        description: 'Track the progress of SMEs in your portfolio or watchlist. Monitor how their readiness scores improve over time and stay informed about their development journey.',
        benefits: [
            'Real-time score updates',
            'Historical trend analysis',
            'Milestone notifications',
            'Portfolio performance overview',
            'Comparative progress charts',
            'Custom alerts and reminders'
        ],
        steps: [
            { title: 'Add to Portfolio', description: 'Select SMEs to track.' },
            { title: 'Monitor', description: 'View real-time progress updates.' },
            { title: 'Analyze', description: 'Review trends and improvements.' },
            { title: 'Engage', description: 'Support SMEs in their growth journey.' }
        ]
    },
    {
        slug: 'detailed-reports',
        title: 'Detailed Reports',
        icon: DocumentChartBarIcon,
        description: 'Access in-depth assessment reports for each SME, including detailed pillar breakdowns, action plans, and supporting documentation. Get the information you need for due diligence.',
        benefits: [
            'Comprehensive assessment data',
            'Pillar-by-pillar analysis',
            'Action plan visibility',
            'Supporting documentation',
            'Export and print options',
            'Version history tracking'
        ],
        steps: [
            { title: 'Select SME', description: 'Choose an SME to review.' },
            { title: 'Access Report', description: 'View the full assessment report.' },
            { title: 'Analyze', description: 'Review scores, insights, and documentation.' },
            { title: 'Export', description: 'Download for offline review.' }
        ]
    },
    {
        slug: 'risk-visibility',
        title: 'Risk Visibility',
        icon: ShieldCheckIcon,
        description: 'Get clear visibility into potential risks and gaps before making investment decisions. Our risk analysis highlights areas of concern and helps you understand the full picture.',
        benefits: [
            'Early risk identification',
            'Gap analysis reports',
            'Risk severity ratings',
            'Mitigation status tracking',
            'Compliance checklists',
            'Due diligence support'
        ],
        steps: [
            { title: 'Review Risks', description: 'Access the risk analysis for each SME.' },
            { title: 'Assess Impact', description: 'Understand severity and potential impact.' },
            { title: 'Track Mitigation', description: 'Monitor how SMEs address identified risks.' },
            { title: 'Decide', description: 'Make informed investment decisions.' }
        ]
    }
]

const feature = computed(() =>
    allFeatures.find(f => f.slug === route.params.slug) ?? null
)
</script>
