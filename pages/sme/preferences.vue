<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Notification Preferences</h1>
                <p class="text-gray-500 mt-1">Manage how and when you receive notifications</p>
            </div>
            <button @click="saveChanges"
                class="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 shadow-sm">
                <span v-if="saving"
                    class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span v-else>Save Changes</span>
            </button>
        </header>

        <main class="flex-1 overflow-y-auto px-8 py-8 space-y-8 max-w-5xl mx-auto w-full">
            <!-- Summary Stats -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Email Active -->
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <EnvelopeIcon class="w-6 h-6" />
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-gray-900">{{ emailActiveCount }}</div>
                        <div class="text-sm text-gray-500">Email Active</div>
                    </div>
                </div>

                <!-- Push Active -->
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                        <BellIcon class="w-6 h-6" />
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-gray-900">{{ pushActiveCount }}</div>
                        <div class="text-sm text-gray-500">Push Active</div>
                    </div>
                </div>

                <!-- Digest Status -->
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                        <CheckCircleIcon class="w-6 h-6" />
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-gray-900">{{ digestEnabled ? 'On' : 'Off' }}</div>
                        <div class="text-sm text-gray-500">Digest</div>
                    </div>
                </div>

                <!-- Quiet Hours Status -->
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
                        <ClockIcon class="w-6 h-6" />
                    </div>
                    <div>
                        <div class="text-2xl font-bold text-gray-900">{{ quietHoursEnabled ? 'On' : 'Off' }}</div>
                        <div class="text-sm text-gray-500">Quiet Hours</div>
                    </div>
                </div>
            </div>

            <!-- Email Settings -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div class="flex items-center gap-3 mb-6">
                    <EnvelopeIcon class="w-6 h-6 text-gray-400" />
                    <h2 class="text-xl font-bold text-gray-900">Email Settings</h2>
                </div>
                <p class="text-gray-500 mb-6">Configure your notification email address</p>

                <div class="max-w-xl">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Notification Email</label>
                    <div class="relative">
                        <input type="email" v-model="email"
                            class="w-full pl-4 pr-24 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow" />
                        <span
                            class="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded flex items-center gap-1">
                            <CheckBadgeIcon class="w-3.5 h-3.5" />
                            Verified
                        </span>
                    </div>
                </div>
            </div>

            <!-- Notification Types -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 class="text-xl font-bold text-gray-900">Notification Types</h2>
                        <p class="text-gray-500 mt-1">Choose which notifications you want to receive</p>
                    </div>
                    <div class="flex gap-3">
                        <button @click="enableAllEmail"
                            class="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                            Enable All Email
                        </button>
                        <button @click="disableAll"
                            class="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                            Disable All
                        </button>
                    </div>
                </div>

                <div class="space-y-10">
                    <div v-for="(category, catIdx) in notificationGroups" :key="catIdx">
                        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{{ category.name }}
                        </h3>
                        <div class="space-y-4">
                            <div v-for="item in category.items" :key="item.id"
                                class="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                <div class="flex items-start gap-4">
                                    <div :class="`p-2 rounded-lg ${item.iconBg}`">
                                        <component :is="item.icon" :class="`w-5 h-5 ${item.iconColor}`" />
                                    </div>
                                    <div>
                                        <h4 class="font-semibold text-gray-900">{{ item.title }}</h4>
                                        <p class="text-sm text-gray-500">{{ item.description }}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-6">
                                    <div class="flex items-center gap-3">
                                        <div @click="item.email = !item.email"
                                            class="cursor-pointer relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                                            :class="item.email ? 'bg-teal-600' : 'bg-gray-200'">
                                            <span
                                                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                                :class="item.email ? 'translate-x-5' : 'translate-x-0'" />
                                        </div>
                                        <span class="text-sm text-gray-600 min-w-[30px]">Email</span>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <div @click="item.push = !item.push"
                                            class="cursor-pointer relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                                            :class="item.push ? 'bg-teal-600' : 'bg-gray-200'">
                                            <span
                                                class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                                :class="item.push ? 'translate-x-5' : 'translate-x-0'" />
                                        </div>
                                        <span class="text-sm text-gray-600 min-w-[30px]">Push</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Weekly Digest -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                        <DocumentTextIcon class="w-6 h-6 text-gray-900" />
                        <h2 class="text-xl font-bold text-gray-900">Weekly Digest</h2>
                    </div>
                    <div @click="digestEnabled = !digestEnabled"
                        class="cursor-pointer relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                        :class="digestEnabled ? 'bg-teal-600' : 'bg-gray-200'">
                        <span
                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            :class="digestEnabled ? 'translate-x-5' : 'translate-x-0'" />
                    </div>
                </div>
                <p class="text-gray-500 mb-8 ml-9">Receive a summary of your progress and upcoming deadlines</p>

                <!-- Expanded Digest Settings -->
                <div v-if="digestEnabled" class="grid grid-cols-1 md:grid-cols-3 gap-6 ml-9 animate-fade-in-down">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                        <select v-model="digestFrequency"
                            class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500">
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Day of Week</label>
                        <select v-model="digestDay"
                            class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500">
                            <option>Monday</option>
                            <option>Tuesday</option>
                            <option>Wednesday</option>
                            <option>Thursday</option>
                            <option>Friday</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <input type="time" v-model="digestTime"
                            class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                </div>
            </div>

            <!-- Quiet Hours -->
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center gap-3">
                        <ClockIcon class="w-6 h-6 text-gray-900" />
                        <h2 class="text-xl font-bold text-gray-900">Quiet Hours</h2>
                    </div>
                    <div @click="quietHoursEnabled = !quietHoursEnabled"
                        class="cursor-pointer relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                        :class="quietHoursEnabled ? 'bg-teal-600' : 'bg-gray-200'">
                        <span
                            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                            :class="quietHoursEnabled ? 'translate-x-5' : 'translate-x-0'" />
                    </div>
                </div>
                <p class="text-gray-500 mb-8 ml-9">Pause notifications during specific hours</p>

                <!-- Expanded Quiet Hours Settings -->
                <div v-if="quietHoursEnabled" class="grid grid-cols-1 md:grid-cols-2 gap-6 ml-9 animate-fade-in-down">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                        <input type="time" v-model="quietStart"
                            class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                        <input type="time" v-model="quietEnd"
                            class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>
                </div>
            </div>
            <!-- Sign Out -->
            <div class="flex justify-end pt-4 pb-8">
                <button @click="handleSignOut"
                    class="text-red-500 hover:text-red-700 font-medium flex items-center gap-2 transition-colors">
                    <ArrowRightOnRectangleIcon class="w-5 h-5" />
                    Sign Out
                </button>
            </div>

        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
    EnvelopeIcon,
    BellIcon,
    CheckCircleIcon,
    ClockIcon,
    CheckBadgeIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    TrophyIcon,
    ExclamationCircleIcon,
    ArrowTrendingUpIcon,
    DocumentCheckIcon,
    PresentationChartLineIcon,
    CalendarIcon,
    BoltIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

import { useAuthStore } from '~/stores/auth.store'

definePageMeta({
    layout: 'default',
    middleware: ['auth', 'sme']
})

const authStore = useAuthStore()
const router = useRouter()

const email = ref('user@example.com')
const saving = ref(false)

const digestEnabled = ref(true)
const digestFrequency = ref('Weekly')
const digestDay = ref('Monday')
const digestTime = ref('09:00')

const quietHoursEnabled = ref(true)
const quietStart = ref('22:00')
const quietEnd = ref('08:00')

// Mock Data for Notifications
const notificationGroups = ref([
    {
        name: 'Goals',
        items: [
            {
                id: 'goal_deadline',
                title: 'Goal Deadline Approaching',
                description: 'Get notified when a goal is within 7 days of its target date',
                icon: ExclamationCircleIcon, // Using ExclamationCircle as proxy for target
                iconBg: 'bg-blue-50',
                iconColor: 'text-blue-600',
                email: true,
                push: true
            },
            {
                id: 'goal_achieved',
                title: 'Goal Achieved',
                description: 'Celebrate when you reach a goal target',
                icon: TrophyIcon,
                iconBg: 'bg-yellow-50',
                iconColor: 'text-yellow-600',
                email: true,
                push: true
            },
            {
                id: 'goal_risk',
                title: 'Goal At Risk',
                description: 'Alert when a goal is overdue or progress has stalled',
                icon: ExclamationTriangleIcon,
                iconBg: 'bg-red-50',
                iconColor: 'text-red-600',
                email: true,
                push: false
            }
        ]
    },
    {
        name: 'Assessments',
        items: [
            {
                id: 'score_improvement',
                title: 'Score Improvement',
                description: 'Notify when your readiness score increases after an assessment',
                icon: ArrowTrendingUpIcon,
                iconBg: 'bg-green-50',
                iconColor: 'text-green-600',
                email: true,
                push: true
            },
            {
                id: 'assessment_reminder',
                title: 'Assessment Reminder',
                description: 'Reminder to complete pending assessments',
                icon: DocumentCheckIcon,
                iconBg: 'bg-teal-50',
                iconColor: 'text-teal-600',
                email: true,
                push: false
            },
            {
                id: 'pillar_target',
                title: 'Pillar Target Reached',
                description: 'Alert when a pillar score reaches your goal target',
                icon: CheckCircleIcon,
                iconBg: 'bg-emerald-50',
                iconColor: 'text-emerald-600',
                email: false,
                push: true
            }
        ]
    },
    {
        name: 'Programs',
        items: [
            {
                id: 'program_update',
                title: 'Program Updates',
                description: 'Updates about programs you are enrolled in',
                icon: CalendarIcon,
                iconBg: 'bg-purple-50',
                iconColor: 'text-purple-600',
                email: true,
                push: true
            }
        ]
    },
    {
        name: 'Actions',
        items: [
            {
                id: 'action_reminder',
                title: 'Action Reminders',
                description: 'Reminders for recommended improvement actions',
                icon: BoltIcon,
                iconBg: 'bg-orange-50',
                iconColor: 'text-orange-600',
                email: false,
                push: true
            }
        ]
    }
])

// Computed Active Counts
const emailActiveCount = computed(() => {
    let count = 0
    notificationGroups.value.forEach(group => {
        group.items.forEach(item => {
            if (item.email) count++
        })
    })
    return count
})

const pushActiveCount = computed(() => {
    let count = 0
    notificationGroups.value.forEach(group => {
        group.items.forEach(item => {
            if (item.push) count++
        })
    })
    return count
})

// Actions
const enableAllEmail = () => {
    notificationGroups.value.forEach(group => {
        group.items.forEach(item => {
            item.email = true
        })
    })
}

const disableAll = () => {
    notificationGroups.value.forEach(group => {
        group.items.forEach(item => {
            item.email = false
            item.push = false
        })
    })
}

const saveChanges = async () => {
    saving.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    saving.value = false
    // Show toast or some feedback could be added here
}

const handleSignOut = async () => {
    await authStore.logout()
    router.push('/')
}
</script>

<style scoped>
.animate-fade-in-down {
    animation: fadeInDown 0.3s ease-out forwards;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
