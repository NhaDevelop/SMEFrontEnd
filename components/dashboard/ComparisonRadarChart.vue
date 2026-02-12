<template>
    <div class="h-96 flex items-center justify-center">
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
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    min: 0,
                    ticks: {
                        stepSize: 25,
                        backdropColor: 'transparent',
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    pointLabels: {
                        font: {
                            size: 11,
                            weight: '500'
                        },
                        color: '#374151'
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#111827',
                    bodyColor: '#374151',
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    padding: 12,
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
