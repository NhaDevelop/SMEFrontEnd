<template>
    <div>
        <!-- ─── Hero ─────────────────────────────────────────────────── -->
        <section class="bg-gray-50/60 pt-32 pb-16">
            <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Contact Us</h1>
                <p class="text-gray-500 text-lg">Have questions about our platform, terms of service, or privacy
                    policy? We're here to help.</p>
            </div>
        </section>

        <!-- ─── Main Content ──────────────────────────────────────────── -->
        <section class="py-16 bg-gray-50/60">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex flex-col lg:flex-row gap-8 items-start">

                    <!-- ── Left: Contact Form ─────────────────────────── -->
                    <div class="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
                        <div class="flex items-center gap-3 mb-2">
                            <ChatBubbleLeftRightIcon class="w-5 h-5 text-teal-600" />
                            <h2 class="text-xl font-bold text-gray-900">Send us a Message</h2>
                        </div>
                        <p class="text-sm text-gray-500 mb-8">Fill out the form below and we'll respond within 2
                            business days.</p>

                        <form @submit.prevent="submitForm" class="space-y-5">
                            <!-- Name + Email -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                                        Your Name <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model="form.name" type="text" required placeholder="Enter your full name"
                                        class="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email Address <span class="text-red-500">*</span>
                                    </label>
                                    <input v-model="form.email" type="email" required placeholder="you@example.com"
                                        class="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition" />
                                </div>
                            </div>

                            <!-- Category + Subject -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                                        Category <span class="text-red-500">*</span>
                                    </label>
                                    <select v-model="form.category" required
                                        class="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition appearance-none">
                                        <option value="" disabled>Select a category</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="sme">SME Support</option>
                                        <option value="investor">Investor Support</option>
                                        <option value="technical">Technical Issue</option>
                                        <option value="billing">Billing & Pricing</option>
                                        <option value="privacy">Privacy & Data</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                                    <input v-model="form.subject" type="text" placeholder="Brief subject line"
                                        class="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition" />
                                </div>
                            </div>

                            <!-- Message -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                                    Message <span class="text-red-500">*</span>
                                </label>
                                <textarea v-model="form.message" required rows="6"
                                    placeholder="Please describe your question or concern in detail..."
                                    class="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition resize-y"></textarea>
                            </div>

                            <!-- Submit -->
                            <button type="submit"
                                class="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-all active:scale-95 shadow-sm">
                                <PaperAirplaneIcon class="w-4 h-4" />
                                Send Message
                            </button>

                            <!-- Success message -->
                            <div v-if="submitted"
                                class="flex items-center gap-3 p-4 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 text-sm">
                                <CheckCircleIcon class="w-5 h-5 shrink-0" />
                                <span>Message sent successfully! We'll get back to you within 2 business days.</span>
                            </div>
                        </form>
                    </div>

                    <!-- ── Right: Info Cards ──────────────────────────── -->
                    <div class="w-full lg:w-80 space-y-5">

                        <!-- Contact Information -->
                        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                            <h3 class="font-bold text-gray-900 mb-5">Contact Information</h3>
                            <div class="space-y-5">
                                <div v-for="info in contactInfo" :key="info.label" class="flex items-start gap-3">
                                    <div
                                        class="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                                        <component :is="info.icon" class="w-4 h-4 text-teal-600" />
                                    </div>
                                    <div>
                                        <div class="text-xs font-semibold text-gray-500 mb-0.5">{{ info.label }}</div>
                                        <div class="text-sm text-gray-800 leading-snug">{{ info.value }}</div>
                                        <div v-if="info.value2" class="text-sm text-gray-800 leading-snug">{{
                                            info.value2 }}</div>
                                        <div v-if="info.value3" class="text-sm text-gray-800 leading-snug">{{
                                            info.value3 }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Quick Links -->
                        <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                            <h3 class="font-bold text-gray-900 mb-4">Quick Links</h3>
                            <div class="space-y-3">
                                <a href="#"
                                    class="flex items-center gap-3 text-sm text-gray-700 hover:text-teal-600 transition-colors group">
                                    <DocumentTextIcon
                                        class="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
                                    Terms of Service
                                </a>
                                <a href="#"
                                    class="flex items-center gap-3 text-sm text-gray-700 hover:text-teal-600 transition-colors group">
                                    <ShieldCheckIcon
                                        class="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
                                    Privacy Policy
                                </a>
                                <NuxtLink to="/register"
                                    class="flex items-center gap-3 text-sm text-gray-700 hover:text-teal-600 transition-colors group cursor-pointer">
                                    <ArrowTrendingUpIcon
                                        class="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
                                    Create Account
                                </NuxtLink>
                            </div>
                        </div>

                        <!-- Data Protection Officer -->
                        <div class="bg-teal-50 border border-teal-100 rounded-2xl p-6">
                            <div class="flex items-center gap-3 mb-2">
                                <ShieldCheckIcon class="w-5 h-5 text-teal-600 shrink-0" />
                                <h3 class="font-bold text-gray-900 text-sm">Data Protection Officer</h3>
                            </div>
                            <p class="text-sm text-gray-600 leading-relaxed">
                                For data privacy concerns or GDPR-related requests, contact our DPO directly at
                                <a href="mailto:privacy@irip.com"
                                    class="text-teal-700 font-medium hover:underline">privacy@irip.com</a>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import {
    ChatBubbleLeftRightIcon,
    PaperAirplaneIcon,
    CheckCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ClockIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    ArrowTrendingUpIcon
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: 'landing' })

// Modal logic removed
const form = reactive({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
})

const submitted = ref(false)

const submitForm = () => {
    submitted.value = true
    form.name = ''
    form.email = ''
    form.category = ''
    form.subject = ''
    form.message = ''
    setTimeout(() => { submitted.value = false }, 5000)
}

const contactInfo = [
    { label: 'Email', icon: EnvelopeIcon, value: 'support@irip.com' },
    { label: 'Phone', icon: PhoneIcon, value: '+1 (234) 567-890' },
    { label: 'Address', icon: MapPinIcon, value: '123 Business Center', value2: 'Suite 456', value3: 'City, Country 12345' },
    { label: 'Business Hours', icon: ClockIcon, value: 'Monday - Friday', value2: '9:00 AM - 6:00 PM (GMT+7)' }
]
</script>
