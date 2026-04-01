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
                                    <!-- Select Program -->
                                    <div>
                                        <label class="block text-sm font-bold text-gray-700 mb-1">Select Program
                                            *</label>
                                        <select v-model="form.programId"
                                            class="w-full rounded-lg border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 text-gray-900">
                                            <option value="">Choose a Program</option>
                                            <option v-for="program in investorStore.programs" :key="program.id"
                                                :value="program.id">{{ program.name }}
                                            </option>
                                        </select>
                                    </div>

                                    <!-- Select SME -->
                                    <div v-if="form.programId">
                                        <label class="block text-sm font-bold text-gray-700 mb-1">Select SME *</label>
                                        <select v-model="form.smeId"
                                            class="w-full rounded-lg border-gray-200 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm py-2.5 text-gray-900">
                                            <option value="">Choose an SME</option>
                                            <option v-for="sme in filteredSmeList" :key="sme.id" :value="sme.id">{{
                                                sme.name }}
                                            </option>
                                        </select>
                                        <p v-if="filteredSmeList.length === 0" class="text-xs text-orange-500 mt-1">No
                                            SMEs from your dealflow are enrolled in the selected program.</p>
                                    </div>
                                    <div v-else
                                        class="text-xs text-gray-500 italic p-2 bg-gray-50 rounded border border-gray-100">
                                        Please select a program first to assign a goal.
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
                                                    :class="['w-full rounded-lg shadow-sm sm:text-sm py-2.5 pl-3 text-gray-900 icon-right', errors.targetDate ? 'border-red-500 ring-1 ring-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-teal-500 focus:ring-teal-500']" />
                                                <CalendarIcon
                                                    class="w-5 h-5 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                                            </div>
                                            <p v-if="errors.targetDate" class="text-xs text-red-500 mt-1">Target date is
                                                required</p>
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

                                    <div class="space-y-4 pt-2">
                                        <div v-for="pillar in pillarTargets" :key="pillar.name" class="space-y-2">
                                            <div class="flex items-center justify-between">
                                                <span class="text-sm font-bold text-gray-900">{{ pillar.name }}</span>
                                                <div class="flex items-center gap-2 text-xs">
                                                    <span class="text-gray-500 font-medium">{{ pillar.currentScore
                                                        }}</span>
                                                    <span class="text-gray-300">→</span>
                                                    <span class="text-[#0F766E] font-bold">{{ pillar.targetScore
                                                        }}</span>
                                                    <span v-if="pillar.targetScore > pillar.currentScore"
                                                        class="text-orange-500 font-medium">
                                                        (+{{ pillar.targetScore - pillar.currentScore }})
                                                    </span>
                                                </div>
                                            </div>

                                            <input type="range" v-model.number="pillar.targetScore" min="0" max="100"
                                                step="1"
                                                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0F766E]" />
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
import { ref, watch, computed, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ArrowLongRightIcon, XMarkIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import { useInvestorStore } from '~/stores/investor.store'

const investorStore = useInvestorStore()

onMounted(() => {
    if (investorStore.programs.length === 0) {
        investorStore.fetchPrograms()
    }
})

const props = defineProps<{
    isOpen: boolean
    smeList?: any[]
    prefilledSme?: any
}>()

const emit = defineEmits(['close', 'create'])

const activeTab = ref('basic')
const form = ref<{
    programId: string | number
    smeId: string | number
    name: string
    description: string
    targetDate: string
    targetScore: number
}>({
    programId: '',
    smeId: '',
    name: '',
    description: '',
    targetDate: '',
    targetScore: 80
})

watch(() => form.value.programId, async (newProgramId) => {
    if (newProgramId) {
        await investorStore.fetchParticipants(newProgramId)
        if (form.value.smeId) {
            const isValid = filteredSmeList.value.some(sme => String(sme.id) === String(form.value.smeId))
            if (!isValid) form.value.smeId = ''
        }
    } else {
        investorStore.programParticipants = []
        form.value.smeId = ''
    }
})

const filteredSmeList = computed(() => {
    if (!form.value.programId) return []

    // Use the backend participants list so we get exact enrollments
    const participants = investorStore.programParticipants || []
    const smeParticipants = participants.filter((p: any) => p.role === 'SME')

    return smeParticipants.map((p: any) => {
        // Link to existing dealflow data to maintain score and pillars
        const found = props.smeList?.find(s => String(s.id) === String(p.profile_id))
        if (found) return found

        return {
            id: p.profile_id,
            name: p.name,
            score: 0,
            pillars: []
        }
    })
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

// Quick template options based on selected SME risk areas
const quickTemplates = computed(() => {
    if (!form.value.smeId || !props.smeList) return []
    const sme = props.smeList.find(s => s.id === form.value.smeId)
    if (!sme || !sme.pillars || sme.pillars.length === 0) return []

    const templates = []
    
    // Find high risk pillars (score < 60)
    const highRiskPillars = sme.pillars.filter((p: any) => p.score < 60)
    if (highRiskPillars.length > 0) {
        templates.push({
            id: 'address-critical',
            label: 'Address Critical Risks',
            icon: '🛡️',
            getGoalName: (smeName: string) => `Mitigate High Risks for ${smeName}`,
            getDescription: (smeName: string) => `Bring early-stage and pre-investment risk areas up to near-ready safe points.`,
            apply: () => {
                let sum = 0
                pillarTargets.value.forEach(pt => {
                    const original = sme.pillars.find((p: any) => (p.name || p.pillar_name) === pt.name)
                    const score = original ? original.score : 0
                    if (score < 60) {
                        pt.targetScore = Math.max(score + 15, 65) // Push to safe near-ready
                    } else {
                        pt.targetScore = score // Keep as is
                    }
                    sum += pt.targetScore
                })
                form.value.targetScore = Math.round(sum / pillarTargets.value.length)
            }
        })
    }

    // Find near ready pillars (60 <= score < 80)
    const nearReadyPillars = sme.pillars.filter((p: any) => p.score >= 60 && p.score < 80)
    if (nearReadyPillars.length > 0) {
        templates.push({
            id: 'push-to-ready',
            label: 'Push to Investor Ready',
            icon: '🚀',
            getGoalName: (smeName: string) => `Achieve Investor Readiness`,
            getDescription: (smeName: string) => `Elevate near-ready pillars above the 80-point threshold for full investment readiness.`,
            apply: () => {
                let sum = 0
                pillarTargets.value.forEach(pt => {
                    const original = sme.pillars.find((p: any) => (p.name || p.pillar_name) === pt.name)
                    const score = original ? original.score : 0
                    if (score >= 60 && score < 80) {
                        pt.targetScore = Math.max(score + 10, 85) // Push to investor ready
                    } else {
                        pt.targetScore = score > 80 ? score : pt.targetScore // Keep as is or existing target
                    }
                    sum += pt.targetScore
                })
                form.value.targetScore = Math.round(sum / pillarTargets.value.length)
            }
        })
    }

    // Always include overall template
    templates.push({
        id: 'overall-growth',
        label: 'Overall Growth Target',
        icon: '📈',
        getGoalName: (smeName: string) => `Overall Growth & Readiness`,
        getDescription: (smeName: string) => `A balanced goal to improve the overall readiness score across all pillars.`,
        apply: () => {
            let sum = 0
            pillarTargets.value.forEach(pt => {
                const original = sme.pillars.find((p: any) => (p.name || p.pillar_name) === pt.name)
                const score = original ? original.score : 0
                pt.targetScore = Math.min(100, score + 15) // Blanket +15 boost
                sum += pt.targetScore
            })
            form.value.targetScore = Math.round(sum / pillarTargets.value.length)
        }
    })

    return templates.slice(0, 3) // Max 3 templates fit in grid
})



// Pillar targets with current and target scores
const pillarTargets = ref<Array<{
    name: string
    currentScore: number
    targetScore: number
}>>([])

const updatePillarsForSme = (sme: any) => {
    const pillars = Array.isArray(sme.pillars) && sme.pillars.length > 0 ? sme.pillars : []
    pillarTargets.value = pillars.map((p: any) => {
        // Set target score to be at least 15 points higher, capped at 100
        const targetScore = Math.min(100, (p.score || 0) + 15)
        return {
            name: p.name || p.pillar_name,
            currentScore: p.score || 0,
            targetScore
        }
    })
}

// Watch for prefilled SME data
watch(() => props.prefilledSme, (newSme) => {
    if (newSme) {
        // Auto-select program if available
        if (newSme.programIds && newSme.programIds.length > 0) {
            form.value.programId = newSme.programIds[0]
        }

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

// Add two-way syncing between overall target and pillar targets
let isSyncing = false

watch(() => form.value.targetScore, (newVal) => {
    if (isSyncing || pillarTargets.value.length === 0) return
    isSyncing = true

    const currentAvg = pillarTargets.value.reduce((sum, p) => sum + p.targetScore, 0) / pillarTargets.value.length
    const diff = newVal - currentAvg

    if (Math.abs(diff) >= 0.5) {
        // Find total points to distribute
        let remainingPointsToDistribute = diff * pillarTargets.value.length
        
        // Loop up to 5 times to distribute points that hit the 100 cap
        let passes = 0
        while (Math.abs(remainingPointsToDistribute) > 0.1 && passes < 5) {
            let activePillars = 0
            // Count how many pillars CAN still be targeted
            if (remainingPointsToDistribute > 0) {
                activePillars = pillarTargets.value.filter(p => p.targetScore < 100).length
            } else {
                activePillars = pillarTargets.value.filter(p => p.targetScore > 0).length
            }

            if (activePillars === 0) break // All capped! Unsolvable limit

            const share = remainingPointsToDistribute / activePillars
            remainingPointsToDistribute = 0

            pillarTargets.value.forEach((p) => {
                if ((share > 0 && p.targetScore < 100) || (share < 0 && p.targetScore > 0)) {
                    let newScore = p.targetScore + share
                    if (newScore > 100) {
                        remainingPointsToDistribute += newScore - 100
                        newScore = 100
                    } else if (newScore < 0) {
                        remainingPointsToDistribute += newScore
                        newScore = 0
                    }
                    p.targetScore = newScore
                }
            })
            passes++
        }
        
        // Round accurately inside bounds
        pillarTargets.value.forEach((p) => { p.targetScore = Math.max(0, Math.min(100, Math.round(p.targetScore))) })
    }

    setTimeout(() => { isSyncing = false }, 10)
})

watch(pillarTargets, (newPillars) => {
    if (isSyncing || newPillars.length === 0) return
    isSyncing = true

    const avg = newPillars.reduce((sum, p) => sum + p.targetScore, 0) / newPillars.length
    form.value.targetScore = Math.max(0, Math.min(100, Math.round(avg)))

    setTimeout(() => { isSyncing = false }, 10)
}, { deep: true })

const applyTemplate = (template: any) => {
    const sme = props.smeList?.find(s => s.id === form.value.smeId)
    const smeName = sme?.name || 'SME'
    form.value.name = template.getGoalName(smeName)
    form.value.description = template.getDescription(smeName)
    
    // Disable syncing temporarily while applying template explicitly
    isSyncing = true
    if (template.apply) {
        template.apply()
    } else if (template.targetScore !== undefined) {
        form.value.targetScore = template.targetScore
    }
    setTimeout(() => { isSyncing = false }, 50)
}

const errors = ref({
    programId: false,
    smeId: false,
    name: false,
    targetDate: false
})

const closeModal = () => {
    emit('close')
}

const createGoal = () => {
    // Basic validation
    errors.value.programId = !form.value.programId
    errors.value.smeId = !form.value.smeId
    errors.value.name = !form.value.name
    errors.value.targetDate = !form.value.targetDate

    if (errors.value.programId || errors.value.smeId || errors.value.name || errors.value.targetDate) {
        activeTab.value = 'basic'
        return
    }

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
