<template>
    <div class="h-full flex flex-col bg-gray-50 overflow-auto overflow-x-hidden">
        <div class="max-w-5xl mx-auto w-full p-8">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
            <p class="text-sm text-gray-500 mb-6">Manage your account settings and preferences</p>

            <!-- Tabs -->
            <div class="flex gap-2 mb-6">
                <button v-for="tab in tabs" :key="tab.id" @click="currentTab = tab.id"
                    class="px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors" :class="currentTab === tab.id
                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'">
                    <component :is="tab.icon" class="w-4 h-4" />
                    {{ tab.label }}
                </button>
            </div>

            <!-- Profile Tab -->
            <div v-if="currentTab === 'profile'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-1">Profile Information</h2>
                <p class="text-sm text-gray-500 mb-6">Update your personal information</p>

                <div class="flex border-b border-gray-100 pb-6 mb-6">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-16 h-16 rounded-full bg-[#115e59] text-white flex items-center justify-center text-2xl font-bold">
                            {{ form.name.charAt(0).toUpperCase() }}
                        </div>
                        <button
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            Change Photo
                        </button>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-8">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" v-model="form.name" :disabled="isReadOnly"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm disabled:bg-gray-50">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" v-model="form.email" disabled
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm bg-gray-50 cursor-not-allowed">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input type="text" v-model="form.phone" :disabled="isReadOnly"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm disabled:bg-gray-50">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Company / Organization</label>
                        <input type="text" v-model="form.company" :disabled="isReadOnly"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm disabled:bg-gray-50">
                    </div>
                </div>

                <div v-if="!isReadOnly" class="flex justify-end pt-4 border-t border-gray-100">
                    <button @click="saveProfile" :disabled="loading"
                        class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50">
                        <component :is="loading ? ArrowPathIcon : BookmarkIcon" class="w-4 h-4" :class="{ 'animate-spin': loading }" />
                        {{ loading ? 'Saving...' : 'Save Changes' }}
                    </button>
                </div>
                <div v-else class="flex justify-start pt-4 border-t border-gray-100">
                    <p class="text-xs text-gray-400 italic flex items-center gap-1.5 font-normal">
                        <ShieldCheckIcon class="w-4 h-4 text-gray-300" />
                        Only system administrators can edit profile information.
                    </p>
                </div>
            </div>

            <!-- Notifications Tab -->
            <div v-if="currentTab === 'notifications'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-1">Notification Preferences</h2>
                <p class="text-sm text-gray-500 mb-6">Choose what notifications you receive</p>

                <div class="divide-y divide-gray-100 mb-8 border-b border-gray-100">
                    <div class="py-4 flex items-center justify-between">
                        <div>
                            <h3 class="text-sm font-medium text-gray-900">Email Notifications</h3>
                            <p class="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <Switch v-model="notifications.email"
                            :class="notifications.email ? 'bg-emerald-600' : 'bg-gray-200'"
                            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                            <span :class="notifications.email ? 'translate-x-6' : 'translate-x-1'"
                                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                        </Switch>
                    </div>
                    <div class="py-4 flex items-center justify-between">
                        <div>
                            <h3 class="text-sm font-medium text-gray-900">Assessment Reminders</h3>
                            <p class="text-sm text-gray-500">Get reminded about pending assessments</p>
                        </div>
                        <Switch v-model="notifications.assessments"
                            :class="notifications.assessments ? 'bg-emerald-600' : 'bg-gray-200'"
                            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                            <span :class="notifications.assessments ? 'translate-x-6' : 'translate-x-1'"
                                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                        </Switch>
                    </div>
                    <div class="py-4 flex items-center justify-between">
                        <div>
                            <h3 class="text-sm font-medium text-gray-900">Weekly Digest</h3>
                            <p class="text-sm text-gray-500">Receive a weekly summary of portfolio activity</p>
                        </div>
                        <Switch v-model="notifications.digest"
                            :class="notifications.digest ? 'bg-emerald-600' : 'bg-gray-200'"
                            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                            <span :class="notifications.digest ? 'translate-x-6' : 'translate-x-1'"
                                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                        </Switch>
                    </div>
                    <div class="py-4 flex items-center justify-between">
                        <div>
                            <h3 class="text-sm font-medium text-gray-900">Score Updates</h3>
                            <p class="text-sm text-gray-500">Get notified when readiness scores change</p>
                        </div>
                        <Switch v-model="notifications.scores"
                            :class="notifications.scores ? 'bg-emerald-600' : 'bg-gray-200'"
                            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
                            <span :class="notifications.scores ? 'translate-x-6' : 'translate-x-1'"
                                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                        </Switch>
                    </div>
                </div>

                <div class="flex justify-end">
                    <button @click="savePreferences"
                        class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                        <DocumentCheckIcon class="w-4 h-4" />
                        Save Preferences
                    </button>
                </div>
            </div>

            <!-- Preferences Tab -->
            <div v-if="currentTab === 'preferences'" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 class="text-lg font-semibold text-gray-900 mb-1">Regional Preferences</h2>
                <p class="text-sm text-gray-500 mb-6">Set your language and regional settings</p>

                <div class="grid grid-cols-2 gap-6 mb-8">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Language</label>
                        <select v-model="preferences.language"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm">
                            <option value="en">English</option>
                            <option value="km">Khmer</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                        <select v-model="preferences.timezone"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm">
                            <option value="Asia/Phnom_Penh">Asia/Phnom_Penh (UTC+7)</option>
                            <option value="America/New_York">America/New_York (UTC-5)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                        <select v-model="preferences.dateFormat"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm">
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                    </div>
                </div>

                <div class="flex justify-end pt-4 border-t border-gray-100">
                    <button @click="savePreferences"
                        class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                        <DocumentCheckIcon class="w-4 h-4" />
                        Save Preferences
                    </button>
                </div>
            </div>

            <!-- Security Tab -->
            <div v-if="currentTab === 'security'" class="space-y-6">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-1">Change Password</h2>
                    <p class="text-sm text-gray-500 mb-6">Update your account password</p>

                    <div class="space-y-4 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input type="password" v-model="security.currentPassword"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input type="password" v-model="security.newPassword"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input type="password" v-model="security.confirmPassword"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm">
                        </div>
                    </div>

                    <button @click="updatePassword"
                        class="px-4 py-2 bg-[#2D7A6B] text-white text-sm font-medium rounded-lg hover:bg-[#205e52] transition-colors">
                        Update Password
                    </button>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 class="text-lg font-semibold text-gray-900 mb-1">Two-Factor Authentication</h2>
                    <p class="text-sm text-gray-500 mb-6">Add an extra layer of security to your account</p>

                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-900">2FA is currently disabled</p>
                            <p class="text-sm text-gray-500">Enable two-factor authentication for enhanced security</p>
                        </div>
                        <button
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Enable 2FA
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { Switch } from '@headlessui/vue'
import { useAuthStore } from '~/stores/auth.store'
import {
    UserIcon,
    BellIcon,
    GlobeAltIcon,
    ShieldCheckIcon,
    BookmarkIcon,
    DocumentCheckIcon,
    ArrowPathIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
    layout: 'investor'
})

const authStore = useAuthStore()
const currentTab = ref('profile')
const loading = ref(false)

const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'preferences', label: 'Preferences', icon: GlobeAltIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon }
]

const form = ref({
    name: '',
    email: '',
    phone: '',
    company: ''
})

const isReadOnly = computed(() => authStore.user?.role !== 'ADMIN')

const syncProfile = () => {
    if (authStore.user) {
        form.value.name = authStore.user.full_name || authStore.user.name || ''
        form.value.email = authStore.user.email || ''
        form.value.phone = authStore.user.phone || ''
        form.value.company = authStore.user.investor_profile?.organization_name || ''
    }
}

onMounted(async () => {
    if (!authStore.user) {
        await authStore.fetchUser()
    }
    syncProfile()
})

watch(() => authStore.user, syncProfile, { deep: true })

const notifications = ref({
    email: true,
    assessments: true,
    digest: false,
    scores: true
})

const preferences = ref({
    language: 'en',
    timezone: 'Asia/Phnom_Penh',
    dateFormat: 'DD/MM/YYYY'
})

const security = ref({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
})

const saveProfile = async () => {
    if (isReadOnly.value) return
    
    loading.value = true
    try {
        await authStore.updateProfile({
            full_name: form.value.name,
            phone: form.value.phone,
            organization_name: form.value.company
        })
        alert('Profile updated successfully!')
    } catch (e: any) {
        alert(e.message || 'Failed to update profile')
    } finally {
        loading.value = false
    }
}

const savePreferences = () => {
    alert('Preferences saved successfully!')
}

const updatePassword = () => {
    if (security.value.newPassword !== security.value.confirmPassword) {
        alert('Passwords do not match!')
        return
    }
    alert('Password updated successfully!')
    security.value.currentPassword = ''
    security.value.newPassword = ''
    security.value.confirmPassword = ''
}
</script>
