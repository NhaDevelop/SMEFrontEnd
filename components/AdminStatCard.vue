<template>
  <div class="bg-white rounded-lg shadow-soft p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-gray-500 font-medium text-sm">{{ title }}</h3>
      <div v-if="icon" class="p-2 rounded-md bg-gray-50 text-gray-500">
        <component :is="icon" class="w-5 h-5" />
      </div>
      <slot name="action"></slot>
    </div>
    <div class="flex items-baseline gap-2">
      <span class="text-3xl font-bold text-gray-900">{{ value }}</span>
      <span v-if="subValue" class="text-sm text-gray-500">{{ subValue }}</span>
    </div>
    <div v-if="trend" class="mt-2 text-xs flex items-center gap-1">
      <span :class="trendIsPositive ? 'text-green-600' : 'text-red-600'">{{ trend }}</span>
      <span class="text-gray-400">vs last period</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  value: string | number
  subValue?: string
  icon?: Component
  trend?: string
  trendIsPositive?: boolean
}>()
</script>
