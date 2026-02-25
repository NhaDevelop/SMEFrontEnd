<template>
    <div class="h-full flex flex-col bg-gray-50">
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 px-8 py-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Framework Settings</h1>
                    <p class="text-gray-500 mt-1">Configure assessment pillars, weights, and score thresholds</p>
                </div>
                <div class="flex items-center gap-3">
                    <button @click="handleReset"
                        class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <ArrowPathIcon class="w-4 h-4" />
                        Reset
                    </button>
                    <button @click="handleSave" :disabled="isSaving || !isTotalValid"
                        class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                        <CloudArrowUpIcon class="w-4 h-4" />
                        {{ isSaving ? 'Saving...' : 'Save Changes' }}
                    </button>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto p-8">
            <div class="max-w-5xl mx-auto space-y-6">

                <!-- Tabs -->
                <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                    <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                        :class="['px-4 py-2 rounded-md text-sm font-medium transition-all', activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700']">
                        {{ tab.label }}
                    </button>
                </div>

                <!-- Tab Content -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">

                    <!-- Pillar Weights Tab -->
                    <div v-if="activeTab === 'weights'" class="p-8">
                        <div class="flex items-center justify-between mb-8">
                            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
                                Pillar Weight Distribution
                                <InformationCircleIcon class="w-5 h-5 text-gray-400" />
                            </h3>
                            <div class="flex items-center gap-3">

                                <span
                                    :class="['text-sm font-medium px-3 py-1 rounded-full', isTotalValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700']">
                                    Total Weight: {{ totalWeight.toFixed(1) }}%
                                </span>
                            </div>
                        </div>

                        <div class="space-y-8">
                            <div v-for="(pillar, index) in pillars" :key="index" class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-3">
                                        <!-- Toggle -->
                                        <button @click="pillar.enabled = !pillar.enabled"
                                            :class="pillar.enabled ? 'bg-emerald-600' : 'bg-gray-200'"
                                            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none">
                                            <span :class="pillar.enabled ? 'translate-x-6' : 'translate-x-1'"
                                                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
                                        </button>
                                        <span class="text-sm font-medium text-gray-700">{{ pillar.name }}</span>
                                    </div>
                                    <span class="text-sm font-bold text-gray-900">{{ pillar.weight }}%</span>
                                </div>
                                <input type="range" v-model.number="pillar.weight" min="0" max="100" step="0.1"
                                    :disabled="!pillar.enabled"
                                    class="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 disabled:accent-gray-300">
                            </div>
                        </div>

                        <!-- Preview Bar -->
                        <div class="mt-12 pt-8 border-t border-gray-100">
                            <h4 class="font-semibold text-gray-900 mb-4">Weight Distribution Preview</h4>
                            <div class="h-8 w-full rounded-lg overflow-hidden flex">
                                <div v-for="(pillar, idx) in pillars" :key="idx"
                                    :style="{ width: pillar.weight + '%', backgroundColor: getColor(Number(idx)) }"
                                    class="h-full transition-all duration-300 relative group">
                                    <div
                                        class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 text-white text-xs font-bold transition-opacity">
                                        {{ pillar.weight }}%
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4 flex flex-wrap gap-4">
                                <div v-for="(pillar, idx) in pillars" :key="idx" class="flex items-center gap-2">
                                    <div class="w-3 h-3 rounded-full"
                                        :style="{ backgroundColor: getColor(Number(idx)) }"></div>
                                    <span class="text-xs text-gray-500">{{ pillar.name }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Score Thresholds Tab -->
                    <div v-if="activeTab === 'thresholds'" class="p-8">
                        <div class="mb-8">
                            <h3 class="text-lg font-bold text-gray-900">Readiness Level Thresholds</h3>
                            <p class="text-sm text-gray-500 mt-1">Define score ranges for each readiness level</p>
                        </div>

                        <div class="space-y-6 max-w-3xl">
                            <div v-for="level in thresholds" :key="level.id" class="flex items-center gap-6">
                                <div class="w-4 h-4 rounded-md flex-shrink-0" :class="level.colorBg"></div>
                                <span class="text-sm font-medium text-gray-900 w-40">{{ level.label }}</span>

                                <div class="flex items-center gap-3">
                                    <input type="number" v-model="level.min"
                                        class="w-20 rounded-lg border-gray-300 text-center text-sm focus:border-emerald-500 focus:ring-emerald-500">
                                    <span class="text-gray-400 text-sm">to</span>
                                    <input type="number" v-model="level.max"
                                        class="w-20 rounded-lg border-gray-300 text-center text-sm focus:border-emerald-500 focus:ring-emerald-500">
                                </div>
                            </div>
                        </div>

                        <div class="mt-12 pt-8 border-t border-gray-100" v-if="thresholds.length >= 4">
                            <h4 class="font-semibold text-gray-900 mb-6">Score Scale Preview</h4>
                            <div
                                class="relative h-12 w-full flex rounded-lg overflow-hidden font-medium text-white text-xs">
                                <div class="bg-red-500 flex items-center justify-center"
                                    :style="{ width: getWidth(thresholds[3]) }">
                                    0 - {{ thresholds[3]?.max }}
                                </div>
                                <div class="bg-teal-500 flex items-center justify-center"
                                    :style="{ width: getWidth(thresholds[2]) }">
                                    {{ thresholds[2]?.min }} - {{ thresholds[2]?.max }}
                                </div>
                                <div class="bg-amber-500 flex items-center justify-center"
                                    :style="{ width: getWidth(thresholds[1]) }">
                                    {{ thresholds[1]?.min }} - {{ thresholds[1]?.max }}
                                </div>
                                <div class="bg-emerald-600 flex items-center justify-center"
                                    :style="{ width: getWidth(thresholds[0]) }">
                                    {{ thresholds[0]?.min }} - 100
                                </div>
                            </div>
                            <div class="flex justify-between text-xs text-gray-400 mt-2">
                                <span>0</span>
                                <span>25</span>
                                <span>50</span>
                                <span>75</span>
                                <span>100</span>
                            </div>
                        </div>
                    </div>

                    <!-- Indicators Tab -->
                    <div v-if="activeTab === 'indicators'" class="p-8">
                        <div class="mb-8">
                            <h3 class="text-lg font-bold text-gray-900">Assessment Indicators</h3>
                            <p class="text-sm text-gray-500 mt-1">Configure indicators for each pillar</p>
                        </div>

                        <div class="space-y-4">
                            <div v-for="(pillar, idx) in pillars" :key="idx"
                                class="border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                                <div class="flex items-center justify-between mb-4">
                                    <h4 class="font-medium text-gray-900">{{ pillar.name }}</h4>
                                    <button @click="openIndicatorsModal(pillar, Number(idx))"
                                        class="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        Edit Indicators
                                    </button>
                                </div>
                                <div class="flex flex-wrap gap-2">
                                    <span v-for="(ind, i) in pillar.indicators" :key="i"
                                        class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                        {{ ind }}
                                    </span>
                                    <span v-if="!pillar.indicators?.length" class="text-xs text-gray-400 italic">No
                                        indicators defined</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>

        <EditIndicatorsModal :is-open="showIndicatorsModal" :pillar-name="editingPillar?.name || ''"
            :initial-indicators="editingPillar?.indicators || []" @close="showIndicatorsModal = false"
            @save="handleSaveIndicators" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CloudArrowUpIcon, ArrowPathIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { useAdminStore } from '~/stores/admin.store'
import EditIndicatorsModal from '~/components/AdminEditIndicatorsModal.vue'

definePageMeta({
    layout: 'admin',
    middleware: ['auth', 'admin']
})

const adminStore = useAdminStore()
const activeTab = ref('weights')
const isSaving = ref(false)

const showIndicatorsModal = ref(false)
const editingPillar = ref<any>(null)
const editingPillarIndex = ref<number>(-1)

const openIndicatorsModal = (pillar: any, index: number) => {
    editingPillar.value = pillar
    editingPillarIndex.value = index
    showIndicatorsModal.value = true
}

const handleSaveIndicators = (indicators: string[]) => {
    if (editingPillarIndex.value !== -1) {
        pillars.value[editingPillarIndex.value].indicators = indicators
        // Auto save to store logic is handled by header "Save Changes", 
        // but user might expect immediate save for this modal.
        // Let's just update local state, and they have to click "Save Changes" on header for global sync.
    }
    showIndicatorsModal.value = false
}

const tabs = [
    { id: 'weights', label: 'Pillar Weights' },
    { id: 'thresholds', label: 'Score Thresholds' },
    { id: 'indicators', label: 'Indicators' },
]

// Initialize from store
const pillars = ref(JSON.parse(JSON.stringify(adminStore.frameworkSettings)).map((p: any) => ({
    ...p,
    enabled: true // Add local UI state
})))

const totalWeight = computed(() => pillars.value.reduce((sum: number, p: any) => sum + (p.enabled ? p.weight : 0), 0))
const isTotalValid = computed(() => Math.abs(totalWeight.value - 100) < 0.1)



const handleSave = async () => {
    if (!isTotalValid.value) {
        alert('Total weight must equal 100%')
        return
    }

    isSaving.value = true
    try {
        await adminStore.updateFrameworkSettings(pillars.value.map((p: any) => ({
            id: p.id || p.name.toLowerCase().replace(/ /g, '_'),
            name: p.name,
            weight: p.weight
        })))
        alert('Settings saved successfully')
    } catch (e) {
        alert('Failed to save settings')
    } finally {
        isSaving.value = false
    }
}

const handleReset = () => {
    if (confirm('Reset changes to last saved state?')) {
        pillars.value = JSON.parse(JSON.stringify(adminStore.frameworkSettings)).map((p: any) => ({
            ...p,
            enabled: true
        }))
    }
}

const thresholds = ref([
    { id: 'investor', label: 'Investor Ready', min: 80, max: 100, colorBg: 'bg-emerald-500' },
    { id: 'near', label: 'Near Ready', min: 60, max: 79, colorBg: 'bg-amber-500' },
    { id: 'early', label: 'Early Stage', min: 40, max: 59, colorBg: 'bg-teal-500' },
    { id: 'pre', label: 'Pre-Investment', min: 0, max: 39, colorBg: 'bg-red-500' },
])

const colors = ['#3b82f6', '#10b981', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1']
const getWidth = (t: any) => {
    if (!t) return '0%'
    return ((t.max - t.min + 1) / 100 * 100) + '%'
}
const getColor = (i: number) => colors[i % colors.length]
</script>
