<template>
  <div
    class="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm transition-all duration-300 group hover:shadow-xl hover:border-teal-100 flex flex-col h-full relative">
    <!-- Status badge -->
    <span :class="[
      'absolute top-6 right-6 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest',
      getStatusClass(program.enrollmentStatus)
    ]">
      {{ program.enrollmentStatus === 'None' ? 'Open' : program.enrollmentStatus }}
    </span>

    <!-- Icon -->
    <div
      class="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center mb-6 group-hover:bg-teal-100 group-hover:scale-110 transition-all">
      <component :is="getIcon(program.name)" class="w-6 h-6 text-teal-600" />
    </div>

    <!-- Enrolled count badge -->
    <div v-if="program.smesCount" class="absolute top-16 right-6 flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-md">
      <UserGroupIcon class="w-3 h-3 text-gray-400" />
      <span class="text-[10px] font-bold text-gray-600">{{ program.smesCount }} Enrolled</span>
    </div>

    <!-- Name & description -->
    <h3
      class="text-lg font-bold text-gray-900 mb-2 tracking-tight group-hover:text-teal-600 transition-colors leading-snug">
      {{ program.name }}
    </h3>
    <p class="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 h-10">{{ program.description }}</p>

    <!-- Program Info Grid -->
    <div class="grid grid-cols-2 gap-y-4 gap-x-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0">
      <div class="flex flex-col gap-1 overflow-hidden">
        <div class="flex items-center gap-1.5 text-gray-500">
          <TagIcon class="w-3.5 h-3.5 shrink-0" />
          <span class="text-[10px] uppercase font-bold tracking-wider">Sector</span>
        </div>
        <span class="font-semibold text-gray-900 text-sm truncate" :title="program.sector || 'General'">{{
          program.sector || 'General' }}</span>
      </div>

      <div class="flex flex-col gap-1 overflow-hidden">
        <div class="flex items-center gap-1.5 text-gray-500">
          <ClockIcon class="w-3.5 h-3.5 shrink-0" />
          <span class="text-[10px] uppercase font-bold tracking-wider">Period</span>
        </div>
        <span class="font-semibold text-gray-900 text-sm truncate" :title="formatProgramDates(program)">{{
          formatProgramDates(program) }}</span>
      </div>

      <div class="flex flex-col gap-1 overflow-hidden">
        <div class="flex items-center gap-1.5 text-gray-500">
          <CurrencyDollarIcon class="w-3.5 h-3.5 shrink-0" />
          <span class="text-[10px] uppercase font-bold tracking-wider">Amount</span>
        </div>
        <span class="font-semibold text-teal-600 text-sm truncate" :title="program.investment_amount || 'TBA'">{{
          program.investment_amount || 'TBA' }}</span>
      </div>

      <div class="flex flex-col gap-1 overflow-hidden">
        <div class="flex items-center gap-1.5 text-gray-500">
          <DocumentDuplicateIcon class="w-3.5 h-3.5 shrink-0" />
          <span class="text-[10px] uppercase font-bold tracking-wider">Template</span>
        </div>
        <span class="font-semibold text-gray-900 text-sm truncate" :title="program.templateName">{{ program.templateName
          || 'None' }}</span>
      </div>
    </div>

    <!-- Benefits Tags -->
    <div v-if="program.benefits && program.benefits.length" class="flex flex-wrap gap-2 mb-8 flex-grow content-start">
      <span v-for="benefit in program.benefits.slice(0, 3)" :key="benefit"
        class="px-2.5 py-1 bg-white border border-gray-200 text-gray-600 text-[10px] font-semibold rounded-md group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors tracking-tight">
        {{ benefit }}
      </span>
      <span v-if="program.benefits.length > 3"
        class="px-2.5 py-1 bg-gray-50 border border-gray-100 text-gray-400 text-[10px] font-medium rounded-md tracking-tight">
        +{{ program.benefits.length - 3 }} more
      </span>
    </div>

    <!-- Progress Bar (If Enrolled) -->
    <div v-if="program.enrollmentStatus !== 'None' && program.enrollmentStatus !== 'Applied'" class="mb-8">
      <div class="flex justify-between text-[10px] mb-1.5 font-bold uppercase tracking-wider">
        <span class="text-gray-400">Program Progress</span>
        <span class="text-teal-600">{{ program.progress || 0 }}%</span>
      </div>
      <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div class="h-full bg-teal-500 rounded-full transition-all duration-1000"
          :style="{ width: `${program.progress || 0}%` }"></div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="flex gap-3 mt-auto pt-6 border-t border-gray-50">
      <button @click="$emit('view', program)"
        class="flex-1 py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center transition-all bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200">
        <EyeIcon class="w-4 h-4 mr-1.5" />
        Details
      </button>

      <button v-if="program.enrollmentStatus === 'None'" @click="$emit('enroll', program)"
        class="flex-1 py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center transition-all bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/10 active:scale-95">
        Apply Now
        <ArrowRightIcon class="w-4 h-4 ml-1.5" />
      </button>

      <div v-else
        class="flex-1 py-3 px-4 rounded-lg font-bold text-sm flex items-center justify-center bg-gray-50 text-teal-600 border border-teal-50 italic">
        {{ program.enrollmentStatus }}
        <CheckCircleIcon class="w-4 h-4 ml-1.5" />
      </div>
    </div>

    <!-- Quick Discussion link -->
    <div class="flex items-center justify-between text-xs text-gray-500 pt-4 mt-2 border-t border-gray-50">
      <button @click="$emit('discuss', program)"
        class="font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
        <ChatBubbleLeftRightIcon class="w-4 h-4" />
        Discussion
      </button>
      <span class="text-gray-400">Join the conversation</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  TagIcon,
  ClockIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BeakerIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CpuChipIcon,
  SparklesIcon,
  RocketLaunchIcon,
  HeartIcon,
  BuildingOfficeIcon,
  UserGroupIcon
} from '@heroicons/vue/24/outline'
import { formatDate } from '~/utils/format'

const props = defineProps<{
  program: {
    id: number | string
    name: string
    description: string
    status: string
    sector: string
    investment_amount: string
    benefits: string[]
    startDate: string
    endDate: string
    templateName: string
    enrollmentStatus: string
    progress?: number
    smesCount?: number
  }
}>()

defineEmits(['enroll', 'view', 'discuss'])

const getStatusClass = (status: string) => {
  switch (status) {
    case 'Accepted': return 'bg-green-100 text-green-700'
    case 'Enrolled': return 'bg-teal-100 text-teal-700 font-bold'
    case 'Applied': return 'bg-amber-100 text-amber-700'
    case 'Rejected': return 'bg-red-100 text-red-700'
    case 'Finished': return 'bg-purple-100 text-purple-700'
    default: return 'bg-teal-100 text-teal-700'
  }
}

const getIcon = (name: string) => {
  const n = name.toLowerCase()
  if (n.includes('digit') || n.includes('tech')) return CpuChipIcon
  if (n.includes('green') || n.includes('sustain') || n.includes('agri')) return SparklesIcon
  if (n.includes('accelerate') || n.includes('growth')) return RocketLaunchIcon
  if (n.includes('women')) return HeartIcon
  if (n.includes('real estate') || n.includes('prop')) return BuildingOfficeIcon
  return BeakerIcon
}

const formatProgramDates = (program: any) => {
  if (program.startDate && program.endDate) {
    return `${formatDate(program.startDate)} - ${formatDate(program.endDate)}`
  }
  return 'Coming Soon'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
