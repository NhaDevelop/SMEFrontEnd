<template>
    <footer class="bg-gray-50 py-12 border-t border-gray-100">
        <div
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-teal-600 rounded-md flex items-center justify-center">
                    <ChartBarIcon class="w-5 h-5 text-white" />
                </div>
                <span class="text-xl font-bold text-gray-900 tracking-tight">IRIP</span>
            </div>
            <div class="flex gap-8 text-sm font-medium text-gray-500 uppercase tracking-widest">
                <NuxtLink to="/contact" class="hover:text-teal-600 transition-colors">Contact</NuxtLink>
                <NuxtLink to="/terms" class="hover:text-teal-600 transition-colors">Terms</NuxtLink>
                <a href="#" class="hover:text-teal-600 transition-colors">Privacy</a>
            </div>
            <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                &copy; 2026 IRIP. All rights reserved.
            </p>
        </div>
    </footer>
</template>

<script setup>
import { ChartBarIcon } from '@heroicons/vue/24/outline'
</script>
