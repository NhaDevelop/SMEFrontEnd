<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Assessment Scoring Debug</h1>
      
      <!-- Pillar Weights Check -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">1. Pillar Weights Check</h2>
          <button 
            @click="checkPillars"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Check
          </button>
        </div>
        <div v-if="pillarData" class="space-y-4">
          <div class="flex items-center gap-4">
            <div 
              :class="pillarData.is_valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              class="px-4 py-2 rounded-full font-medium"
            >
              {{ pillarData.is_valid ? '✓ Valid' : '✗ Invalid' }}
            </div>
            <span class="text-gray-600">Total Weight: {{ pillarData.total_weight }}</span>
            <span class="text-gray-600">({{ pillarData.pillars_count }} pillars)</span>
          </div>
          <div v-if="!pillarData.is_valid" class="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
            ⚠️ Pillar weights don't sum to 100! This breaks score calculations.
          </div>
          <table class="w-full border-collapse border border-gray-200">
            <thead>
              <tr class="bg-gray-50">
                <th class="border border-gray-200 px-4 py-2 text-left">Pillar</th>
                <th class="border border-gray-200 px-4 py-2 text-left">Weight</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pillar in pillarData.pillars" :key="pillar.id">
                <td class="border border-gray-200 px-4 py-2">{{ pillar.name }}</td>
                <td class="border border-gray-200 px-4 py-2">{{ pillar.weight }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- All Assessments Check -->
      <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">2. All Assessments Score Check</h2>
          <button 
            @click="checkAllAssessments"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Check All
          </button>
        </div>
        <div v-if="assessmentsData" class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-gray-50 p-4 rounded-md">
              <div class="text-sm text-gray-600">Total</div>
              <div class="text-2xl font-bold">{{ assessmentsData.total_assessments }}</div>
            </div>
            <div class="bg-green-50 p-4 rounded-md">
              <div class="text-sm text-green-600">Matches</div>
              <div class="text-2xl font-bold text-green-700">{{ assessmentsData.matches }}</div>
            </div>
            <div class="bg-red-50 p-4 rounded-md">
              <div class="text-sm text-red-600">Mismatches</div>
              <div class="text-2xl font-bold text-red-700">{{ assessmentsData.mismatches }}</div>
            </div>
          </div>
          
          <div v-if="assessmentsData.mismatch_details.length > 0" class="mt-4">
            <h3 class="font-medium text-red-700 mb-2">Mismatched Assessments:</h3>
            <table class="w-full border-collapse border border-red-200">
              <thead>
                <tr class="bg-red-50">
                  <th class="border border-red-200 px-4 py-2 text-left">Assessment ID</th>
                  <th class="border border-red-200 px-4 py-2 text-left">Stored</th>
                  <th class="border border-red-200 px-4 py-2 text-left">Calculated</th>
                  <th class="border border-red-200 px-4 py-2 text-left">Diff</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in assessmentsData.mismatch_details" :key="m.assessment_id">
                  <td class="border border-red-200 px-4 py-2">{{ m.assessment_id }}</td>
                  <td class="border border-red-200 px-4 py-2">{{ m.stored }}</td>
                  <td class="border border-red-200 px-4 py-2">{{ m.calculated }}</td>
                  <td class="border border-red-200 px-4 py-2 text-red-600">{{ m.difference }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Single Assessment Debug -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-800">3. Single Assessment Debug</h2>
          <div class="flex gap-2">
            <input 
              v-model="assessmentId"
              type="number" 
              placeholder="Assessment ID"
              class="px-3 py-2 border border-gray-300 rounded-md"
            />
            <button 
              @click="debugAssessment"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Debug
            </button>
          </div>
        </div>
        
        <div v-if="singleAssessmentData" class="space-y-4">
          <div class="flex items-center gap-4">
            <div 
              :class="singleAssessmentData.is_match ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              class="px-4 py-2 rounded-full font-medium"
            >
              {{ singleAssessmentData.is_match ? '✓ Score Correct' : '✗ Score Mismatch' }}
            </div>
            <span class="text-gray-600">SME: {{ singleAssessmentData.sme_name }}</span>
          </div>
          
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-blue-50 p-4 rounded-md">
              <div class="text-sm text-blue-600">Stored Score</div>
              <div class="text-2xl font-bold text-blue-700">{{ singleAssessmentData.stored_total_score }}</div>
            </div>
            <div class="bg-green-50 p-4 rounded-md">
              <div class="text-sm text-green-600">Calculated</div>
              <div class="text-2xl font-bold text-green-700">{{ singleAssessmentData.calculated_total_score }}</div>
            </div>
            <div class="bg-red-50 p-4 rounded-md">
              <div class="text-sm text-red-600">Difference</div>
              <div class="text-2xl font-bold text-red-700">{{ singleAssessmentData.difference }}</div>
            </div>
          </div>

          <div class="mt-4">
            <h3 class="font-medium text-gray-800 mb-2">Pillar Breakdown:</h3>
            <table class="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr class="bg-gray-50">
                  <th class="border border-gray-200 px-3 py-2 text-left">Pillar</th>
                  <th class="border border-gray-200 px-3 py-2 text-left">Weight</th>
                  <th class="border border-gray-200 px-3 py-2 text-left">Earned</th>
                  <th class="border border-gray-200 px-3 py-2 text-left">Max</th>
                  <th class="border border-gray-200 px-3 py-2 text-left">%</th>
                  <th class="border border-gray-200 px-3 py-2 text-left">Contribution</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in singleAssessmentData.pillar_breakdown" :key="p.pillar_id">
                  <td class="border border-gray-200 px-3 py-2">{{ p.pillar_name }}</td>
                  <td class="border border-gray-200 px-3 py-2">{{ p.pillar_weight }}%</td>
                  <td class="border border-gray-200 px-3 py-2">{{ p.earned_points }}</td>
                  <td class="border border-gray-200 px-3 py-2">{{ p.max_points }}</td>
                  <td class="border border-gray-200 px-3 py-2">{{ p.pillar_percentage }}%</td>
                  <td class="border border-gray-200 px-3 py-2 font-medium">{{ p.weighted_contribution }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
            <strong>Formula:</strong> {{ singleAssessmentData.calculation_summary.formula }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()

const pillarData = ref<any>(null)
const assessmentsData = ref<any>(null)
const singleAssessmentData = ref<any>(null)
const assessmentId = ref('')

const checkPillars = async () => {
  try {
    const res = await $api('/admin/debug/pillars')
    pillarData.value = res
  } catch (e) {
    alert('Error: ' + (e as Error).message)
  }
}

const checkAllAssessments = async () => {
  try {
    const res = await $api('/admin/debug/assessments/score-check')
    assessmentsData.value = res
  } catch (e) {
    alert('Error: ' + (e as Error).message)
  }
}

const debugAssessment = async () => {
  if (!assessmentId.value) {
    alert('Please enter an assessment ID')
    return
  }
  try {
    const res = await $api(`/admin/debug/assessment/${assessmentId.value}`)
    singleAssessmentData.value = res
  } catch (e) {
    alert('Error: ' + (e as Error).message)
  }
}
</script>
