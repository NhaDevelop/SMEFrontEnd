<template>
    <div class="relative pt-2 pb-6 px-4">
        <!-- Helper grid lines background -->
        <div class="absolute inset-x-8 top-0 bottom-8 flex flex-col justify-between pointer-events-none z-0">
            <div class="border-b border-dashed border-gray-100 h-0 w-full mb-8"></div>
            <div class="border-b border-dashed border-gray-100 h-0 w-full mb-8"></div>
            <div class="border-b border-dashed border-gray-100 h-0 w-full mb-8"></div>
            <div class="border-b border-dashed border-gray-100 h-0 w-full mb-8"></div>
        </div>

        <div class="space-y-8 relative z-10 pl-24 ml-2">
            <!-- Investor Ready -->
            <div class="relative flex items-center h-8 group cursor-pointer" @click="$emit('select', 'Investor Ready')">
                <div class="absolute -left-28 w-24 text-right pr-2">
                    <span class="text-xs text-gray-500 font-medium leading-tight block">Investor<br>Ready</span>
                </div>
                <div class="w-full h-8 relative flex items-center rounded-sm overflow-visible">
                    <!-- Hover Background Track -->
                    <div
                        class="absolute inset-x-0 top-0 bottom-0 bg-gray-100/80 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    </div>

                    <!-- Data Bar -->
                    <div class="h-full bg-emerald-500 rounded-sm relative z-10 transition-all duration-500"
                        :style="{ width: getWidth(data.investorReady) }">
                    </div>

                    <!-- Tooltip -->
                    <div
                        class="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                        <div
                            class="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-lg py-2 px-4 text-center border border-gray-100 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                            <p class="text-xs text-gray-500 mb-0.5 font-medium">Investor Ready</p>
                            <p class="text-sm font-bold text-gray-900">{{ data.investorReady }} SMEs</p>
                        </div>
                        <div
                            class="w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100 absolute left-1/2 -translate-x-1/2 -bottom-1">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Near Ready -->
            <div class="relative flex items-center h-8 group cursor-pointer" @click="$emit('select', 'Near Ready')">
                <div class="absolute -left-28 w-24 text-right pr-2">
                    <span class="text-xs text-gray-500 font-medium leading-tight block">Near Ready</span>
                </div>
                <div class="w-full h-8 relative flex items-center rounded-sm overflow-visible">
                    <div
                        class="absolute inset-x-0 top-0 bottom-0 bg-gray-100/80 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    </div>
                    <div class="h-full bg-[#189AB4] rounded-sm relative z-10 transition-all duration-500"
                        :style="{ width: getWidth(data.nearReady) }">
                    </div>
                    <div
                        class="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                        <div
                            class="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-lg py-2 px-4 text-center border border-gray-100 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                            <p class="text-xs text-gray-500 mb-0.5 font-medium">Near Ready</p>
                            <p class="text-sm font-bold text-gray-900">{{ data.nearReady }} SMEs</p>
                        </div>
                        <div
                            class="w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100 absolute left-1/2 -translate-x-1/2 -bottom-1">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Early Stage -->
            <div class="relative flex items-center h-8 group cursor-pointer" @click="$emit('select', 'Early Stage')">
                <div class="absolute -left-28 w-24 text-right pr-2">
                    <span class="text-xs text-gray-500 font-medium leading-tight block">Early Stage</span>
                </div>
                <div class="w-full h-8 relative flex items-center rounded-sm overflow-visible">
                    <div
                        class="absolute inset-x-0 top-0 bottom-0 bg-gray-100/80 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    </div>
                    <div class="h-full bg-[#F59E0B] rounded-sm relative z-10 transition-all duration-500"
                        :style="{ width: getWidth(data.earlyStage) }">
                    </div>
                    <div
                        class="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                        <div
                            class="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-lg py-2 px-4 text-center border border-gray-100 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                            <p class="text-xs text-gray-500 mb-0.5 font-medium">Early Stage</p>
                            <p class="text-sm font-bold text-gray-900">{{ data.earlyStage }} SMEs</p>
                        </div>
                        <div
                            class="w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100 absolute left-1/2 -translate-x-1/2 -bottom-1">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pre-Investment -->
            <div class="relative flex items-center h-8 group cursor-pointer" @click="$emit('select', 'Pre-Investment')">
                <div class="absolute -left-28 w-24 text-right pr-2">
                    <span class="text-xs text-gray-500 font-medium leading-tight block">Pre-Investment</span>
                </div>
                <div class="w-full h-8 relative flex items-center rounded-sm overflow-visible">
                    <div
                        class="absolute inset-x-0 top-0 bottom-0 bg-gray-100/80 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    </div>
                    <div class="h-full bg-gray-400 rounded-sm relative z-10 transition-all duration-500"
                        :style="{ width: getWidth(data.preInvestment) }">
                    </div>
                    <div
                        class="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 whitespace-nowrap">
                        <div
                            class="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-lg py-2 px-4 text-center border border-gray-100 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                            <p class="text-xs text-gray-500 mb-0.5 font-medium">Pre-Investment</p>
                            <p class="text-sm font-bold text-gray-900">{{ data.preInvestment }} SMEs</p>
                        </div>
                        <div
                            class="w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100 absolute left-1/2 -translate-x-1/2 -bottom-1">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- X Axis (0-16) -->
        <div class="flex justify-between pl-24 ml-2 text-xs text-gray-400 mt-8 relative z-10">
            <span>0</span>
            <span>4</span>
            <span>8</span>
            <span>12</span>
            <span>16</span>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    data: {
        investorReady: number
        nearReady: number
        earlyStage: number
        preInvestment: number
    }
}>()

defineEmits(['select'])

const getWidth = (count: number) => {
    // Max scale is 16 based on the axis labels
    return (count / 16 * 100) + '%'
}
</script>
