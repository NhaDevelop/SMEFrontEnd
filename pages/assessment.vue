<template>
  <!-- Template Selection Screen (when no template specified) -->
  <div v-if="!currentTemplateId || currentTemplateId === 'temp_001' && !route.query.template"
    class="min-h-full bg-gray-50 px-6 py-8 md:px-8">
    <div class="max-w-7xl mx-auto w-full">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Select an Assessment</h1>
        <p class="text-gray-600">Choose a program to begin your investment readiness assessment</p>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-4 md:p-5 mb-6">
        <div class="flex flex-wrap items-center gap-3 md:gap-5">
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <span class="text-sm">&#9661;</span>
            <span>Filter by:</span>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">Pillars:</label>
            <select v-model="selectedPillarFilter"
              class="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none">
              <option value="all">All</option>
              <option value="1-4">1-4</option>
              <option value="5-6">5-6</option>
              <option value="7-8">7-8</option>
              <option value="9+">9+</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-sm text-gray-600">Questions:</label>
            <select v-model="selectedQuestionFilter"
              class="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none">
              <option value="all">All</option>
              <option value="1-20">1-20</option>
              <option value="21-40">21-40</option>
              <option value="41+">41+</option>
            </select>
          </div>
        </div>

        <p class="text-sm text-gray-500 mt-4">
          Showing {{ filteredAvailableTemplates.length }} of {{ availableTemplates.length }} templates
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="template in filteredAvailableTemplates" :key="template.id"
          class="group relative bg-white rounded-xl border border-gray-200 p-5 hover:border-teal-300 hover:shadow-md transition-all duration-200 overflow-hidden">
          <div class="flex items-start justify-between mb-4">
            <div class="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
              <ClipboardDocumentCheckIcon class="w-5 h-5 text-teal-600" />
            </div>
            <div class="flex items-center gap-2">
              <span
                :class="getTemplateType(template.id) === 'Quick' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'"
                class="px-2 py-0.5 rounded-full text-[10px] font-semibold">
                {{ getTemplateType(template.id) }}
              </span>
              <span class="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-semibold">
                v{{ template.version || '1.0' }}
              </span>
            </div>
          </div>

          <h3 class="text-3xl font-bold text-gray-900 mb-2 leading-tight">{{ template.name }}</h3>
          <p class="text-sm text-gray-500 mb-5 min-h-[40px] line-clamp-2">{{ template.description || 'No description available.' }}</p>

          <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>{{ getTemplatePillarCount(template.id) }} pillars</span>
            <span>{{ getQuestionCount(template.id) }} questions</span>
            <span>{{ getTemplateDuration(template.id) }}</span>
          </div>

          <div
            class="absolute inset-x-5 bottom-4 transition-all duration-200 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0">
            <button type="button" @click="openTemplatePreview(template)"
              class="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <span class="text-xs">&#9679;</span>
              Preview Questions
            </button>
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

      <div v-else-if="filteredAvailableTemplates.length === 0" class="text-center py-12">
        <ClipboardDocumentCheckIcon class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">No templates match your filters</h3>
        <p class="text-gray-600 mb-6">Try a different filter combination.</p>
      </div>

      <div v-if="previewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/50" @click="closeTemplatePreview"></div>

        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
            <div>
              <h3 class="text-xl font-bold text-gray-900">{{ previewTemplate?.name || 'Assessment Preview' }}</h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ previewTemplate?.description || 'Preview questions by pillar before you start.' }}
              </p>
            </div>
            <button type="button" @click="closeTemplatePreview"
              class="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <span class="text-lg leading-none">&times;</span>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div v-if="previewLoading" class="py-16 text-center text-gray-500 text-sm">
              Loading questions...
            </div>

            <div v-else-if="previewGroupedQuestions.length === 0" class="py-16 text-center">
              <h4 class="text-base font-semibold text-gray-900 mb-2">No questions found</h4>
              <p class="text-sm text-gray-500">This template currently has no available questions.</p>
            </div>

            <div v-else class="space-y-5">
              <div v-for="group in previewGroupedQuestions" :key="group.pillarId"
                class="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div class="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <h4 class="font-semibold text-gray-900">{{ group.pillarName }}</h4>
                  <span class="text-xs text-gray-500 font-medium">{{ group.questions.length }} questions</span>
                </div>

                <div class="divide-y divide-gray-100">
                  <div v-for="(question, idx) in group.questions" :key="question.id" class="px-4 py-3">
                    <div class="text-xs text-gray-400 mb-1">Q{{ idx + 1 }}</div>
                    <p class="text-sm text-gray-800">{{ question.text }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end gap-3">
            <button type="button" @click="closeTemplatePreview"
              class="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors">
              Close
            </button>
            <button type="button" @click="startPreviewedTemplate"
              class="px-5 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 transition-colors">
              Start Assessment
            </button>
          </div>
        </div>
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
                <h2 class="text-2xl font-bold text-gray-900">Investment Readiness Assessment</h2>
                <span
                  class="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium border border-gray-200">
                  {{availableTemplates.find(t => t.id == currentTemplateId)?.name || 'Assessment'}}
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
                    <div v-if="answers[String(q.id)] === true"
                      :class="proofValidationErrors.includes(String(q.id)) ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'"
                      class="max-w-md mt-1 p-4 rounded-lg border transition-colors">
                      <label class="block text-sm font-medium mb-2"
                        :class="proofValidationErrors.includes(String(q.id)) ? 'text-red-600' : 'text-gray-700'">
                        Upload Proof <span class="text-red-500">*</span>
                        <span v-if="proofValidationErrors.includes(String(q.id))"
                          class="ml-2 font-normal text-xs text-red-500">
                          ⚠ Proof document required before proceeding
                        </span>
                      </label>
                      <label
                        :class="proofValidationErrors.includes(String(q.id)) ? 'border-red-300 hover:border-red-400 hover:bg-red-50' : 'border-gray-300 hover:bg-teal-50 hover:border-teal-300'"
                        class="flex flex-col items-center px-4 py-4 bg-white border-2 border-dashed rounded-lg cursor-pointer transition-colors">
                        <svg class="w-6 h-6 mb-2"
                          :class="proofValidationErrors.includes(String(q.id)) ? 'text-red-400' : 'text-gray-400'"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12">
                          </path>
                        </svg>
                        <span class="text-sm text-gray-600"><span class="font-semibold text-teal-600">Click to upload
                            proof</span>
                          document</span>
                        <input type="file" class="hidden"
                          @change="(e) => { handleFileUpload(e, String(q.id) + '_proof'); proofValidationErrors = proofValidationErrors.filter(id => id !== String(q.id)) }"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg">
                      </label>
                      <div v-if="answers[String(q.id) + '_proof']"
                        class="mt-3 text-sm text-gray-700 flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                        <CheckCircleIcon class="w-5 h-5 text-teal-600" />
                        <span class="truncate font-medium">{{ answers[String(q.id) + '_proof']?.name || 'Proof file attached' }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- SINGLE CHOICE -->
                  <div v-else-if="q.type === 'CHOICE' || q.type === 'Single Choice'" class="space-y-3">
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

                  <!-- MULTIPLE CHOICE (Checkboxes) -->
                  <div v-else-if="q.type === 'Multiple Choice'" class="space-y-3">
                    <template v-if="q.options && q.options.length > 0">
                      <label v-for="(option, idx) in q.options" :key="idx"
                        class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        :class="(answers[q.id] || []).includes(getOptionValue(option)) ? 'border-teal-500 ring-1 ring-teal-500 bg-teal-50' : 'border-gray-200'">
                        <input type="checkbox" v-model="answers[q.id]" :value="getOptionValue(option)"
                          class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded focus:ring-2">
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
                      <input type="file" class="hidden" @change="(e) => handleFileUpload(e, String(q.id))"
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
  layout: 'default',
  middleware: ['auth', 'sme']
})

import { ref, computed, onMounted, watch, shallowRef } from 'vue'
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

import { smeService } from '~/modules/sme/sme.service'
import { useSmeProgramStore } from '~/stores/smeProgram.store'
import { useDashboardStore } from '~/stores/dashboard.store'
import { calculateOverallScore } from '~/utils/helpers'

const route = useRoute()
const smeProgramStore = useSmeProgramStore()
const dashboardStore = useDashboardStore()
const frameworkSettings = ref<any[]>([])

interface AssessmentQuestion {
  id: number | string
  pillar_id: number | string
  text: string
  type: string
  weight: number
  required: boolean
  options?: any[]
  template_id: number | string
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
const availablePrograms = ref<any[]>([])
const loadingTemplates = ref(false)
const selectedPillarFilter = ref('all')
const selectedQuestionFilter = ref('all')

// Helper to get pillar icon
const getPillarIcon = (id: string | number) => {
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
  // Allow numeric IDs mapping too if they match business logic
  const stringId = String(id).toLowerCase()
  return map[stringId] || BuildingOfficeIcon
}

// --- TEMPLATE SELECTION LOGIC ---

// Get available templates from enrolled programs
const availableTemplates = computed(() => {
  return availablePrograms.value
    .filter(p => p.templateId && p.enrollmentStatus !== 'None')
    .map(p => ({
      id: p.templateId,
      name: p.templateName || p.name,
      description: p.description,
      version: p.templateVersion || p.version || null,
      duration: 15, // Mock duration for now
      programName: p.name
    }))
})

const filteredAvailableTemplates = computed(() => {
  return availableTemplates.value.filter((template) => {
    const pillars = getTemplatePillarCount(template.id)
    const questions = getQuestionCount(template.id)

    let pillarMatch = true
    if (selectedPillarFilter.value === '1-4') pillarMatch = pillars >= 1 && pillars <= 4
    else if (selectedPillarFilter.value === '5-6') pillarMatch = pillars >= 5 && pillars <= 6
    else if (selectedPillarFilter.value === '7-8') pillarMatch = pillars >= 7 && pillars <= 8
    else if (selectedPillarFilter.value === '9+') pillarMatch = pillars >= 9

    let questionMatch = true
    if (selectedQuestionFilter.value === '1-20') questionMatch = questions >= 1 && questions <= 20
    else if (selectedQuestionFilter.value === '21-40') questionMatch = questions >= 21 && questions <= 40
    else if (selectedQuestionFilter.value === '41+') questionMatch = questions >= 41

    return pillarMatch && questionMatch
  })
})

const templateMeta = ref<Record<string, { questionCount: number, pillarCount: number }>>({})

// Function to select a template and start assessment
const selectTemplate = (templateId: string | number) => {
  navigateTo({
    path: '/assessment',
    query: { template: String(templateId) }
  })
}

const getQuestionCount = (templateId: string | number) => {
  const key = String(templateId)
  return templateMeta.value[key]?.questionCount || 0
}

const getTemplatePillarCount = (templateId: string | number) => {
  const key = String(templateId)
  return templateMeta.value[key]?.pillarCount || 0
}

const getTemplateType = (templateId: string | number) => {
  const pillarCount = getTemplatePillarCount(templateId)
  return pillarCount > 0 && pillarCount <= 4 ? 'Quick' : 'Comprehensive'
}

const getTemplateDuration = (templateId: string | number) => {
  const qCount = getQuestionCount(templateId)
  if (!qCount) return '15-25 min'
  const upper = Math.max(qCount + 5, Math.round(qCount * 1.5))
  return `${qCount}-${upper} min`
}

const loadTemplateMeta = async () => {
  const api = useApi()
  const entries = await Promise.all(
    availableTemplates.value.map(async (template) => {
      try {
        const response = await api<any>('/sme/questions', {
          query: { template_id: normalizeTemplateId(template.id) }
        })
        const questions: AssessmentQuestion[] = response.data || response || []
        const uniquePillars = new Set(questions.map(q => String(q.pillar_id)))
        return [String(template.id), { questionCount: questions.length, pillarCount: uniquePillars.size }] as const
      } catch {
        return [String(template.id), { questionCount: 0, pillarCount: 0 }] as const
      }
    })
  )

  templateMeta.value = Object.fromEntries(entries)
}

// --- ASSESSMENT LOGIC ---

// Fetch questions based on template
const currentTemplateId = computed(() => (route.query.template as string) || null)

// Filtered questions for current template
const assessmentQuestions = ref<AssessmentQuestion[]>([])
const loadingQuestions = ref(false)
const previewModalOpen = ref(false)
const previewLoading = ref(false)
const previewTemplate = ref<any | null>(null)
const previewGroupedQuestions = ref<Array<{ pillarId: string, pillarName: string, questions: AssessmentQuestion[] }>>([])

const normalizeTemplateId = (templateId: string | number) => {
  if (typeof templateId === 'string') {
    return Number(templateId.replace('temp_', '')) || templateId
  }
  return templateId
}

const openTemplatePreview = async (template: any) => {
  previewModalOpen.value = true
  previewLoading.value = true
  previewTemplate.value = template
  previewGroupedQuestions.value = []

  const api = useApi()
  try {
    const response = await api<any>('/sme/questions', {
      query: { template_id: normalizeTemplateId(template.id) }
    })

    const questions: AssessmentQuestion[] = response.data || response || []
    const grouped = new Map<string, AssessmentQuestion[]>()

    questions.forEach((q) => {
      const key = String(q.pillar_id || 'general')
      if (!grouped.has(key)) grouped.set(key, [])
      grouped.get(key)?.push(q)
    })

    previewGroupedQuestions.value = Array.from(grouped.entries()).map(([pillarId, qList]) => {
      const found = frameworkSettings.value.find(p => String(p.id) === String(pillarId))
      return {
        pillarId,
        pillarName: found?.name || `Pillar ${pillarId}`,
        questions: qList
      }
    })
  } catch (e) {
    console.error('Failed to preview template questions', e)
  } finally {
    previewLoading.value = false
  }
}

const closeTemplatePreview = () => {
  previewModalOpen.value = false
  previewLoading.value = false
  previewTemplate.value = null
  previewGroupedQuestions.value = []
}

const startPreviewedTemplate = () => {
  if (!previewTemplate.value) return
  const tId = previewTemplate.value.id
  closeTemplatePreview()
  selectTemplate(tId)
}

const fetchQuestions = async () => {
  if (!currentTemplateId.value) return
  loadingQuestions.value = true
  const api = useApi()
  try {
    const response = await api<any>(`/sme/questions`, {
      query: { template_id: currentTemplateId.value }
    })
    assessmentQuestions.value = response.data || response || []
    
    // Explicitly seed multiple choice answers as arrays so validation processes them correctly under checkboxes
    assessmentQuestions.value.forEach((q: any) => {
      if (q.type === 'Multiple Choice' && !answers.value[q.id]) {
        answers.value[q.id] = []
      }
    })
  } catch (e) {
    console.error('Failed to fetch questions', e)
  } finally {
    loadingQuestions.value = false
  }
}

const groupedQuestions = computed<Record<string, AssessmentQuestion[]>>(() => {
  const groups: Record<string, AssessmentQuestion[]> = {}
  if (assessmentQuestions.value) {
    assessmentQuestions.value.forEach(q => {
      if (q && q.pillar_id) {
        const pId = String(q.pillar_id)
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
  return qList.filter(q => {
    const ans = answers.value[q.id]
    if (ans === undefined || ans === null || ans === '') return false
    if (Array.isArray(ans) && ans.length === 0) return false
    return true
  }).length
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
    const pillarStyle = frameworkSettings.value.find(p => String(p.id) === String(pillarId))
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

const totalQuestions = computed(() => assessmentQuestions.value.length + 5)

const totalAnswered = computed(() => {
  const qCount = Object.keys(answers.value).filter(k => {
    const ans = answers.value[k]
    if (ans === undefined || ans === null || ans === '') return false
    if (Array.isArray(ans) && ans.length === 0) return false
    return true
  }).length
  return qCount + profileAnsweredCount.value
})

const verifiedScore = ref<number | null>(null)

// Fix #4: Debounced score — only recalculates 400ms after user stops interacting.
// Previously was a computed() that re-ran on every checkbox/radio change, causing UI lag.
const finalScore = ref(0)

const _calculateFinalScore = () => {
  const questionsList = assessmentQuestions.value
  if (questionsList.length === 0) {
    finalScore.value = 0
    return
  }

  const pillarScores: Record<string, { totalScore: number, maxScore: number }> = {}

  questionsList.forEach(question => {
    const pillarId = String(question.pillar_id)
    const answer = answers.value[question.id]
    const weight = question.weight || 10

    if (!pillarScores[pillarId]) {
      pillarScores[pillarId] = { totalScore: 0, maxScore: 0 }
    }

    let questionScore = 0

    if (answer !== undefined && answer !== null && answer !== '') {
      if (question.type === 'Yes/No' && (!question.options || question.options.length === 0)) {
         if (answer === true || answer === 'true' || answer === 'Yes') {
             questionScore = weight
         }
      } else if (question.type === 'Scale (1-10)' || question.type === 'SCALE') {
         const scaleValue = typeof answer === 'number' ? answer : parseFloat(answer)
         if (!isNaN(scaleValue)) {
             questionScore = (scaleValue / 10) * weight
         }
      } else if (question.type === 'Multiple Choice' && Array.isArray(answer)) {
         let runningScore = 0
         answer.forEach(selectedVal => {
             const selectedOption = (question.options || []).find((opt: any) => {
                 const optValue = typeof opt === 'object' && opt !== null && ('value' in opt ? opt.value : opt.label) ? (opt.value || opt.label) : opt
                 return optValue === selectedVal
             })
             if (selectedOption && typeof selectedOption === 'object' && 'points' in selectedOption) {
                 runningScore += parseFloat(selectedOption.points) || 0
             }
         })
         questionScore = Math.min(weight, runningScore)
      } else {
         const extractedValue = answer
         const selectedOption = (question.options || []).find((opt: any) => {
             const optValue = typeof opt === 'object' && opt !== null && ('value' in opt ? opt.value : opt.label) ? (opt.value || opt.label) : opt
             return optValue === extractedValue
         })
         if (selectedOption && typeof selectedOption === 'object' && 'points' in selectedOption) {
             questionScore = parseFloat(selectedOption.points) || 0
         } else if (extractedValue === true || extractedValue === 'true' || extractedValue === 'Yes') {
             questionScore = weight
         }
      }
    }

    const currentPillar = pillarScores[pillarId]
    if (currentPillar) {
      currentPillar.totalScore += questionScore
      currentPillar.maxScore += weight
    }
  })

  const pillarResults = Object.entries(pillarScores).map(([pillarId, stats]) => {
    const pillarConfig = frameworkSettings.value.find(fs => String(fs.id) === String(pillarId))
    const pillarScore = stats.maxScore > 0 ? (stats.totalScore / stats.maxScore) * 100 : 0
    return {
      score: pillarScore,
      weight: pillarConfig ? pillarConfig.weight : 1
    }
  })

  finalScore.value = calculateOverallScore(pillarResults)
}

// Debounce timer handle
let _scoreDebounceTimer: ReturnType<typeof setTimeout> | null = null
watch(
  [answers, assessmentQuestions, frameworkSettings],
  () => {
    if (_scoreDebounceTimer) clearTimeout(_scoreDebounceTimer)
    _scoreDebounceTimer = setTimeout(_calculateFinalScore, 400)
  },
  { deep: true }
)

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
  const api = useApi()
  try {
    const tId = currentTemplateId.value
    if (!tId) throw new Error('No template selected')

    const startResponse = await api<any>('/assessment/start', {
      method: 'POST',
      body: {
        template_id: typeof tId === 'string' ? (Number(tId.replace('temp_', '')) || tId) : tId
      }
    })

    // The unwrapped response should have assessment_id
    const assessmentId = startResponse.data?.assessment_id || startResponse.assessment_id

    if (!assessmentId) throw new Error('Failed to initialize assessment session')

    // 2. Prepare answers in the format the backend expects
    // Backend expects array of { question_id, value }
    const formattedAnswers = Object.entries(answers.value)
      .filter(([key]) => !key.endsWith('_proof')) // Skip proof file keys for now as they go to document store or separate logic
      .map(([questionId, value]) => ({
        question_id: Number(questionId),
        value: value
      }))

    console.log('[Assessment] Submitting formatted answers for assessment:', assessmentId)

    // 3. Submit to real backend
    const response = await api<any>(`/assessment/${assessmentId}/submit`, {
      method: 'POST',
      body: {
        answers: formattedAnswers
      }
    })

    const data = response.data || response
    if (data && 'total_score' in data) {
      verifiedScore.value = data.total_score
    }

    console.log('[Assessment] Submit successful, API response:', response)
    isSubmitted.value = true
  } catch (error: any) {
    console.error('[Assessment] FAILED to save assessment:', error)
    alert(error.data?.message || "There was an error submitting your assessment. Please try again.")
  }
}

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
  loadingTemplates.value = true
  try {
    // 1. Fetch available programs (which includes templates)
    await smeProgramStore.fetchEnrolledPrograms()
    availablePrograms.value = smeProgramStore.enrolledPrograms

    // 2. Fetch Framework Settings
    frameworkSettings.value = await smeService.fetchFrameworkSettings()
    await loadTemplateMeta()
  } catch (e) {
    console.error('Failed to fetch initial assessment data:', e)
  } finally {
    loadingTemplates.value = false
  }

  // 3. Load Program Name from query if possible
  const programId = route.query.program
  if (programId) {
    const program = availablePrograms.value.find(p => p.id == programId)
    if (program) {
      programName.value = program.name
    }
  }

  // 4. Initial Questions Fetch if template already in URL
  if (currentTemplateId.value) {
    await fetchQuestions()
  }

  // 5. Load SME Profile Data (Optional for summary display)
  const smeId = route.query.sme
  if (smeId) {
    try {
      const sme = await smeService.fetchSmeDetails()
      if (sme) {
        formData.value.name = sme.name
        formData.value.sector = sme.industry || ''
        formData.value.location = sme.location || ''
      }
    } catch (e) {
      console.warn('Could not fetch SME details for pre-filling', e)
    }
  }
})

watch(
  () => currentTemplateId.value,
  async (newTemplateId, oldTemplateId) => {
    // React to template selection changes on the same route (/assessment?template=...)
    if (!newTemplateId) {
      assessmentQuestions.value = []
      currentSection.value = 0
      return
    }

    if (newTemplateId !== oldTemplateId) {
      currentSection.value = 0
      await fetchQuestions()
    }
  }
)
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
