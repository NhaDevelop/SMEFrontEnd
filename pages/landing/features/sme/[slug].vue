<template>
    <div v-if="feature">

        <!-- ─── Hero ─────────────────────────────────────────────────── -->
        <section class="bg-gray-50/60 pt-28 pb-20">
            <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                <!-- Back -->
                <NuxtLink to="/landing/sme"
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
                        For SMEs
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
                <p class="text-teal-100/80 mb-10">Create your free account and complete your first assessment.</p>
                <NuxtLink to="/login"
                    class="inline-flex items-center gap-2 px-8 py-4 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-all shadow-xl active:scale-95">
                    Start Free Assessment
                    <ArrowRightIcon class="w-4 h-4" />
                </NuxtLink>
            </div>
        </section>

    </div>

    <!-- 404 fallback -->
    <div v-else class="flex flex-col items-center justify-center py-40 text-center">
        <p class="text-gray-400 mb-6">Feature not found.</p>
        <NuxtLink to="/landing/sme" class="text-teal-600 font-semibold hover:underline flex items-center gap-2">
            <ArrowLeftIcon class="w-4 h-4" /> Back to For SMEs
        </NuxtLink>
    </div>
</template>

<script setup>
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    ChartBarIcon,
    LightBulbIcon,
    DocumentChartBarIcon,
    UsersIcon,
    FlagIcon,
    ShieldExclamationIcon
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'landing' })

const route = useRoute()

// Modal logic removed
const allFeatures = [
    {
        slug: 'comprehensive-assessment',
        title: 'Comprehensive Assessment',
        icon: ChartBarIcon,
        description: 'Our comprehensive assessment framework evaluates your business across 8 critical pillars: Team, Business Model, Market, Financials, Operations, Legal, Digital Maturity, and Growth. Each pillar is carefully analyzed to provide you with a complete picture of your investment readiness.',
        benefits: [
            'Complete 360-degree business evaluation',
            'AI-powered scoring for objective results',
            'Detailed breakdown by each pillar',
            'Benchmarking against industry standards',
            'Identification of strengths and weaknesses',
            'Actionable improvement recommendations'
        ],
        steps: [
            { title: 'Register', description: 'Create your account and provide basic company information.' },
            { title: 'Complete Questions', description: 'Answer questions across all 8 pillars (30–45 minutes).' },
            { title: 'Get Results', description: 'Receive your investment readiness score with detailed analysis.' },
            { title: 'Review Insights', description: 'Explore pillar-by-pillar breakdown and recommendations.' }
        ]
    },
    {
        slug: 'actionable-insights',
        title: 'Actionable Insights',
        icon: LightBulbIcon,
        description: 'Transform your assessment results into a clear action plan. Our AI analyzes your scores and generates prioritized recommendations that have the highest impact on your investment readiness.',
        benefits: [
            'Prioritized action items by impact',
            'Step-by-step improvement guides',
            'Resource recommendations and templates',
            'Timeline estimates for each action',
            'Progress tracking and checkpoints',
            'Expert tips and best practices'
        ],
        steps: [
            { title: 'Assess', description: 'Complete your investment readiness assessment.' },
            { title: 'Analyze', description: 'AI identifies improvement opportunities.' },
            { title: 'Prioritize', description: 'Actions are ranked by impact and effort.' },
            { title: 'Execute', description: 'Follow the roadmap to improve your score.' }
        ]
    },
    {
        slug: 'professional-reports',
        title: 'Professional Reports',
        icon: DocumentChartBarIcon,
        description: 'Create polished, professional reports that present your business in the best light. Our reports are designed to meet investor expectations and highlight your strengths, progress, and potential.',
        benefits: [
            'Investor-ready format and design',
            'Comprehensive business overview',
            'Visual score breakdowns and charts',
            'Progress tracking over time',
            'Customizable sections',
            'PDF export for easy sharing'
        ],
        steps: [
            { title: 'Complete Assessment', description: 'Ensure your assessment data is up to date.' },
            { title: 'Generate Report', description: 'Create a professional investment readiness report.' },
            { title: 'Customize', description: 'Add additional context and highlights.' },
            { title: 'Share', description: 'Download and share with potential investors.' }
        ]
    },
    {
        slug: 'investor-matching',
        title: 'Investor Matching',
        icon: UsersIcon,
        description: 'Our intelligent matching algorithm connects you with investors whose criteria align with your business profile, sector, and readiness level. Save time by focusing on investors most likely to be interested in your opportunity.',
        benefits: [
            'AI-powered investor matching',
            'Filter by sector, stage, and ticket size',
            'View investor preferences and focus areas',
            'Direct introduction requests',
            'Track engagement and interest',
            'Build relationships before pitching'
        ],
        steps: [
            { title: 'Complete Profile', description: 'Ensure your assessment and profile are complete.' },
            { title: 'Get Matches', description: 'Receive curated investor recommendations.' },
            { title: 'Request Intro', description: 'Express interest in connecting with matched investors.' },
            { title: 'Engage', description: 'Start conversations with interested investors.' }
        ]
    },
    {
        slug: 'goal-tracking',
        title: 'Goal Tracking',
        icon: FlagIcon,
        description: 'Our goal tracking system helps you set measurable targets, monitor your progress over time, and stay on track with your investment readiness journey. Receive personalized recommendations and celebrate milestones as you improve.',
        benefits: [
            'Set SMART goals aligned with investor expectations',
            'Track progress with visual dashboards',
            'Receive automated progress updates',
            'Get personalized recommendations',
            'Celebrate milestones and achievements',
            'Compare performance over time'
        ],
        steps: [
            { title: 'Set Goals', description: 'Define specific, measurable goals for each pillar.' },
            { title: 'Track Progress', description: 'Monitor your advancement with real-time dashboards.' },
            { title: 'Get Insights', description: 'Receive AI-powered recommendations to accelerate progress.' },
            { title: 'Achieve & Iterate', description: 'Celebrate wins and set new targets.' }
        ]
    },
    {
        slug: 'risk-analysis',
        title: 'Risk Analysis',
        icon: ShieldExclamationIcon,
        description: 'Our risk analysis tools help you identify potential red flags and gaps in your business before investors do. By understanding and addressing these risks early, you can present a stronger case for investment.',
        benefits: [
            'Early identification of potential deal-breakers',
            'Risk scoring across all business areas',
            'Prioritized action items for risk mitigation',
            'Industry-specific risk benchmarks',
            'Document checklist for compliance',
            'Ongoing monitoring and alerts'
        ],
        steps: [
            { title: 'Analyze', description: 'Our system scans your assessment for potential risks.' },
            { title: 'Prioritize', description: 'Risks are ranked by severity and investor impact.' },
            { title: 'Mitigate', description: 'Follow actionable steps to address each risk.' },
            { title: 'Verify', description: 'Reassess to confirm risks have been resolved.' }
        ]
    }
]

const feature = computed(() =>
    allFeatures.find(f => f.slug === route.params.slug) ?? null
)
</script>
