<template>
    <div class="h-full flex flex-col bg-gray-50">
        <header class="bg-white border-b border-gray-200 px-8 py-6 flex-shrink-0">
            <div>
                <h1 class="text-2xl font-bold text-gray-900">Scoring Rules</h1>
                <p class="text-gray-500 mt-1">Configure automatic score adjustments based on conditions</p>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto custom-scrollbar p-8">
            <div class="max-w-[1200px] mx-auto space-y-8">
                <!-- Readiness Level Thresholds Section -->
                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <div class="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-6">
                        <div>
                            <h2 class="text-xl font-bold text-gray-900">Readiness Level Thresholds</h2>
                            <p class="text-gray-500 mt-1">Define score ranges for the selected context below</p>
                            <div class="mt-4 flex items-center gap-3">
                                <label class="text-sm font-semibold text-gray-700 whitespace-nowrap">Target Configuration:</label>
                                <select v-model="selectedProgramId" 
                                    class="w-full sm:w-64 rounded-lg border-gray-300 text-sm focus:border-emerald-500 focus:ring-emerald-500 py-2 pl-3 pr-8 bg-gray-50 font-medium">
                                    <option value="global">🌍 Global (Default System Thresholds)</option>
                                    <optgroup label="Active Programs">
                                        <option v-for="prog in activePrograms" :key="prog.id" :value="prog.id">
                                            {{ prog.name }}
                                        </option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                        <button @click="handleSaveThresholds" :disabled="isSavingThresholds || !isThresholdsValid"
                            class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium shadow-sm disabled:opacity-50">
                            <CloudArrowUpIcon class="w-4 h-4" />
                            {{ isSavingThresholds ? 'Saving...' : 'Save Thresholds' }}
                        </button>
                    </div>

                    <div class="space-y-6 max-w-3xl mb-12">
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

                    <div v-if="!isThresholdsValid"
                        class="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                        <ExclamationTriangleIcon class="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p class="text-sm font-medium">{{ thresholdErrorMessage }}</p>
                    </div>

                    <!-- Visual Preview -->
                    <div class="pt-8 border-t border-gray-100" v-if="thresholds.length >= 4">
                        <h4
                            class="font-semibold text-gray-900 mb-6 font-medium text-sm text-gray-500 uppercase tracking-wider">
                            Score Scale Preview</h4>
                        <div
                            class="relative h-12 w-full flex rounded-lg overflow-hidden font-medium text-white text-xs shadow-inner">
                            <div class="bg-red-500 flex items-center justify-center transition-all duration-500"
                                :style="{ width: getWidth(thresholds[3]) }">
                                0 - {{ thresholds[3]?.max }}
                            </div>
                            <div class="bg-teal-500 flex items-center justify-center transition-all duration-500"
                                :style="{ width: getWidth(thresholds[2]) }">
                                {{ thresholds[2]?.min }} - {{ thresholds[2]?.max }}
                            </div>
                            <div class="bg-amber-500 flex items-center justify-center transition-all duration-500"
                                :style="{ width: getWidth(thresholds[1]) }">
                                {{ thresholds[1]?.min }} - {{ thresholds[1]?.max }}
                            </div>
                            <div class="bg-emerald-600 flex items-center justify-center transition-all duration-500"
                                :style="{ width: getWidth(thresholds[0]) }">
                                {{ thresholds[0]?.min }} - 100
                            </div>
                        </div>
                        <div class="flex justify-between text-xs text-gray-400 mt-3 px-1 font-medium">
                            <span>0</span>
                            <span>25</span>
                            <span>50</span>
                            <span>75</span>
                            <span>100</span>
                        </div>
                    </div>
                </div>

            </div>
        </main>

    </div>
</template>

<script setup lang="ts">
import { useAdminStore } from '~/stores/admin.store'
import {
    ExclamationTriangleIcon,
    CloudArrowUpIcon
} from '@heroicons/vue/24/outline'
import { useToast } from '~/composables/useToast'

const adminStore = useAdminStore()
const isSavingThresholds = ref(false)
const toast = useToast()

const selectedProgramId = ref<string | number>('global')
const activePrograms = computed(() => {
    return adminStore.programs.filter((p: any) => ['Published', 'Coming Soon'].includes(p.status))
})

const thresholds = ref<{ id: string, label: string, min: number, max: number, colorBg: string }[]>([])
const thresholdErrorMessage = ref('')

const isThresholdsValid = computed(() => {
    if (thresholds.value.length === 0) return true

    const sorted = [...thresholds.value].sort((a, b) => Number(a.min) - Number(b.min))
    const first = sorted[0]
    const last = sorted[sorted.length - 1]

    if (!first || Number(first.min) !== 0) {
        thresholdErrorMessage.value = 'Thresholds must start from 0'
        return false
    }

    if (!last || Number(last.max) !== 100) {
        thresholdErrorMessage.value = 'Thresholds must end at 100'
        return false
    }

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

const loadThresholdsContext = () => {
    if (selectedProgramId.value === 'global') {
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
    } else {
        const prog = adminStore.programs.find((p: any) => p.id === selectedProgramId.value)
        if (prog && prog.thresholds && prog.thresholds.length === 4) {
            thresholds.value = JSON.parse(JSON.stringify(prog.thresholds))
        } else {
            // Seed from global default if the program has no custom thresholds yet
            thresholds.value = adminStore.frameworkThresholds && adminStore.frameworkThresholds.length > 0
                ? JSON.parse(JSON.stringify(adminStore.frameworkThresholds))
                : [
                    { id: 'investor', label: 'Investor Ready', min: 80, max: 100, colorBg: 'bg-emerald-500' },
                    { id: 'near', label: 'Near Ready', min: 60, max: 79, colorBg: 'bg-amber-500' },
                    { id: 'early', label: 'Early Stage', min: 40, max: 59, colorBg: 'bg-teal-500' },
                    { id: 'pre', label: 'Pre-Investment', min: 0, max: 39, colorBg: 'bg-red-500' },
                ]
        }
    }
}

watch(selectedProgramId, () => {
    loadThresholdsContext()
})

onMounted(async () => {
    await Promise.all([
        adminStore.fetchFrameworkSettings(),
        adminStore.programs.length === 0 ? adminStore.fetchProgramsData() : Promise.resolve()
    ])
    loadThresholdsContext()
})

const handleSaveThresholds = async () => {
    if (!isThresholdsValid.value) return

    isSavingThresholds.value = true
    try {
        if (selectedProgramId.value === 'global') {
            await adminStore.updateFrameworkSettings({
                thresholds: thresholds.value
            })
            toast.success('Global thresholds updated successfully')
        } else {
            const prog = adminStore.programs.find((p: any) => p.id === selectedProgramId.value)
            if (prog) {
                const updatedProg = { ...prog, thresholds: thresholds.value }
                await adminStore.updateProgram(updatedProg)
                toast.success(`Thresholds updated successfully for program: ${prog.name}`)
            }
        }
    } catch (e) {
        toast.error('Failed to save thresholds')
    } finally {
        isSavingThresholds.value = false
    }
}

const getWidth = (t: any) => {
    if (!t) return '0%'
    return ((t.max - t.min + 1) / 100 * 100) + '%'
}


definePageMeta({
    layout: 'admin',
    middleware: ['auth', 'admin']
})
</script>
