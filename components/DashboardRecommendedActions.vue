<template>
  <div class="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2 py-2">
    <div v-for="action in actions" :key="action.id" :class="getCardClasses(action.pillarRisk || action.priority)"
      class="border-l-4 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
      @click="action.type === 'onboarding' ? navigateTo('/sme/assessment') : navigateTo('/sme/goals')">

      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <div :class="getIconBg(action.pillarRisk || action.priority)" class="p-1.5 rounded-md">
            <ExclamationTriangleIcon :class="getIconColor(action.pillarRisk || action.priority)" class="w-4 h-4" />
          </div>
          <span :class="getTextColor(action.pillarRisk || action.priority)"
            class="text-[10px] font-bold uppercase tracking-wider">
            {{ action.pillarRisk || action.priority }} Priority
          </span>
        </div>
        <div :class="getImpactBadge(action.pillarRisk || action.priority)"
          class="flex items-center gap-1 font-bold text-xs px-2 py-1 rounded-full">
          <ArrowTrendingUpIcon class="w-3.5 h-3.5" />
          +{{ action.impact }}
        </div>
      </div>

      <h4 class="font-bold text-gray-900 text-sm mb-1 group-hover:text-teal-600 transition-colors">
        {{ action.title }}
      </h4>
      <p class="text-[11px] text-gray-600 mb-3 opacity-90">
        {{ action.description }}
      </p>

      <div class="space-y-2 mb-4 bg-white/50 p-2.5 rounded border border-white">
        <div class="flex items-start gap-2">
          <span class="shrink-0 text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">You:</span>
          <span class="text-xs font-semibold text-gray-800">{{ action.userAnswer }}</span>
        </div>
        <div v-if="action.bestOption" class="flex items-start gap-2 pt-2 border-t border-gray-200/60">
          <span class="shrink-0 text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">Target:</span>
          <span class="text-xs font-semibold text-emerald-800">{{ action.bestOption }}</span>
        </div>
      </div>

      <div :class="getDividerColor(action.pillarRisk || action.priority)"
        class="flex items-center justify-between pt-3 border-t">
        <span v-if="action.pillar && action.pillar.toLowerCase() !== 'general'"
          :class="getPillarTagClasses(action.pillarRisk || action.priority)"
          class="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded">
          {{ action.pillar }}
        </span>
        <span v-else></span>
        <span v-if="action.type === 'onboarding'" class="text-[10px] font-bold text-teal-600 group-hover:underline">
          Enroll &amp; Start &rarr;
        </span>
        <span v-else class="text-[10px] font-bold text-teal-600 group-hover:underline">
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
import {
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'RecommendedActions',
  components: {
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
    getCardClasses(priority) {
      const map = {
        high: 'bg-rose-50 border-l-rose-500 border border-rose-100',
        medium: 'bg-amber-50 border-l-amber-400 border border-amber-200',
        low: 'bg-emerald-50 border-l-emerald-500 border border-emerald-100'
      }
      return map[priority] || 'bg-white border-l-gray-300 border border-gray-100'
    },
    getIconBg(priority) {
      return { high: 'bg-rose-100', medium: 'bg-amber-200', low: 'bg-emerald-100' }[priority] || 'bg-gray-100'
    },
    getIconColor(priority) {
      return { high: 'text-rose-600', medium: 'text-amber-700', low: 'text-emerald-600' }[priority] || 'text-gray-600'
    },
    getTextColor(priority) {
      return { high: 'text-rose-600', medium: 'text-amber-700', low: 'text-emerald-600' }[priority] || 'text-gray-600'
    },
    getImpactBadge(priority) {
      return { high: 'bg-rose-100 text-rose-700', medium: 'bg-amber-200 text-amber-800', low: 'bg-emerald-100 text-emerald-700' }[priority] || 'bg-gray-100 text-gray-700'
    },
    getDividerColor(priority) {
      return { high: 'border-rose-200', medium: 'border-amber-200', low: 'border-emerald-100' }[priority] || 'border-gray-100'
    },
    getPillarTagClasses(priority) {
      return { high: 'bg-rose-100 text-rose-600', medium: 'bg-amber-200 text-amber-700', low: 'bg-emerald-100 text-emerald-600' }[priority] || 'bg-gray-100 text-gray-500'
    }
  }
}
</script>
