<template>
    <div class="min-h-screen bg-gray-50/70 flex flex-col items-center justify-center px-4 py-12">

        <!-- Back arrow -->
        <NuxtLink to="/"
            class="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-gray-400 hover:text-teal-600 transition-colors">
            <ArrowLeftIcon class="w-4 h-4" />
        </NuxtLink>

        <!-- Logo -->
        <div class="flex flex-col items-center mb-8">
            <img src="/logo.png" alt="IRIP Logo" class="h-24 w-24 object-contain shadow-xl rounded-full mb-4" />
            <span class="text-2xl font-bold text-gray-900 tracking-tight">IRIP</span>
            <p class="text-gray-500 text-sm mt-1">Welcome to Investment Readiness Intelligence Platform!</p>
        </div>

        <!-- Card -->
        <div class="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

            <h2 class="text-xl font-bold text-gray-900 mb-1">Let's get started.</h2>
            <p class="text-sm text-gray-400 mb-7">Log in to access your account.</p>

            <!-- Error -->
            <div v-if="error"
                class="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm mb-5">
                <ExclamationCircleIcon class="w-4 h-4 shrink-0" />
                {{ error }}
            </div>

            <form @submit.prevent="handleLogin" class="space-y-4">

                <!-- Email -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                        Email <span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.email" id="login-email" type="email" required placeholder="Enter your email"
                        class="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white focus:border-transparent transition" />
                </div>

                <!-- Password -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1.5">
                        Password <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                        <input v-model="form.password" id="login-password" :type="showPassword ? 'text' : 'password'"
                            required placeholder="Enter your password"
                            class="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white focus:border-transparent transition" />
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                            <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                            <EyeSlashIcon v-else class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <!-- Checkboxes -->
                <div class="space-y-2.5 pt-1">
                    <label class="flex items-center gap-2.5 cursor-pointer group">
                        <input v-model="rememberEmail" type="checkbox"
                            class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-400" />
                        <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember my
                            email</span>
                    </label>
                    <label class="flex items-start gap-2.5 cursor-pointer group">
                        <input v-model="agreedToTerms" type="checkbox" required
                            class="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-400 mt-0.5" />
                        <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                            I agree to the <NuxtLink to="/terms" @click.stop class="text-teal-600 hover:underline">user
                                terms
                            </NuxtLink> and
                            <NuxtLink to="/privacy" @click.stop class="text-teal-600 hover:underline">privacy policy
                            </NuxtLink>.
                        </span>
                    </label>
                </div>

                <!-- Submit -->
                <button type="submit" :disabled="loading || !agreedToTerms"
                    class="w-full py-3.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl tracking-wide transition-all active:scale-95 shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 mt-2">
                    <span v-if="loading"
                        class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {{ loading ? 'Logging in...' : 'LOG IN' }}
                </button>

            </form>

            <!-- Footer links -->
            <div class="mt-6 text-center space-y-3">
                <p class="text-sm text-gray-500">
                    Don't have an account yet?
                    <NuxtLink to="/register" class="font-semibold text-teal-600 hover:underline">Register Your
                        Account</NuxtLink>
                </p>
                <a href="#" class="block text-sm text-teal-600 hover:underline">Forgot Password</a>
            </div>

        </div>

        <!-- Support footer -->
        <p class="mt-8 text-xs text-gray-400 text-center">
            Need help? Contact our support team at
            <a href="mailto:support@irip.com" class="text-teal-600 hover:underline">support@irip.com</a>
        </p>

    </div>
</template>

<script setup>
import {
    ArrowLeftIcon,
    ChartBarIcon,
    EyeIcon,
    EyeSlashIcon,
    ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

definePageMeta({ layout: false }) // Standalone page — no landing layout

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const rememberEmail = ref(false)
const agreedToTerms = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Pre-fill email if remembered
onMounted(() => {
    const saved = localStorage.getItem('irip_remembered_email')
    if (saved) {
        form.email = saved
        rememberEmail.value = true
    }
})

const handleLogin = async () => {
    error.value = ''
    loading.value = true
    try {
        await authStore.login({ email: form.email, password: form.password })

        // Remember email if checked
        if (rememberEmail.value) {
            localStorage.setItem('irip_remembered_email', form.email)
        } else {
            localStorage.removeItem('irip_remembered_email')
        }

        // Redirect logic
        const redirect = route.query.redirect
        if (redirect && typeof redirect === 'string' && redirect.startsWith('/')) {
            router.push(redirect)
        } else {
            const role = authStore.role
            if (role === 'ADMIN') router.push('/admin/dashboard')
            else if (role === 'INVESTOR') router.push('/investor/dashboard')
            else router.push('/sme/dashboard')
        }
    } catch (e) {
        error.value = e?.data?.statusMessage || e?.message || 'Invalid email or password.'
    } finally {
        loading.value = false
    }
}
</script>
