<template>
  <span 
    :class="['inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border border-transparent shadow-sm whitespace-nowrap', badgeClasses]"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="dotClass"></span>
    {{ finalLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  level: string
}>()

const finalLabel = computed(() => {
  if (!props.level) return 'Unknown'
  const l = props.level.toLowerCase()
  if (l === 'low') return 'Low Risk'
  if (l === 'medium') return 'Medium Risk'
  if (l === 'high') return 'High Risk'
  if (l === 'safe') return 'Safe to Invest'
  return props.level
})

const badgeClasses = computed(() => {
  const l = finalLabel.value.toLowerCase()
  if (l.includes('safe') || l.includes('investor ready') || l === 'open' || l === 'active') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  }
  if (l.includes('low') || l.includes('near ready')) {
    return 'bg-teal-50 text-teal-700 border-teal-100'
  }
  if (l.includes('medium') || l.includes('early stage') || l.includes('developing')) {
    return 'bg-amber-50 text-amber-700 border-amber-100'
  }
  if (l.includes('high') || l.includes('pre-investment') || l.includes('needs improvement') || l.includes('paused')) {
    return 'bg-rose-50 text-rose-700 border-rose-100'
  }
  return 'bg-gray-50 text-gray-700 border-gray-100'
})

const dotClass = computed(() => {
  const l = finalLabel.value.toLowerCase()
  if (l.includes('safe') || l.includes('investor ready') || l === 'open' || l === 'active') return 'bg-emerald-500'
  if (l.includes('low') || l.includes('near ready')) return 'bg-teal-500'
  if (l.includes('medium') || l.includes('early stage') || l.includes('developing')) return 'bg-amber-500'
  if (l.includes('high') || l.includes('pre-investment') || l.includes('needs improvement') || l.includes('paused')) return 'bg-rose-500'
  return 'bg-gray-400'
})
</script>
