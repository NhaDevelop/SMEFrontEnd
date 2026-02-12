<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6 mb-8 flex-shrink-0">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
                <p class="text-gray-500 mt-1">Manage your account settings and preferences</p>
            </div>

            <!-- Tabs -->
            <div class="flex items-center gap-2 mt-6">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors',
                    activeTab === tab.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                ]">
                    <component :is="tab.icon" class="w-4 h-4" />
                    {{ tab.name }}
                </button>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto px-8 pb-12 w-full">
            <div class="max-w-[1600px] mx-auto">

                <!-- Profile Tab -->
                <div v-if="activeTab === 'profile'" class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <h2 class="text-xl font-bold text-gray-900">Profile Information</h2>
                    <p class="text-gray-500 text-sm mt-1 mb-8">Update your personal information</p>

                    <div class="flex items-center gap-6 mb-8">
                        <div
                            class="w-20 h-20 rounded-full bg-[#198754] text-white flex items-center justify-center text-2xl font-medium">
                            {{ profile.name.charAt(0).toLowerCase() }}
                        </div>
                        <button
                            class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Change Photo
                        </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input v-model="profile.name" type="text"
                                class="w-full rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input v-model="profile.email" type="email"
                                class="w-full rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input v-model="profile.phone" type="text"
                                class="w-full rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Company / Organization</label>
                            <input v-model="profile.company" type="text"
                                class="w-full rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button
                            class="px-4 py-2.5 bg-[#198754] text-white rounded-lg font-medium hover:bg-[#157347] transition-colors flex items-center gap-2">
                            <ArrowDownTrayIcon class="w-4 h-4" v-if="false" /> <!-- Placeholder for icon if needed -->
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Save Changes
                        </button>
                    </div>
                </div>

                <!-- Notifications Tab -->
                <div v-else-if="activeTab === 'notifications'"
                    class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <h2 class="text-xl font-bold text-gray-900">Notification Preferences</h2>
                    <p class="text-gray-500 text-sm mt-1 mb-8">Choose what notifications you receive</p>

                    <div class="space-y-6 mb-8">
                        <div class="flex items-center justify-between pb-6 border-b border-gray-100">
                            <div>
                                <h3 class="font-medium text-gray-900">Email Notifications</h3>
                                <p class="text-xs text-gray-500 mt-1">Receive notifications via email</p>
                            </div>
                            <!-- Toggle Switch -->
                            <button @click="notifications.email = !notifications.email"
                                :class="notifications.email ? 'bg-emerald-600' : 'bg-gray-200'"
                                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none">
                                <span :class="notifications.email ? 'translate-x-6' : 'translate-x-1'"
                                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                            </button>
                        </div>

                        <div class="flex items-center justify-between pb-6 border-b border-gray-100">
                            <div>
                                <h3 class="font-medium text-gray-900">Assessment Reminders</h3>
                                <p class="text-xs text-gray-500 mt-1">Get reminded about pending assessments</p>
                            </div>
                            <button @click="notifications.reminders = !notifications.reminders"
                                :class="notifications.reminders ? 'bg-emerald-600' : 'bg-gray-200'"
                                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none">
                                <span :class="notifications.reminders ? 'translate-x-6' : 'translate-x-1'"
                                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                            </button>
                        </div>

                        <div class="flex items-center justify-between pb-6 border-b border-gray-100">
                            <div>
                                <h3 class="font-medium text-gray-900">Weekly Digest</h3>
                                <p class="text-xs text-gray-500 mt-1">Receive a weekly summary of portfolio activity</p>
                            </div>
                            <button @click="notifications.digest = !notifications.digest"
                                :class="notifications.digest ? 'bg-emerald-600' : 'bg-gray-200'"
                                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none">
                                <span :class="notifications.digest ? 'translate-x-6' : 'translate-x-1'"
                                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                            </button>
                        </div>

                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="font-medium text-gray-900">Score Updates</h3>
                                <p class="text-xs text-gray-500 mt-1">Get notified when readiness scores change</p>
                            </div>
                            <button @click="notifications.updates = !notifications.updates"
                                :class="notifications.updates ? 'bg-emerald-600' : 'bg-gray-200'"
                                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none">
                                <span :class="notifications.updates ? 'translate-x-6' : 'translate-x-1'"
                                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
                            </button>
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button
                            class="px-4 py-2.5 bg-[#198754] text-white rounded-lg font-medium hover:bg-[#157347] transition-colors flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Save Preferences
                        </button>
                    </div>
                </div>

                <!-- Preferences Tab -->
                <div v-else-if="activeTab === 'preferences'"
                    class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <h2 class="text-xl font-bold text-gray-900">Regional Preferences</h2>
                    <p class="text-gray-500 text-sm mt-1 mb-8">Set your language and regional settings</p>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Language</label>
                            <select v-model="prefs.language"
                                class="w-full rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                                <option>English</option>
                                <option>Khmer</option>
                                <option>French</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                            <select v-model="prefs.timezone"
                                class="w-full rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                                <option>Asia/Phnom_Penh (UTC+7)</option>
                                <option>Asia/Bangkok (UTC+7)</option>
                                <option>UTC</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                            <select v-model="prefs.dateFormat"
                                class="w-full rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                                <option>DD/MM/YYYY</option>
                                <option>MM/DD/YYYY</option>
                                <option>YYYY-MM-DD</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex justify-end">
                        <button
                            class="px-4 py-2.5 bg-[#198754] text-white rounded-lg font-medium hover:bg-[#157347] transition-colors flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Save Preferences
                        </button>
                    </div>
                </div>

                <!-- Security Tab -->
                <div v-else-if="activeTab === 'security'" class="space-y-6">
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                        <h2 class="text-xl font-bold text-gray-900">Change Password</h2>
                        <p class="text-gray-500 text-sm mt-1 mb-8">Update your account password</p>

                        <div class="space-y-6 mb-8">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input type="password"
                                    class="w-full rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input type="password"
                                    class="w-full rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input type="password"
                                    class="w-full rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500">
                            </div>
                        </div>

                        <div>
                            <button
                                class="px-4 py-2 bg-[#198754] text-white rounded-lg font-medium hover:bg-[#157347] transition-colors">
                                Update Password
                            </button>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                        <h2 class="text-xl font-bold text-gray-900">Two-Factor Authentication</h2>
                        <p class="text-gray-500 text-sm mt-1 mb-8">Add an extra layer of security to your account</p>

                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="font-medium text-gray-900">2FA is currently disabled</h3>
                                <p class="text-xs text-gray-500 mt-1">Enable two-factor authentication for enhanced
                                    security</p>
                            </div>
                            <button
                                class="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                Enable 2FA
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
    UserIcon,
    BellIcon,
    GlobeAltIcon,
    ShieldCheckIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
    layout: 'investor',
    middleware: ['auth', 'investor']
})

const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'preferences', name: 'Preferences', icon: GlobeAltIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
]

const activeTab = ref('profile')

const profile = ref({
    name: 'panha pay',
    email: 'paypanha45@gmail.com',
    phone: '+855 12 345 678',
    company: ''
})

const notifications = ref({
    email: true,
    reminders: true,
    digest: false,
    updates: true
})

const prefs = ref({
    language: 'English',
    timezone: 'Asia/Phnom_Penh (UTC+7)',
    dateFormat: 'DD/MM/YYYY'
})
</script>
