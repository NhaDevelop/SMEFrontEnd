<template>
    <div class="min-h-screen bg-gray-50 py-12 px-4">

        <!-- Back -->
        <NuxtLink to="/login"
            class="fixed top-6 left-6 flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal-600 transition-colors z-10">
            <ArrowLeftIcon class="w-4 h-4" />
        </NuxtLink>

        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
            <img src="/logo.png" alt="IRIP Logo" class="h-20 w-20 object-contain shadow-xl rounded-full mb-3" />
            <span class="text-2xl font-bold text-gray-900 tracking-tight">IRIP</span>
            <h1 class="text-3xl font-bold text-gray-900 mt-4 mb-1">Create Account</h1>
            <p class="text-gray-500 text-sm">Complete your verification to access the Investment Readiness Platform</p>
        </div>

        <!-- Success State -->
        <div v-if="submitted"
            class="max-w-2xl mx-auto bg-white rounded-2xl shadow border border-gray-100 p-12 text-center">
            <div class="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircleIcon class="w-9 h-9 text-teal-600" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900 mb-3">Registration Submitted!</h2>
            <p class="text-gray-500 leading-relaxed mb-8">
                Your registration is <strong class="text-gray-800">pending admin approval</strong>. You will be
                notified by email once your account has been verified and activated.
            </p>
            <NuxtLink to="/login"
                class="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
                Back to Login
            </NuxtLink>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit" class="max-w-2xl mx-auto space-y-6">

            <!-- ── Verified Registration ──────────────────────────── -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <div class="flex items-center gap-2.5 mb-1.5">
                    <ShieldCheckIcon class="w-4 h-4 text-gray-400" />
                    <h2 class="font-semibold text-gray-800">Verified Registration</h2>
                </div>
                <p class="text-xs text-gray-500 mb-6">To protect our community and ensure data privacy, we require
                    verification for all accounts.</p>

                <p class="text-sm font-medium text-gray-700 mb-3">
                    I am registering as <span class="text-red-500">*</span>
                </p>
                <div class="grid grid-cols-2 gap-4">
                    <button v-for="r in roleOptions" :key="r.value" type="button" @click="form.role = r.value" :class="[
                        'flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all',
                        form.role === r.value
                            ? 'border-teal-500 bg-teal-50/50'
                            : 'border-gray-200 hover:border-teal-200'
                    ]">
                        <div :class="[
                            'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                            form.role === r.value ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500'
                        ]">
                            <component :is="r.icon" class="w-5 h-5" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="font-semibold text-sm text-gray-900">{{ r.label }}</span>
                                <CheckIcon v-if="form.role === r.value" class="w-4 h-4 text-teal-600 shrink-0" />
                            </div>
                            <p class="text-xs text-gray-500 leading-snug">{{ r.description }}</p>
                        </div>
                    </button>
                </div>
            </div>

            <!-- ── Basic Information ──────────────────────────────── -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Basic Information</p>

                <div class="grid grid-cols-2 gap-5">
                    <!-- Full Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span
                                class="text-red-500">*</span></label>
                        <input v-model="form.name" type="text" required placeholder="Enter your full name"
                            v-bind:class="fieldCls" />
                    </div>
                    <!-- Company Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Company Name <span
                                class="text-red-500">*</span></label>
                        <input v-model="form.company" type="text" required placeholder="Your company name"
                            v-bind:class="fieldCls" />
                    </div>
                    <!-- Business Email -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Business Email <span
                                class="text-red-500">*</span></label>
                        <input v-model="form.email" type="email" required placeholder="you@company.com"
                            v-bind:class="fieldCls" />
                    </div>
                    <!-- Phone -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span
                                class="text-red-500">*</span></label>
                        <input v-model="form.phone" type="tel" required placeholder="+1 (555) 000-0000"
                            v-bind:class="fieldCls" />
                    </div>
                    <!-- Website -->
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Website</label>
                        <input v-model="form.website" type="url" placeholder="https://www.yourcompany.com"
                            v-bind:class="fieldCls" />
                    </div>
                </div>
            </div>

            <!-- ── Business Verification ──────────────────────────── -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Business Verification
                </p>

                <div class="grid grid-cols-2 gap-5">
                    <!-- Industry -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Industry <span
                                class="text-red-500">*</span></label>
                        <select v-model="form.industry" required v-bind:class="fieldCls">
                            <option value="" disabled>Select industry</option>
                            <option v-for="sector in sectors" :key="sector.id" :value="sector.name">
                                {{ sector.name }}
                            </option>
                        </select>
                    </div>
                    <!-- Number of Employees -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Number of Employees <span
                                class="text-red-500">*</span></label>
                        <select v-model="form.employees" required v-bind:class="fieldCls">
                            <option value="" disabled>Select range</option>
                            <option>1-10</option>
                            <option>11-50</option>
                            <option>51-100</option>
                            <option>101-250</option>
                            <option>251-500</option>
                            <option>500+</option>
                        </select>
                    </div>
                    <!-- Years in Business -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Years in Business <span
                                class="text-red-500">*</span></label>
                        <select v-model="form.years" required v-bind:class="fieldCls">
                            <option value="" disabled>Select range</option>
                            <option>Less than 1 year</option>
                            <option>1-2 years</option>
                            <option>3-5 years</option>
                            <option>6-10 years</option>
                            <option>More than 10 years</option>
                        </select>
                    </div>
                    <!-- Business Registration No. -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Business Registration No. <span
                                class="text-red-500">*</span></label>
                        <input v-model="form.regNo" type="text" required placeholder="Enter registration number"
                            v-bind:class="fieldCls" />
                    </div>
                    <!-- Business Address -->
                    <div class="col-span-2">
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Business Address</label>
                        <textarea v-model="form.address" rows="3" placeholder="Enter your business address"
                            v-bind:class="fieldCls + ' resize-none'"></textarea>
                    </div>
                </div>
            </div>

            <!-- ── Verification Document ──────────────────────────── -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Verification Document
                </p>

                <label class="block text-sm font-medium text-gray-700 mb-1">Upload Document <span
                        class="text-red-500">*</span></label>
                <p class="text-xs text-gray-400 mb-3">Upload your business registration certificate or license (PDF,
                    JPG, PNG - max 10MB)</p>

                <label
                    class="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-10 cursor-pointer hover:border-teal-300 hover:bg-teal-50/30 transition-all group">
                    <input type="file" class="hidden" accept=".pdf,.jpg,.jpeg,.png" @change="handleFileUpload" />
                    <ArrowUpTrayIcon class="w-8 h-8 text-gray-300 group-hover:text-teal-400 transition-colors" />
                    <span v-if="!uploadedFile"
                        class="text-sm text-gray-400 group-hover:text-teal-600 transition-colors">Click or drag to
                        upload document</span>
                    <span v-else class="text-sm text-teal-600 font-medium flex items-center gap-2">
                        <CheckCircleIcon class="w-4 h-4" /> {{ uploadedFile }}
                    </span>
                </label>
            </div>

            <!-- ── Account Security ───────────────────────────────── -->
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Account Security</p>

                <div class="grid grid-cols-2 gap-5">
                    <!-- Password -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Password <span
                                class="text-red-500">*</span></label>
                        <div class="relative">
                            <input v-model="form.password" :type="showPass ? 'text' : 'password'" required
                                placeholder="Create password" v-bind:class="fieldCls + ' pr-10'" />
                            <button type="button" @click="showPass = !showPass"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <EyeIcon v-if="!showPass" class="w-4 h-4" />
                                <EyeSlashIcon v-else class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <!-- Confirm Password -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password <span
                                class="text-red-500">*</span></label>
                        <input v-model="form.confirmPassword" :type="showPass ? 'text' : 'password'" required
                            placeholder="Confirm password" v-bind:class="fieldCls" />
                    </div>
                </div>

                <!-- Password mismatch warning -->
                <p v-if="form.confirmPassword && form.password !== form.confirmPassword"
                    class="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <ExclamationCircleIcon class="w-3.5 h-3.5" /> Passwords do not match
                </p>

                <!-- Checkboxes -->
                <div class="mt-6 space-y-4">
                    <label class="flex items-start gap-3 cursor-pointer">
                        <input v-model="agreedTerms" type="checkbox" required
                            class="w-4 h-4 mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-400 shrink-0" />
                        <span class="text-sm text-gray-600">
                            I agree to the <NuxtLink to="/terms" @click.stop class="text-teal-600 hover:underline">terms
                                of service</NuxtLink> and
                            <NuxtLink to="/privacy" @click.stop class="text-teal-600 hover:underline">privacy policy
                            </NuxtLink>.
                            <span class="text-red-500">*</span>
                        </span>
                    </label>
                    <label class="flex items-start gap-3 cursor-pointer">
                        <input v-model="agreedProcessing" type="checkbox" required
                            class="w-4 h-4 mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-400 shrink-0" />
                        <span class="text-sm text-gray-600">
                            I consent to the processing of my data for verification purposes and understand that my
                            information will be reviewed by administrators. <span class="text-red-500">*</span>
                        </span>
                    </label>
                </div>
            </div>

            <!-- Error -->
            <div v-if="error"
                class="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                <ExclamationCircleIcon class="w-4 h-4 shrink-0" />
                {{ error }}
            </div>

            <!-- Submit -->
            <button type="submit"
                :disabled="loading || !form.role || !agreedTerms || !agreedProcessing || (form.password !== form.confirmPassword)"
                class="w-full py-4 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl tracking-widest uppercase transition-all active:scale-[0.98] shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2">
                <span v-if="loading"
                    class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ loading ? 'Submitting...' : 'Submit Registration' }}
            </button>

            <p class="text-center text-sm text-gray-500 pb-8">
                Already have an account?
                <NuxtLink to="/login" class="font-semibold text-teal-600 hover:underline">Log In</NuxtLink>
            </p>

        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
    ArrowLeftIcon,
    ChartBarIcon,
    CheckCircleIcon,
    CheckIcon,
    ShieldCheckIcon,
    BuildingOffice2Icon,
    BriefcaseIcon,
    ArrowUpTrayIcon,
    EyeIcon,
    EyeSlashIcon,
    ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

import { authService } from '~/modules/auth/auth.service'
import { adminService } from '~/modules/admin/admin.service'

definePageMeta({ layout: false })

const sectors = ref<any[]>([])

onMounted(async () => {
    try {
        sectors.value = await adminService.fetchPublicSectors()
    } catch (e) {
        console.error('Failed to load sectors', e)
    }
})

const fieldCls = 'w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition'

const form = reactive({
    role: '',
    name: '',
    company: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    employees: '',
    years: '',
    regNo: '',
    address: '',
    password: '',
    confirmPassword: ''
})

const roleOptions = [
    {
        value: 'SME',
        label: 'SME / Business',
        icon: BuildingOffice2Icon,
        description: 'I represent a small or medium enterprise seeking investment readiness assessment'
    },
    {
        value: 'INVESTOR',
        label: 'Investor / Program',
        icon: BriefcaseIcon,
        description: 'I am an investor or program manager looking to evaluate SMEs'
    }
]

const showPass = ref(false)
const agreedTerms = ref(false)
const agreedProcessing = ref(false)
const loading = ref(false)
const error = ref('')
const submitted = ref(false)
const uploadedFile = ref('')

const handleFileUpload = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) uploadedFile.value = file.name
}

const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
        error.value = 'Passwords do not match.'
        return
    }
    error.value = ''
    loading.value = true
    try {
        await authService.register({
            full_name: form.name,
            email: form.email,
            role: form.role,
            company_name: form.company,
            phone: form.phone,
            website_url: form.website,
            industry: form.industry,
            employees: form.employees,
            years_in_business: form.years,
            registration_no: form.regNo,
            address: form.address,
            password: form.password,
            password_confirmation: form.confirmPassword
        })
        submitted.value = true
    } catch (e: any) {
        error.value = e?.data?.message || e?.message || 'Something went wrong. Please try again.'
    } finally {
        loading.value = false
    }
}
</script>
