<template>
  <div class="h-80">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default {
  name: 'ProgressChart',
  components: {
    Line
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const chartData = computed(() => ({
      labels: props.data.map(d => d.date || d.month),
      datasets: [
        {
          label: 'Investment Readiness Score',
          data: props.data.map(d => d.score),
          fill: true,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx
            const gradient = ctx.createLinearGradient(0, 0, 0, 300)
            gradient.addColorStop(0, 'rgba(15, 118, 110, 0.3)')
            gradient.addColorStop(1, 'rgba(15, 118, 110, 0.0)')
            return gradient
          },
          borderColor: 'rgba(15, 118, 110, 1)',
          borderWidth: 3,
          pointBackgroundColor: 'rgba(15, 118, 110, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.4
        }
      ]
    }))

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          min: 0,
          ticks: {
            stepSize: 25,
            font: {
              size: 11
            },
            color: '#6b7280'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          }
        },
        x: {
          ticks: {
            font: {
              size: 11
            },
            color: '#6b7280'
          },
          grid: {
            display: false
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
              return `Score: ${context.parsed.y}/100`
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
