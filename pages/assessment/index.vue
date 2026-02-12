<template>
  <div class="flex h-full bg-gray-50">
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
              <!-- Completed Text (Optional, if we want to show 'Completed' text instead of bar, but tick does the job) -->
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
            <div class="text-6xl font-bold text-teal-600 mb-2">{{ finalScore }}</div>
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
                  Standard Investment Readiness Assessment
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
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div class="flex items-center gap-3 mb-6">
              <BuildingOfficeIcon class="w-6 h-6 text-teal-600" />
              <h2 class="text-xl font-bold text-gray-900">{{ sections[currentSection].name }}</h2>
            </div>
            <p class="text-gray-500 text-sm mb-8">Enter your company information to get started</p>

            <!-- Form Fields (Dynamic based on section, mocking Company Profile for now) -->
            <div v-if="currentSection === 0" class="space-y-6">
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

            <div v-else-if="currentSection === 1" class="space-y-8">
              <!-- Section Header & Progress -->
              <div>
                <p class="text-gray-500 text-sm mb-6">Evaluate the SME's team & leadership capabilities</p>

                <div class="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                  <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Section Progress</span>
                  <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-teal-600 transition-all duration-500"
                      :style="{ width: `${(teamAnsweredCount / 6) * 100}%` }"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ teamAnsweredCount }} / 6</span>
                </div>
              </div>

              <!-- Questions -->
              <div class="space-y-8">
                <!-- Q1 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 1</span>
                    Does your company have a dedicated CEO/Managing Director? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="teamData.hasCEO" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="teamData.hasCEO" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q2 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 2</span>
                    Do you have a CFO or dedicated finance lead? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="teamData.hasCFO" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="teamData.hasCFO" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q3 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 3</span>
                    Do you have an advisory board?
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="teamData.hasAdvisoryBoard" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="teamData.hasAdvisoryBoard" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q4 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    <span class="text-gray-500 font-normal block mb-1">Question 4</span>
                    Average years of industry experience in leadership team <span class="text-red-500">*</span>
                  </label>
                  <div class="relative max-w-md">
                    <select v-model="teamData.experience"
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm appearance-none bg-white">
                      <option value="" disabled selected>Select an option</option>
                      <option value="0-2">0-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                    <ChevronDownIcon
                      class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <!-- Q5 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-4">
                    <span class="text-gray-500 font-normal block mb-1">Question 5</span>
                    Rate your team's ability to execute on strategic goals <span class="text-red-500">*</span>
                  </label>
                  <div class="max-w-xl">
                    <input type="range" v-model.number="teamData.ability" min="1" max="10" step="1"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600">
                    <div class="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1 (Low)</span>
                      <span>10 (High)</span>
                    </div>
                    <div class="text-center mt-2 font-medium text-teal-700">{{ teamData.ability }}</div>
                  </div>
                </div>

                <!-- Q6 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    <span class="text-gray-500 font-normal block mb-1">Question 6</span>
                    Describe your leadership team's key strengths
                  </label>
                  <textarea v-model="teamData.strengths" placeholder="Enter key strengths..." rows="4"
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm placeholder-gray-400 resize-none"></textarea>
                </div>
              </div>
            </div>

            <div v-else-if="currentSection === 2" class="space-y-8">
              <!-- Section Header & Progress -->
              <div>
                <p class="text-gray-500 text-sm mb-6">Evaluate the SME's business model capabilities</p>

                <div class="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                  <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Section Progress</span>
                  <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-teal-600 transition-all duration-500"
                      :style="{ width: `${(businessAnsweredCount / 5) * 100}%` }"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ businessAnsweredCount }} / 5</span>
                </div>
              </div>

              <!-- Questions -->
              <div class="space-y-8">
                <!-- Q1 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 1</span>
                    Is your business model clearly documented? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="businessData.isDocumented" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="businessData.isDocumented" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q2 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    <span class="text-gray-500 font-normal block mb-1">Question 2</span>
                    Primary Revenue Model <span class="text-red-500">*</span>
                  </label>
                  <div class="relative max-w-md">
                    <select v-model="businessData.revenueModel"
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm appearance-none bg-white">
                      <option value="" disabled selected>Select an option</option>
                      <option value="Subscription/SaaS">Subscription/SaaS</option>
                      <option value="Transactional">Transactional</option>
                      <option value="Licensing">Licensing</option>
                      <option value="Marketplace">Marketplace</option>
                      <option value="Services">Services</option>
                      <option value="Mixed">Mixed</option>
                    </select>
                    <ChevronDownIcon
                      class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <!-- Q3 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 3</span>
                    Do you have validated unit economics? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="businessData.validatedUnitEconomics" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="businessData.validatedUnitEconomics" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q4 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 4</span>
                    Do you have recurring revenue streams? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="businessData.recurringRevenue" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="businessData.recurringRevenue" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q5 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-4">
                    <span class="text-gray-500 font-normal block mb-1">Question 5</span>
                    Rate the scalability of your business model <span class="text-red-500">*</span>
                  </label>
                  <div class="max-w-xl">
                    <input type="range" v-model.number="businessData.scalability" min="1" max="10" step="1"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600">
                    <div class="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1 (Low)</span>
                      <span>10 (High)</span>
                    </div>
                    <div class="text-center mt-2 font-medium text-teal-700">{{ businessData.scalability }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="currentSection === 3" class="space-y-8">
              <!-- Section Header & Progress -->
              <div>
                <p class="text-gray-500 text-sm mb-6">Evaluate the SME's market & traction capabilities</p>

                <div class="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                  <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Section Progress</span>
                  <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-teal-600 transition-all duration-500"
                      :style="{ width: `${(marketAnsweredCount / 5) * 100}%` }"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ marketAnsweredCount }} / 5</span>
                </div>
              </div>

              <!-- Questions -->
              <div class="space-y-8">
                <!-- Q1 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    <span class="text-gray-500 font-normal block mb-1">Question 1</span>
                    Target Market Size (USD) <span class="text-red-500">*</span>
                  </label>
                  <div class="relative max-w-md">
                    <select v-model="marketData.marketSize"
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm appearance-none bg-white">
                      <option value="" disabled selected>Select an option</option>
                      <option value="Under $1M">Under $1M</option>
                      <option value="$1M - $10M">$1M - $10M</option>
                      <option value="$10M - $100M">$10M - $100M</option>
                      <option value="$100M - $1B">$100M - $1B</option>
                      <option value="Over $1B">Over $1B</option>
                    </select>
                    <ChevronDownIcon
                      class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <!-- Q2 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    <span class="text-gray-500 font-normal block mb-1">Question 2</span>
                    Number of Active Customers <span class="text-red-500">*</span>
                  </label>
                  <input type="number" v-model="marketData.activeCustomers" placeholder="Enter number of customers"
                    class="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm placeholder-gray-400">
                </div>

                <!-- Q3 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    <span class="text-gray-500 font-normal block mb-1">Question 3</span>
                    Monthly Customer Growth Rate (%) <span class="text-red-500">*</span>
                  </label>
                  <input type="number" v-model="marketData.growthRate" placeholder="e.g., 10"
                    class="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm placeholder-gray-400">
                </div>

                <!-- Q4 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 4</span>
                    Do you track customer retention metrics? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="marketData.trackRetention" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="marketData.trackRetention" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q5 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 5</span>
                    Customer acquisition strategy maturity <span class="text-red-500">*</span>
                  </label>
                  <div class="space-y-3">
                    <label
                      v-for="option in ['No formal strategy', 'Basic strategy in place', 'Well-developed strategy', 'Advanced multi-channel strategy']"
                      :key="option"
                      class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      :class="marketData.acquisitionStrategy === option ? 'border-teal-500 ring-1 ring-teal-500 bg-teal-50' : 'border-gray-200'">
                      <input type="radio" v-model="marketData.acquisitionStrategy" :value="option"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">{{ option }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="currentSection === 4" class="space-y-8">
              <!-- Section Header & Progress -->
              <div>
                <p class="text-gray-500 text-sm mb-6">Evaluate the SME's financial readiness capabilities</p>

                <div class="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                  <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Section Progress</span>
                  <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-teal-600 transition-all duration-500"
                      :style="{ width: `${(financeAnsweredCount / 5) * 100}%` }"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ financeAnsweredCount }} / 5</span>
                </div>
              </div>

              <!-- Questions -->
              <div class="space-y-8">
                <!-- Q1 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    <span class="text-gray-500 font-normal block mb-1">Question 1</span>
                    Annual Revenue (USD) <span class="text-red-500">*</span>
                  </label>
                  <div class="relative max-w-md">
                    <select v-model="financeData.revenue"
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm appearance-none bg-white">
                      <option value="" disabled selected>Select an option</option>
                      <option value="Pre-revenue">Pre-revenue</option>
                      <option value="Under $50K">Under $50K</option>
                      <option value="$50K - $200K">$50K - $200K</option>
                      <option value="$200K - $1M">$200K - $1M</option>
                      <option value="$1M - $5M">$1M - $5M</option>
                      <option value="Over $5M">Over $5M</option>
                    </select>
                    <ChevronDownIcon
                      class="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <!-- Q2 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 2</span>
                    Do you have monthly financial tracking? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="financeData.financialTracking" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="financeData.financialTracking" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q3 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 3</span>
                    Do you have 3-year financial projections? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="financeData.projections" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="financeData.projections" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q4 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    <span class="text-gray-500 font-normal block mb-1">Question 4</span>
                    Current runway (months) <span class="text-red-500">*</span>
                  </label>
                  <input type="number" v-model="financeData.runway" placeholder="Months of runway"
                    class="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm placeholder-gray-400">
                </div>

                <!-- Q5 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 5</span>
                    Have you completed a financial audit?
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="financeData.audit" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="financeData.audit" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="currentSection === 5" class="space-y-8">
              <!-- Section Header & Progress -->
              <div>
                <p class="text-gray-500 text-sm mb-6">Evaluate the SME's operations capabilities</p>

                <div class="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                  <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Section Progress</span>
                  <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-teal-600 transition-all duration-500"
                      :style="{ width: `${(opsAnsweredCount / 5) * 100}%` }"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ opsAnsweredCount }} / 5</span>
                </div>
              </div>

              <!-- Questions -->
              <div class="space-y-8">
                <!-- Q1 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 1</span>
                    Are your core processes documented? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="opsData.processDocumented" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="opsData.processDocumented" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q2 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 2</span>
                    Do you have quality control measures? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="opsData.qualityControl" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="opsData.qualityControl" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q3 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 3</span>
                    Supply chain maturity level <span class="text-red-500">*</span>
                  </label>
                  <div class="space-y-3">
                    <label
                      v-for="option in ['No formal supply chain', 'Basic supplier relationships', 'Managed supply chain', 'Optimized & diversified']"
                      :key="option"
                      class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      :class="opsData.supplyChainMaturity === option ? 'border-teal-500 ring-1 ring-teal-500 bg-teal-50' : 'border-gray-200'">
                      <input type="radio" v-model="opsData.supplyChainMaturity" :value="option"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">{{ option }}</span>
                    </label>
                  </div>
                </div>

                <!-- Q4 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-4">
                    <span class="text-gray-500 font-normal block mb-1">Question 4</span>
                    Rate your operational efficiency <span class="text-red-500">*</span>
                  </label>
                  <div class="max-w-xl">
                    <input type="range" v-model.number="opsData.efficiency" min="1" max="10" step="1"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600">
                    <div class="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1 (Low)</span>
                      <span>10 (High)</span>
                    </div>
                    <div class="text-center mt-2 font-medium text-teal-700">{{ opsData.efficiency }}</div>
                  </div>
                </div>

                <!-- Q5 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 5</span>
                    Do you track key operational KPIs? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="opsData.trackKPIs" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="opsData.trackKPIs" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="currentSection === 6" class="space-y-8">
              <!-- Section Header & Progress -->
              <div>
                <p class="text-gray-500 text-sm mb-6">Evaluate the SME's legal & governance capabilities</p>

                <div class="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                  <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Section Progress</span>
                  <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-teal-600 transition-all duration-500"
                      :style="{ width: `${(legalAnsweredCount / 5) * 100}%` }"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ legalAnsweredCount }} / 5</span>
                </div>
              </div>

              <!-- Questions -->
              <div class="space-y-8">
                <!-- Q1 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 1</span>
                    Is your company properly registered? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="legalData.registered" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="legalData.registered" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q2 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 2</span>
                    Do you have IP protection (patents, trademarks)? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="legalData.ipProtection" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="legalData.ipProtection" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q3 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 3</span>
                    Do you have a formal board of directors? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="legalData.boardOfDirectors" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="legalData.boardOfDirectors" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q4 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 4</span>
                    Shareholder agreement status <span class="text-red-500">*</span>
                  </label>
                  <div class="space-y-3">
                    <label v-for="option in ['No agreement', 'Informal agreement', 'Formal agreement in place']"
                      :key="option"
                      class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      :class="legalData.shareholderAgreement === option ? 'border-teal-500 ring-1 ring-teal-500 bg-teal-50' : 'border-gray-200'">
                      <input type="radio" v-model="legalData.shareholderAgreement" :value="option"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">{{ option }}</span>
                    </label>
                  </div>
                </div>

                <!-- Q5 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 5</span>
                    Are you compliant with all relevant regulations? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="legalData.regulatoryCompliance" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="legalData.regulatoryCompliance" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="currentSection === 7" class="space-y-8">
              <!-- Section Header & Progress -->
              <div>
                <p class="text-gray-500 text-sm mb-6">Evaluate the SME's data & digital maturity capabilities</p>

                <div class="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                  <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Section Progress</span>
                  <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-teal-600 transition-all duration-500"
                      :style="{ width: `${(digitalAnsweredCount / 5) * 100}%` }"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ digitalAnsweredCount }} / 5</span>
                </div>
              </div>

              <!-- Questions -->
              <div class="space-y-8">
                <!-- Q1 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 1</span>
                    Do you use a CRM or customer data platform? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="digitalData.useCRM" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="digitalData.useCRM" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q2 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 2</span>
                    Digital maturity level <span class="text-red-500">*</span>
                  </label>
                  <div class="space-y-3">
                    <label
                      v-for="option in ['Basic digital presence', 'Developing digital capabilities', 'Advanced digital integration', 'Digital-first organization']"
                      :key="option"
                      class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      :class="digitalData.digitalMaturity === option ? 'border-teal-500 ring-1 ring-teal-500 bg-teal-50' : 'border-gray-200'">
                      <input type="radio" v-model="digitalData.digitalMaturity" :value="option"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">{{ option }}</span>
                    </label>
                  </div>
                </div>

                <!-- Q3 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 3</span>
                    Do you have data analytics capabilities? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="digitalData.dataAnalytics" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="digitalData.dataAnalytics" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q4 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 4</span>
                    Cybersecurity measures in place? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="digitalData.cybersecurity" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="digitalData.cybersecurity" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q5 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-4">
                    <span class="text-gray-500 font-normal block mb-1">Question 5</span>
                    Rate your data-driven decision making <span class="text-red-500">*</span>
                  </label>
                  <div class="max-w-xl">
                    <input type="range" v-model.number="digitalData.decisionMaking" min="1" max="10" step="1"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600">
                    <div class="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1 (Low)</span>
                      <span>10 (High)</span>
                    </div>
                    <div class="text-center mt-2 font-medium text-teal-700">{{ digitalData.decisionMaking }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="currentSection === 8" class="space-y-8">
              <!-- Section Header & Progress -->
              <div>
                <p class="text-gray-500 text-sm mb-6">Evaluate the SME's growth & scalability capabilities</p>

                <div class="bg-gray-50 rounded-lg p-4 flex items-center gap-4">
                  <span class="text-sm font-medium text-gray-700 whitespace-nowrap">Section Progress</span>
                  <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-teal-600 transition-all duration-500"
                      :style="{ width: `${(growthAnsweredCount / 5) * 100}%` }"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ growthAnsweredCount }} / 5</span>
                </div>
              </div>

              <!-- Questions -->
              <div class="space-y-8">
                <!-- Q1 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 1</span>
                    Do you have a documented growth strategy? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="growthData.documentedStrategy" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="growthData.documentedStrategy" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q2 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 2</span>
                    Geographic expansion readiness <span class="text-red-500">*</span>
                  </label>
                  <div class="space-y-3">
                    <label
                      v-for="option in ['Local only', 'National expansion ready', 'Regional expansion ready', 'Global expansion ready']"
                      :key="option"
                      class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      :class="growthData.expansionReadiness === option ? 'border-teal-500 ring-1 ring-teal-500 bg-teal-50' : 'border-gray-200'">
                      <input type="radio" v-model="growthData.expansionReadiness" :value="option"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">{{ option }}</span>
                    </label>
                  </div>
                </div>

                <!-- Q3 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-3">
                    <span class="text-gray-500 font-normal block mb-1">Question 3</span>
                    Do you have strategic partnerships? <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-6">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="growthData.strategicPartnerships" :value="true"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">Yes</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" v-model="growthData.strategicPartnerships" :value="false"
                        class="w-4 h-4 text-teal-600 focus:ring-teal-500 border-gray-300">
                      <span class="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                <!-- Q4 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-4">
                    <span class="text-gray-500 font-normal block mb-1">Question 4</span>
                    Technology infrastructure scalability <span class="text-red-500">*</span>
                  </label>
                  <div class="max-w-xl">
                    <input type="range" v-model.number="growthData.techScalability" min="1" max="10" step="1"
                      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600">
                    <div class="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1 (Low)</span>
                      <span>10 (High)</span>
                    </div>
                    <div class="text-center mt-2 font-medium text-teal-700">{{ growthData.techScalability }}</div>
                  </div>
                </div>

                <!-- Q5 -->
                <div>
                  <label class="block text-sm font-medium text-gray-900 mb-2">
                    <span class="text-gray-500 font-normal block mb-1">Question 5</span>
                    What is your primary growth constraint?
                  </label>
                  <textarea v-model="growthData.growthConstraint" placeholder="Describe your main growth constraint..."
                    rows="4"
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-shadow text-sm placeholder-gray-400 resize-none"></textarea>
                </div>
              </div>
            </div>
            <div v-else-if="currentSection === 9" class="space-y-6">
              <!-- Header -->
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <CheckIcon class="w-6 h-6 text-teal-600" />
                  <h2 class="text-xl font-bold text-gray-900">Review & Submit</h2>
                </div>
                <p class="text-gray-500 text-sm">Review your responses before submitting</p>
              </div>

              <!-- Company Information -->
              <div class="bg-gray-50 rounded-xl p-6">
                <h3 class="text-base font-bold text-gray-900 mb-6">Company Information</h3>
                <div class="grid grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <div class="text-xs font-medium text-gray-500 mb-1">Company Name</div>
                    <div class="text-sm font-medium text-gray-900">{{ formData.name || '-' }}</div>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-gray-500 mb-1">Sector</div>
                    <div class="text-sm font-medium text-gray-900">{{ formData.sector || '-' }}</div>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-gray-500 mb-1">Location</div>
                    <div class="text-sm font-medium text-gray-900">{{ formData.location || '-' }}</div>
                  </div>
                  <div>
                    <div class="text-xs font-medium text-gray-500 mb-1">Employees</div>
                    <div class="text-sm font-medium text-gray-900">{{ formData.employees || '-' }}</div>
                  </div>
                </div>
              </div>

              <!-- Assessment Score Summary -->
              <div class="bg-teal-50 rounded-xl p-6">
                <h3 class="text-base font-bold text-gray-900 mb-4">Assessment Score Summary</h3>
                <div class="flex items-center gap-4">
                  <div class="text-5xl font-bold text-teal-700">{{ finalScore }}</div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">Overall Score</div>
                    <div class="text-sm text-gray-600">Based on {{ totalAnswered }} of {{ totalQuestions }} questions
                    </div>
                  </div>
                </div>
              </div>

              <!-- Pillar Breakdown -->
              <div>
                <h3 class="text-base font-bold text-gray-900 mb-4">Pillar Breakdown</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="(section, index) in sections.filter(s => s.id !== 'review' && s.id !== 'profile')"
                    :key="section.id" class="p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                    <div class="flex items-center gap-3 mb-4">
                      <div class="p-2 rounded-lg bg-orange-50 text-orange-500" v-if="index % 4 === 0">
                        <component :is="section.icon" class="w-5 h-5" />
                      </div>
                      <div class="p-2 rounded-lg bg-red-50 text-red-500" v-else-if="index % 4 === 1">
                        <component :is="section.icon" class="w-5 h-5" />
                      </div>
                      <div class="p-2 rounded-lg bg-yellow-50 text-yellow-500" v-else-if="index % 4 === 2">
                        <component :is="section.icon" class="w-5 h-5" />
                      </div>
                      <div class="p-2 rounded-lg bg-green-50 text-green-500" v-else>
                        <component :is="section.icon" class="w-5 h-5" />
                      </div>
                      <span class="font-medium text-gray-900 text-sm">{{ section.name }}</span>
                    </div>
                    <!-- Progress Bar -->
                    <div class="flex items-center gap-3">
                      <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-teal-600 rounded-full" :style="{ width: `${section.progress}%` }"></div>
                      </div>
                      <span class="text-xs font-bold text-gray-700">{{ section.progress }}%</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Incomplete Warning -->
              <div v-if="overallProgress < 100"
                class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                <div class="text-yellow-600 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path fill-rule="evenodd"
                      d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 class="text-sm font-medium text-yellow-800">Incomplete Assessment</h4>
                  <p class="text-sm text-yellow-700 mt-1">
                    {{ totalQuestions - totalAnswered }} questions remaining. You can still submit, but completing all
                    questions is recommended.
                  </p>
                </div>
              </div>

            </div>
            <div v-else class="py-12 text-center text-gray-500">
              <component :is="sections[currentSection].icon" class="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>Content for {{ sections[currentSection].name }} will go here.</p>
            </div>
          </div>


          <!-- Navigation Buttons -->
          <div class="flex items-center justify-between mt-8 mb-12">
            <button @click="prevSection" :disabled="currentSection === 0"
              class="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
              <ChevronLeftIcon class="w-4 h-4" />
              Previous
            </button>

            <button v-if="currentSection < sections.length - 1" @click="nextSection"
              class="px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              Next
              <ChevronRightIcon class="w-4 h-4" />
            </button>
            <button v-else @click="submitAssessment"
              class="px-6 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              Submit Assessment
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin'
})

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ClipboardDocumentListIcon,
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
  CheckIcon
} from '@heroicons/vue/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/vue/24/solid'

import { useAdminStore } from '~/stores/admin.store'

const route = useRoute()
const adminStore = useAdminStore()

// Mock Data
const defaultProgramName = 'Investment Accelerator 2024'; const programName = ref(defaultProgramName)
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

// Team Data
const teamData = ref({
  hasCEO: null,
  hasCFO: null,
  hasAdvisoryBoard: null,
  experience: '',
  ability: 5, // Default mid-range
  strengths: ''
})

const teamAnsweredCount = computed(() => {
  let count = 0
  if (teamData.value.hasCEO !== null) count++
  if (teamData.value.hasCFO !== null) count++
  if (teamData.value.hasAdvisoryBoard !== null) count++
  if (teamData.value.experience) count++
  // ability is always set (slider), but let's count it
  if (teamData.value.ability) count++
  if (teamData.value.strengths.trim()) count++
  return count
})

const teamProgress = computed(() => {
  return Math.round((teamAnsweredCount.value / 6) * 100)
})

// Business Model Data
const businessData = ref({
  isDocumented: null,
  revenueModel: '',
  validatedUnitEconomics: null,
  recurringRevenue: null,
  scalability: 1
})

const businessAnsweredCount = computed(() => {
  let count = 0
  if (businessData.value.isDocumented !== null) count++
  if (businessData.value.revenueModel) count++
  if (businessData.value.validatedUnitEconomics !== null) count++
  if (businessData.value.recurringRevenue !== null) count++
  // scalability is a range so it's always set, but good to include in count logic
  if (businessData.value.scalability >= 1) count++
  return count
})

const businessProgress = computed(() => {
  return Math.round((businessAnsweredCount.value / 5) * 100)
})



// Market & Traction Data
const marketData = ref({
  marketSize: '',
  activeCustomers: '',
  growthRate: '',
  trackRetention: null,
  acquisitionStrategy: ''
})

const marketAnsweredCount = computed(() => {
  let count = 0
  if (marketData.value.marketSize) count++
  if (marketData.value.activeCustomers !== '') count++
  if (marketData.value.growthRate !== '') count++
  if (marketData.value.trackRetention !== null) count++
  if (marketData.value.acquisitionStrategy) count++
  return count
})

const marketProgress = computed(() => {
  return Math.round((marketAnsweredCount.value / 5) * 100)
})

// Financial Readiness Data
const financeData = ref({
  revenue: '',
  financialTracking: null,
  projections: null,
  runway: '',
  audit: null
})

const financeAnsweredCount = computed(() => {
  let count = 0
  if (financeData.value.revenue) count++
  if (financeData.value.financialTracking !== null) count++
  if (financeData.value.projections !== null) count++
  if (financeData.value.runway !== '') count++
  // audit is optional in mock but let's count it if selected
  if (financeData.value.audit !== null) count++
  return count
})

const financeProgress = computed(() => {
  return Math.round((financeAnsweredCount.value / 5) * 100)
})

// Operations Data
const opsData = ref({
  processDocumented: null,
  qualityControl: null,
  supplyChainMaturity: '',
  efficiency: 1,
  trackKPIs: null
})

const opsAnsweredCount = computed(() => {
  let count = 0
  if (opsData.value.processDocumented !== null) count++
  if (opsData.value.qualityControl !== null) count++
  if (opsData.value.supplyChainMaturity) count++
  // efficiency is a range
  if (opsData.value.efficiency >= 1) count++
  if (opsData.value.trackKPIs !== null) count++
  return count
})

const opsProgress = computed(() => {
  return Math.round((opsAnsweredCount.value / 5) * 100)
})

// Legal & Governance Data
const legalData = ref({
  registered: null,
  ipProtection: null,
  boardOfDirectors: null,
  shareholderAgreement: '',
  regulatoryCompliance: null
})

const legalAnsweredCount = computed(() => {
  let count = 0
  if (legalData.value.registered !== null) count++
  if (legalData.value.ipProtection !== null) count++
  if (legalData.value.boardOfDirectors !== null) count++
  if (legalData.value.shareholderAgreement) count++
  if (legalData.value.regulatoryCompliance !== null) count++
  return count
})

const legalProgress = computed(() => {
  return Math.round((legalAnsweredCount.value / 5) * 100)
})

// Data & Digital Maturity Data
const digitalData = ref({
  useCRM: null,
  digitalMaturity: '',
  dataAnalytics: null,
  cybersecurity: null,
  decisionMaking: 1
})

const digitalAnsweredCount = computed(() => {
  let count = 0
  if (digitalData.value.useCRM !== null) count++
  if (digitalData.value.digitalMaturity) count++
  if (digitalData.value.dataAnalytics !== null) count++
  if (digitalData.value.cybersecurity !== null) count++
  if (digitalData.value.decisionMaking >= 1) count++
  return count
})

const digitalProgress = computed(() => {
  return Math.round((digitalAnsweredCount.value / 5) * 100)
})

// Growth & Scalability Data
const growthData = ref({
  documentedStrategy: null,
  expansionReadiness: '',
  strategicPartnerships: null,
  techScalability: 1,
  growthConstraint: ''
})

const growthAnsweredCount = computed(() => {
  let count = 0
  if (growthData.value.documentedStrategy !== null) count++
  if (growthData.value.expansionReadiness) count++
  if (growthData.value.strategicPartnerships !== null) count++
  // techScalability is a slider (always has value), but let's count it
  if (growthData.value.techScalability >= 1) count++
  if (growthData.value.growthConstraint) count++
  return count
})

const growthProgress = computed(() => {
  return Math.round((growthAnsweredCount.value / 5) * 100)
})

const contentSections = computed(() => [
  { id: 'profile', name: 'Company Profile', icon: BuildingOfficeIcon, progress: profileProgress.value },
  { id: 'team', name: 'Team & Leadership', icon: UserGroupIcon, progress: teamProgress.value },
  { id: 'business', name: 'Business Model', icon: BuildingOfficeIcon, progress: businessProgress.value },
  { id: 'market', name: 'Market & Traction', icon: PresentationChartLineIcon, progress: marketProgress.value },
  { id: 'finance', name: 'Financial Readiness', icon: CurrencyDollarIcon, progress: financeProgress.value },
  { id: 'ops', name: 'Operations', icon: CogIcon, progress: opsProgress.value },
  { id: 'legal', name: 'Legal & Governance', icon: ScaleIcon, progress: legalProgress.value },
  { id: 'data', name: 'Data & Digital Maturity', icon: ComputerDesktopIcon, progress: digitalProgress.value },
  { id: 'growth', name: 'Growth & Scalability', icon: RocketLaunchIcon, progress: growthProgress.value },
])

const overallProgress = computed(() => {
  if (contentSections.value.length === 0) return 0
  const total = contentSections.value.reduce((sum, section) => sum + section.progress, 0)
  return Math.round(total / contentSections.value.length)
})

const sections = computed(() => [
  ...contentSections.value,
  { id: 'review', name: 'Review & Submit', icon: CheckCircleIcon, progress: overallProgress.value },
])

const totalQuestions = 41 // Sum of questions per section (5*8 + 1*? wait, let's count dynamically if possible or hardcode for now based on sections)
// Profile(5) + Team(6) + Business(5) + Market(5) + Finance(5) + Ops(5) + Legal(5) + Digital(5) + Growth(5) = 46
// Wait, the screenshot says "Based on 19 of 41 questions". Let's stick to the visual or a reasonable mock.
// I'll calculate total answered count dynamicially.

const totalAnswered = computed(() => {
  return profileAnsweredCount.value + teamAnsweredCount.value + businessAnsweredCount.value +
    marketAnsweredCount.value + financeAnsweredCount.value + opsAnsweredCount.value +
    legalAnsweredCount.value + digitalAnsweredCount.value + growthAnsweredCount.value
})

const finalScore = computed(() => {
  // Mock scoring logic: just average of progress for now, or some weighted sum
  return overallProgress.value
})

const isSubmitted = ref(false)

const submitAssessment = () => {
  // In real app: await adminStore.submitAssessment({...})
  isSubmitted.value = true
}

const navigateToDashboard = () => {
  navigateTo('/admin')
}

const sectors = ['Technology', 'Healthcare', 'FinTech', 'AgriTech', 'E-commerce', 'Manufacturing', 'CleanTech', 'EdTech', 'Services', 'Logistics']
const locations = ['Phnom Penh', 'Siem Reap', 'Battambang', 'Sihanoukville', 'Kampot', 'Kampong Cham', 'Takeo', 'Kandal', 'Kep', 'Mondulkiri']



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
