<template>
    <div class="bg-white p-6 rounded-lg border border-gray-200">
        <h3 class="text-lg font-bold text-gray-900 mb-8">Risk Distribution by Pillar</h3>

        <div class="space-y-6">
            <div v-for="pillar in riskByPillarData" :key="pillar.name" class="space-y-2 group">
                <div class="flex items-center justify-between text-xs transition-opacity duration-200"
                    :class="pillar.avg < 60 ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'">
                    <span class="font-bold text-gray-700">{{ pillar.name }}</span>
                    <div class="flex items-center gap-4">
                        <span class="text-gray-400">Min: {{ pillar.min }}</span>
                        <span class="text-cyan-600 font-bold">Avg: {{ pillar.avg }}</span>
                        <span class="text-gray-400">Max: {{ pillar.max }}</span>
                    </div>
                </div>
                <div class="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <!-- Max range track -->
                    <div class="absolute h-full bg-gray-200 rounded-full opacity-40 transition-all duration-700"
                        :style="{ left: pillar.min + '%', width: (pillar.max - pillar.min) + '%' }"></div>
                    <!-- Average line -->
                    <div class="absolute h-full bg-cyan-500 rounded-full transition-all duration-700"
                        :style="{ width: pillar.avg + '%' }"></div>
                    <!-- Min indicator -->
                    <div class="absolute h-full w-1 bg-navy-900 z-10" :style="{ left: pillar.min + '%' }"></div>
                </div>
            </div>
        </div>

        <!-- Legend -->
        <div class="mt-8 flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
            <div class="flex items-center gap-2">
                <div class="w-2.5 h-1 bg-navy-900"></div>
                <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Min Score</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-10 h-1 bg-gray-200 opacity-60"></div>
                <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Range (Min-Max)</span>
            </div>
            <div class="flex items-center gap-2">
                <div class="w-10 h-1 bg-cyan-500"></div>
                <span class="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Average Score</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    riskByPillarData: any[]
}>()
</script>
