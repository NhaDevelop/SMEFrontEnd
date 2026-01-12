<template>
  <MainLayout>
    <div class="flex-1 overflow-y-auto custom-scrollbar p-8">
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p class="text-gray-600">Generate and export detailed investment readiness reports</p>
        </div>

        <!-- Coming Soon Placeholder -->
        <div class="card text-center py-16">
          <DocumentTextIcon class="w-16 h-16 text-cyan-500 mx-auto mb-4" />
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">Reports & Analytics</h2>
          <p class="text-gray-600 mb-6">
            Detailed reports, PDF exports, and comparative analysis will be available soon.
          </p>
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg">
            <span class="text-sm font-medium">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue'
import { DocumentTextIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'ReportsView',
  components: {
    MainLayout,
    DocumentTextIcon
  }
}
</script>
