<template>
    <div class="bg-white p-6 rounded-lg border border-gray-200">
        <div class="flex items-center justify-between mb-8">
            <div>
                <h3 class="text-lg font-bold text-gray-900">Portfolio Readiness Trend</h3>
                <p class="text-sm text-gray-500">Aggregate readiness score progression across selected period</p>
            </div>
            <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-cyan-500"></span>
                    <span class="text-xs text-gray-500">Current Period</span>
                </div>
                <div v-if="comparePeriods" class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-gray-300"></span>
                    <span class="text-xs text-gray-500">Previous Period</span>
                </div>
            </div>
        </div>

        <div class="relative h-[300px] w-full mt-4 group">
            <!-- SVG Chart -->
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="w-full h-full overflow-visible">
                <!-- Grid Lines -->
                <line v-for="i in 5" :key="i" x1="0" :y1="(i - 1) * 25" x2="100" :y2="(i - 1) * 25"
                    stroke="#F3F4F6" stroke-width="0.5" />

                <!-- Previous Period Line (if enabled) -->
                <path v-if="comparePeriods" :d="'M ' + comparisonPath" fill="none" stroke="#D1D5DB"
                    stroke-width="1.5" stroke-dasharray="2,2" class="transition-all duration-700" />

                <!-- Current Period Area -->
                <path :d="trendAreaPath" fill="url(#gradient)" opacity="0.1" class="transition-all duration-700" />

                <!-- Current Period Line -->
                <path :d="trendPath" fill="none" stroke="#06b6d4" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" class="transition-all duration-700" />

                <!-- Data Points (Current) -->
                <circle v-for="point in trendData" :key="point.x" :cx="point.x" :cy="point.svgY" r="1.5"
                    fill="white" stroke="#06b6d4" stroke-width="0.8" class="transition-all duration-500" />

                <!-- Hover Interactivity (Vertical line) -->
                <line x1="0" y1="0" x2="0" y2="100" stroke="#06b6d4" stroke-width="0.5" stroke-dasharray="2,2"
                    class="opacity-0 group-hover:opacity-100 transition-opacity" id="hover-line" />

                <!-- Gradient Definition -->
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="#06b6d4" />
                        <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
                    </linearGradient>
                </defs>
            </svg>

            <!-- Tooltips (Overlay) -->
            <div v-for="(point, idx) in trendData" :key="idx"
                class="absolute top-0 bottom-0 w-[5%] group/point flex items-center justify-center cursor-crosshair transform -translate-x-1/2"
                :style="{ left: point.x + '%' }" @mouseenter="updateHoverLine(point.x)">
                <!-- Visual trigger dot -->
                <div class="w-2.5 h-2.5 rounded-full bg-[#06b6d4] opacity-0 group-hover/point:opacity-100 shadow-lg scale-0 group-hover/point:scale-100 transition-all duration-200 z-10"
                    :style="{ transform: `translateY(${(point.svgY * 3) - 150}px)` }"></div>

                <!-- Tooltip Panel -->
                <div
                    class="absolute bottom-full mb-4 opacity-0 group-hover/point:opacity-100 transition-all duration-200 pointer-events-none z-20 whitespace-nowrap">
                    <div
                        class="bg-navy-900 text-white rounded-lg py-2 px-3 shadow-2xl border border-navy-800 transform translate-y-2 group-hover/point:translate-y-0 transition-transform">
                        <p class="text-[10px] text-cyan-500 font-bold uppercase tracking-wider mb-0.5">{{ point.month }}
                        </p>
                        <div class="flex items-center gap-3">
                            <div>
                                <p class="text-xs text-gray-400">Readiness</p>
                                <p class="text-sm font-bold">{{ point.score }}</p>
                            </div>
                            <div class="w-px h-6 bg-navy-800"></div>
                            <div>
                                <p class="text-xs text-gray-400">Ready</p>
                                <p class="text-sm font-bold text-emerald-400">{{ point.ready }} SMEs</p>
                            </div>
                        </div>
                    </div>
                    <!-- Tooltip Arrow -->
                    <div
                        class="w-2 h-2 bg-navy-900 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1 border-r border-b border-navy-800">
                    </div>
                </div>
            </div>

            <!-- X-Axis Labels -->
            <div class="flex justify-between mt-4">
                <span v-for="point in trendData" :key="point.month"
                    class="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{{ point.month }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    trendData: any[],
    trendPath: string,
    trendAreaPath: string,
    comparePeriods: boolean,
    comparisonPath?: string
}>()

const updateHoverLine = (x: number) => {
    const line = document.getElementById('hover-line')
    if (line) {
        line.setAttribute('x1', String(x))
        line.setAttribute('x2', String(x))
    }
}
</script>
