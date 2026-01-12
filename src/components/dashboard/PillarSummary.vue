<template>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          <th class="pb-3">Pillar</th>
          <th class="pb-3">Score</th>
          <th class="pb-3">Risk Level</th>
          <th class="pb-3">Improvement Potential</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr 
          v-for="pillar in pillars" 
          :key="pillar.id"
          class="hover:bg-gray-50 transition-colors"
        >
          <!-- Pillar Name -->
          <td class="py-4 pr-4">
            <div class="font-medium text-gray-900">{{ pillar.name }}</div>
          </td>

          <!-- Score with Progress Bar -->
          <td class="py-4 pr-4">
            <div class="flex items-center gap-3">
              <div class="flex-1 max-w-[120px]">
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    :class="getScoreColor(pillar.score)"
                    :style="{ width: `${pillar.score}%` }"
                    class="h-full rounded-full transition-all duration-500"
                  ></div>
                </div>
              </div>
              <span class="text-sm font-semibold text-gray-700 min-w-[2rem]">
                {{ pillar.score }}
              </span>
            </div>
          </td>

          <!-- Risk Level Badge -->
          <td class="py-4 pr-4">
            <RiskBadge :level="pillar.riskLevel" />
          </td>

          <!-- Improvement Potential -->
          <td class="py-4">
            <div class="flex items-center gap-1 text-sm font-medium text-cyan-600">
              <ArrowTrendingUpIcon class="w-4 h-4" />
              <span>+{{ pillar.improvementPotential }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import RiskBadge from '@/components/common/RiskBadge.vue'
import { ArrowTrendingUpIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'PillarSummary',
  components: {
    RiskBadge,
    ArrowTrendingUpIcon
  },
  props: {
    pillars: {
      type: Array,
      required: true
    }
  },
  methods: {
    getScoreColor(score) {
      if (score >= 70) return 'bg-green-500'
      if (score >= 60) return 'bg-orange-500'
      return 'bg-red-500'
    }
  }
}
</script>
