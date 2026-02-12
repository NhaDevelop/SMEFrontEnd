<template>
    <Dashboard />
</template>

<script setup lang="ts">
import Dashboard from '~/pages/investor/dashboard.vue'

definePageMeta({
    layout: 'investor',
    middleware: ['auth', 'investor']
})
</script>
