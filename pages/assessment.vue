<template>
  <!-- Template Selection Screen (when no template specified) -->
  <div v-if="!currentTemplateId || currentTemplateId === 'temp_001' && !route.query.template"
    class="min-h-screen bg-gray-50 flex items-center justify-center p-8">
    <div class="max-w-4xl w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Select an Assessment</h1>
        <p class="text-gray-600">Choose a program to begin your investment readiness assessment</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="template in availableTemplates" :key="template.id" @click="selectTemplate(template.id)"
          class="bg-white rounded-xl border-2 border-gray-200 p-6 cursor-pointer hover:border-teal-500 hover:shadow-lg transition-all duration-200">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <ClipboardDocumentCheckIcon class="w-6 h-6 text-teal-600" />
            </div>
            <span class="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
              {{ getQuestionCount(template.id) }} questions
            </span>
          </div>

          <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ template.name }}</h3>
          <p class="text-sm text-gray-600 mb-4">{{ template.description }}</p>

          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">Est. {{ template.duration }} minutes</span>
            <span class="text-teal-600 font-medium flex items-center gap-1">
              Start Assessment
              <ArrowRightIcon class="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      <div v-if="availableTemplates.length === 0" class="text-center py-12">
        <ClipboardDocumentCheckIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No Assessments Available</h3>
        <p class="text-gray-600 mb-6">There are no assessment templates available at this time.</p>
        <button @click="$router.push('/sme/dashboard')"
          class="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
          Return to Dashboard
        </button>
      </div>
    </div>
  </div>

  <!-- Main Assessment (when template is selected) -->
  <div v-else class="flex h-full bg-gray-50">
    <!-- Assessment Sidebar -->
    <aside
      class="w-72 bg-white border-r border-gray-100 flex flex-col h-full overflow-y-auto shrink-0 transition-all duration-300">
      <div class="p-6">
        <h2 class="text-sm font-bold text-gray-900 flex items-center gap-2 mb-6">
          <ClipboardDocumentListIcon class="w-5 h-5 text-teal-600" />
          Jump to Section
        </h2>

        <nav class="space-y-2">
          <button v-for="(section, index) in sections" :key="section.id" @click="currentSection = index" :class="[
            'w-full flex items-start gap-3 p-3 text-left rounded-xl transition-all duration-200 group',
            currentSection === index ? 'bg-gray-100' : 'hover:bg-gray-50'
          ]">
            <!-- Icon State -->
            <div class="shrink-0 relative">
              <div v-if="section.progress === 100"
                class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center transition-transform duration-300 scale-100">
                <CheckIcon class="w-6 h-6 text-white stroke-2" />
              </div>
              <div v-else :class="[
                'w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200',
                currentSection === index ? 'bg-teal-600 text-white shadow-md' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
              ]">
                <component :is="section.icon" class="w-5 h-5" />
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 pt-0.5 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span :class="[
                  'text-sm font-semibold truncate pr-2',
                  currentSection === index ? 'text-gray-900' : 'text-gray-600'
                ]">{{ section.name }}</span>
                <span v-if="section.progress < 100 && section.progress > 0" class="text-xs font-medium text-gray-500">{{
                  section.progress }}%</span>
              </div>

              <!-- Progress Bar -->
              <div v-if="section.progress < 100" class="h-1.5 bg-gray-100 rounded-full overflow-hidden w-full mt-1">
                <div class="h-full bg-teal-500 rounded-full transition-all duration-500 ease-out"
                  :style="{ width: `${section.progress}%` }"></div>
              </div>
            </div>
          </button>
        </nav>
      </div>

      <div class="mt-auto p-6 border-t border-gray-100">
        <button
          class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
          <CheckCircleIcon class="w-5 h-5 text-gray-400" />
          Review & Submit
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-full overflow-hidden">
      <!-- Scrollable Content Area -->
      <div class="flex-1 overflow-y-auto p-8 relative">
        <!-- Success State Overlay -->
        <div v-if="isSubmitted"
          class="max-w-3xl mx-auto py-12 flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
          <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIconSolid class="w-12 h-12 text-green-600" />
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Assessment Submitted Successfully!</h2>
          <p class="text-gray-500 max-w-lg mb-8 text-lg">
            Thank you for completing the Investment Readiness Assessment. Your responses have been recorded and your
            score is calculated.
          </p>

          <div class="bg-white border border-gray-100 shadow-sm rounded-xl p-6 w-full max-w-md mb-8">
            <div class="text-sm font-medium text-gray-500 mb-1">Your Preliminary Score</div>
            <div class="text-6xl font-bold text-teal-600 mb-2">{{ verifiedScore !== null ? verifiedScore : finalScore }}
            </div>
            <div class="text-sm text-gray-400">out of 100</div>
          </div>

          <div class="flex gap-4">
            <button @click="navigateToDashboard"
              class="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors shadow-sm">
              Go to Dashboard
            </button>
          </div>
        </div>

        <div v-else class="max-w-3xl mx-auto">
          <!-- Header -->
          <div class="flex items-start justify-between mb-2">
            <div>
              <div class="flex items-center gap-3 mb-1">
                <h1 class="text-2xl font-bold text-gray-900">Investment Readiness Assessment</h1>
                <span
                  class="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                  {{adminStore.templates.find(t => t.id === currentTemplateId)?.name || 'Assessment'}}
                </span>
              </div>
              <div class="flex items-center gap-2 mb-2">
                <span class="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold">
                  {{ programName || defaultProgramName }}
                </span>
              </div>
              <p class="text-gray-500 text-sm">Complete this assessment as part of the {{ programName ||
                defaultProgramName }} program</p>
            </div>
            <button
              class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <BookmarkIcon class="w-4 h-4 text-gray-500" />
              Save Draft
            </button>
          </div>

          <!-- Step Progress -->
          <div class="mt-6 mb-8">
            <div class="flex items-center justify-between text-sm font-medium text-gray-500 mb-2">
              <span>Step {{ currentSection + 1 }} of {{ sections.length }}</span>
              <!-- Mock Calculation for Overall Progress -->
              <span>{{ overallProgress }}% Complete</span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-teal-500 rounded-full transition-all duration-500"
                :style="{ width: `${overallProgress}%` }"></div>
            </div>
          </div>

          <!-- Form Card -->
          <div v-if="currentSectionData" class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div class="flex items-center gap-3 mb-6">
              <BuildingOfficeIcon class="w-6 h-6 text-teal-600" />
              <h2 class="text-xl font-bold text-gray-900">{{ currentSectionData.name }}</h2>
            </div>
            <p class="text-gray-500 text-sm mb-8">Enter your company information to get started</p>

            <!-- Form Fields -->
            <div v-if="currentSectionData.id === 'profile'" class="space-y-6">
              <!-- Company Profile Content -->
              <div class="grid grid-cols-2 gap-6">
                <!-- Company Name -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Company Name <span
                      class="text-red-500">*</span></label>
                  <input type="text" v-model="formData.name" placeholder="Enter company name"
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm placeholder-gray-400">
                </div>

                <!-- Sector -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Sector <span
                      class="text-red-500">*</span></label>
                  <div class="relative">
                    <select v-model="formData.sector"
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm appearance-none bg-white">
                      <option value="" disabled selected>Select sector</option>
                      <option v-for="sector in sectors" :key="sector" :value="sector">{{ sector }}</option>
                    </select>
                    <ChevronDownIcon
                      class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <!-- Location -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Location <span
                      class="text-red-500">*</span></label>
                  <div class="relative">
                    <select v-model="formData.location"
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm appearance-none bg-white">
                      <option value="" disabled selected>Select location</option>
                      <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
                    </select>
                    <ChevronDownIcon
                      class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <!-- Year Founded -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Year Founded <span
                      class="text-red-500">*</span></label>
                  <input type="number" v-model="formData.founded" placeholder="e.g., 2020"
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm placeholder-gray-400">
                </div>

                <!-- Num Employees -->
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Number of Employees <span
                      class="text-red-500">*</span></label>
                  <div class="relative">
                    <select v-model="formData.employees"
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm appearance-none bg-white">
                      <option value="" disabled selected>Select range</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-100">51-100</option>
                      <option value="101-250">101-250</option>
                      <option value="250+">250+</option>
                    </select>
                    <ChevronDownIcon
                      class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <!-- Website -->
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input type="url" v-model="formData.website" placeholder="https://example.com"
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm placeholder-gray-400">
                </div>

                <!-- Description -->
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Brief Description (max 200 chars)</label>
                  <textarea v-model="formData.description" placeholder="Describe your business..." rows="4"
                    maxlength="200"
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm placeholder-gray-400 resize-none"></textarea>
                  <div class="flex justify-end mt-1">
                    <span class="text-xs text-gray-500">{{ formData.description.length }}/200</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Dynamic Section -->
            <div v-else-if="currentSectionData.questions" class="space-y-8">
              <!-- Section Header & Progress -->
              <div>
                <p class="text-gray-500 text-sm mb-6">Complete the questions for {{ currentSectionData.name }}</p>
                <div class="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                  <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Section Progress</span>
                  <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-teal-600 transition-all duration-500"
                      :style="{ width: `${currentSectionData.progress}%` }"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ getAnsweredCount(currentSectionData.id) }} /
                    {{ currentSectionData.questions.length }}</span>
                </div>
              </div>

              <!-- Question Loop -->
              <div class="space-y-8">
                <div v-for="(q, idx) in currentSectionData.questions" :key="q.id" :id="`question-${q.id}`">
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question {{ idx + 1 }}</span>
                    {{ q.text }} <span v-if="q.required" class="text-red-500">*</span>
                  </label>

                  <!-- YES/NO or BOOLEAN (Yes/No Questions) -->
                  <div v-if="q.type === 'Yes/No' || q.type === 'BOOLEAN'" class="flex flex-col gap-4">
                    <div class="flex gap-6">
                      <!-- If question has options (BOOLEAN type from mock data) -->
                      <template v-if="q.options && q.options.length > 0">
                        <label v-for="option in q.options" :key="option.value"
                          class="flex items-center gap-2 cursor-pointer">
                          <input type="radio" v-model="answers[q.id]" :value="option.value"
                            class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                          <span class="text-sm text-gray-700">{{ option.label }}</span>
                        </label>
                      </template>
                      <!-- Default Yes/No (admin store type) -->
                      <template v-else>
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input type="radio" v-model="answers[q.id]" :value="true"
                            class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                          <span class="text-sm text-gray-700">Yes</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                          <input type="radio" v-model="answers[q.id]" :value="false"
                            class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                          <span class="text-sm text-gray-700">No</span>
                        </label>
                      </template>
                    </div>

                    <!-- Proof File Upload — only shown when answer is Yes -->
                    <div v-if="answers[q.id] === true"
                      :class="proofValidationErrors.includes(q.id) ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'"
                      class="max-w-md mt-1 p-4 rounded-lg border transition-colors">
                      <label class="block text-sm font-medium mb-2"
                        :class="proofValidationErrors.includes(q.id) ? 'text-red-600' : 'text-gray-700'">
                        Upload Proof <span class="text-red-500">*</span>
                        <span v-if="proofValidationErrors.includes(q.id)" class="ml-2 font-normal text-xs text-red-500">
                          ⚠ Proof document required before proceeding
                        </span>
                      </label>
                      <label
                        :class="proofValidationErrors.includes(q.id) ? 'border-red-300 hover:border-red-400 hover:bg-red-50' : 'border-gray-300 hover:bg-teal-50 hover:border-teal-300'"
                        class="flex flex-col items-center px-4 py-4 bg-white border-2 border-dashed rounded-lg cursor-pointer transition-colors">
                        <svg class="w-6 h-6 mb-2"
                          :class="proofValidationErrors.includes(q.id) ? 'text-red-400' : 'text-gray-400'" fill="none"
                          stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
                          </path>
                        </svg>
                        <span class="text-sm text-gray-600"><span class="font-semibold text-teal-600">Click to upload
                            proof</span>
                          document</span>
                        <input type="file" class="hidden"
                          @change="(e) => { handleFileUpload(e, q.id + '_proof'); proofValidationErrors = proofValidationErrors.filter(id => id !== q.id) }"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg">
                      </label>
                      <!-- Show selected file name -->
                      <div v-if="answers[q.id + '_proof']"
                        class="mt-3 text-sm text-gray-700 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <CheckCircleIcon class="w-5 h-5 text-teal-600" />
                        <span class="truncate font-medium">{{ answers[q.id + '_proof']?.name || 'Proof file attached'
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- CHOICE (Single Choice or Multiple Choice with options) -->
                  <div v-else-if="q.type === 'CHOICE' || q.type === 'Multiple Choice' || q.type === 'Single Choice'"
                    class="space-y-3">
                    <template v-if="q.options && q.options.length > 0">
                      <!-- Handle both object format {label, value, points} and simple string array -->
                      <label v-for="(option, idx) in q.options" :key="idx"
                        class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        :class="answers[q.id] === getOptionValue(option) ? 'border-teal-500 ring-1 ring-teal-500 bg-teal-50' : 'border-gray-200'">
                        <input type="radio" v-model="answers[q.id]" :value="getOptionValue(option)"
                          class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                        <span class="text-sm text-gray-700">{{ getOptionLabel(option) }}</span>
                      </label>
                    </template>
                    <div v-else class="text-sm text-gray-500 italic">No options available for this question</div>
                  </div>

                  <!-- DROPDOWN SELECT -->
                  <div v-else-if="q.type === 'Dropdown Select' || q.type === 'Dropdown'" class="relative max-w-md">
                    <select v-model="answers[q.id]"
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none text-sm appearance-none bg-white">
                      <option value="" disabled selected>Select an option</option>
                      <template v-if="q.options && q.options.length > 0">
                        <option v-for="(opt, idx) in q.options" :key="idx" :value="getOptionValue(opt)">
                          {{ getOptionLabel(opt) }}
                        </option>
                      </template>
                      <template v-else>
                        <option disabled>No options available</option>
                      </template>
                    </select>
                    <ChevronDownIcon
                      class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>


                  <!-- TEXT -->
                  <div v-else-if="q.type === 'Text' || q.type === 'TEXT'">
                    <textarea v-model="answers[q.id]" rows="3" placeholder="Enter your answer..."
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none text-sm resize-none"></textarea>
                  </div>

                  <!-- SCALE (1-10) -->
                  <div v-else-if="q.type === 'Scale (1-10)' || q.type === 'SCALE'" class="max-w-xl">
                    <input type="range" v-model.number="answers[q.id]" min="1" max="10" step="1"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600">
                    <div class="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1 (Low)</span><span>10 (High)</span>
                    </div>
                    <div class="text-center mt-2 font-medium text-teal-700">{{ answers[q.id] || 5 }}</div>
                  </div>

                  <!-- FILE UPLOAD -->
                  <div v-else-if="q.type === 'File Upload'" class="max-w-md">
                    <label
                      class="flex flex-col items-center px-4 py-6 bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
                        </path>
                      </svg>
                      <span class="text-sm text-gray-600"><span class="font-semibold">Click to upload</span> or drag and
                        drop</span>
                      <span class="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, XLS, XLSX (max 10MB)</span>
                      <input type="file" class="hidden" @change="(e) => handleFileUpload(e, q.id)"
                        accept=".pdf,.doc,.docx,.xls,.xlsx">
                    </label>
                    <!-- Show selected file name -->
                    <div v-if="answers[q.id]" class="mt-2 text-sm text-gray-700 flex items-center gap-2">
                      <svg class="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{{ answers[q.id]?.name || 'File uploaded' }}</span>
                    </div>
                  </div>

                  <!-- FALLBACK: Unknown question type - render as TEXT -->
                  <div v-else>
                    <textarea v-model="answers[q.id]" rows="3" placeholder="Enter your answer..."
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 outline-none text-sm resize-none"></textarea>
                    <p class="text-xs text-gray-400 mt-1">Question type: {{ q.type }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Review & Submit Section -->
            <div v-else-if="currentSectionData.id === 'review'" class="max-w-2xl mx-auto py-8">
              <div class="bg-white border border-gray-100 shadow-sm rounded-xl p-6 text-center">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Ready to Submit?</h3>
                <p class="text-gray-500 mb-6">Review your answers across all sections before finalizing.</p>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
                  <div v-for="section in contentSections" :key="section.id"
                    class="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700">{{ section.name }}</span>
                    <span class="text-xs font-semibold px-2 py-1 rounded bg-white border border-gray-200"
                      :class="section.progress === 100 ? 'text-teal-600' : 'text-orange-600'">
                      {{ section.progress }}%
                    </span>
                  </div>
                </div>

                <button type="button" @click.prevent="submitAssessment"
                  class="px-8 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 shadow-sm transition-colors w-full sm:w-auto">
                  Submit Assessment
                </button>
              </div>
            </div>
          </div>
        </div>


        <!-- Navigation Buttons -->
        <div class="flex items-center justify-between mt-8 mb-12">
          <button @click="prevSection" :disabled="currentSection === 0"
            class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
            <ChevronLeftIcon class="w-4 h-4" />
            Previous
          </button>

          <button v-if="currentSection < sections.length - 1" @click="validateAndNext"
            class="px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            Next
            <ChevronRightIcon class="w-4 h-4" />
          </button>
          <button type="button" v-else @click.prevent="submitAssessment"
            class="px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            Submit Assessment
          </button>
        </div>
      </div>
    </main>
  </div>

</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  PresentationChartLineIcon,
  CurrencyDollarIcon,
  CogIcon,
  ScaleIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ComputerDesktopIcon,
  CheckIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/vue/24/solid'

import { useAdminStore } from '~/stores/admin.store'
import { useDashboardStore } from '~/stores/dashboard.store'
import { calculateOverallScore } from '~/utils/helpers'

const route = useRoute()
const adminStore = useAdminStore()

interface AssessmentQuestion {
  id: string
  pillarId: string
  text: string
  type: string
  weight: number
  required: boolean
  options?: any[]
  templateId: string
}

interface Section {
  id: string
  name: string
  icon: any
  progress: number
  questions?: AssessmentQuestion[]
}

// Mock Data
const defaultProgramName = 'Investment Accelerator 2024';
const programName = ref(defaultProgramName)
const currentSection = ref(0)

// Profile Data
const formData = ref({
  name: '',
  sector: '',
  location: '',
  founded: '',
  employees: '',
  website: '',
  description: ''
})

const profileAnsweredCount = computed(() => {
  let count = 0
  if (formData.value.name) count++
  if (formData.value.sector) count++
  if (formData.value.location) count++
  if (formData.value.founded) count++
  if (formData.value.employees) count++
  return count
})

const profileProgress = computed(() => {
  return Math.round((profileAnsweredCount.value / 5) * 100)
})

// --- DYNAMIC LOGIC ---

const answers = ref<Record<string, any>>({})

// Helper to get pillar icon
const getPillarIcon = (id: string) => {
  const map: Record<string, any> = {
    'team': UserGroupIcon,
    'business': PresentationChartLineIcon,
    'market': CurrencyDollarIcon,
    'finance': CurrencyDollarIcon,
    'ops': CogIcon,
    'legal': ScaleIcon,
    'data': PresentationChartLineIcon,
    'growth': RocketLaunchIcon
  }
  return map[id] || BuildingOfficeIcon
}

// --- TEMPLATE SELECTION LOGIC ---

const authStore = useAuthStore()
// Get current SME ID from auth store
const currentSMEId = computed(() => authStore.user?.company?.id || 3)

// Get programs that the current SME is enrolled in
const enrolledPrograms = computed(() => {
  return adminStore.programs.filter(program =>
    program.enrolledSMEs && program.enrolledSMEs.includes(currentSMEId.value)
  )
})

// Get available templates from enrolled programs
const availableTemplates = computed(() => {
  const templateIds = enrolledPrograms.value.map(p => p.templateId)
  const uniqueTemplateIds = [...new Set(templateIds)]

  return adminStore.templates
    .filter(template => uniqueTemplateIds.includes(template.id))
    .map(template => {
      const questionCount = adminStore.questions.filter(q => q.templateId === template.id).length
      const program = enrolledPrograms.value.find(p => p.templateId === template.id)
      return {
        ...template,
        duration: Math.ceil(questionCount * 2), // Estimate 2 minutes per question
        programName: program?.name || 'Unknown Program'
      }
    })
})

// Function to select a template and start assessment
const selectTemplate = (templateId: string) => {
  navigateTo({
    path: '/assessment',
    query: { template: templateId }
  })
}

// Helper to get question count for a template
const getQuestionCount = (templateId: string) => {
  return adminStore.questions.filter(q => q.templateId === templateId).length
}

// --- ASSESSMENT LOGIC ---

// Fetch questions based on template
const currentTemplateId = computed(() => (route.query.template as string) || 'temp_001')

// Filtered questions for current template
const assessmentQuestions = computed<AssessmentQuestion[]>(() =>
  adminStore.questions.filter(q => q.templateId === currentTemplateId.value) as AssessmentQuestion[]
)

const groupedQuestions = computed<Record<string, AssessmentQuestion[]>>(() => {
  const groups: Record<string, AssessmentQuestion[]> = {}
  if (assessmentQuestions.value) {
    assessmentQuestions.value.forEach(q => {
      if (q && q.pillarId) {
        const pId = q.pillarId
        if (!groups[pId]) {
          groups[pId] = []
        }
        groups[pId]!.push(q)
      }
    })
  }
  return groups
})

const getAnsweredCount = (pillarId: string) => {
  const qList = groupedQuestions.value[pillarId] || []
  if (!qList.length) return 0
  return qList.filter(q => answers.value[q.id] !== undefined && answers.value[q.id] !== null && answers.value[q.id] !== '').length
}

const contentSections = computed<Section[]>(() => {
  // 1. Company Profile (Fixed)
  const profileSection: Section = {
    id: 'profile',
    name: 'Company Profile',
    icon: BuildingOfficeIcon,
    progress: profileProgress.value
  }

  // 2. Dynamic Pillars
  const dynamicPillars = Object.keys(groupedQuestions.value).map(pillarId => {
    const pillarStyle = adminStore.frameworkSettings.find(p => p.id === pillarId)
    const qList = groupedQuestions.value[pillarId] || []
    const answered = getAnsweredCount(pillarId)

    return {
      id: pillarId,
      name: pillarStyle ? pillarStyle.name : (pillarId.charAt(0).toUpperCase() + pillarId.slice(1)),
      icon: getPillarIcon(pillarId),
      progress: qList.length ? Math.round((answered / qList.length) * 100) : 0,
      questions: qList
    }
  })

  return [profileSection, ...dynamicPillars]
})

const overallProgress = computed(() => {
  if (contentSections.value.length === 0) return 0
  const total = contentSections.value.reduce((sum, section) => sum + section.progress, 0)
  return Math.round(total / contentSections.value.length)
})

const sections = computed<Section[]>(() => [
  ...contentSections.value,
  { id: 'review', name: 'Review & Submit', icon: CheckCircleIcon, progress: overallProgress.value },
])

const currentSectionData = computed<Section | undefined>(() => sections.value[currentSection.value])

const totalQuestions = computed(() => adminStore.questions.filter(q => q.templateId === currentTemplateId.value).length + 5)

const totalAnswered = computed(() => {
  const qCount = Object.keys(answers.value).filter(k => answers.value[k] !== undefined && answers.value[k] !== null && answers.value[k] !== '').length
  return qCount + profileAnsweredCount.value
})

const verifiedScore = ref<number | null>(null)

const finalScore = computed(() => {
  // Calculate actual score based on answers and question weights
  const questionsList = adminStore.questions.filter(q => q.templateId === currentTemplateId.value)

  if (questionsList.length === 0) return 0

  // Group questions by pillar
  const pillarScores: Record<string, { totalScore: number, maxScore: number }> = {}

  questionsList.forEach(question => {
    const pillarId = question.pillarId
    const answer = answers.value[question.id]
    const weight = question.weight || 10

    if (!pillarScores[pillarId]) {
      pillarScores[pillarId] = { totalScore: 0, maxScore: 0 }
    }

    // Calculate score for this question
    let questionScore = 0

    if (answer !== undefined && answer !== null && answer !== '') {
      // For Yes/No or BOOLEAN questions
      if (question.type === 'Yes/No' || question.type === 'BOOLEAN') {
        questionScore = answer === true ? weight : 0
      }
      // For CHOICE questions with options
      else if ((question.type === 'CHOICE' || question.type === 'Multiple Choice' || question.type === 'Single Choice') && question.options) {
        // Check if options are objects with points or simple strings
        const selectedOption = (question.options as any[]).find(opt => {
          const optValue = typeof opt === 'object' && opt !== null && ('value' in opt ? opt.value : opt.label) ? (opt.value || opt.label) : opt
          return optValue === answer
        })

        if (selectedOption) {
          // If option has points property, use it
          if (typeof selectedOption === 'object' && selectedOption !== null && 'points' in selectedOption) {
            questionScore = (selectedOption.points / 10) * weight
          } else {
            // For simple string options, give full credit for answering
            questionScore = weight
          }
        }
      }
      // For Number questions
      else if (question.type === 'Number' || question.type === 'NUMBER') {
        // Assume higher numbers are better, normalize to 0-10 scale
        const numValue = typeof answer === 'number' ? answer : parseFloat(answer)
        if (!isNaN(numValue) && numValue > 0) {
          questionScore = Math.min(weight, (numValue / 100) * weight)
        }
      }
      // For Scale questions
      else if (question.type === 'Scale (1-10)' || question.type === 'SCALE') {
        const scaleValue = typeof answer === 'number' ? answer : parseInt(answer)
        if (!isNaN(scaleValue)) {
          questionScore = (scaleValue / 10) * weight
        }
      }
      // For Text, Dropdown, File Upload - if answered, give full credit
      else if (answer) {
        questionScore = weight // Give full credit for providing an answer
      }
    }

    const currentPillar = pillarScores[pillarId]
    if (currentPillar) {
      currentPillar.totalScore += questionScore
      currentPillar.maxScore += weight
    }
  })

  // Calculate overall score using shared helper
  const pillarResults = Object.entries(pillarScores).map(([pillarId, stats]) => {
    // Get weight for this pillar from adminStore
    const pillarConfig = adminStore.frameworkSettings.find(fs => fs.id === pillarId)
    const pillarScore = stats.maxScore > 0 ? (stats.totalScore / stats.maxScore) * 100 : 0

    return {
      score: pillarScore,
      weight: pillarConfig ? pillarConfig.weight : 1
    }
  })

  return calculateOverallScore(pillarResults)
})

const isSubmitted = ref(false)

// Tracks question IDs with missing proof (Yes/No answered Yes but no file)
const proofValidationErrors = ref<string[]>([])

// Validates proof uploads for Yes/No questions in the current section before proceeding
const validateAndNext = () => {
  const section = currentSectionData.value
  if (!section?.questions) {
    currentSection.value++
    return
  }

  const missing: string[] = []
  section.questions.forEach((q: any) => {
    const isYesNo = q.type === 'Yes/No' || q.type === 'BOOLEAN'
    const answeredYes = answers.value[q.id] === true
    const hasProof = !!answers.value[q.id + '_proof']
    if (isYesNo && answeredYes && !hasProof) {
      missing.push(q.id)
    }
  })

  proofValidationErrors.value = missing

  if (missing.length > 0) {
    // Scroll to first error question
    const firstErrorEl = document.getElementById(`question-${missing[0]}`)
    if (firstErrorEl) firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return // Block navigation
  }

  // All good — clear errors and advance
  proofValidationErrors.value = []
  currentSection.value++
}

const submitAssessment = async () => {
  console.log('[Assessment] Submit button clicked')
  try {
    // Get the questions for this template to send to server
    // This is needed because server can't access Pinia store for admin-created questions
    const templateQuestions = assessmentQuestions.value.map(q => ({
      id: q.id,
      pillarId: q.pillarId,
      templateId: q.templateId,
      text: q.text,
      type: q.type,
      weight: q.weight,
      required: q.required,
      options: q.options
    }))

    console.log('[Assessment] Constructed templateQuestions array:', templateQuestions.length)
    console.log('[Assessment] Initiating backend API call')

    // Submit to mock backend to persist score
    const response = await $fetch('/api/assessment/submit', {
      method: 'POST',
      body: {
        smeId: currentSMEId.value,
        score: finalScore.value,
        answers: answers.value,
        formData: formData.value,
        templateId: currentTemplateId.value,
        questions: templateQuestions // ← Send questions to server!
      }
    })

    if (response && 'assessment' in response && response.assessment) {
      verifiedScore.value = response.assessment.total_score
    }

    console.log('[Assessment] Submit successful, API response:', response)
    isSubmitted.value = true
  } catch (error) {
    console.error('[Assessment] FAILED to save assessment:', error)
    alert("There was an error submitting your assessment. Please try again.")
  }
}

const dashboardStore = useDashboardStore()

const navigateToDashboard = async () => {
  // Force refresh of dashboard data since we just submitted a new assessment
  await dashboardStore.fetchDashboardData()
  navigateTo('/sme/dashboard')
}

const sectors = ['Technology', 'Healthcare', 'FinTech', 'AgriTech', 'E-commerce', 'Manufacturing', 'CleanTech', 'EdTech', 'Services', 'Logistics']
const locations = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Kampot', 'Kampong Cham', 'Takeo', 'Kandal', 'Kep', 'Mondulkiri']

// Helper functions to handle both option formats
const getOptionValue = (option: any) => {
  // If option is an object with 'value' property, return it
  if (typeof option === 'object' && option !== null && 'value' in option) {
    return option.value
  }
  // Otherwise, treat it as a string
  return option
}

const getOptionLabel = (option: any) => {
  // If option is an object with 'label' property, return it
  if (typeof option === 'object' && option !== null && 'label' in option) {
    return option.label
  }
  // Otherwise, treat it as a string
  return option
}

const handleFileUpload = (event: Event, questionId: string) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    // Store the file object in answers
    answers.value[questionId] = file
  }
}


const prevSection = () => {
  if (currentSection.value > 0) {
    currentSection.value--
  }
}

const nextSection = () => {
  if (currentSection.value < sections.value.length - 1) {
    currentSection.value++
  }
}

onMounted(async () => {
  // fetch fresh data
  try {
    await adminStore.fetchProgramsData()
    await adminStore.fetchTemplatesData()
    await adminStore.fetchQuestionsData() // Explicitly fetch questions to be sure
  } catch (e) {
    console.warn('Failed to fetch data:', e)
  }

  // 1. Load Program Name
  const programId = route.query.program
  if (programId) {
    const program = adminStore.programs.find(p => p.id == programId)
    if (program) {
      programName.value = program.name
    }
  }

  // 2. Load SME Data
  const smeId = route.query.sme
  if (smeId) {
    const sme = adminStore.smes.find(s => s.id == smeId)
    if (sme) {
      formData.value.name = sme.name
      formData.value.sector = sme.industry || ''
      formData.value.location = sme.location || ''
      // Mock other fields as they might not be in the simple SME list model
      formData.value.founded = '2022'
      formData.value.employees = '11-50'
      formData.value.website = `https://www.${sme.name.toLowerCase().replace(/\s+/g, '')}.com`
    }
  }
})
</script>

<style scoped>
/* Custom scrollbar for sidebar */
aside::-webkit-scrollbar {
  width: 5px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background-color: #f1f5f9;
  border-radius: 20px;
}

aside:hover::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
}
</style>
