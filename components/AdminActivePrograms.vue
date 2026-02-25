<template>
  <div class="bg-white rounded-lg shadow-soft p-6">
    <h3 class="font-semibold text-gray-900 mb-4">Active Programs</h3>
    <div class="space-y-4">
      <div v-for="program in adminStore.programs" :key="program.id"
        class="p-4 border border-gray-100 rounded-md hover:border-cyan-100 transition-colors">
        <h4 class="font-medium text-gray-900">{{ program.name }}</h4>
        <p class="text-sm text-gray-500 mt-1">{{ program.smesCount }} SMEs enrolled</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/stores/admin.store'

const adminStore = useAdminStore()
</script>
