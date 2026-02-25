<template>
    <TransitionRoot as="template" :show="isOpen">
        <Dialog as="div" class="relative z-50" @close="closeModal">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                        enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                        leave-from="opacity-100 translate-y-0 sm:scale-100"
                        leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">

                            <!-- Header -->
                            <div class="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-start">
                                <div>
                                    <DialogTitle as="h3" class="text-xl font-bold text-gray-900">Create Goal for SME
                                    </DialogTitle>
                                    <p class="text-sm text-gray-500 mt-1">Set improvement targets to track progress</p>
                                </div>
                                <button @click="closeModal"
                                    class="text-gray-400 hover:text-gray-500 focus:outline-none">
                                    <XMarkIcon class="h-6 w-6" />
                                </button>
                            </div>

                            <!-- Content -->
                            <div class="px-6 py-6">
                                <!-- Tabs -->
                                <div class="flex p-1 bg-gray-50 rounded-lg mb-6">
                                    <button @click="activeTab = 'basic'" :class="[
                                        'flex-1 py-1.5 text-sm font-medium rounded-md transition-all',
                                        activeTab === 'basic' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    ]">
                                        Basic Info
                                    </button>
                                    <button @click="activeTab = 'pillars'" :class="[
                                        'flex-1 py-1.5 text-sm font-medium rounded-md transition-all',
                                        activeTab === 'pillars' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                    ]">
                                        Pillar Targets
                                    </button>
                                </div>

                                <!-- Basic Info Tab -->
                                <div v-if="activeTab === 'basic'" class="space-y-5">
                                    <!-- Select SME -->
                                    <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-1">Select SME *</label>
                                        <select v-model="form.smeId"
                                            class="w-full rounded-lg border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 text-gray-900">
                                            <option value="">Choose an SME</option>
                                            <option v-for="sme in smeList" :key="sme.id" :value="sme.id">{{ sme.name }}
                                            </option>
                                        </select>
                                    </div>

                                    <!-- Quick Templates -->
                                    <div v-if="form.smeId">
                                        <label class="block text-sm font-bold text-gray-700 mb-2">Quick
                                            Templates</label>
                                        <div class="grid grid-cols-3 gap-3">
                                            <button v-for="template in quickTemplates" :key="template.id" type="button"
                                                @click="applyTemplate(template)"
                                                class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-teal-500 hover:bg-teal-50 transition-all text-left">
                                                <span class="text-xl">{{ template.icon }}</span>
                                                <span class="text-xs font-medium text-gray-700">{{ template.label
                                                    }}</span>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Goal Name -->
                                    <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-1">Goal Name *</label>
                                        <input type="text" v-model="form.name"
                                            placeholder="e.g., Investor Ready by Q4 2024"
                                            class="w-full rounded-lg border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 text-gray-900 placeholder:text-gray-400" />
                                    </div>

                                    <!-- Description -->
                                    <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                        <textarea v-model="form.description" rows="3"
                                            placeholder="Describe what you want to achieve..."
                                            class="w-full rounded-lg border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 text-gray-900 placeholder:text-gray-400"></textarea>
                                    </div>

                                    <!-- Date & Score -->
                                    <div class="grid grid-cols-1 gap-6">
                                        <div>
                                            <label class="block text-sm font-bold text-gray-700 mb-1">Target Date
                                                *</label>
                                            <div class="relative">
                                                <input type="date" v-model="form.targetDate"
                                                    class="w-full rounded-lg border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 pl-3 text-gray-900 icon-right" />
                                                <CalendarIcon
                                                    class="w-5 h-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                                            </div>
                                        </div>

                                        <!-- Score Slider Section -->
                                        <div>
                                            <div class="flex justify-between items-center mb-2">
                                                <label class="block text-sm font-bold text-gray-700">Overall Target
                                                    Score: {{ form.targetScore }}</label>
                                            </div>

                                            <div class="relative pt-1 px-1 mb-6">
                                                <input type="range" v-model="form.targetScore" min="0" max="100"
                                                    step="1"
                                                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                                            </div>

                                            <!-- Score Comparison Display -->
                                            <div class="bg-gray-50 rounded-xl p-6 flex items-center justify-between">
                                                <div class="text-center">
                                                    <div class="text-xs text-gray-500 mb-1 font-medium">Current Score
                                                    </div>
                                                    <div class="text-3xl font-bold text-gray-900">{{ currentSmeScore }}
                                                    </div>
                                                    <div class="text-[10px] text-emerald-600 font-medium mt-1">+5 points
                                                        improvement needed</div>
                                                </div>

                                                <div class="text-gray-300">
                                                    <ArrowLongRightIcon class="w-8 h-8" />
                                                </div>

                                                <div class="text-center">
                                                    <div class="text-xs text-gray-500 mb-1 font-medium">Target Score
                                                    </div>
                                                    <div class="text-3xl font-bold text-emerald-600">{{ form.targetScore
                                                    }}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pillar Targets Tab -->
                                <div v-else class="space-y-4">
                                    <p class="text-sm text-gray-500">Set individual targets for each pillar. Current
                                        scores are shown for reference.</p>

                                    <div class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                                        <div v-for="pillar in pillarTargets" :key="pillar.name"
                                            class="bg-gray-50 rounded-lg p-4 space-y-3">
                                            <div class="flex items-center justify-between">
                                                <h4 class="text-sm font-bold text-gray-900">{{ pillar.name }}</h4>
                                                <div class="flex items-center gap-3 text-xs">
                                                    <span class="text-gray-500">
                                                        Current: <span class="font-bold text-gray-900">{{
                                                            pillar.currentScore }}</span>
                                                    </span>
                                                    <span class="text-gray-400">→</span>
                                                    <span class="text-teal-600">
                                                        Target: <span class="font-bold">{{ pillar.targetScore }}</span>
                                                    </span>
                                                    <span v-if="pillar.targetScore > pillar.currentScore"
                                                        class="text-emerald-600 font-medium">
                                                        (+{{ pillar.targetScore - pillar.currentScore }})
                                                    </span>
                                                </div>
                                            </div>

                                            <!-- Current Score Bar (Read-only) -->
                                            <div class="space-y-1">
                                                <div class="flex justify-between text-xs text-gray-500">
                                                    <span>Current Score</span>
                                                    <span>{{ pillar.currentScore }}</span>
                                                </div>
                                                <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                                    <div class="h-full bg-gray-400 rounded-full transition-all"
                                                        :style="{ width: pillar.currentScore + '%' }"></div>
                                                </div>
                                            </div>

                                            <!-- Target Score Slider -->
                                            <div class="space-y-1">
                                                <div class="flex justify-between text-xs text-gray-700 font-medium">
                                                    <span>Target Score</span>
                                                    <span class="text-teal-600">{{ pillar.targetScore }}</span>
                                                </div>
                                                <input type="range" v-model="pillar.targetScore" min="0" max="100"
                                                    step="1"
                                                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div class="px-6 py-4 flex justify-end gap-3 mt-4">
                                <button @click="closeModal"
                                    class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-sm">
                                    Cancel
                                </button>
                                <button @click="createGoal"
                                    class="px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#0D655D] font-medium text-sm shadow-sm">
                                    Create Goal
                                </button>
                            </div>

                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ArrowLongRightIcon, XMarkIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import { generatePillarScores } from '~/utils/sme-data'

const props = defineProps<{
    isOpen: boolean
    smeList?: any[]
    prefilledSme?: any
}>()

const emit = defineEmits(['close', 'create'])

const activeTab = ref('basic')
const form = ref<{
    smeId: string | number
    name: string
    description: string
    targetDate: string
    targetScore: number
}>({
    smeId: '',
    name: '',
    description: '',
    targetDate: '',
    targetScore: 80
})

// Compute current SME score for display
const currentSmeScore = computed(() => {
    if (props.prefilledSme) return props.prefilledSme.score || 0
    if (form.value.smeId && props.smeList) {
        const found = props.smeList.find(s => s.id === form.value.smeId)
        return found ? found.score : 0
    }
    return 0
})

// Quick template options
const quickTemplates = [
    {
        id: 'investor-ready',
        label: 'Investor Ready',
        icon: '🎯',
        getGoalName: (smeName: string) => `Investor Ready by Q4 2024`,
        getDescription: (smeName: string) => `Achieve investor-ready status with 80+ overall score for ${smeName}`,
        targetScore: 80
    },
    {
        id: 'strengthen-weak',
        label: 'Strengthen Weak',
        icon: '💪',
        getGoalName: (smeName: string) => `Strengthen Weak Areas`,
        getDescription: (smeName: string) => `Focus on improving the weakest pillars to boost overall readiness`,
        targetScore: 75
    },
    {
        id: 'financial-focus',
        label: 'Financial Focus',
        icon: '💰',
        getGoalName: (smeName: string) => `Financial Excellence`,
        getDescription: (smeName: string) => `Improve financial metrics and reduce financial risk for ${smeName}`,
        targetScore: 85
    }
]



// Pillar targets with current and target scores
const pillarTargets = ref<Array<{
    name: string
    currentScore: number
    targetScore: number
}>>([])

// Helper to update pillars based on an SME object
const updatePillarsForSme = (sme: any) => {
    const pillars = sme.pillars || generatePillarScores(sme.id, sme.score ?? 0)
    pillarTargets.value = pillars.map((p: any) => {
        // Set target score to be at least 15 points higher, capped at 100
        const targetScore = Math.min(100, p.score + 15)
        return {
            name: p.name,
            currentScore: p.score,
            targetScore
        }
    })
}

// Watch for prefilled SME data
watch(() => props.prefilledSme, (newSme) => {
    if (newSme) {
        // Auto-fill the form with SME data
        form.value.smeId = String(newSme.id)

        // Set a smart default goal name
        form.value.name = `Investor Ready by Q4 2024`

        // Set a smart description
        form.value.description = `Achieve investor-ready status with 80+ overall score for ${newSme.name}`

        // Set target score based on current score (aim for 80 or higher)
        form.value.targetScore = Math.max(80, Math.ceil((newSme.score + 20) / 10) * 10)

        // Set default target date (3 months from now)
        const targetDate = new Date()
        targetDate.setMonth(targetDate.getMonth() + 3)
        form.value.targetDate = targetDate.toISOString().split('T')[0]!

        // Generate consistent pillar scores using utility
        updatePillarsForSme(newSme)
    }
}, { immediate: true })

// ADDED: Watch form.smeId to handle manual selection from dropdown
watch(() => form.value.smeId, (newId) => {
    if (newId && props.smeList) {
        const selectedSme = props.smeList.find(s => s.id === newId)
        if (selectedSme) {
            // Update pillars for the manually selected SME
            updatePillarsForSme(selectedSme)

            // Should potentially update other fields if they are empty or default?
            // For now, let's at least make sure basics are there if empty
            if (!form.value.name) form.value.name = `Goal for ${selectedSme.name}`
        }
    }
})

const applyTemplate = (template: any) => {
    const sme = props.smeList?.find(s => s.id === form.value.smeId)
    const smeName = sme?.name || 'SME'
    form.value.name = template.getGoalName(smeName)
    form.value.description = template.getDescription(smeName)
    form.value.targetScore = template.targetScore
}

const closeModal = () => {
    emit('close')
}

const createGoal = () => {
    // Validate and emit with pillar targets
    emit('create', {
        ...form.value,
        pillarTargets: pillarTargets.value
    })
    closeModal()
}
</script>

<style scoped>
/* Custom range slider styling if needed, but accent-teal-600 works well in modern browsers */
</style>
