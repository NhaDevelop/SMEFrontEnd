<template>
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ChatBubbleBottomCenterTextIcon class="w-5 h-5 text-gray-500" />
            Evaluator Notes
        </h3>
        <p class="text-sm text-gray-500 mt-1">Private notes and observations about {{ smeName }}</p>
      </div>
      <button class="px-3 py-2 bg-teal-700 text-white rounded-lg text-sm font-medium hover:bg-teal-800 transition-colors flex items-center gap-2">
        <PlusIcon class="w-4 h-4" />
        Add Note
      </button>
    </div>

    <div class="space-y-6">
        <!-- Note 1 -->
        <div class="flex gap-4">
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
                DC
            </div>
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-bold text-gray-900">David Chen</span>
                    <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Investor</span>
                    <span class="text-xs text-gray-400">Sep 15, 2024 at 2:30 PM</span>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed mb-3">
                    Strong team composition with experienced leadership. CEO has 10+ years in the sector. Recommend focusing on financial metrics improvement before next funding round.
                </p>
                <div class="flex gap-2">
                    <span class="px-2 py-1 bg-cyan-50 text-cyan-700 rounded text-xs font-medium">Team Assessment</span>
                    <span class="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">Positive Signal</span>
                </div>
            </div>
        </div>
        
        <div class="h-px bg-gray-100 w-full pl-12"></div>

        <!-- Note 2 -->
        <div class="flex gap-4">
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
                SA
            </div>
            <div class="flex-1">
                <div class="flex items-center justify-between">
                     <div class="flex items-center gap-2 mb-1">
                        <span class="text-sm font-bold text-gray-900">Sarah Admin</span>
                        <span class="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Admin</span>
                        <span class="text-xs text-gray-400">Oct 2, 2024 at 10:15 AM</span>
                    </div>
                    <span class="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded-full">
                        <EyeSlashIcon class="w-3 h-3" />
                        Investors Only
                    </span>
                </div>
               
                <p class="text-sm text-gray-700 leading-relaxed mb-3">
                    Legal documentation review completed. IP protection needs attention - patents pending but not yet secured. Follow up in 30 days.
                </p>
                <div class="flex gap-2">
                    <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium border border-gray-200">Legal Review</span>
                    <span class="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">Follow-up Required</span>
                </div>
            </div>
        </div>

        <div class="h-px bg-gray-100 w-full pl-12"></div>

         <!-- Note 3 -->
        <div class="flex gap-4">
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
                DC
            </div>
            <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-bold text-gray-900">David Chen</span>
                    <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold">Investor</span>
                    <span class="text-xs text-gray-400">Nov 20, 2024 at 4:45 PM</span>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed mb-3">
                   Met with founding team. Discussed growth strategy and market expansion plans. They have a clear vision for regional expansion within 18 months.
                </p>
                <div class="flex gap-2">
                    <span class="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium">Meeting Notes</span>
                    <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">Market Analysis</span>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChatBubbleBottomCenterTextIcon, PlusIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

defineProps<{
    smeName: string
}>()
</script>
