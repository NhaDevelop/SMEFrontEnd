<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
          <th class="py-3 pl-2">Pillar</th>
          <th class="py-3">Score</th>
          <th class="py-3">Risk Level</th>
          <th class="py-3 text-right pr-2">Improvement Potential</th>
        </tr>
      </thead>
      <tbody class="text-sm">
        <tr v-for="pillar in pillars" :key="pillar.id"
          class="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
          <!-- Pillar Name -->
          <td class="py-3 pl-2 font-medium text-gray-700">
            {{ pillar.name }}
          </td>

          <!-- Score -->
          <td class="py-3 w-32">
            <div class="flex items-center gap-3">
              <div class="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden flex shrink-0">
                <div class="h-full rounded-full transition-all duration-500" :class="getScoreColor(pillar.score)"
                  :style="{ width: `${pillar.score}%` }"></div>
              </div>
              <span class="font-semibold text-gray-700 w-6 text-right">{{ pillar.score }}</span>
            </div>
          </td>

          <!-- Risk Level Badge -->
          <td class="py-3">
            <RiskBadge :level="pillar.riskLevel" class="scale-90 origin-left" />
          </td>

          <!-- Improvement Potential -->
          <td class="py-3 text-right pr-2 cursor-pointer" @click="goToWhatIf(pillar.id)">
            <div
              class="inline-flex items-center gap-1.5 font-medium text-teal-600 transition-colors group-hover:text-teal-700">
              <ArrowTrendingUpIcon class="w-3.5 h-3.5" />
              <span>+{{ pillar.improvementPotential }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import RiskBadge from '~/components/BaseRiskBadge.vue'
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
  data() {
    return {
      thresholds: []
    }
  },
  async mounted() {
    try {
      const settings = await $fetch('/api/admin/settings')
      if (settings && settings.thresholds) {
        this.thresholds = settings.thresholds
      }
    } catch (e) {
      // Slient fallback
    }
  },
  methods: {
    getScoreColor(score) {
      const matched = this.thresholds.find(t => score >= t.min && score <= t.max)
      if (matched) return matched.colorBg || 'bg-emerald-500'

      if (score >= 70) return 'bg-emerald-500'
      if (score >= 40) return 'bg-amber-500'
      return 'bg-rose-500'
    },
    goToWhatIf(pillarId) {
      navigateTo({
        path: '/sme/what-if',
        query: { pillar: pillarId }
      })
    }
  }
}
</script>
