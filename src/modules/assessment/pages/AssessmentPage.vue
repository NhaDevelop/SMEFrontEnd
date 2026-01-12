<template>
  <MainLayout>
    <div class="flex-1 overflow-y-auto custom-scrollbar p-8">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Assessment</h1>
          <p class="text-gray-600">Complete your investment readiness assessment across all 8 pillars</p>
        </div>

        <!-- Coming Soon Placeholder -->
        <div class="card text-center py-16">
          <ClipboardDocumentCheckIcon class="w-16 h-16 text-cyan-500 mx-auto mb-4" />
          <h2 class="text-2xl font-semibold text-gray-900 mb-2">Assessment Module</h2>
          <p class="text-gray-600 mb-6">
            The comprehensive assessment questionnaire will be available soon.
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
import MainLayout from '@/shared/components/layout/MainLayout.vue'
import { ClipboardDocumentCheckIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'AssessmentView',
  components: {
    MainLayout,
    ClipboardDocumentCheckIcon
  }
}
</script>
