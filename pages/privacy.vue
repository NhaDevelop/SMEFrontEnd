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
                <h1 class="text-3xl font-bold text-gray-900 tracking-tight mb-2">Privacy Policy</h1>
                <p class="text-sm text-gray-500 mb-10">Last updated: January 2025</p>

                <div class="space-y-8 text-gray-600 leading-relaxed text-sm md:text-base">
                    <!-- 1. Introduction -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">1. Introduction</h2>
                        <p>
                            The Investment Readiness Intelligence Platform (IRIP) is committed to protecting your
                            privacy and ensuring the security of your personal information. This Privacy Policy explains
                            how we collect, use, disclose, and safeguard your information when you use our platform.
                        </p>
                    </section>

                    <!-- 2. Information We Collect -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-4">2. Information We Collect</h2>

                        <div class="space-y-4">
                            <div>
                                <h3 class="font-semibold text-gray-800 mb-2">2.1 Personal Information</h3>
                                <p class="mb-2">We collect information you provide during registration and use of our
                                    services:</p>
                                <ul class="list-disc pl-5 space-y-1">
                                    <li>Full name and contact information (email, phone number)</li>
                                    <li>Company/Organization name and details</li>
                                    <li>Business registration numbers and documentation</li>
                                    <li>Professional credentials and LinkedIn profiles</li>
                                    <li>Business address and website</li>
                                    <li>Industry, employee count, and years in business</li>
                                </ul>
                            </div>

                            <div>
                                <h3 class="font-semibold text-gray-800 mb-2">2.2 Verification Documents</h3>
                                <p>For verification purposes, we collect business licenses, registration certificates,
                                    and other identity documents. These are stored securely and accessed only by
                                    authorized personnel.</p>
                            </div>

                            <div>
                                <h3 class="font-semibold text-gray-800 mb-2">2.3 Usage Data</h3>
                                <p class="mb-2">We automatically collect:</p>
                                <ul class="list-disc pl-5 space-y-1">
                                    <li>Log data (IP address, browser type, pages visited)</li>
                                    <li>Device information</li>
                                    <li>Usage patterns and preferences</li>
                                    <li>Assessment data and scores</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <!-- 3. How We Use Your Information -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">3. How We Use Your Information</h2>
                        <p class="mb-2">We use the collected information to:</p>
                        <ul class="list-disc pl-5 space-y-1">
                            <li>Verify your identity and eligibility for our services</li>
                            <li>Provide and maintain our platform services</li>
                            <li>Process investment readiness assessments</li>
                            <li>Facilitate communication between SMEs and investors</li>
                            <li>Generate analytics and reports</li>
                            <li>Prevent fraud and ensure platform security</li>
                            <li>Comply with legal obligations</li>
                            <li>Send important notifications about your account</li>
                        </ul>
                    </section>

                    <!-- 4. Data Sharing and Disclosure -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">4. Data Sharing and Disclosure</h2>
                        <p class="mb-2">We may share your information with:</p>
                        <ul class="list-disc pl-5 space-y-1">
                            <li><strong>Platform Administrators:</strong> For verification and approval purposes</li>
                            <li><strong>Investors (for SMEs):</strong> Assessment data may be shared with approved
                                investors based on your consent</li>
                            <li><strong>Service Providers:</strong> Third-party services that help us operate the
                                platform</li>
                            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                        </ul>
                        <p class="mt-4">We do not sell your personal information to third parties.</p>
                    </section>

                    <!-- 5. Data Security -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">5. Data Security</h2>
                        <p class="mb-2">We implement appropriate technical and organizational measures to protect your
                            data:</p>
                        <ul class="list-disc pl-5 space-y-1">
                            <li>Encryption of data in transit and at rest</li>
                            <li>Secure access controls and authentication</li>
                            <li>Regular security audits and monitoring</li>
                            <li>Employee training on data protection</li>
                            <li>Secure document storage with restricted access</li>
                        </ul>
                    </section>

                    <!-- 6. Data Retention -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">6. Data Retention</h2>
                        <p>
                            We retain your personal information for as long as your account is active or as needed to
                            provide services. After account termination, we may retain data for legal, accounting, or
                            compliance purposes for up to 7 years, after which it will be securely deleted.
                        </p>
                    </section>

                    <!-- 7. Your Rights -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">7. Your Rights</h2>
                        <p class="mb-2">Depending on your location, you may have the right to:</p>
                        <ul class="list-disc pl-5 space-y-1">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Object to or restrict processing</li>
                            <li>Data portability</li>
                            <li>Withdraw consent at any time</li>
                        </ul>
                        <p class="mt-4">To exercise these rights, please contact us at <a href="mailto:privacy@irip.com"
                                class="text-teal-600 hover:underline">privacy@irip.com</a>.</p>
                    </section>

                    <!-- 8. Cookies and Tracking -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">8. Cookies and Tracking</h2>
                        <p>
                            We use cookies and similar technologies to improve your experience, analyze usage, and
                            maintain security. You can control cookie preferences through your browser settings.
                        </p>
                    </section>

                    <!-- 9. International Data Transfers -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">9. International Data Transfers</h2>
                        <p>
                            Your information may be transferred to and processed in countries other than your own. We
                            ensure appropriate safeguards are in place for such transfers in compliance with applicable
                            data protection laws.
                        </p>
                    </section>

                    <!-- 10. Children's Privacy -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">10. Children's Privacy</h2>
                        <p>
                            Our services are not intended for individuals under 18 years of age. We do not knowingly
                            collect personal information from children.
                        </p>
                    </section>

                    <!-- 11. Changes to This Policy -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">11. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy periodically. We will notify you of significant changes
                            via email or through the platform. The "Last updated" date at the top indicates when the
                            policy was last revised.
                        </p>
                    </section>

                    <!-- 12. Contact Us -->
                    <section>
                        <h2 class="text-lg font-bold text-gray-900 mb-2">12. Contact Us</h2>
                        <p class="mb-4">For questions about this Privacy Policy or our data practices, please contact:
                        </p>

                        <div class="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                            <p class="font-semibold text-gray-900 mb-2">Data Protection Officer</p>
                            <p>Email: <a href="mailto:privacy@irip.com"
                                    class="text-teal-600 hover:underline">privacy@irip.com</a></p>
                            <p>Address: [Your Business Address]</p>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Footer Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button @click="goToTerms"
                    class="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm w-full sm:w-auto">
                    Read Terms of Service
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

const goToTerms = () => {
    router.push('/terms')
}

const goToRegistration = () => {
    router.push('/register')
}

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
