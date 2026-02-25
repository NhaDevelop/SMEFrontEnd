<template>
    <div class="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
            <!-- Header / Back Button -->
            <div class="mb-8 flex items-center gap-3">
                <button @click="goBack"
                    class="p-2 text-gray-500 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100">
                    <ArrowLeftIcon class="w-5 h-5" />
                </button>
                <div class="flex items-center gap-2">
                    <div
                        class="w-8 h-8 bg-teal-600 rounded-md flex items-center justify-center shadow-md shadow-teal-600/20">
                        <ChartBarIcon class="w-5 h-5 text-white" />
                    </div>
                    <span class="text-xl font-bold tracking-tight text-gray-900">IRIP</span>
                </div>
            </div>

            <!-- Main Content Card -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
                <h1 class="text-3xl font-bold text-gray-900 tracking-tight mb-2">Terms of Service</h1>
                <p class="text-sm text-gray-500 mb-10">Last updated: January 2025</p>

                <div class="space-y-8 text-gray-600 leading-relaxed text-sm md:text-base">
                    <!-- 1. Acceptance of Terms -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using the Investment Readiness Intelligence Platform (IRIP), you agree to be
                            bound by these Terms of Service. If you do not agree to these terms, please do not use our
                            services.
                        </p>
                    </section>

                    <!-- 2. Description of Service -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">2. Description of Service</h2>
                        <p class="mb-2">IRIP provides investment readiness assessment tools and analytics for Small and
                            Medium Enterprises (SMEs) and investors. Our platform offers:</p>
                        <ul class="list-disc pl-5 space-y-1">
                            <li>Investment readiness assessments and scoring</li>
                            <li>Business analytics and reporting</li>
                            <li>Document management and storage</li>
                            <li>Communication tools between SMEs and investors</li>
                            <li>What-if scenario planning tools</li>
                        </ul>
                    </section>

                    <!-- 3. User Accounts -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">3. User Accounts</h2>
                        <p class="mb-2">To access our services, you must create an account and provide accurate,
                            complete information. You are responsible for:</p>
                        <ul class="list-disc pl-5 space-y-1">
                            <li>Maintaining the confidentiality of your account credentials</li>
                            <li>All activities that occur under your account</li>
                            <li>Notifying us immediately of any unauthorized access</li>
                            <li>Ensuring your registration information is accurate and up-to-date</li>
                        </ul>
                    </section>

                    <!-- 4. User Verification -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">4. User Verification</h2>
                        <p class="mb-2">All user registrations are subject to verification and approval by our
                            administrative team. We reserve the right to:</p>
                        <ul class="list-disc pl-5 space-y-1">
                            <li>Request additional documentation for verification purposes</li>
                            <li>Reject registrations that do not meet our verification criteria</li>
                            <li>Suspend or terminate accounts found to be fraudulent</li>
                            <li>Modify user roles based on verification findings</li>
                        </ul>
                    </section>

                    <!-- 5. Acceptable Use -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">5. Acceptable Use</h2>
                        <p class="mb-2">You agree not to:</p>
                        <ul class="list-disc pl-5 space-y-1">
                            <li>Use the service for any unlawful purpose</li>
                            <li>Attempt to gain unauthorized access to any part of the service</li>
                            <li>Interfere with or disrupt the service or servers</li>
                            <li>Upload malicious code or harmful content</li>
                            <li>Impersonate any person or entity</li>
                            <li>Collect or harvest user data without authorization</li>
                            <li>Use the platform to spam or harass other users</li>
                        </ul>
                    </section>

                    <!-- 6. Intellectual Property -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">6. Intellectual Property</h2>
                        <p>
                            All content, features, and functionality of the IRIP platform are owned by us and are
                            protected by international copyright, trademark, and other intellectual property laws. You
                            retain ownership of the content you submit but grant us a license to use it for providing
                            our services.
                        </p>
                    </section>

                    <!-- 7. Data and Content -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">7. Data and Content</h2>
                        <p>
                            You are responsible for all data and content you upload to the platform. You represent that
                            you have the right to share such content and that it does not violate any third-party
                            rights.
                        </p>
                    </section>

                    <!-- 8. Limitation of Liability -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">8. Limitation of Liability</h2>
                        <p>
                            IRIP is provided "as is" without warranties of any kind. We shall not be liable for any
                            indirect, incidental, special, consequential, or punitive damages resulting from your use of
                            the service. Our assessments and scores are for informational purposes only and should not
                            be considered as financial or investment advice.
                        </p>
                    </section>

                    <!-- 9. Termination -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">9. Termination</h2>
                        <p>
                            We may terminate or suspend your account at any time for violations of these terms. Upon
                            termination, your right to use the service will cease immediately. You may request deletion
                            of your data in accordance with our Privacy Policy.
                        </p>
                    </section>

                    <!-- 10. Changes to Terms -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">10. Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these terms at any time. We will notify users of significant
                            changes via email or through the platform. Continued use of the service after changes
                            constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <!-- 11. Contact Us -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">11. Contact Us</h2>
                        <p>
                            If you have any questions about these Terms of Service, please contact us at <a
                                href="mailto:support@irip.com"
                                class="text-teal-600 hover:underline">support@irip.com</a>.
                        </p>
                    </section>
                </div>
            </div>

            <!-- Footer Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    class="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto">
                    Read Privacy Policy
                </button>
                <button
                    class="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto">
                    Contact Us
                </button>
                <button @click="goToRegistration"
                    class="px-6 py-2.5 bg-teal-600 border border-transparent text-white font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm w-full sm:w-auto">
                    Back to Registration
                </button>
            </div>

            <!-- Scroll to Top (Fixed) -->
            <button @click="scrollToTop"
                class="fixed bottom-8 right-8 w-12 h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                <ArrowUpIcon class="w-6 h-6" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ArrowLeftIcon, ChartBarIcon, ArrowUpIcon } from '@heroicons/vue/24/outline'

definePageMeta({
    layout: 'empty'
})

const router = useRouter()

const goBack = () => {
    router.back()
}

const goToRegistration = () => {
    router.push('/register')
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
