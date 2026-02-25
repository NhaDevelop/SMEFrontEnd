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

                <!-- Header Cards -->
                <div class="flex gap-6">
                    <div
                        class="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500 mb-1">Total Rules</p>
                            <p class="text-3xl font-bold text-gray-900">{{ rules.length }}</p>
                        </div>
                        <div class="p-3 bg-gray-50 rounded-lg">
                            <BoltIcon class="w-6 h-6 text-gray-400" />
                        </div>
                    </div>
                    <div
                        class="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500 mb-1">Active Rules</p>
                            <p class="text-3xl font-bold text-gray-900">{{ metrics.activeRules }}</p>
                        </div>
                        <div class="p-3 bg-green-50 rounded-lg">
                            <CheckCircleIcon class="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <div
                        class="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500 mb-1">Max Bonus</p>
                            <p class="text-3xl font-bold text-green-600">+{{ metrics.maxBonus }}</p>
                        </div>
                        <div class="p-3 bg-green-50 rounded-lg">
                            <ArrowTrendingUpIcon class="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <div
                        class="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-500 mb-1">Max Penalty</p>
                            <p class="text-3xl font-bold text-red-500">{{ metrics.maxPenalty }}</p>
                        </div>
                        <div class="p-3 bg-red-50 rounded-lg">
                            <ArrowTrendingDownIcon class="w-6 h-6 text-red-500" />
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                    <div class="flex items-center justify-between mb-6">
                        <div>
                            <h2 class="text-xl font-bold text-gray-900">Scoring Rules</h2>
                            <p class="text-gray-500 mt-1">Rules are applied in order. Multiple rules can trigger for the
                                same SME.</p>
                        </div>
                        <button @click="openCreateModal"
                            class="px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center gap-2">
                            <PlusIcon class="w-4 h-4" /> Add Rule
                        </button>
                    </div>
                    <div class="space-y-4">
                        <div v-for="rule in rules" :key="rule.id"
                            class="border border-gray-200 rounded-xl p-6 flex items-start gap-4 hover:border-teal-200 transition-colors">
                            <!-- Icon -->
                            <div :class="['p-3 rounded-lg', rule.modifier > 0 ? 'bg-teal-50' : 'bg-red-50']">
                                <ArrowTrendingUpIcon v-if="rule.modifier > 0" class="w-6 h-6 text-teal-600" />
                                <ArrowTrendingDownIcon v-else class="w-6 h-6 text-red-500" />
                            </div>

                            <!-- Content -->
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-1">
                                    <h3 class="text-lg font-medium text-gray-900">{{ rule.name }}</h3>
                                    <span
                                        :class="['px-2 py-0.5 rounded-full text-xs font-bold', rule.modifier > 0 ? 'bg-teal-600 text-white' : 'bg-red-500 text-white']">
                                        {{ rule.modifier > 0 ? '+' : '' }}{{ rule.modifier }} points
                                    </span>
                                </div>
                                <p class="text-gray-500 mb-3 text-sm">Award bonus points for SMEs with >20% monthly
                                    growth rate</p>

                                <div
                                    class="bg-gray-100 rounded px-3 py-1.5 inline-block font-mono text-xs text-gray-700 border border-gray-200">
                                    {{ rule.condition }}
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex items-center gap-4">
                                <button @click="toggleRule(rule)" :class="[
                                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                                    rule.isActive ? 'bg-teal-600' : 'bg-gray-200'
                                ]">
                                    <span aria-hidden="true" :class="[
                                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                                        rule.isActive ? 'translate-x-5' : 'translate-x-0'
                                    ]" />
                                </button>
                                <button @click="editRule(rule)" class="text-gray-400 hover:text-gray-600">
                                    <PencilSquareIcon class="w-5 h-5" />
                                </button>
                                <button @click="deleteRule(rule)" class="text-gray-400 hover:text-red-500">
                                    <TrashIcon class="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>

        <CreateRuleModal v-if="showModal" :initial-data="editingRule" @cancel="showModal = false"
            @save="handleSaveRule" />

    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAdminStore } from '~/stores/admin.store'
import CreateRuleModal from '~/components/AdminCreateRuleModal.vue'
import {
    PlusIcon,
    BoltIcon,
    CheckCircleIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/vue/24/outline'

const adminStore = useAdminStore()
const rules = computed(() => adminStore.scoringRules)
const showModal = ref(false)
const editingRule = ref<any>(null)

const metrics = computed(() => {
    const active = rules.value.filter(r => r.isActive)
    return {
        activeRules: active.length,
        maxBonus: active.filter(r => r.modifier > 0).reduce((sum, r) => sum + r.modifier, 0),
        maxPenalty: active.filter(r => r.modifier < 0).reduce((sum, r) => sum + r.modifier, 0)
    }
})

const openCreateModal = () => {
    editingRule.value = null
    showModal.value = true
}

const editRule = (rule: any) => {
    editingRule.value = rule
    showModal.value = true
}

const handleSaveRule = async (ruleData: any) => {
    if (ruleData.id) {
        await adminStore.updateScoringRule(ruleData)
    } else {
        await adminStore.addScoringRule(ruleData)
    }
    showModal.value = false
    editingRule.value = null
}

const toggleRule = async (rule: any) => {
    const updated = { ...rule, isActive: !rule.isActive }
    await adminStore.updateScoringRule(updated)
}

const deleteRule = async (rule: any) => {
    if (confirm(`Are you sure you want to delete "${rule.name}"?`)) {
        await adminStore.deleteScoringRule(rule.id)
    }
}

definePageMeta({
    layout: 'admin',
    middleware: ['auth', 'admin']
})
</script>
