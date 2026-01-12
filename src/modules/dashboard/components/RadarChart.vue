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
          data: props.pillars.map(p => p.score),
          backgroundColor: 'rgba(6, 182, 212, 0.2)',
          borderColor: 'rgba(6, 182, 212, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(6, 182, 212, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(6, 182, 212, 1)',
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
            label: function(context) {
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
