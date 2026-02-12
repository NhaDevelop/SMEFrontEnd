<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-8 py-6 mb-8 flex-shrink-0">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p class="text-gray-500 mt-1">Manage users, programs, and assessment framework</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
            <ArrowDownTrayIcon class="w-4 h-4" />
            Export All Data
          </button>
          <button class="px-4 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors flex items-center gap-2">
            <PlusIcon class="w-4 h-4" />
            Create Program
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-8 pb-12 max-w-[1600px] mx-auto flex-1 overflow-y-auto custom-scrollbar w-full">
      <!-- KPI Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total SMEs" 
          value="25" 
          :icon="BuildingOfficeIcon"
        />
        <StatCard 
          title="Active Users" 
          value="42" 
          :icon="UsersIcon"
        />
        <StatCard 
          title="Programs" 
          value="8" 
          :icon="FolderIcon"
        />
        <StatCard 
          title="Assessments This Month" 
          value="156" 
          :icon="Cog6ToothIcon" 
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Framework Settings -->
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-white rounded-xl shadow-soft p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-bold text-gray-900">Framework Settings</h2>
              <button class="text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                Reset to Defaults
              </button>
            </div>
            <FrameworkSettingsSummary />
          </div>
        </div>

        <!-- Right Column: Actions & Programs -->
        <div class="space-y-6">
          <QuickActions />
          <ActivePrograms />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { 
  BuildingOfficeIcon, 
  UsersIcon, 
  FolderIcon, 
  ClipboardDocumentListIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'
import StatCard from './StatCard.vue'
import FrameworkSettingsSummary from './FrameworkSettingsSummary.vue'
import QuickActions from './QuickActions.vue'
import ActivePrograms from './ActivePrograms.vue'
</script>
