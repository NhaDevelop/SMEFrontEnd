<template>
    <div class="space-y-4">
        <!-- Top Row: Current Period Selector -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex flex-wrap items-center gap-2">
                <CalendarIcon class="w-5 h-5 text-gray-400" />
                <span class="text-sm text-gray-600 font-medium">Current Period:</span>

                <!-- Presets -->
                <div class="flex items-center gap-1 bg-gray-100/80 p-1 rounded-lg">
                    <button v-for="preset in presets" :key="preset.value" @click="selectPreset(preset)" :class="[
                        'px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
                        selectedPreset === preset.value
                            ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
                    ]">
                        {{ preset.label }}
                    </button>
                </div>
            </div>

            <div class="flex items-center gap-2 relative">
                <!-- Date Range Display / Trigger -->
                <button @click="togglePicker('current')"
                    class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors shadow-sm min-w-[240px]">
                    <CalendarIcon class="w-4 h-4 text-gray-500" />
                    <span class="text-sm text-gray-700 font-medium">{{ formattedDateRange }}</span>
                    <ChevronDownIcon class="w-4 h-4 text-gray-400 ml-auto" />
                </button>

                <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                    <ArrowPathIcon class="w-4 h-4" />
                </button>

                <!-- Date Picker Popover -->
                <div v-if="showPicker"
                    class="absolute top-12 right-0 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50 w-[640px]">
                    <!-- Picker Header -->
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-sm font-semibold text-gray-700">Select {{ activePicker === 'compare' ?
                            'Comparison' : 'Period' }} Range</span>
                        <div class="flex items-center gap-2">
                            <button @click="changeMonth(-1)" class="p-1 hover:bg-gray-100 rounded-full">
                                <ChevronLeftIcon class="w-4 h-4 text-gray-500" />
                            </button>
                            <button @click="changeMonth(1)" class="p-1 hover:bg-gray-100 rounded-full">
                                <ChevronRightIcon class="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <!-- Calendars -->
                    <div class="flex gap-8">
                        <!-- Month 1 -->
                        <div class="flex-1">
                            <div class="text-center text-sm font-medium text-gray-900 mb-3">{{ formatMonth(pickerMonth1)
                                }}</div>
                            <div class="grid grid-cols-7 text-xs text-gray-400 mb-2 text-center">
                                <div v-for="d in daysOfWeek" :key="d">{{ d }}</div>
                            </div>
                            <div class="grid grid-cols-7 gap-y-1 gap-x-0">
                                <button v-for="date in getDaysInMonth(pickerMonth1)" :key="date.toISOString()"
                                    @click="handleDateSelect(date)" :class="getDateClass(date)"
                                    :disabled="date.getMonth() !== pickerMonth1.getMonth()">
                                    <span class="relative z-10">{{ date.getDate() }}</span>
                                </button>
                            </div>
                        </div>

                        <!-- Month 2 -->
                        <div class="flex-1">
                            <div class="text-center text-sm font-medium text-gray-900 mb-3">{{ formatMonth(pickerMonth2)
                                }}</div>
                            <div class="grid grid-cols-7 text-xs text-gray-400 mb-2 text-center">
                                <div v-for="d in daysOfWeek" :key="d">{{ d }}</div>
                            </div>
                            <div class="grid grid-cols-7 gap-y-1 gap-x-0">
                                <button v-for="date in getDaysInMonth(pickerMonth2)" :key="date.toISOString()"
                                    @click="handleDateSelect(date)" :class="getDateClass(date)"
                                    :disabled="date.getMonth() !== pickerMonth2.getMonth()">
                                    <span class="relative z-10">{{ date.getDate() }}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3">
                        <button @click="showPicker = false"
                            class="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded">Cancel</button>
                        <button @click="applyDateRange"
                            class="px-3 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded shadow-sm">Apply
                            Range</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Row: Comparison Toggle -->
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
                <!-- Toggle Switch -->
                <button @click="toggleCompare" :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                    localCompareEnabled ? 'bg-emerald-600' : 'bg-gray-200'
                ]">
                    <span class="sr-only">Use setting</span>
                    <span aria-hidden="true" :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                        localCompareEnabled ? 'translate-x-5' : 'translate-x-0'
                    ]" />
                </button>
                <span class="text-sm text-gray-600 font-medium cursor-pointer" @click="toggleCompare">Compare
                    Periods</span>
            </div>

            <div v-if="localCompareEnabled"
                class="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                <span class="text-sm text-gray-500">Compare with:</span>
                <button @click="togglePicker('compare')"
                    class="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors shadow-sm min-w-[200px]">
                    <CalendarIcon class="w-4 h-4 text-gray-400" />
                    <span class="text-sm text-gray-600">{{ formattedCompareRange }}</span>
                    <ChevronDownIcon class="w-3 h-3 text-gray-300 ml-auto" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CalendarIcon, ChevronDownIcon, ArrowPathIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
    modelValue: { start: Date, end: Date },
    compareValue: { start: Date, end: Date },
    compareEnabled: boolean,
    periodPreset: string
}>()

const emit = defineEmits(['update:modelValue', 'update:compareValue', 'update:compareEnabled', 'update:periodPreset', 'change'])

const presets = [
    { label: '7 Days', value: '7d' },
    { label: '1 Month', value: '1m' },
    { label: '3 Months', value: '3m' },
    { label: '6 Months', value: '6m' },
    { label: '1 Year', value: '1y' },
    { label: 'All Time', value: 'all' }
]

const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const selectedPreset = computed({
    get: () => props.periodPreset,
    set: (val) => emit('update:periodPreset', val)
})

const localCompareEnabled = computed({
    get: () => props.compareEnabled,
    set: (val) => emit('update:compareEnabled', val)
})

const toggleCompare = () => {
    localCompareEnabled.value = !localCompareEnabled.value
}

// Picker State
const showPicker = ref(false)
const activePicker = ref<'current' | 'compare'>('current')
const pickerMonth1 = ref(new Date())
const pickerMonth2 = ref(new Date(new Date().setMonth(new Date().getMonth() + 1)))

// Temporary selection state before applying
const tempSelection = ref<{ start: Date | null, end: Date | null }>({ start: null, end: null })

const formattedDateRange = computed(() => {
    return formatDateRange(props.modelValue.start, props.modelValue.end)
})

const formattedCompareRange = computed(() => {
    return formatDateRange(props.compareValue.start, props.compareValue.end)
})

const formatDateRange = (start: Date, end: Date) => {
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

const selectPreset = (preset: any) => {
    selectedPreset.value = preset.value
    const now = new Date()
    now.setHours(23, 59, 59, 0)
    let start = new Date(now)

    switch (preset.value) {
        case '7d':  start = new Date(now); start.setDate(now.getDate() - 7); break
        case '1m':  start = new Date(now); start.setMonth(now.getMonth() - 1); break
        case '3m':  start = new Date(now); start.setMonth(now.getMonth() - 3); break
        case '6m':  start = new Date(now); start.setMonth(now.getMonth() - 6); break
        case '1y':  start = new Date(now); start.setFullYear(now.getFullYear() - 1); break
        case 'all': start = new Date(2020, 0, 1); break
    }
    start.setHours(0, 0, 0, 0)

    const payload = { start, end: new Date(now) }
    emit('update:modelValue', payload)
    emit('change')
}

const togglePicker = (type: 'current' | 'compare') => {
    if (showPicker.value && activePicker.value === type) {
        showPicker.value = false
        return
    }

    activePicker.value = type
    showPicker.value = true

    // Reset temp selection to current value
    const currentRange = type === 'current' ? props.modelValue : props.compareValue
    tempSelection.value = { start: new Date(currentRange.start), end: new Date(currentRange.end) }

    // Set picker months to align with start date
    pickerMonth1.value = new Date(currentRange.start)
    pickerMonth1.value.setDate(1)
    pickerMonth2.value = new Date(pickerMonth1.value)
    pickerMonth2.value.setMonth(pickerMonth2.value.getMonth() + 1)
}

const changeMonth = (delta: number) => {
    pickerMonth1.value = new Date(pickerMonth1.value.setMonth(pickerMonth1.value.getMonth() + delta))
    pickerMonth2.value = new Date(pickerMonth2.value.setMonth(pickerMonth2.value.getMonth() + delta))
}

const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = []

    // Padding for start of month
    const startPadding = firstDay.getDay()
    for (let i = 0; i < startPadding; i++) {
        days.push(new Date(year, month, -startPadding + i + 1))
    }

    // Days in month
    for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push(new Date(year, month, i))
    }

    // Padding for end of row (optional but looks better)
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
        days.push(new Date(year, month + 1, i))
    }

    return days
}

const isSameDay = (d1: Date, d2: Date) => {
    if (!d1 || !d2) return false
    return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
}

const isBetween = (date: Date, start: Date, end: Date) => {
    if (!start || !end) return false
    return date > start && date < end
}

const getDateClass = (date: Date) => {
    const start = tempSelection.value.start
    const end = tempSelection.value.end

    let classes = 'w-8 h-8 flex items-center justify-center text-xs rounded-full transition-colors relative '

    if (isSameDay(date, start!) || isSameDay(date, end!)) {
        return classes + 'bg-emerald-600 text-white font-bold hover:bg-emerald-700'
    }

    if (start && end && isBetween(date, start, end)) {
        return 'w-full h-8 flex items-center justify-center text-xs bg-emerald-50 text-emerald-700 font-medium'
    }

    return classes + 'text-gray-700 hover:bg-gray-100'
}

const handleDateSelect = (date: Date) => {
    if (!tempSelection.value.start || (tempSelection.value.start && tempSelection.value.end)) {
        // Start new selection
        tempSelection.value = { start: date, end: null }
    } else {
        // Complete selection
        if (date < tempSelection.value.start) {
            tempSelection.value = { start: date, end: tempSelection.value.start }
        } else {
            tempSelection.value.end = date
        }
    }
}

const applyDateRange = () => {
    if (tempSelection.value.start && !tempSelection.value.end) {
        tempSelection.value.end = tempSelection.value.start // Single day selection fallback
    }

    if (tempSelection.value.start && tempSelection.value.end) {
        const payload = { start: tempSelection.value.start, end: tempSelection.value.end }
        if (activePicker.value === 'current') {
            emit('update:modelValue', payload)
            // If manual range, clear preset
            selectedPreset.value = 'custom'
        } else {
            emit('update:compareValue', payload)
        }
        showPicker.value = false
        emit('change')
    }
}
</script>
