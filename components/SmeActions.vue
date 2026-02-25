<template>
    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ClipboardDocumentCheckIcon class="w-5 h-5 text-gray-500" />
                    Action Items
                </h3>
                <p class="text-sm text-gray-500 mt-1">Recommended improvements to increase readiness</p>
            </div>
            <div class="text-right">
                <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold border border-gray-200">
                    {{ completedCount }}/{{ actions.length }} Complete
                </span>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-8">
            <div class="flex justify-between text-xs mb-2">
                <span class="font-medium text-gray-700">Completion Progress</span>
                <span class="text-gray-500 font-bold">{{ progress }}%</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden w-full">
                <div class="h-full bg-teal-500 transition-all duration-500" :style="{ width: `${progress}%` }"></div>
            </div>
            <div class="flex gap-4 mt-3 text-xs text-gray-500">
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-500"></span> {{
                    highPriorityCount }} High</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-500"></span> {{
                    mediumPriorityCount }} Medium</span>
                <span class="ml-auto font-bold text-emerald-600">+{{ potentialPoints }} pts potential</span>
            </div>
        </div>

        <div class="space-y-4">
            <div v-for="(action, idx) in actions" :key="idx"
                :class="['border rounded-xl p-4 transition-all flex items-start gap-4', action.completed ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-200 hover:shadow-sm hover:border-teal-200']">
                <div class="pt-1">
                    <input type="checkbox" v-model="action.completed"
                        class="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500 cursor-pointer" />
                </div>
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <span
                            :class="['px-2 py-0.5 rounded text-[10px] uppercase font-bold border', getPriorityBadge(action.priority)]">
                            {{ action.priority }}
                        </span>
                        <span class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                            {{ action.pillar }}
                        </span>
                    </div>
                    <h4
                        :class="['text-sm font-bold transition-colors', action.completed ? 'text-gray-500 line-through' : 'text-gray-900']">
                        {{ action.title }}</h4>
                    <p v-if="!action.completed" class="text-xs text-[#198754] mt-1 font-bold">Expected improvement: +{{
                        action.points }} points</p>
                    <p v-else class="text-xs text-gray-400 mt-1 italic">Action completed</p>
                </div>
                <button class="text-gray-400 hover:text-gray-600">
                    <ChevronRightIcon class="w-5 h-5" />
                </button>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ClipboardDocumentCheckIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

interface ActionItem {
    title: string
    priority: 'high' | 'medium' | 'low'
    pillar: string
    points: number
    completed: boolean
}

const props = defineProps<{
    actions: ActionItem[]
}>()

// Metrics
const completedCount = computed(() => props.actions.filter(a => a.completed).length)
const progress = computed(() => {
    if (props.actions.length === 0) return 0
    return Math.round((completedCount.value / props.actions.length) * 100)
})

const highPriorityCount = computed(() => props.actions.filter(a => a.priority === 'high').length)
const mediumPriorityCount = computed(() => props.actions.filter(a => a.priority === 'medium').length)

const potentialPoints = computed(() => {
    return props.actions
        .filter(a => !a.completed) // Only count points for remaining actions
        .reduce((sum, a) => sum + a.points, 0)
})

const getPriorityBadge = (p: string) => {
    if (p === 'high') return 'bg-red-50 text-red-700 border-red-100'
    if (p === 'medium') return 'bg-amber-50 text-amber-700 border-amber-100'
    return 'bg-blue-50 text-blue-700 border-blue-100'
}
</script>
