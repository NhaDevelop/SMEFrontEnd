<template>
  <div class="overflow-x-auto">
    <!-- Weak Pillars Warning Section -->
    <div v-if="weakPillarsList.length > 0" class="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
      <div class="flex items-start gap-3">
        <div class="p-1.5 bg-amber-100 rounded-full shrink-0">
          <ExclamationTriangleIcon class="w-4 h-4 text-amber-600" />
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-semibold text-amber-800 mb-1">Attention Needed</h4>
          <p class="text-xs text-amber-700 mb-2">
            {{ weakPillarsList.length }} pillar{{ weakPillarsList.length > 1 ? 's' : '' }} {{ weakPillarsList.length > 1 ? 'are' : 'is' }} underperforming and need improvement:
          </p>
          <div class="flex flex-wrap gap-2">
            <span v-for="pillar in weakPillarsList" :key="pillar.id" 
              class="px-2 py-1 bg-white text-amber-700 text-xs font-medium rounded border border-amber-200">
              {{ pillar.name }} ({{ formatNumber(pillar.score) }})
            </span>
          </div>
          <p class="text-xs text-amber-600 mt-2">
            Click on any pillar's improvement potential to see recommended actions.
          </p>
        </div>
      </div>
    </div>

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
        <tr v-for="pillar in pillarsCapped" :key="pillar.id"
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
              <span>+{{ pillar.improvementPotential }}%</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import RiskBadge from '~/components/BaseRiskBadge.vue'
import { ArrowTrendingUpIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { formatNumber } from '~/utils/format'

export default {
  name: 'PillarSummary',
  components: {
    RiskBadge,
    ArrowTrendingUpIcon,
    ExclamationTriangleIcon
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
      const settings = await useApi()('/sme/settings')
      if (settings && settings.thresholds) {
        this.thresholds = settings.thresholds
      }
    } catch (e) {
      // Silent fallback
    }
  },
  computed: {
    // Clamp ALL pillar scores to 0–100 regardless of what backend returns.
    // This protects against old assessment data where option points exceeded question weights.
    pillarsCapped() {
      return (this.pillars || []).map(p => ({
        ...p,
        score: Math.min(100, Math.max(0, parseFloat(p.score) || 0))
      }))
    },
    weakPillarsList() {
      const threshold = this.thresholds.find(t => t.id === 'early')?.min || 40
      return this.pillarsCapped.filter(p => p.score < threshold)
    }
  },
  methods: {
    getScoreColor(score) {
      const matched = this.thresholds.find(t => score >= t.min && score <= t.max)
      if (matched) return matched.colorBg || 'bg-emerald-500'
      return score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500'
    },
    formatNumber(value) {
      if (value === null || value === undefined) return '0'
      const num = typeof value === 'string' ? parseFloat(value) : value
      if (isNaN(num)) return '0'
      if (Number.isInteger(num)) return num.toString()
      return parseFloat(num.toFixed(2)).toString()
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
