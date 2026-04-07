<template>
  <div
    class="bg-white rounded-xl border border-gray-100 p-6 hover:border-cyan-100 transition-colors shadow-sm flex flex-col h-full">
    <div class="flex items-start justify-between mb-4">
      <div class="w-full">
        <div class="flex items-start justify-between gap-3 mb-1 w-full">
          <h3 class="font-bold text-gray-900 text-lg line-clamp-1">{{ program.name }}</h3>
          <span :class="[
            'px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap',
            program.isComingSoon ? 'bg-amber-100 text-amber-700' :
              program.status === 'Active' || program.status === 'Published' ? 'bg-green-100 text-green-700' :
                program.status === 'Finished' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
          ]">
            {{ program.isComingSoon ? 'Coming Soon' : program.status }}
          </span>
        </div>
        <p class="text-gray-500 text-sm max-w-2xl line-clamp-2 h-10">{{ program.description }}</p>
        <div class="flex flex-wrap items-center gap-2 mt-3">
          <span
            class="px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-cyan-100/50">
            <ClockIcon class="w-3.5 h-3.5 flex-shrink-0" />
            <span class="truncate max-w-[120px]">{{ program.duration || 'Flexible' }}</span>
          </span>
          <span v-if="program.sector"
            class="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-purple-100/50">
            <TagIcon class="w-3.5 h-3.5 flex-shrink-0" />
            <span class="truncate max-w-[120px]">{{ program.sector }}</span>
          </span>
          <span
            class="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-gray-200/50">
            <CalendarIcon class="w-3.5 h-3.5 flex-shrink-0" />
            <span class="truncate">{{ program.startDate || 'TBD' }}</span>
          </span>
        </div>
      </div>

      <!-- Headless UI Menu -->
      <Menu as="div" class="relative ml-2">
        <MenuButton class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <EllipsisHorizontalIcon class="w-6 h-6" />
        </MenuButton>

        <transition enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0">
          <MenuItems
            class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
            <div class="px-1 py-1">
              <MenuItem v-slot="{ active }">
              <button :class="[
                active ? 'bg-gray-50' : '',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900'
              ]" @click="$emit('view', program)">
                <EyeIcon :active="active" class="mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                View Details
              </button>
              </MenuItem>
              <MenuItem v-slot="{ active }" v-if="!isInvestor && !isSme">
              <button :class="[
                active ? 'bg-gray-50' : '',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900'
              ]" @click="$emit('edit', program)">
                <PencilSquareIcon :active="active" class="mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                Edit
              </button>
              </MenuItem>
              <MenuItem v-slot="{ active }" v-if="!isInvestor && !isSme">
              <button :class="[
                active ? 'bg-gray-50' : '',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900'
              ]" @click="$emit('manage-smes', program)">
                <UserGroupIcon :active="active" class="mr-2 h-4 w-4 text-gray-500" aria-hidden="true" />
                Manage SMEs ({{ program.smesCount ?? program.smes ?? 0 }})
              </button>
              </MenuItem>
            </div>
            <div class="px-1 py-1" v-if="!isInvestor && !isSme">
              <MenuItem v-slot="{ active }">
              <button :class="[
                active ? 'bg-red-50' : '',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm text-red-600'
              ]" @click="$emit('delete', program.id)">
                <TrashIcon :active="active" class="mr-2 h-4 w-4 text-red-500" aria-hidden="true" />
                Delete
              </button>
              </MenuItem>
            </div>

            <!-- Status Actions -->
            <div class="px-1 py-1" v-if="isAdmin">
              <MenuItem v-slot="{ active }" v-if="program.status !== 'Published'">
              <button :class="[
                active ? 'bg-green-50' : '',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm text-green-700'
              ]" @click="handleStatusChange('Published')">
                <CheckCircleIcon class="mr-2 h-4 w-4 text-green-500" />
                Publish Program
              </button>
              </MenuItem>
              <MenuItem v-slot="{ active }" v-if="program.status === 'Published'">
              <button :class="[
                active ? 'bg-amber-50' : '',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm text-amber-700'
              ]" @click="handleStatusChange('Coming Soon')">
                <XMarkIcon class="mr-2 h-4 w-4 text-amber-500" />
                Unpublish (Draft)
              </button>
              </MenuItem>
              <MenuItem v-slot="{ active }" v-if="program.status !== 'Finished'">
              <button :class="[
                active ? 'bg-blue-50' : '',
                'group flex w-full items-center rounded-md px-2 py-2 text-sm text-blue-700'
              ]" @click="handleStatusChange('Finished')">
                <FlagIcon class="mr-2 h-4 w-4 text-blue-500" />
                Finish / Close
              </button>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </div>

    <div v-if="!program.template && !program.templateName"
      class="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg text-xs font-medium text-orange-700 mb-6 border border-orange-100 flex-shrink-0">
      <DocumentTextIcon class="w-4 h-4 flex-shrink-0" />
      <span>No template assigned</span>
      <button v-if="isAdmin" @click="$emit('edit', program)"
        class="ml-1 text-orange-800 hover:text-orange-900 font-semibold hover:underline">
        Assign now
      </button>
    </div>
    <div v-else
      class="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 text-xs font-medium text-gray-600 mb-6 w-fit flex-shrink-0">
      <DocumentDuplicateIcon class="w-3.5 h-3.5 flex-shrink-0" />
      Template: <span class="text-gray-900 font-medium truncate max-w-[200px]">{{ program.template ??
        program.templateName }}</span>
    </div>

    <!-- Stats Row -->
    <div class="grid grid-cols-4 gap-3 mb-6 flex-shrink-0">
      <div class="bg-gray-50/50 rounded-xl p-3 text-center border border-gray-100/50 flex flex-col justify-center">
        <div class="text-xl font-bold text-gray-900">{{ program.smesCount ?? program.smes ?? 0 }}</div>
        <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">SMEs</div>
      </div>
      <div class="bg-gray-50/50 rounded-xl p-3 text-center border border-gray-100/50 flex flex-col justify-center">
        <div class="text-xl font-bold text-indigo-600">{{ program.investorsCount ?? 0 }}</div>
        <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Investors</div>
      </div>
      <div class="bg-gray-50/50 rounded-xl p-3 text-center border border-gray-100/50 flex flex-col justify-center">
        <div class="text-xl font-bold text-cyan-600">{{ program.avgScore || 0 }}</div>
        <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Avg Score</div>
      </div>
      <div class="bg-gray-50/50 rounded-xl p-3 text-center border border-gray-100/50 flex flex-col justify-center">
        <div class="text-xl font-bold text-green-600">{{ program.progress ?? program.completion ?? 0 }}%</div>
        <div class="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Complete</div>
      </div>
    </div>

    <!-- Progress Bar (Always Show for consistency) -->
    <div class="mb-6 flex-shrink-0">
      <div class="flex justify-between text-xs mb-2">
        <span class="text-gray-500 font-medium tracking-tight">Program Progress</span>
        <span class="text-gray-900 font-bold">{{ program.progress ?? program.completion ?? 0 }}%</span>
      </div>
      <div class="h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-100/50">
        <div class="h-full bg-cyan-500 rounded-full transition-all duration-700"
          :style="{ width: `${program.progress ?? program.completion ?? 0}%` }"></div>
      </div>
    </div>

    <!-- Universal Actions Footer -->
    <div class="flex flex-col gap-4 pt-5 border-t border-gray-50 mt-auto">
      <div class="grid grid-cols-2 gap-4 text-[10px] uppercase tracking-widest font-black text-gray-400">
        <div class="flex flex-col gap-1">
          <span class="flex items-center gap-1.5"><ClockIcon class="w-3 h-3 text-teal-500" /> Registration</span>
          <span class="text-xs text-gray-700 normal-case tracking-tight font-bold">
            {{ formatDate(program.createdAt || program.startDate) }} <span class="text-gray-300 mx-1">→</span> {{ formatDate(program.enrollmentDeadline || program.endDate) }}
          </span>
        </div>
        <div class="flex flex-col gap-1 text-right">
          <span class="flex items-center justify-end gap-1.5"><CalendarIcon class="w-3 h-3 text-indigo-500" /> Program Duration</span>
          <span class="text-xs text-gray-700 normal-case tracking-tight font-bold">
            {{ formatDate(program.startDate) }} <span class="text-gray-300 mx-1">→</span> {{ formatDate(program.endDate) }}
          </span>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <!-- Discussion -->
        <button @click="$emit('discuss', program)"
          class="font-bold text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1.5 px-3 py-2 hover:bg-purple-50 rounded-lg transition-colors">
          <ChatBubbleLeftRightIcon class="w-4 h-4" />
          Discussion
        </button>

        <!-- SME Actions -->
        <template v-if="isSme">
          <div v-if="program.isComingSoon"
            class="px-5 py-2 bg-amber-50 text-amber-700 rounded-lg font-bold border border-amber-100 italic">
            Coming Soon
          </div>
          <button
            v-else-if="(program.enrollmentStatus === 'None' || !program.enrollmentStatus) && !program.isEnrollmentClosed && !program.isFinished"
            @click="$emit('enroll', program)"
            class="px-5 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition-all shadow-md active:scale-95">
            Apply Now
          </button>
          <div v-else-if="program.isFinished"
            class="px-5 py-2 bg-gray-100 text-gray-500 rounded-lg font-bold border border-gray-200">
            Program Finished
          </div>
          <div
            v-else-if="(program.enrollmentStatus === 'None' || !program.enrollmentStatus) && program.isEnrollmentClosed"
            class="px-5 py-2 bg-amber-50 text-amber-700 rounded-lg font-bold border border-amber-100">
            Enrollment Closed
          </div>
          <div v-else-if="program.enrollmentStatus === 'Enrolled' || program.enrollmentStatus === 'Accepted'"
            class="px-5 py-2 bg-teal-50 text-teal-700 rounded-lg font-bold border border-teal-100 flex items-center gap-2">
            <CheckCircleIcon class="w-4 h-4" />
            Enrolled
          </div>
          <div v-else-if="program.enrollmentStatus === 'Applied' || program.enrollmentStatus === 'Pending'"
            class="px-5 py-2 bg-amber-50 text-amber-700 rounded-lg font-bold border border-amber-100">
            Applied
          </div>
          <div v-else-if="program.enrollmentStatus === 'Rejected'"
            class="px-5 py-2 bg-rose-50 text-rose-700 rounded-lg font-bold border border-rose-100">
            Rejected
          </div>
        </template>

        <!-- Investor Actions -->
        <template v-else-if="isInvestor">
          <div v-if="program.isComingSoon"
            class="px-5 py-2 bg-amber-50 text-amber-700 rounded-lg font-bold border border-amber-100 italic">
            Coming Soon
          </div>
          <button v-else-if="!program.isEnrolled && !program.isEnrollmentClosed && !program.isFinished"
            @click="$emit('enroll', program.id)"
            class="px-5 py-2 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-700 transition-all shadow-md active:scale-95">
            Enroll Now
          </button>
          <div v-else-if="!program.isEnrolled && (program.isEnrollmentClosed || program.isFinished)"
            class="px-5 py-2 bg-amber-50 text-amber-700 rounded-lg font-bold border border-amber-100">
            Closed
          </div>
          <div v-else
            class="px-5 py-2 bg-green-50 text-green-700 rounded-lg font-bold border border-green-100 flex items-center gap-2">
            <CheckCircleIcon class="w-4 h-4" />
            Enrolled
          </div>
        </template>

        <!-- Admin Actions -->
        <template v-else-if="isAdmin">
          <NuxtLink :to="`${reportsPath}?programId=${program.id}`"
            class="font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1.5 px-3 py-1.5 hover:bg-cyan-50 rounded-lg transition-colors">
            View Report
            <ArrowLongRightIcon class="w-4 h-4" />
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useAuthStore } from '~/stores/auth.store'
import { useAdminStore } from '~/stores/admin.store'
import { formatDate } from '~/utils/format'
import {
  EllipsisHorizontalIcon,
  DocumentDuplicateIcon,
  ArrowLongRightIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XMarkIcon,
  FlagIcon,
  ClockIcon,
  TagIcon,
  CalendarIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  program: {
    id: number | string
    name: string
    status: string
    description: string
    template?: string
    templateName?: string
    templateId?: string | number
    smesCount?: number
    smes?: number
    investorsCount?: number
    avgScore: number
    progress?: number
    completion?: number
    startDate?: string
    endDate?: string
    duration?: string
    sector?: string
    isEnrolled?: boolean
    enrollmentStatus?: string
    isEnrollmentClosed?: boolean
    isAssessmentPeriodOver?: boolean
    isFinished?: boolean
    isComingSoon?: boolean
    enrollmentDeadline?: string
    createdAt?: string
  }
}>()

const emit = defineEmits(['edit', 'delete', 'view', 'manage-smes', 'discuss', 'enroll'])

// Admin Store for status changes
const adminStore = useAdminStore()

const handleStatusChange = async (newStatus: string) => {
  if (confirm(`Change program status to ${newStatus}?`)) {
    await adminStore.setProgramStatus(props.program.id, newStatus)
  }
}

// Auth Store to determine roles
const authStore = useAuthStore()
const isSme = computed(() => authStore.user?.role === 'SME')
const isInvestor = computed(() => authStore.user?.role === 'INVESTOR')
const isAdmin = computed(() => authStore.user?.role === 'ADMIN')

const reportsPath = computed(() => {
  return isInvestor.value ? '/investor/reports' : '/admin/reports'
})
</script>
