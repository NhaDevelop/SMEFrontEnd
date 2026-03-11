<template>
  <span :class="badgeClasses"
    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
    {{ label }}
  </span>
</template>

<script>
export default {
  name: 'PriorityBadge',
  props: {
    priority: {
      type: String,
      required: true,
      validator: (value) => ['high', 'medium', 'low'].includes(value)
    }
  },
  computed: {
    label() {
      const labels = {
        high: 'High Priority',
        medium: 'Medium Priority',
        low: 'Low Priority'
      }
      return labels[this.priority]
    },
    badgeClasses() {
      const classes = {
        high: 'bg-red-100 text-red-700',
        medium: 'bg-orange-100 text-orange-700',
        low: 'bg-yellow-100 text-yellow-700'
      }
      return classes[this.priority]
    }
  }
}
</script>
