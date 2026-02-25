<template>
    <div class="h-full w-full relative">
        <Radar :data="chartData" :options="chartOptions" />
    </div>
</template>

<script>
import { computed } from 'vue'
import { Radar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
)

export default {
    name: 'ComparisonRadarChart',
    components: {
        Radar
    },
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const chartData = computed(() => props.data)

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    left: 20,
                    right: 20
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    min: 0,
                    ticks: {
                        display: false, // Hide numeric labels on the spokes to keep it clean
                        stepSize: 25,
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    pointLabels: {
                        padding: 10, // Add space between point and label
                        font: {
                            size: 10,
                            weight: '500'
                        },
                        color: '#6B7280'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Hide built-in legend as it's custom in the parent
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#111827',
                    bodyColor: '#374151',
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    padding: 10,
                    boxPadding: 4,
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': ' + context.parsed.r
                        }
                    }
                }
            }
        }

        return {
            chartData,
            chartOptions
        }
    }
}
</script>
