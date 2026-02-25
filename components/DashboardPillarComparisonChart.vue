<template>
    <div class="h-96 w-full">
        <Bar :data="chartData" :options="chartOptions" />
    </div>
</template>

<script>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

export default {
    name: 'PillarComparisonChart',
    components: {
        Bar
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
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#111827',
                    bodyColor: '#374151',
                    borderColor: '#E5E7EB',
                    borderWidth: 1,
                    padding: 12,
                    boxPadding: 4
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: '#F3F4F6',
                        drawBorder: false
                    },
                    ticks: {
                        stepSize: 25,
                        color: '#6B7280',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#374151',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                axis: 'y'
            }
        }

        return {
            chartData,
            chartOptions
        }
    }
}
</script>
