<template>
    <AdminDashboard />
</template>

<script setup lang="ts">
import AdminDashboard from '~/components/admin/AdminDashboard.vue'

definePageMeta({
    layout: 'admin',
    middleware: ['auth', 'admin']
})
</script>
