<template>
  <div class="space-y-8">
    <div>
      <h3 class="font-bold text-gray-900 mb-6">Pillar Weights</h3>
      <div class="space-y-5">
        <div v-for="pillar in pillars" :key="pillar.id" class="flex items-center gap-4">
          <span class="text-sm font-medium text-gray-600 w-48">{{ pillar.name }}</span>
          <div class="flex-1 relative flex items-center">
            <input type="range" v-model="pillar.weight" min="0" max="100" step="0.5"
              class="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#198754] [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:hover:scale-110 transition-all" />
          </div>
          <span class="text-sm font-medium text-gray-900 w-12 text-right">{{ Number(pillar.weight).toFixed(1) }}%</span>
        </div>
      </div>
    </div>

    <!-- Thresholds Preview -->
    <div class="pt-2">
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-bold text-gray-900">Score Thresholds</h3>
      </div>
      <div v-if="adminStore.frameworkThresholds?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="t in adminStore.frameworkThresholds" :key="t.id"
          :class="['p-4 rounded-xl border transition-all hover:shadow-sm', getThresholdClasses(t.colorBg)]">
          <div class="font-medium text-sm mb-2 opacity-80">{{ t.label }}</div>
          <div class="font-bold text-2xl">
            {{ formatScore(t) }}
          </div>
        </div>
      </div>
      <div v-else class="grid grid-cols-2 gap-4 opacity-50">
        <!-- Fallback/Loading state removed for brevity as per instructions to be concise -->
        <div class="p-5 bg-gray-50 rounded-xl border border-gray-100 animate-pulse h-20"></div>
        <div class="p-5 bg-gray-50 rounded-xl border border-gray-100 animate-pulse h-20"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useAdminStore } from '~/stores/admin.store'

const adminStore = useAdminStore()

// Local copy for dragging/interaction
const pillars = ref<any[]>([])

// Sync local state when store data changes
watch(() => adminStore.frameworkSettings, (newVal) => {
  if (newVal && newVal.length > 0) {
    pillars.value = JSON.parse(JSON.stringify(newVal))
  }
}, { immediate: true, deep: true })

const totalWeight = computed(() => {
  return pillars.value.reduce((sum: number, p: any) => sum + Number(p.weight), 0)
})

const isTotalValid = computed(() => Math.abs(totalWeight.value - 100) < 0.1)

const saveSettings = async () => {
  if (!isTotalValid.value) {
    alert('Total weight must equal 100% before saving.')
    return
  }
  try {
    await adminStore.updateFrameworkSettings({ pillars: pillars.value })
    alert('Settings saved successfully!')
  } catch (e) {
    alert('Failed to save settings')
  }
}

const colorMap: Record<string, string> = {
  'bg-emerald-500': 'bg-emerald-50 border-emerald-200 text-emerald-700',
  'bg-green-500': 'bg-green-50 border-green-200 text-green-700',
  'bg-amber-500': 'bg-amber-50 border-amber-200 text-amber-700',
  'bg-yellow-500': 'bg-yellow-50 border-yellow-200 text-yellow-700',
  'bg-teal-500': 'bg-teal-50 border-teal-200 text-teal-700',
  'bg-cyan-500': 'bg-cyan-50 border-cyan-200 text-cyan-700',
  'bg-blue-500': 'bg-blue-50 border-blue-200 text-blue-700',
  'bg-red-500': 'bg-red-50 border-red-200 text-red-700',
  'bg-rose-500': 'bg-rose-50 border-rose-200 text-rose-700',
}

const getThresholdClasses = (colorBg: string) => {
  return colorMap[colorBg] || 'bg-gray-50 border-gray-200 text-gray-700'
}

const formatScore = (t: any) => {
  if (t.max === 100 && t.min > 0) return `≥ ${t.min}`
  if (t.min === 0 && t.max < 100) return `< ${t.max + 1}`
  return `${t.min} - ${t.max}`
}
</script>
