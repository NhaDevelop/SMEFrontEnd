<template>
  <div class="h-80 flex items-center justify-center">
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
  name: 'RadarChart',
  components: {
    Radar
  },
  props: {
    pillars: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const chartData = computed(() => ({
      labels: props.pillars.map(p => p.name),
      datasets: [
        {
          label: 'Current Score',
          // Clamp to 0-100: old assessment data may have raw earned points > 100
          data: props.pillars.map(p => Math.min(100, Math.max(0, parseFloat(p.score) || 0))),
          backgroundColor: 'rgba(15, 118, 110, 0.2)',
          borderColor: 'rgba(15, 118, 110, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(15, 118, 110, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(15, 118, 110, 1)',
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          min: 0,
          ticks: {
            stepSize: 20,
            font: {
              size: 11
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          pointLabels: {
            font: {
              size: 12,
              weight: '500'
            },
            color: '#374151'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 13,
            weight: 'bold'
          },
          bodyFont: {
            size: 12
          },
          callbacks: {
            label: function (context) {
              return `Score: ${context.parsed.r}/100`
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
