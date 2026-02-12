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
      <h3 class="font-bold text-gray-900 mb-6">Score Thresholds</h3>
      <div class="grid grid-cols-2 gap-4">
        <!-- Investor Ready -->
        <div class="p-5 bg-emerald-50 rounded-xl border border-emerald-100">
          <div class="text-emerald-800 font-medium text-sm mb-1">Investor Ready</div>
          <div class="text-emerald-600 font-bold text-xl">≥ 80</div>
        </div>

        <!-- Near Ready -->
        <div class="p-5 bg-sky-50 rounded-xl border border-sky-100">
          <div class="text-sky-800 font-medium text-sm mb-1">Near Ready</div>
          <div class="text-sky-600 font-bold text-xl">60 - 79</div>
        </div>

        <!-- Early Stage -->
        <div class="p-5 bg-amber-50 rounded-xl border border-amber-100">
          <div class="text-amber-800 font-medium text-sm mb-1">Early Stage</div>
          <div class="text-amber-600 font-bold text-xl">40 - 59</div>
        </div>

        <!-- Pre-Investment -->
        <div class="p-5 bg-rose-50 rounded-xl border border-rose-100">
          <div class="text-rose-800 font-medium text-sm mb-1">Pre-Investment</div>
          <div class="text-rose-600 font-bold text-xl">&lt; 40</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAdminStore } from '~/stores/admin.store'

const adminStore = useAdminStore()

// Create a local copy for immediate reactivity/dragging
const pillars = ref(JSON.parse(JSON.stringify(adminStore.frameworkSettings)))

const totalWeight = computed(() => {
  return pillars.value.reduce((sum: number, p: any) => sum + Number(p.weight), 0)
})

const isTotalValid = computed(() => Math.abs(totalWeight.value - 100) < 0.1)

const saveSettings = async () => {
  try {
    await adminStore.updateFrameworkSettings(pillars.value)
    alert('Settings saved successfully!')
  } catch (e) {
    alert('Failed to save settings')
  }
}
</script>
