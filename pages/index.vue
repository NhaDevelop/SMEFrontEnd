<template>
  <div>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-16 lg:pt-44 lg:pb-24 overflow-hidden">
      <!-- Background Shapes -->
      <div
        class="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-teal-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4">
      </div>
      <div
        class="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-teal-50/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4">
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          class="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-[11px] font-semibold mb-8 transition-transform hover:scale-105">
          Trusted by 500+ SMEs across Southeast Asia
        </div>

        <h1
          class="text-4xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-[1.1] max-w-4xl mx-auto">
          Your Path to <span class="text-teal-600">Investment Readiness</span>
        </h1>

        <p class="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Assess, improve, and showcase your startup's investment potential with our comprehensive readiness platform.
        </p>

        <div v-if="auth.isAuthenticated.value" class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <NuxtLink :to="dashboardRoute"
            class="w-full sm:w-auto px-10 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-all shadow-xl shadow-teal-600/25 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 text-base">
            Go to Your Dashboard
            <ArrowRightIcon class="w-5 h-5" />
          </NuxtLink>
        </div>
        <div v-else class="flex flex-col sm:flex-row items-center justify-center gap-3">
          <NuxtLink to="/login"
            class="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-all shadow-xl shadow-teal-600/25 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
            Start Free Assessment
            <ArrowRightIcon class="w-4 h-4" />
          </NuxtLink>
          <NuxtLink to="/login"
            class="w-full sm:w-auto px-8 py-3 bg-white text-gray-700 border border-gray-200 hover:border-teal-200 hover:bg-teal-50 text-sm font-semibold rounded-lg transition-all hover:-translate-y-0.5 active:scale-95 shadow-sm">
            I'm an Investor
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Metrics Bar -->
    <section class="py-12 bg-gray-50/50 border-y border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <div v-for="metric in metrics" :key="metric.label" class="space-y-1">
            <div class="text-3xl font-bold text-teal-600 tracking-tight">{{ metric.value }}</div>
            <div class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{{ metric.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 tracking-tight">Everything You Need to Succeed
        </h2>
        <p class="text-lg text-gray-500 max-w-xl mx-auto">Evaluation and improvement tools for investment readiness.</p>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="feature in features" :key="feature.title"
            class="p-7 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-xl hover:border-teal-100 transition-all duration-500 group">
            <div
              class="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-600 group-hover:scale-110 group-hover:rotate-3 transition-all">
              <component :is="feature.icon" class="w-5 h-5 text-teal-600 group-hover:text-white" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3 tracking-tight">{{ feature.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-24 bg-gray-50/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 tracking-tight">How It Works</h2>
          <p class="text-lg text-gray-500">Simple steps to showcase your business to investors.</p>
        </div>
        <div class="grid md:grid-cols-3 gap-10">
          <div v-for="(step, index) in steps" :key="step.title" class="flex flex-col items-center text-center group">
            <div
              class="w-14 h-14 bg-white border-2 border-teal-600 text-teal-600 rounded-xl flex items-center justify-center text-xl font-bold mb-6 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-lg shadow-teal-600/10">
              0{{ index + 1 }}
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2 tracking-tight">{{ step.title }}</h3>
            <p class="text-sm text-gray-500 max-w-[240px] mx-auto leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 tracking-tight">Success Stories</h2>
          <p class="text-lg text-gray-500">Hear from SMEs who successfully matched with investors.</p>
        </div>
        <div class="grid md:grid-cols-2 gap-8">
          <div v-for="testimonial in testimonials" :key="testimonial.author"
            class="p-10 bg-gray-50/50 rounded-[2rem] border border-gray-100 hover:border-teal-100 transition-all relative group">
            <QuoteIcon class="absolute top-8 right-8 w-12 h-12 text-teal-600/5 group-hover:text-teal-600/10" />
            <p class="text-lg text-gray-600 mb-8 italic leading-relaxed">"{{ testimonial.quote }}"</p>
            <div>
              <div class="font-semibold text-gray-900 tracking-tight">{{ testimonial.author }}</div>
              <div class="text-sm text-gray-400 font-medium uppercase tracking-widest">{{ testimonial.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="py-24 bg-gray-50">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tighter">Frequently Asked Questions
          </h2>
          <p class="text-lg text-gray-500">Find answers to common questions about our platform.</p>
        </div>

        <div class="space-y-2">
          <div v-for="(faq, index) in faqs" :key="index"
            class="bg-white rounded-lg border border-gray-100 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
            <button @click="toggleFaq(index)"
              class="w-full flex items-center justify-between p-6 text-left focus:outline-none group">
              <span class="text-base font-medium text-gray-800 group-hover:text-teal-600 transition-colors">{{
                faq.question }}</span>
              <div
                class="shrink-0 ml-4 w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-teal-300 transition-all">
                <ChevronDownIcon :class="{ 'rotate-180': faq.isOpen }"
                  class="w-4 h-4 text-gray-400 transition-transform" />
              </div>
            </button>
            <div v-show="faq.isOpen"
              class="px-7 pb-7 text-sm text-gray-500 leading-relaxed animate-[fade-in_0.3s_ease-out]">
              {{ faq.answer }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Ready to Get Started CTA -->
    <section class="py-20 bg-teal-700 text-center text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl lg:text-3xl font-semibold mb-4 tracking-tight">Ready to Get Started?</h2>
        <p class="text-lg text-teal-100/80 mb-10 max-w-2xl mx-auto">
          Join hundreds of SMEs who have improved their investment readiness with IRIP.
        </p>
        <NuxtLink v-if="auth.isAuthenticated.value" :to="dashboardRoute"
          class="px-8 py-3 bg-white text-teal-700 font-semibold rounded-lg transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 flex w-fit items-center justify-center gap-2 mx-auto">
          Go to Your Dashboard
          <ArrowRightIcon class="w-4 h-4" />
        </NuxtLink>
        <NuxtLink v-else to="/login"
          class="px-8 py-3 bg-white text-teal-700 font-semibold rounded-lg transition-all shadow-xl hover:-translate-y-0.5 active:scale-95 flex w-fit items-center justify-center gap-2 mx-auto">
          Start Your Free Assessment
          <ArrowRightIcon class="w-4 h-4" />
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white pt-20 pb-10 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <!-- Brand Column -->
          <div class="space-y-6">
            <div class="flex items-center gap-2">
              <img src="/logo.png" alt="CAM INVESTMENT" class="w-12 h-12 object-cover rounded-full shadow-sm" />
              <span class="text-2xl font-semibold tracking-tight text-gray-900">CAM INVESTMENT</span>
            </div>
            <p class="text-sm text-gray-400 leading-relaxed max-w-[240px]">
              Investment Readiness Intelligence Platform
            </p>
          </div>

          <!-- Platform Column -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-6">Platform</h4>
            <ul class="space-y-4">
              <li><a href="#how-it-works" class="text-sm text-gray-500 hover:text-teal-600 transition-colors">For
                  SMEs</a></li>
              <li><a href="#testimonials" class="text-sm text-gray-500 hover:text-teal-600 transition-colors">For
                  Investors</a></li>
              <li>
                <NuxtLink to="/programs" class="text-sm text-gray-500 hover:text-teal-600 transition-colors">Programs
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Company Column -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-6">Company</h4>
            <ul class="space-y-4">
              <li><a href="#faq" class="text-sm text-gray-500 hover:text-teal-600 transition-colors">Contact</a></li>
              <li>
                <NuxtLink to="/terms" class="text-sm text-gray-500 hover:text-teal-600 transition-colors">Terms of
                  Service</NuxtLink>
              </li>
              <li><a href="#" class="text-sm text-gray-500 hover:text-teal-600 transition-colors">Privacy
                  Policy</a></li>
            </ul>
          </div>

          <!-- Get Started Column -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-6">Get Started</h4>
            <ul class="space-y-4">
              <li>
                <NuxtLink to="/register" class="text-sm text-gray-500 hover:text-teal-600 transition-colors">Create
                  Account</NuxtLink>
              </li>
              <li>
                <NuxtLink to="/login" class="text-sm text-gray-500 hover:text-teal-600 transition-colors">Sign In
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <div class="pt-8 border-t border-gray-50 text-center">
          <p class="text-xs font-medium text-gray-400 uppercase tracking-widest">
            &copy; {{ new Date().getFullYear() }} CAM INVESTMENT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, h, computed } from 'vue'
const auth = useAuth()
const dashboardRoute = computed(() => {
  const role = auth.user.value?.role?.toUpperCase() || ''
  if (role.includes('ADMIN')) return '/admin/dashboard'
  if (role === 'INVESTOR') return '/investor/dashboard'
  return '/sme/dashboard'
})

// Custom Quote Icon component
const QuoteIcon = (props) => h('svg', {
  ...props,
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': 'true'
}, [
  h('path', {
    d: 'M14.017 21L14.017 18C14.017 11.3726 18.3726 7 21 7V10C19.3431 10 17 12.3431 17 14H21V21H14.017ZM3 21L3 18C3 11.3726 7.37258 7 10 7V10C8.34315 10 6 12.3431 6 14H10V21H3Z'
  })
])
import {
  ChartBarIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  PresentationChartLineIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'landing',
  hideLayoutFooter: true
})


const isScrolled = ref(false)

const metrics = [
  { label: 'SMEs Assessed', value: '500+' },
  { label: 'Success Rate', value: '92%' },
  { label: 'Investment Facilitated', value: '$12M+' },
  { label: 'Partner Investors', value: '45+' }
]

const features = [
  {
    title: 'Comprehensive Assessment',
    description: 'Evaluate investment readiness across 8 key pillars with AI-powered scoring.',
    icon: ChartBarIcon
  },
  {
    title: 'Goal Tracking',
    description: 'Set targets, track progress, and receive actionable recommendations.',
    icon: PresentationChartLineIcon
  },
  {
    title: 'Risk Analysis',
    description: 'Identify gaps and mitigate risks before approaching investors.',
    icon: ShieldCheckIcon
  },
  {
    title: 'Investor Matching',
    description: 'Connect SMEs with the right investors based on readiness scores.',
    icon: UserGroupIcon
  }
]

const steps = [
  { title: 'Take Assessment', description: 'Complete our comprehensive 8-pillar evaluation' },
  { title: 'Get Insights', description: 'Receive detailed scores and actionable recommendations' },
  { title: 'Connect', description: 'Match with investors aligned to your readiness level' }
]

const testimonials = [
  {
    quote: "IRIP helped us identify exactly what we needed to improve before approaching investors. We closed our Series A within 3 months.",
    author: "Sarah Chen",
    role: "CEO, TechStart Cambodia"
  },
  {
    quote: "The assessment framework gave us a clear roadmap. Our readiness score went from 45 to 78 in just 6 months.",
    author: "Virak Sok",
    role: "Founder, AgriGrow Solutions"
  }
]

const faqs = ref([
  {
    question: "What is the Investment Readiness Intelligence Platform (IRIP)?",
    answer: "IRIP is a comprehensive platform that helps SMEs assess and improve their investment readiness through an 8-pillar evaluation framework. We provide actionable insights, goal tracking, and investor matching to help businesses become investment-ready.",
    isOpen: false
  },
  {
    question: "How does the assessment work?",
    answer: "Our assessment evaluates your business across 8 key pillars: Team & Leadership, Business Model, Market & Traction, Financial Readiness, Operations, Legal & Governance, Data & Digital Maturity, and Growth & Scalability. The assessment takes about 30 - 45 minutes to complete and generates a comprehensive readiness score.",
    isOpen: false
  },
  {
    question: "Is the assessment free?",
    answer: "Yes! Your first assessment is completely free. This allows you to understand your current investment readiness level and identify key areas for improvement. Premium features and ongoing support are available through our investment programs.",
    isOpen: false
  },
  {
    question: "How is the readiness score calculated?",
    answer: "Your readiness score is calculated using weighted averages across all 8 pillars, based on your responses to our assessment questions. Each pillar contributes to your overall score, and the weighting reflects the relative importance investors place on each area.",
    isOpen: false
  },
  {
    question: "What happens after I complete the assessment?",
    answer: "After completing your assessment, you'll receive a detailed report showing your scores by pillar, identified gaps, and prioritized recommendations. You can then set goals, track progress over time, and when ready, get matched with investors whose criteria align with your profile.",
    isOpen: false
  },
  {
    question: "How do you match SMEs with investors?",
    answer: "Our matching algorithm considers multiple factors including your readiness score, sector, growth stage, funding requirements, and specific strengths. Investors can filter and search for SMEs that meet their investment criteria, while SMEs can see which programs they qualify for.",
    isOpen: false
  },
  {
    question: "Is my data secure and confidential?",
    answer: "Absolutely. We take data security very seriously. All assessment data is encrypted and stored securely. Your detailed information is only shared with investors or program managers with your explicit consent. You maintain full control over who can see your data.",
    isOpen: false
  },
  {
    question: "Can I retake the assessment?",
    answer: "Yes! We encourage regular reassessments to track your progress. As you implement improvements and your business evolves, your readiness score should improve. Historical assessments are saved so you can see your growth trajectory over time.",
    isOpen: false
  }
])

const toggleFaq = (index) => {
  faqs.value[index].isOpen = !faqs.value[index].isOpen
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bg-dashed {
  background-image: linear-gradient(to right, #a3dbce 33%, rgba(255, 255, 255, 0) 0%);
  background-position: top;
  background-size: 15px 2px;
  background-repeat: repeat-x;
}
</style>
