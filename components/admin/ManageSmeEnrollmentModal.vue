<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="$emit('close')" class="relative z-50">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4 text-center">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all flex flex-col h-[85vh]">

                            <!-- Header -->
                            <div
                                class="px-6 py-5 border-b border-gray-100 flex items-start justify-between flex-shrink-0">
                                <div>
                                    <div class="flex items-center gap-3">
                                        <h3 class="text-xl font-bold text-gray-900">Manage SME Enrollment</h3>
                                        <span
                                            class="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-100">
                                            {{ program?.name }}
                                        </span>
                                    </div>
                                    <p class="text-sm text-gray-500 mt-1">Add SMEs to this program and track their
                                        assessment progress</p>
                                </div>
                                <button @click="$emit('close')"
                                    class="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100">
                                    <XMarkIcon class="w-6 h-6" />
                                </button>
                            </div>

                            <!-- Key Metrics Cards -->
                            <div class="px-6 py-6 border-b border-gray-100 flex-shrink-0">
                                <div class="grid grid-cols-5 gap-4">
                                    <!-- Total -->
                                    <div class="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
                                        <div class="text-2xl font-bold text-gray-900">{{ enrolledSmes.length }}</div>
                                        <div class="text-xs text-gray-500 font-medium mt-1">Total</div>
                                    </div>

                                    <!-- Invited -->
                                    <div class="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                                        <div class="text-2xl font-bold text-blue-600">{{ invitedCount }}</div>
                                        <div class="text-xs text-blue-600/80 font-medium mt-1">Invited</div>
                                    </div>

                                    <!-- In Progress -->
                                    <div class="bg-orange-50 rounded-xl p-4 text-center border border-orange-100">
                                        <div class="text-2xl font-bold text-orange-600">{{ inProgressCount }}</div>
                                        <div class="text-xs text-orange-600/80 font-medium mt-1">In Progress</div>
                                    </div>

                                    <!-- Completed -->
                                    <div class="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
                                        <div class="text-2xl font-bold text-emerald-600">{{ completedCount }}</div>
                                        <div class="text-xs text-emerald-600/80 font-medium mt-1">Completed</div>
                                    </div>

                                    <!-- Avg Progress -->
                                    <div class="bg-teal-50 rounded-xl p-4 text-center border border-teal-100">
                                        <div class="text-2xl font-bold text-teal-700">{{ avgProgress }}%</div>
                                        <div class="text-xs text-teal-700/80 font-medium mt-1">Avg. Progress</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Tabs & Content Container -->
                            <div class="flex-1 flex flex-col min-h-0 bg-white">
                                <!-- Toolbar Section -->
                                <div class="px-6 py-4 flex flex-col gap-4 border-b border-gray-100">
                                    <!-- Segmented Control Tabs -->
                                    <div
                                        class="bg-gray-100 p-1 rounded-lg flex self-start w-full sm:w-auto min-w-[300px]">
                                        <button @click="activeTab = 'enrolled'" :class="[
                                            'flex-1 py-1.5 px-4 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2',
                                            activeTab === 'enrolled'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                        ]">
                                            <CheckCircleIcon class="w-4 h-4" />
                                            Enrolled SMEs ({{ enrolledSmes.length }})
                                        </button>
                                        <button @click="activeTab = 'add'" :class="[
                                            'flex-1 py-1.5 px-4 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2',
                                            activeTab === 'add'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-500 hover:text-gray-700'
                                        ]">
                                            <UserPlusIcon class="w-4 h-4" />
                                            Add SMEs
                                        </button>
                                    </div>

                                    <!-- Search and Filter Row -->
                                    <div class="flex items-center gap-3">
                                        <div class="relative flex-1">
                                            <MagnifyingGlassIcon
                                                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input v-if="activeTab === 'enrolled'" v-model="searchQueryEnrolled"
                                                type="text" placeholder="Search enrolled SMEs..."
                                                class="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" />
                                            <input v-else v-model="searchQueryAdd" type="text"
                                                placeholder="Search & add new SMEs..."
                                                class="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow" />
                                        </div>

                                        <div v-if="activeTab === 'enrolled'" class="relative min-w-[140px]">
                                            <select v-model="filterStatus"
                                                class="w-full appearance-none pl-4 pr-10 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer">
                                                <option value="All">All Status</option>
                                                <option value="Invited">Invited</option>
                                                <option value="Enrolled">Enrolled</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Dropped">Dropped</option>
                                            </select>
                                            <ChevronDownIcon
                                                class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Enrolled SMEs Table -->
                                <div v-if="activeTab === 'enrolled'" class="flex-1 overflow-y-auto">
                                    <table class="min-w-full divide-y divide-gray-100">
                                        <thead class="bg-white sticky top-0 z-10">
                                            <tr>
                                                <th scope="col"
                                                    class="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                                    SME
                                                </th>
                                                <th scope="col"
                                                    class="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                                    Status
                                                </th>
                                                <th scope="col"
                                                    class="px-6 py-4 text-left text-sm font-medium text-gray-500 w-1/4">
                                                    Progress
                                                </th>
                                                <th scope="col"
                                                    class="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                                    Score
                                                </th>
                                                <th scope="col"
                                                    class="px-6 py-4 text-left text-sm font-medium text-gray-500">
                                                    Last Activity
                                                </th>
                                                <th scope="col" class="relative px-6 py-4">
                                                    <span class="sr-only">Actions</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-gray-100">
                                            <tr v-for="sme in filteredEnrolledSmes" :key="sme.id"
                                                class="group hover:bg-gray-50 transition-colors">
                                                <!-- SME Info -->
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-gray-900">{{ sme.name
                                                        }}</span>
                                                        <span class="text-xs text-gray-500 mt-0.5">{{ sme.industry }} •
                                                            {{
                                                                sme.location }}</span>
                                                    </div>
                                                </td>

                                                <!-- Status -->
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <span :class="[
                                                        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold',
                                                        getStatusClasses(getSmeStatus(sme))
                                                    ]">
                                                        <component :is="getStatusIcon(getSmeStatus(sme))"
                                                            class="w-4 h-4" />
                                                        {{ getSmeStatus(sme) }}
                                                    </span>
                                                </td>

                                                <!-- Progress -->
                                                <td class="px-6 py-4 whitespace-nowrap align-middle">
                                                    <div class="flex items-center gap-3">
                                                        <div
                                                            class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div class="h-full rounded-full transition-all duration-500"
                                                                :class="[getSmeStatus(sme) === 'Invited' ? 'bg-gray-200' : 'bg-teal-600']"
                                                                :style="{ width: `${getSmeProgress(sme)}%` }"></div>
                                                        </div>
                                                        <span
                                                            class="text-xs font-medium text-gray-500 block w-8 text-right">
                                                            {{ getSmeProgress(sme) }}%
                                                        </span>
                                                    </div>
                                                </td>

                                                <!-- Score -->
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <div class="flex items-center gap-2">
                                                        <span
                                                            v-if="sme.score && sme.score > 0 && getSmeStatus(sme) !== 'Invited'"
                                                            class="text-sm font-bold text-gray-900">{{ sme.score
                                                            }}</span>
                                                        <span v-else class="text-sm text-gray-400 font-medium">-</span>

                                                        <span v-if="sme.score >= 50 && getSmeStatus(sme) !== 'Invited'"
                                                            class="text-emerald-500 flex items-center">
                                                            <ArrowTrendingUpIcon class="w-4 h-4" />
                                                        </span>
                                                    </div>
                                                </td>

                                                <!-- Last Activity -->
                                                <td
                                                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-normal">
                                                    {{ formatDate(sme.lastAssessed) }}
                                                </td>

                                                <!-- Actions -->
                                                <td class="px-6 py-4 whitespace-nowrap text-right">
                                                    <Menu as="div" class="relative inline-block text-left">
                                                        <MenuButton @click="setMenuPosition($event)"
                                                            class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                                                            <EllipsisHorizontalIcon class="w-5 h-5"
                                                                aria-hidden="true" />
                                                        </MenuButton>

                                                        <Teleport to="body">
                                                            <transition
                                                                enter-active-class="transition ease-out duration-100"
                                                                enter-from-class="transform opacity-0"
                                                                enter-to-class="transform opacity-100"
                                                                leave-active-class="transition ease-in duration-75"
                                                                leave-from-class="transform opacity-100"
                                                                leave-to-class="transform opacity-0">
                                                                <MenuItems :style="menuStyle"
                                                                    class="fixed z-[9999] w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">

                                                                    <!-- Primary Actions -->
                                                                    <div class="px-1 py-1">
                                                                        <MenuItem v-slot="{ active }">
                                                                        <button :class="[
                                                                            active ? 'bg-teal-50 text-teal-700' : 'text-gray-700',
                                                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                                                                        ]" @click="startAssessment(sme)">
                                                                            <PlayIcon :class="[
                                                                                active ? 'text-teal-600' : 'text-gray-400',
                                                                                'mr-2 h-4 w-4'
                                                                            ]" aria-hidden="true" />
                                                                            Start Assessment
                                                                        </button>
                                                                        </MenuItem>
                                                                        <MenuItem v-slot="{ active }">
                                                                        <button :class="[
                                                                            active ? 'bg-teal-50 text-teal-700' : 'text-gray-700',
                                                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                                                                        ]" @click="viewProfile(sme)">
                                                                            <ArrowTopRightOnSquareIcon :class="[
                                                                                active ? 'text-teal-600' : 'text-gray-400',
                                                                                'mr-2 h-4 w-4'
                                                                            ]" aria-hidden="true" />
                                                                            View Profile
                                                                        </button>
                                                                        </MenuItem>
                                                                        <MenuItem v-slot="{ active }">
                                                                        <button :class="[
                                                                            active ? 'bg-teal-50 text-teal-700' : 'text-gray-700',
                                                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                                                                        ]" @click="sendReminder(sme)">
                                                                            <PaperAirplaneIcon :class="[
                                                                                active ? 'text-teal-600' : 'text-gray-400',
                                                                                'mr-2 h-4 w-4'
                                                                            ]" aria-hidden="true" />
                                                                            Send Reminder
                                                                        </button>
                                                                        </MenuItem>
                                                                    </div>

                                                                    <!-- Status Updates -->
                                                                    <div class="px-1 py-1">
                                                                        <div
                                                                            class="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                                            Update Status
                                                                        </div>
                                                                        <MenuItem v-slot="{ active }">
                                                                        <button :class="[
                                                                            active ? 'bg-gray-50 text-gray-900' : 'text-gray-700',
                                                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm pl-8'
                                                                        ]" @click="updateStatus(sme, 'Enrolled')">
                                                                            Mark as Enrolled
                                                                        </button>
                                                                        </MenuItem>
                                                                        <MenuItem v-slot="{ active }">
                                                                        <button :class="[
                                                                            active ? 'bg-gray-50 text-gray-900' : 'text-gray-700',
                                                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm pl-8'
                                                                        ]" @click="updateStatus(sme, 'In Progress')">
                                                                            Mark as In Progress
                                                                        </button>
                                                                        </MenuItem>
                                                                        <MenuItem v-slot="{ active }">
                                                                        <button :class="[
                                                                            active ? 'bg-gray-50 text-gray-900' : 'text-gray-700',
                                                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm pl-8'
                                                                        ]" @click="updateStatus(sme, 'Completed')">
                                                                            Mark as Completed
                                                                        </button>
                                                                        </MenuItem>
                                                                    </div>

                                                                    <!-- Danger Zone -->
                                                                    <div class="px-1 py-1">
                                                                        <MenuItem v-slot="{ active }">
                                                                        <button :class="[
                                                                            active ? 'bg-red-50 text-red-700' : 'text-red-600',
                                                                            'group flex w-full items-center rounded-md px-2 py-2 text-sm'
                                                                        ]" @click="removeSme(sme.id)">
                                                                            <TrashIcon :class="[
                                                                                active ? 'text-red-500' : 'text-red-400',
                                                                                'mr-2 h-4 w-4'
                                                                            ]" aria-hidden="true" />
                                                                            Remove from Program
                                                                        </button>
                                                                        </MenuItem>
                                                                    </div>
                                                                </MenuItems>
                                                            </transition>
                                                        </Teleport>
                                                    </Menu>
                                                </td>
                                            </tr>
                                            <tr v-if="filteredEnrolledSmes.length === 0">
                                                <td colspan="6" class="px-6 py-16 text-center text-gray-500">
                                                    <div class="flex flex-col items-center">
                                                        <div class="p-3 bg-gray-50 rounded-full mb-3">
                                                            <MagnifyingGlassIcon class="w-6 h-6 text-gray-400" />
                                                        </div>
                                                        <p class="text-sm font-medium text-gray-900">No SMEs found</p>
                                                        <p class="text-xs text-gray-500 mt-1">Try adjusting your filters
                                                            or
                                                            search terms</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Add SMEs Content -->
                                <div v-if="activeTab === 'add'" class="flex-1 overflow-y-auto">
                                    <table class="min-w-full divide-y divide-gray-100">
                                        <thead class="bg-white sticky top-0 z-10">
                                            <tr>
                                                <th scope="col" class="px-6 py-3 w-10"></th>
                                                <th scope="col"
                                                    class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    SME
                                                </th>
                                                <th scope="col"
                                                    class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Sector
                                                </th>
                                                <th scope="col"
                                                    class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Location
                                                </th>
                                                <th scope="col"
                                                    class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                    Readiness
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody class="bg-white divide-y divide-gray-100">
                                            <tr v-for="sme in filteredAvailableSmes" :key="sme.id"
                                                class="hover:bg-gray-50 cursor-pointer transition-colors"
                                                @click="toggleSelection(sme.id)">
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <div :class="[
                                                        'w-5 h-5 rounded border flex items-center justify-center transition-all duration-200',
                                                        selectedSmes.includes(sme.id)
                                                            ? 'bg-teal-600 border-teal-600 shadow-sm'
                                                            : 'border-gray-300 bg-white group-hover:border-teal-400'
                                                    ]">
                                                        <CheckIcon v-if="selectedSmes.includes(sme.id)"
                                                            class="w-3.5 h-3.5 text-white" />
                                                    </div>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <span class="text-sm font-semibold text-gray-900">{{ sme.name
                                                    }}</span>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                        {{ sme.industry }}
                                                    </span>
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {{ sme.location }}
                                                </td>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <span :class="getReadinessClass(sme.readinessStatus)">
                                                        {{ sme.readinessStatus }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <!-- Footer Action Bar -->
                                <div v-if="selectedSmes.length > 0 && activeTab === 'add'"
                                    class="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between animate-fade-in-up">
                                    <div class="text-sm font-medium text-gray-900">
                                        <span class="text-teal-600 font-bold">{{ selectedSmes.length }}</span> SME{{
                                            selectedSmes.length > 1 ? 's' : '' }} selected
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <button @click="selectedSmes = []"
                                            class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors">
                                            Clear
                                        </button>
                                        <button @click="confirmAddSmes"
                                            class="px-6 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                                            <PlusIcon class="w-4 h-4" />
                                            Add to Program
                                        </button>
                                    </div>
                                </div>

                                <!-- Standard Footer -->
                                <div v-if="activeTab === 'enrolled' || (activeTab === 'add' && selectedSmes.length === 0)"
                                    class="p-4 border-t border-gray-100 flex justify-end">
                                    <button @click="$emit('close')"
                                        class="px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                        Close
                                    </button>
                                </div>
                            </div>

                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, DialogPanel, TransitionChild, TransitionRoot, Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import {
    XMarkIcon,
    MagnifyingGlassIcon,
    EllipsisHorizontalIcon,
    CheckCircleIcon,
    ClockIcon,
    EnvelopeIcon,
    UserPlusIcon,
    PlusIcon,
    TrashIcon,
    PlayIcon,
    ArrowTopRightOnSquareIcon,
    PaperAirplaneIcon,
    ChevronDownIcon,
    ArrowTrendingUpIcon
} from '@heroicons/vue/24/outline'
import { useAdminStore } from '~/stores/admin.store'

const props = defineProps<{
    isOpen: boolean
    program: any
}>()

const emit = defineEmits(['close', 'refresh'])
const adminStore = useAdminStore()
const router = useRouter()

const activeTab = ref('enrolled')
const searchQueryEnrolled = ref('')
const searchQueryAdd = ref('')
const filterStatus = ref('All') // Matches template value "All"

const selectedSmes = ref<any[]>([])
const menuStyle = ref({})

const setMenuPosition = (event: MouseEvent) => {
    const button = (event.currentTarget as HTMLElement)
    const rect = button.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const menuHeight = 320 // Approximate max height of menu

    let top = rect.bottom + 8 // Default below with 8px gap
    let transformOrigin = 'top right'

    // If not enough space below, show above
    if (spaceBelow < menuHeight) {
        top = rect.top - 8 // Position above
        menuStyle.value = {
            bottom: `${window.innerHeight - rect.top + 8}px`,
            left: `${rect.right - 224}px`, // 224px is w-56
            transformOrigin: 'bottom right'
        }
    } else {
        menuStyle.value = {
            top: `${top}px`,
            left: `${rect.right - 224}px`,
            transformOrigin: 'top right'
        }
    }
}

// Reset state when modal opens
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        activeTab.value = 'enrolled'
        searchQueryEnrolled.value = ''
        searchQueryAdd.value = ''
        selectedSmes.value = []
        filterStatus.value = 'All'
    }
})

const smes = computed(() => adminStore.smes)

// Get enrolled SMEs for this program
const enrolledSmes = computed(() => {
    if (!props.program) return []
    return smes.value.filter(sme => sme.programIds.includes(Number(props.program.id)))
})

// Get available SMEs (not enrolled)
const availableSmes = computed(() => {
    if (!props.program) return []
    return smes.value.filter(sme => !sme.programIds.includes(Number(props.program.id)))
})

// Filter enrolled SMEs
const filteredEnrolledSmes = computed(() => {
    let result = enrolledSmes.value

    if (searchQueryEnrolled.value) {
        const query = searchQueryEnrolled.value.toLowerCase()
        result = result.filter(sme =>
            sme.name.toLowerCase().includes(query) ||
            (sme.industry && sme.industry.toLowerCase().includes(query))
        )
    }

    if (filterStatus.value !== 'All') {
        result = result.filter(sme => getSmeStatus(sme) === filterStatus.value)
    }

    return result
})

// Filter available SMEs
const filteredAvailableSmes = computed(() => {
    let result = availableSmes.value

    if (searchQueryAdd.value) {
        const query = searchQueryAdd.value.toLowerCase()
        result = result.filter(sme =>
            sme.name.toLowerCase().includes(query) ||
            (sme.industry && sme.industry.toLowerCase().includes(query))
        )
    }

    return result
})

// Selection for Add Tab
const toggleSelection = (smeId: any) => {
    const index = selectedSmes.value.indexOf(smeId)
    if (index === -1) {
        selectedSmes.value.push(smeId)
    } else {
        selectedSmes.value.splice(index, 1)
    }
}

const confirmAddSmes = async () => {
    if (selectedSmes.value.length === 0) return

    try {
        await adminStore.enrollSmesToProgram(props.program.id, selectedSmes.value)
        selectedSmes.value = []
        activeTab.value = 'enrolled'
    } catch (error) {
        console.error('Failed to enroll SMEs', error)
    }
}



const removeSme = async (smeId: number | string) => {
    if (!props.program) return
    if (!confirm('Are you sure you want to remove this SME from the program?')) return

    await adminStore.removeSmeFromProgram(props.program.id, smeId)
}

const getSmeStatus = (sme: any) => {
    // If explicitly set (via updateStatus action or enrollment), prioritize that
    if (sme.status) return sme.status

    // Fallback Mock logic for status (if legacy data has no status field)
    if (sme.readinessStatus === 'Investment Ready' || sme.score >= 80) return 'Completed'
    if (sme.readinessStatus === 'Early Stage' || (sme.score > 20 && sme.score < 80)) return 'In Progress'
    if (Number(sme.id) % 3 === 0) return 'Enrolled' // Mock Enrolled

    return 'Enrolled'
}

const getSmeProgress = (sme: any) => {
    // If newly enrolled/invited, show 0 progress
    if (sme.status === 'Invited' || getSmeStatus(sme) === 'Invited') return 0

    if (sme.score >= 80) return 100
    const status = getSmeStatus(sme)
    if (status === 'Completed') return 100
    if (status === 'In Progress') return sme.score || 45
    if (status === 'Enrolled') return 10
    return 0
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'Never'
    // Mock Format: "M/D/YYYY"
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

const getStatusClasses = (status: string) => {
    switch (status) {
        case 'Invited': return 'bg-white border-gray-200 text-gray-700'
        case 'Enrolled': return 'bg-blue-600 border-transparent text-white'
        case 'In Progress': return 'bg-orange-500 border-transparent text-white'
        case 'Completed': return 'bg-emerald-500 border-transparent text-white'
        case 'Dropped': return 'bg-red-500 border-transparent text-white'
        default: return 'bg-gray-100 text-gray-800'
    }
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Invited': return EnvelopeIcon
        case 'Enrolled': return CheckCircleIcon
        case 'In Progress': return ClockIcon
        case 'Completed': return CheckCircleIcon
        case 'Dropped': return XMarkIcon
        default: return CheckCircleIcon
    }
}

const getReadinessClass = (status: string) => {
    switch (status) {
        case 'Investment Ready': return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
        case 'Near Ready': return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
        case 'Early Stage': return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'
        case 'Pre-investment': return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
        default: return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
    }
}

// Stats
const invitedCount = computed(() => enrolledSmes.value.filter(s => getSmeStatus(s) === 'Invited').length)
const inProgressCount = computed(() => enrolledSmes.value.filter(s => getSmeStatus(s) === 'In Progress').length)
const completedCount = computed(() => enrolledSmes.value.filter(s => getSmeStatus(s) === 'Completed').length)

const avgProgress = computed(() => {
    if (enrolledSmes.value.length === 0) return 0
    const total = enrolledSmes.value.reduce((acc, sme) => acc + getSmeProgress(sme), 0)
    return Math.round(total / enrolledSmes.value.length)
})

// Actions
const startAssessment = (sme: any) => {
    // Navigate to assessment page with query params
    router.push({
        path: '/assessment',
        query: {
            program: props.program?.id,
            sme: sme.id,
            template: props.program?.templateId || 'template-default'
        }
    })
}

const viewProfile = (sme: any) => {
    router.push(`/sme/${sme.id}`)
}

const sendReminder = (sme: any) => {
    alert(`Reminder sent to ${sme.name}`)
}

const updateStatus = async (sme: any, newStatus: string) => {
    if (!props.program) return
    try {
        await adminStore.updateSmeStatus(props.program.id, sme.id, newStatus)
    } catch (error) {
        console.error('Failed to update status', error)
    }
}





onMounted(() => {
    if (props.program) {
        // Optionally refresh data
    }
})
</script>

<style scoped>
/* Custom scrollbar for better look in modal */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
    border-radius: 3px;
}
</style>
