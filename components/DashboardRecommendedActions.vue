<template>
  <div class="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2 py-2">
    <div v-for="action in actions" :key="action.id" :class="[getBorderColor(action.priority)]"
      class="bg-white border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-300 cursor-pointer group"
      @click="navigateTo('/sme/goals')">

      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <div :class="getIconBg(action.priority)" class="p-1.5 rounded-md">
            <ExclamationTriangleIcon :class="getIconColor(action.priority)" class="w-4 h-4" />
          </div>
          <span :class="getTextColor(action.priority)" class="text-[10px] font-bold uppercase tracking-wider">
            {{ action.priority }} Priority
          </span>
        </div>
        <div class="flex items-center gap-1 text-teal-600 font-bold text-xs bg-teal-50 px-2 py-1 rounded-full">
          <ArrowTrendingUpIcon class="w-3.5 h-3.5" />
          +{{ action.impact }}
        </div>
      </div>

      <h4 class="font-bold text-gray-900 text-sm mb-1 group-hover:text-teal-600 transition-colors">
        {{ action.title }}
      </h4>
      <p class="text-xs text-gray-500 mb-4 line-clamp-2">
        {{ action.description }}
      </p>

      <div class="flex items-center justify-between pt-3 border-t border-gray-50">
        <span class="text-[10px] font-medium text-gray-400 uppercase tracking-wide bg-gray-50 px-2 py-0.5 rounded">
          {{ action.pillar }}
        </span>
        <span class="text-[10px] font-bold text-teal-600 group-hover:underline">
          Create Goal &rarr;
        </span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="actions.length === 0" class="text-center py-8">
      <CheckCircleIcon class="w-12 h-12 text-green-500 mx-auto mb-3" />
      <p class="text-gray-600 font-medium">All caught up!</p>
      <p class="text-sm text-gray-500">No pending actions at the moment</p>
    </div>
  </div>
</template>

<script>
import PriorityBadge from '~/components/BasePriorityBadge.vue'
import {
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'RecommendedActions',
  components: {
    PriorityBadge,
    ExclamationTriangleIcon,
    ArrowTrendingUpIcon,
    CheckCircleIcon
  },
  props: {
    actions: {
      type: Array,
      required: true
    }
  },
  methods: {
    getBorderColor(priority) {
      const colors = {
        high: 'border-l-rose-500',
        medium: 'border-l-orange-500',
        low: 'border-l-yellow-400'
      }
      return colors[priority] || 'border-l-gray-300'
    },
    getIconBg(priority) {
      const colors = {
        high: 'bg-rose-50',
        medium: 'bg-orange-50',
        low: 'bg-yellow-50'
      }
      return colors[priority] || 'bg-gray-50'
    },
    getIconColor(priority) {
      const colors = {
        high: 'text-rose-600',
        medium: 'text-orange-600',
        low: 'text-yellow-600'
      }
      return colors[priority] || 'text-gray-600'
    },
    getTextColor(priority) {
      const colors = {
        high: 'text-rose-600',
        medium: 'text-orange-600',
        low: 'text-yellow-600'
      }
      return colors[priority] || 'text-gray-600'
    }
  }
}
</script>
