<template>
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BuildingOfficeIcon class="w-5 h-5 text-gray-500" />
            Company Information
        </h3>
        <p class="text-sm text-gray-500 mt-1">Overview of the SME profile</p>
      </div>
      <span class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Pending</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <!-- Sector -->
        <div class="bg-gray-50 p-4 rounded-lg flex items-start gap-4">
            <div class="p-2 bg-teal-100 rounded text-teal-600">
                <BuildingOfficeIcon class="w-5 h-5" />
            </div>
            <div>
                <p class="text-xs text-gray-500 font-medium">Sector</p>
                <p class="text-base font-bold text-gray-900">{{ sme.industry }}</p>
            </div>
        </div>

        <!-- Location -->
        <div class="bg-gray-50 p-4 rounded-lg flex items-start gap-4">
            <div class="p-2 bg-teal-100 rounded text-teal-600">
                <MapPinIcon class="w-5 h-5" />
            </div>
            <div>
                <p class="text-xs text-gray-500 font-medium">Location</p>
                <p class="text-base font-bold text-gray-900">{{ sme.location }}</p>
            </div>
        </div>

        <!-- Last Assessment -->
        <div class="bg-gray-50 p-4 rounded-lg flex items-start gap-4">
             <div class="p-2 bg-teal-100 rounded text-teal-600">
                <CalendarIcon class="w-5 h-5" />
            </div>
            <div>
                <p class="text-xs text-gray-500 font-medium">Last Assessment</p>
                <p class="text-base font-bold text-gray-900">{{ sme.lastAssessed }}</p>
            </div>
        </div>

        <!-- Total Assessments -->
        <div class="bg-gray-50 p-4 rounded-lg flex items-start gap-4">
             <div class="p-2 bg-teal-100 rounded text-teal-600">
                <ChartBarIcon class="w-5 h-5" />
            </div>
            <div>
                <p class="text-xs text-gray-500 font-medium">Total Assessments</p>
                <p class="text-base font-bold text-gray-900">2 completed</p>
            </div>
        </div>

        <!-- Growth Potential -->
        <div class="bg-gray-50 p-4 rounded-lg flex items-start gap-4">
             <div class="p-2 bg-teal-100 rounded text-teal-600">
                <ArrowTrendingUpIcon class="w-5 h-5" />
            </div>
            <div>
                <p class="text-xs text-gray-500 font-medium">Growth Potential</p>
                <p class="text-base font-bold text-gray-900">{{ sme.growthPotential }}/100</p>
            </div>
        </div>

         <!-- Financial Risk -->
        <div class="bg-gray-50 p-4 rounded-lg flex items-start gap-4">
             <div class="p-2 bg-teal-100 rounded text-teal-600">
                <ShieldCheckIcon class="w-5 h-5" />
            </div>
            <div>
                <p class="text-xs text-gray-500 font-medium">Financial Risk</p>
                <p class="text-base font-bold text-gray-900">{{ sme.financialRisk || 'Low' }}</p>
            </div>
        </div>
    </div>

    <div class="mt-8 pt-8 border-t border-gray-100 grid grid-cols-4 text-center divide-x divide-gray-100">
        <div>
            <span class="text-3xl font-bold text-teal-600">{{ sme.score }}</span>
            <p class="text-xs text-gray-500 mt-1">Readiness Score</p>
        </div>
         <div>
            <span class="text-3xl font-bold text-gray-900">87</span>
            <p class="text-xs text-gray-500 mt-1">Highest Pillar</p>
        </div>
         <div>
            <span class="text-3xl font-bold text-amber-600">33</span>
            <p class="text-xs text-gray-500 mt-1">Lowest Pillar</p>
        </div>
         <div>
            <span class="text-3xl font-bold text-gray-900">5</span>
            <p class="text-xs text-gray-500 mt-1">Action Items</p>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
    BuildingOfficeIcon, 
    MapPinIcon, 
    CalendarIcon,
    ChartBarIcon,
    ArrowTrendingUpIcon,
    ShieldCheckIcon
} from '@heroicons/vue/24/outline'

defineProps<{
    sme: any
}>()
</script>
