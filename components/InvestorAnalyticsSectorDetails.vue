<template>
    <div class="bg-white p-6 rounded-lg border border-gray-200">
        <h3 class="text-lg font-bold text-gray-900 mb-8">Sector Breakdown Dashboard</h3>

        <div class="overflow-x-auto overflow-y-auto max-h-[400px] custom-scrollbar">
            <table class="w-full text-left text-sm border-collapse">
                <thead class="sticky top-0 bg-white z-20">
                    <tr class="text-xs text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100 pb-4">
                        <th class="py-4 pr-6">Industry Sector</th>
                        <th class="py-4 px-6 text-center">SMEs</th>
                        <th class="py-4 px-6 text-center">Avg. Readiness</th>
                        <th class="py-4 px-6 text-center">Growth Potential</th>
                        <th class="py-4 pl-6 text-right">High Risk (%)</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <tr v-for="sector in sectorDetails" :key="sector.name"
                        class="group hover:bg-gray-50 transition-colors">
                        <td class="py-5 pr-6 font-bold text-gray-900">
                            {{ sector.name }}
                        </td>
                        <td class="py-5 px-6 text-center">
                            <span class="bg-gray-100 text-gray-900 px-3 py-1 rounded-full font-bold text-xs">{{
                                sector.count }}</span>
                        </td>
                        <td class="py-5 px-6 text-center">
                            <div class="flex flex-col items-center gap-2">
                                <span class="font-bold text-gray-900">{{ sector.avgReadiness }}</span>
                                <div class="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full transition-all duration-700" :class="[
                                        sector.avgReadiness >= 75 ? 'bg-emerald-500' :
                                            sector.avgReadiness >= 50 ? 'bg-cyan-500' : 'bg-amber-500'
                                    ]" :style="{ width: sector.avgReadiness + '%' }"></div>
                                </div>
                            </div>
                        </td>
                        <td class="py-5 px-6 text-center font-bold text-gray-900">
                            {{ sector.avgGrowth }}%
                        </td>
                        <td class="py-5 pl-6 text-right font-bold"
                            :class="sector.highRisk > 50 ? 'text-rose-600' : 'text-emerald-600'">
                            {{ sector.highRisk }}%
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    sectorDetails: any[]
}>()
</script>
