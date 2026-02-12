<template>
  <div class="bg-white rounded-xl shadow-soft p-6">
    <h3 class="font-semibold text-gray-900 mb-4">Active Programs</h3>
    <div class="space-y-4">
      <div 
        v-for="program in programs" 
        :key="program.id"
        class="p-4 border border-gray-100 rounded-lg hover:border-cyan-100 transition-colors"
      >
        <h4 class="font-medium text-gray-900">{{ program.name }}</h4>
        <p class="text-sm text-gray-500 mt-1">{{ program.enrolled }} SMEs enrolled</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const programs = [
  { id: 1, name: 'SME Growth Accelerator 2024', enrolled: 12 },
  { id: 2, name: 'FinTech Innovation Fund', enrolled: 8 },
  { id: 3, name: 'AgriTech Scale-up', enrolled: 5 }
]
</script>
