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
                    <button @click="handleSave" :disabled="isSaving || !canSave"
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

                        <div v-if="!isThresholdsValid" class="mt-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                            <ExclamationTriangleIcon class="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <p class="text-sm font-medium">{{ thresholdErrorMessage }}</p>
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

                    <!-- Industry Sectors Tab -->
                    <div v-if="activeTab === 'sectors'" class="p-8">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h3 class="text-lg font-bold text-gray-900">Industry Sectors</h3>
                                <p class="text-sm text-gray-500 mt-0.5">Manage sector types for categorizing SMEs</p>
                            </div>
                            <button @click="showAddSector = !showAddSector"
                                class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                                <PlusIcon class="w-4 h-4" />
                                Add Sector
                            </button>
                        </div>

                        <!-- Add / Edit Form -->
                        <div v-if="showAddSector || editingSector"
                            class="mb-6 p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                            <h4 class="font-semibold text-gray-900 text-sm">{{ sectorFormTitle }}</h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Sector Name *</label>
                                    <input v-model="sectorForm.name" type="text" placeholder="e.g. Agriculture"
                                        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
                                </div>
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-1">Description</label>
                                    <input v-model="sectorForm.description" type="text"
                                        placeholder="Optional short description"
                                        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none" />
                                </div>
                            </div>
                            <!-- Color Picker -->
                            <div>
                                <label class="block text-xs font-medium text-gray-600 mb-2">Color</label>
                                <div class="flex flex-wrap gap-2">
                                    <button v-for="color in sectorColors" :key="color" @click="sectorForm.color = color"
                                        :style="{ backgroundColor: color }"
                                        :class="sectorForm.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''"
                                        class="w-7 h-7 rounded-full transition-transform" />
                                </div>
                            </div>
                            <div class="flex gap-3 pt-1">
                                <button @click="saveSector" :disabled="!sectorForm.name.trim() || sectorSaving"
                                    class="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                    {{ sectorSaving ? 'Saving...' : (editingSector ? 'Update' : 'Create') }}
                                </button>
                                <button @click="cancelSectorForm"
                                    class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <!-- Sectors List -->
                        <div v-if="sectorsLoading" class="flex justify-center py-12">
                            <div
                                class="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin">
                            </div>
                        </div>
                        <div v-else-if="sectors.length === 0" class="text-center py-16 text-gray-400">
                            <p class="text-sm">No sectors yet. Add one above.</p>
                        </div>
                        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div v-for="sector in sectors" :key="sector.id"
                                class="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                                <!-- Color Dot -->
                                <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                    :style="{ backgroundColor: sector.color + '20', border: '2px solid ' + sector.color }">
                                    <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: sector.color }"></div>
                                </div>
                                <!-- Info -->
                                <div class="flex-1 min-w-0">
                                    <div class="font-semibold text-gray-900 text-sm">{{ sector.name }}</div>
                                    <div v-if="sector.description" class="text-xs text-gray-500 mt-0.5 truncate">{{
                                        sector.description }}</div>
                                </div>
                                <!-- Actions -->
                                <div class="flex items-center gap-1 shrink-0">
                                    <button @click="startEditSector(sector)"
                                        class="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                        <PencilSquareIcon class="w-4 h-4" />
                                    </button>
                                    <button @click="deleteSector(sector)"
                                        class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <TrashIcon class="w-4 h-4" />
                                    </button>
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
import { ref, computed, watch, onMounted } from 'vue'
import { CloudArrowUpIcon, ArrowPathIcon, InformationCircleIcon, PlusIcon, PencilSquareIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
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
    const index = editingPillarIndex.value
    const pillar = index !== -1 ? pillars.value[index] : undefined

    if (pillar) {
        pillar.indicators = indicators
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
    { id: 'sectors', label: 'Industry Sectors' },
]

// Initialize from variables, will be hydrated on mount
const pillars = ref<{ id?: string, name: string, weight: number, indicators: string[], enabled: boolean }[]>([])

const totalWeight = computed(() => pillars.value.reduce((sum: number, p: any) => sum + (p.enabled ? p.weight : 0), 0))
const isTotalValid = computed(() => Math.abs(totalWeight.value - 100) < 0.1)

const thresholds = ref<{ id: string, label: string, min: number, max: number, colorBg: string }[]>([])
 
const thresholdErrorMessage = ref('')
const isThresholdsValid = computed(() => {
    if (thresholds.value.length === 0) return true
    
    const sorted = [...thresholds.value].sort((a, b) => Number(a.min) - Number(b.min))
    const first = sorted[0]
    const last = sorted[sorted.length - 1]
    
    // 1. Must start at 0
    if (!first || Number(first.min) !== 0) {
        thresholdErrorMessage.value = 'Thresholds must start from 0'
        return false
    }
    
    // 2. Must end at 100
    if (!last || Number(last.max) !== 100) {
        thresholdErrorMessage.value = 'Thresholds must end at 100'
        return false
    }
    
    // 3. Must be contiguous and min < max for each
    for (let i = 0; i < sorted.length; i++) {
        const current = sorted[i];
        if (!current) continue;

        if (Number(current.min) >= Number(current.max)) {
            thresholdErrorMessage.value = `Invalid range for ${current.label}: min must be less than max`;
            return false;
        }
        if (i < sorted.length - 1) {
            const next = sorted[i + 1];
            if (!next) continue;

            if (Number(current.max) !== Number(next.min) - 1) {
                thresholdErrorMessage.value = `Gaps or overlaps detected between ${current.label} and ${next.label}. Ranges must be contiguous (e.g., 0-39, 40-59).`;
                return false;
            }
        }
    }
    
    thresholdErrorMessage.value = ''
    return true
})
 
const canSave = computed(() => isTotalValid.value && isThresholdsValid.value)

onMounted(async () => {
    // 1. Fetch live DB settings
    await adminStore.fetchFrameworkSettings()
    fetchSectors()

    // 2. Hydrate Pillars
    if (adminStore.frameworkSettings && adminStore.frameworkSettings.length > 0) {
        pillars.value = JSON.parse(JSON.stringify(adminStore.frameworkSettings)).map((p: any) => ({
            ...p,
            enabled: true
        }))
    } else {
        // Fallback default
        pillars.value = []
    }

    // 3. Hydrate Thresholds
    if (adminStore.frameworkThresholds && adminStore.frameworkThresholds.length > 0) {
        thresholds.value = JSON.parse(JSON.stringify(adminStore.frameworkThresholds))
    } else {
        thresholds.value = [
            { id: 'investor', label: 'Investor Ready', min: 80, max: 100, colorBg: 'bg-emerald-500' },
            { id: 'near', label: 'Near Ready', min: 60, max: 79, colorBg: 'bg-amber-500' },
            { id: 'early', label: 'Early Stage', min: 40, max: 59, colorBg: 'bg-teal-500' },
            { id: 'pre', label: 'Pre-Investment', min: 0, max: 39, colorBg: 'bg-red-500' },
        ]
    }
})



const handleSave = async () => {
    if (!isTotalValid.value) {
        alert('Total weight must equal 100%')
        return
    }

    isSaving.value = true
    try {
        await adminStore.updateFrameworkSettings({
            pillars: pillars.value.map((p: any) => ({
                id: p.id || p.name.toLowerCase().replace(/ /g, '_'),
                name: p.name,
                weight: p.weight,
                indicators: p.indicators || []
            })),
            thresholds: thresholds.value
        })
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

const colors = ['#3b82f6', '#10b981', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1']
const getWidth = (t: any) => {
    if (!t) return '0%'
    return ((t.max - t.min + 1) / 100 * 100) + '%'
}
const getColor = (i: number) => colors[i % colors.length]

// ─── SECTORS CRUD ──────────────────────────────────────────
const sectors = computed(() => adminStore.sectors)
const sectorsLoading = ref(false)
const showAddSector = ref(false)
const editingSector = ref<any>(null)
const sectorSaving = ref(false)
const sectorFormTitle = computed(() => editingSector.value ? 'Edit Sector' : 'New Sector')

const sectorColors = [
    '#16a34a', '#2563eb', '#9333ea', '#0891b2', '#e11d48',
    '#ea580c', '#d97706', '#059669', '#7c3aed', '#db2777',
    '#0f172a', '#64748b', '#f43f5e', '#10b981', '#f59e0b'
]

const sectorForm = ref({ name: '', description: '', color: '#16a34a' })

const fetchSectors = async () => {
    sectorsLoading.value = true
    try {
        await adminStore.fetchSectors()
    } catch (e) { 
        console.error(e) 
    } finally { 
        sectorsLoading.value = false 
    }
}

const startEditSector = (sector: any) => {
    editingSector.value = sector
    showAddSector.value = false
    sectorForm.value = { 
        ...sectorForm.value,
        name: sector.name, 
        description: sector.description || '', 
        color: sector.color 
    }
}

const cancelSectorForm = () => {
    showAddSector.value = false
    editingSector.value = null
    sectorForm.value = { name: '', description: '', color: '#16a34a' }
}

const saveSector = async () => {
    sectorSaving.value = true
    try {
        const payload = {
            ...sectorForm.value,
            id: editingSector.value?.id
        }
        await adminStore.saveSector(payload)
        cancelSectorForm()
    } catch (e) { 
        console.error(e) 
    } finally { 
        sectorSaving.value = false 
    }
}

const deleteSector = async (sector: any) => {
    if (!confirm(`Delete sector "${sector.name}"? This cannot be undone.`)) return
    try {
        await adminStore.deleteSector(sector.id)
    } catch (e) { 
        console.error(e) 
    }
}
// ────────────────────────────────────────────────────────────
</script>
