<template>
  <div class="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
    <div 
      v-for="action in actions" 
      :key="action.id"
      :class="getBorderColor(action.priority)"
      class="border-l-4 bg-gray-50 rounded-r-lg p-4 hover:bg-gray-100 transition-smooth"
    >
      <!-- Header -->
      <div class="flex items-start gap-3 mb-2">
        <ExclamationTriangleIcon class="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
        <div class="flex-1 min-w-0">
          <h4 class="font-semibold text-gray-900 text-sm mb-1">
            {{ action.title }}
          </h4>
          <p class="text-xs text-gray-600 line-clamp-2">
            {{ action.description }}
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
        <div class="flex items-center gap-2">
          <PriorityBadge :priority="action.priority" />
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span class="text-gray-600">{{ action.pillar }}</span>
          <span class="flex items-center gap-1 text-green-600 font-semibold">
            <ArrowTrendingUpIcon class="w-4 h-4" />
            +{{ action.impact }}
          </span>
        </div>
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
import PriorityBadge from '@/components/common/PriorityBadge.vue'
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
        high: 'border-red-500',
        medium: 'border-orange-500',
        low: 'border-yellow-500'
      }
      return colors[priority] || 'border-gray-300'
    }
  }
}
</script>
