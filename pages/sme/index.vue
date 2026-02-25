<template>
    <Dashboard />
</template>

<script setup lang="ts">
import Dashboard from '~/pages/sme/dashboard.vue'

definePageMeta({
    layout: 'default',
    middleware: ['auth', 'sme']
})
</script>
