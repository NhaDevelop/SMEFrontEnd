<template>
  <div
    class="bg-white rounded-xl p-8 shadow-soft hover:shadow-lg transition-smooth cursor-pointer border-2 border-transparent hover:border-cyan-400"
    @click="handleClick">
    <div class="flex items-start gap-4">
      <!-- Icon -->
      <div :class="iconBgClass" class="flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center">
        <component :is="icon" class="w-7 h-7 text-white" />
      </div>

      <!-- Content -->
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ title }}
        </h3>
        <p class="text-sm text-gray-600">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  BuildingOfficeIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

export default {
  name: 'RoleCard',
  components: {
    BuildingOfficeIcon,
    ChartBarIcon,
    Cog6ToothIcon
  },
  props: {
    role: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    iconColor: {
      type: String,
      default: 'cyan'
    }
  },
  computed: {
    icon() {
      const icons = {
        sme_user: BuildingOfficeIcon,
        investor: ChartBarIcon,
        administrator: Cog6ToothIcon
      }
      return icons[this.role] || BuildingOfficeIcon
    },
    iconBgClass() {
      const colors = {
        cyan: 'bg-cyan-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500'
      }
      return colors[this.iconColor] || 'bg-cyan-500'
    }
  },
  methods: {
    handleClick() {
      this.$emit('select', this.role)
    }
  }
}
</script>
