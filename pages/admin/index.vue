<template>
    <AdminDashboard />
</template>

<script setup lang="ts">
import AdminDashboard from '~/components/AdminDashboard.vue'

definePageMeta({
    layout: 'admin',
    middleware: ['auth', 'admin']
})
</script>
