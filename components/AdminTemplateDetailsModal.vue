<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('close')"></div>

        <!-- Modal -->
        <div
            class="relative bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
            <!-- Header -->
            <div class="px-8 py-6 border-b border-gray-100 flex items-start justify-between bg-white flex-shrink-0">
                <div class="flex-1 pr-8">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-xl font-bold text-gray-900">{{ template.name }}</h3>
                        <span :class="[
                            'px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5',
                            template.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                template.status === 'Draft' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                        ]">
                            {{ template.status }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-500 leading-relaxed">{{ template.description }}</p>
                </div>
                <button @click="$emit('close')"
                    class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                    <XMarkIcon class="w-6 h-6" />
                </button>
            </div>

            <!-- Tabs -->
            <div class="px-8 border-b border-gray-200 flex items-center gap-8 bg-white flex-shrink-0">
                <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" :class="[
                    'py-4 text-sm font-medium border-b-2 transition-colors',
                    activeTab === tab ? 'border-cyan-600 text-cyan-700' : 'border-transparent text-gray-500 hover:text-gray-700'
                ]">
                    {{ tab }}
                </button>
            </div>

            <!-- Body -->
            <div class="p-8 overflow-y-auto custom-scrollbar bg-white flex-1">

                <!-- Overview Tab -->
                <div v-if="activeTab === 'Overview'" class="space-y-8">
                    <div class="grid grid-cols-2 gap-x-12 gap-y-8">
                        <div>
                            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Version</p>
                            <p class="text-gray-900 font-medium">{{ template.version }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Created By</p>
                            <p class="text-gray-900 font-medium">{{ template.updatedBy || 'System Admin' }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Created</p>
                            <p class="text-gray-900 font-medium">Jan 1, 2024</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Last Updated</p>
                            <p class="text-gray-900 font-medium">{{ template.updatedAt || 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Pillars</p>
                            <p class="text-gray-900 font-medium">{{ template.pillarCount }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Total Questions
                            </p>
                            <p class="text-gray-900 font-medium">{{ template.questionCount }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Assessments
                                Completed</p>
                            <p class="text-gray-900 font-medium">{{ template.usageCount }}</p>
                        </div>
                        <div>
                            <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Published</p>
                            <p class="text-gray-900 font-medium">Jan 15, 2024</p>
                        </div>
                    </div>
                </div>

                <!-- Pillars Tab -->
                <div v-if="activeTab === 'Pillars'" class="space-y-4">
                    <div v-for="pillar in templatePillars" :key="pillar.id"
                        class="p-4 rounded-xl border border-gray-100 bg-white shadow-sm flex items-center justify-between hover:border-gray-200 transition-colors">
                        <div>
                            <h4 class="font-semibold text-gray-900 mb-1">{{ pillar.name }}</h4>
                            <p class="text-sm text-gray-500">Evaluate the SME's {{ pillar.name.toLowerCase() }}
                                capabilities
                            </p>
                        </div>
                        <div class="bg-gray-50 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700">
                            {{ pillar.questionCount }} questions
                        </div>
                    </div>
                </div>

                <!-- Version History Tab -->
                <div v-if="activeTab === 'Version History'" class="space-y-4">
                    <div class="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                <ArrowPathIcon class="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                                <div class="flex items-center gap-2">
                                    <span class="font-semibold text-gray-900">{{ template.version }}</span>
                                    <span
                                        class="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">Latest</span>
                                </div>
                            </div>
                        </div>
                        <div class="pl-11">
                            <p class="text-sm text-gray-600 mb-2">Initial release</p>
                            <p class="text-xs text-gray-400">{{ template.updatedBy || 'System Admin' }} • {{
                                template.updatedAt || 'Jan 1, 2024' }}</p>
                        </div>
                    </div>
                    <!-- Mock previous version for history visualization if needed, currently just showing current as per screenshot -->
                </div>

            </div>

            <!-- Footer -->
            <div
                class="px-8 py-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 flex-shrink-0">
                <button type="button" @click="$emit('close')"
                    class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm">
                    Close
                </button>
                <button type="button" @click="$emit('edit')"
                    class="px-4 py-2 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition-colors shadow-sm flex items-center gap-2">
                    <PencilSquareIcon class="w-4 h-4" />
                    Edit Template
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { XMarkIcon, PencilSquareIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import { useAdminStore } from '~/stores/admin.store'

const props = defineProps<{
    template: any
}>()

const emit = defineEmits(['close', 'edit'])
const adminStore = useAdminStore()

const tabs = ['Overview', 'Pillars', 'Version History']
const activeTab = ref('Overview')

const templatePillars = computed(() => {
    // Get all defined pillars from framework settings
    const allPillars = adminStore.frameworkSettings;

    // Get questions for this template
    const templateQuestions = adminStore.questions.filter(q => String(q.templateId) === String(props.template.id));

    // Map pillars with counts
    return allPillars.map(p => {
        const count = templateQuestions.filter(q => String(q.pillarId) === String(p.id)).length;
        return {
            ...p,
            questionCount: count
        }
    }).filter(p => p.questionCount > 0);
})
</script>

<style scoped>
@keyframes fade-in-up {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    animation: fade-in-up 0.3s ease-out;
}
</style>
