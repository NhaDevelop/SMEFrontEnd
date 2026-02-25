<template>
    <div class="relative h-[400px] w-full pl-8 pb-8">
        <!-- Chart area with border -->
        <div class="absolute left-8 top-0 right-0 bottom-8 border-l-2 border-b-2 border-gray-200 overflow-visible">
            <!-- Background Zones (Quadrants) -->
            <!-- Top-left: Low Risk, High Growth (IDEAL - Green/Cyan) -->
            <div class="absolute left-0 top-0 w-1/2 h-1/2 bg-gradient-to-br from-emerald-50 to-emerald-100/30">
            </div>

            <!-- Top-right: High Risk, High Growth (CAUTION - Amber) -->
            <div class="absolute right-0 top-0 w-1/2 h-1/2 bg-gradient-to-bl from-amber-50 to-amber-100/30">
            </div>

            <!-- Bottom-left: Low Risk, Low Growth (NEUTRAL - Blue) -->
            <div class="absolute left-0 bottom-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-50/50 to-blue-100/20">
            </div>

            <!-- Bottom-right: High Risk, Low Growth (AVOID - Rose) -->
            <div class="absolute right-0 bottom-0 w-1/2 h-1/2 bg-gradient-to-tl from-rose-50 to-rose-100/30">
            </div>

            <!-- Horizontal grid lines -->
            <div class="absolute left-0 right-0 top-0 border-b border-gray-200/50"></div>
            <div class="absolute left-0 right-0 top-1/4 border-b border-dashed border-gray-200">
            </div>
            <div class="absolute left-0 right-0 top-2/4 border-b border-gray-300"></div>
            <div class="absolute left-0 right-0 top-3/4 border-b border-dashed border-gray-200">
            </div>

            <!-- Vertical grid lines -->
            <div class="absolute top-0 bottom-0 left-1/4 border-l border-dashed border-gray-200">
            </div>
            <div class="absolute top-0 bottom-0 left-2/4 border-l border-gray-300"></div>
            <div class="absolute top-0 bottom-0 left-3/4 border-l border-dashed border-gray-200">
            </div>

            <!-- Scatter Points -->
            <div v-for="(point, idx) in scatterPoints" :key="idx" class="absolute group cursor-pointer"
                :style="{ bottom: point.growth + '%', left: point.risk + '%', transform: 'translate(-50%, 50%)' }"
                @click="$emit('point-click', point.sme)">
                <!-- Data Point -->
                <div
                    :class="['w-3 h-3 rounded-full shadow-md transition-all duration-200 group-hover:scale-[2] group-hover:shadow-lg', point.color]">
                </div>

                <!-- Hover Tooltip -->
                <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-4 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap"
                    style="z-index: 9999;">
                    <div
                        class="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-xl py-3 px-5 border border-gray-200 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <p class="text-sm font-bold text-gray-900 mb-1.5">{{ point.sme.name }}</p>
                        <div class="flex items-center gap-3 text-xs">
                            <span class="text-gray-500">Readiness: <span class="font-bold text-gray-900">{{
                                point.sme.score
                                    }}</span></span>
                            <span class="text-gray-300">|</span>
                            <span class="text-gray-500">Growth Potential: <span class="font-bold text-gray-900">{{
                                point.growth }}</span></span>
                        </div>
                    </div>
                    <div
                        class="w-2.5 h-2.5 bg-white rotate-45 border-r border-b border-gray-200 absolute left-1/2 -translate-x-1/2 -bottom-1">
                    </div>
                </div>
            </div>
        </div>

        <!-- Axis Labels -->
        <div
            class="absolute left-0 bottom-[calc(50%+1rem)] -rotate-90 text-xs text-gray-400 font-medium origin-center transform -translate-x-1/2">
            Growth Potential →
        </div>
        <div class="absolute left-1/2 bottom-0 text-xs text-gray-400 font-medium transform -translate-x-1/2">
            Risk Level →
        </div>

        <!-- Y-axis labels -->
        <div class="absolute left-0 top-0 text-xs text-gray-400 font-medium">100</div>
        <div class="absolute left-0 top-1/4 text-xs text-gray-400 font-medium">75</div>
        <div class="absolute left-0 top-2/4 text-xs text-gray-400 font-medium">50</div>
        <div class="absolute left-0 top-3/4 text-xs text-gray-400 font-medium">25</div>
        <div class="absolute left-0 bottom-8 text-xs text-gray-400 font-medium">0</div>

        <!-- X-axis labels -->
        <div class="absolute left-8 bottom-2 text-xs text-gray-400 font-medium">0</div>
        <div class="absolute left-[calc(25%+2rem)] bottom-2 text-xs text-gray-400 font-medium">25</div>
        <div class="absolute left-[calc(50%+2rem)] bottom-2 text-xs text-gray-400 font-medium">50</div>
        <div class="absolute left-[calc(75%+2rem)] bottom-2 text-xs text-gray-400 font-medium">75</div>
        <div class="absolute right-0 bottom-2 text-xs text-gray-400 font-medium">100</div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getRiskColors } from '~/utils/sme-data'

const props = defineProps<{
    smes: any[]
}>()

defineEmits(['point-click'])

// Deterministic random generator for consistent positioning
const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
}

const scatterPoints = computed(() => {
    return props.smes.map(deal => {
        // Map financial risk to numeric value (0-100) - deterministic based on ID
        const seed = Number(deal.id) || 1
        const riskMap: Record<string, number> = {
            'Low': 15 + seededRandom(seed * 1.1) * 15,
            'Medium': 40 + seededRandom(seed * 1.2) * 20,
            'High': 70 + seededRandom(seed * 1.3) * 25
        }

        // Parse growth rate - now it is a number
        const growthValue = Math.min(100, Number(deal.growthRate) || 50)

        // Get colors from global system
        const riskColors = getRiskColors(deal.financialRisk as 'Low' | 'Medium' | 'High')

        return {
            sme: deal,
            risk: riskMap[deal.financialRisk] || 50,
            growth: growthValue,
            color: riskColors.dot // Use global dot color
        }
    })
})
</script>
