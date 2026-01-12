<template>
  <span 
    :class="badgeClasses"
    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
  >
    <span class="w-2 h-2 rounded-full" :class="dotClass"></span>
    {{ label }}
  </span>
</template>

<script>
export default {
  name: 'RiskBadge',
  props: {
    level: {
      type: String,
      required: true,
      validator: (value) => ['low', 'medium', 'high'].includes(value)
    }
  },
  computed: {
    label() {
      const labels = {
        low: 'Low Risk',
        medium: 'Medium Risk',
        high: 'High Risk'
      }
      return labels[this.level]
    },
    badgeClasses() {
      const classes = {
        low: 'bg-green-50 text-green-700 border border-green-200',
        medium: 'bg-orange-50 text-orange-700 border border-orange-200',
        high: 'bg-red-50 text-red-700 border border-red-200'
      }
      return classes[this.level]
    },
    dotClass() {
      const classes = {
        low: 'bg-green-500',
        medium: 'bg-orange-500',
        high: 'bg-red-500'
      }
      return classes[this.level]
    }
  }
}
</script>
