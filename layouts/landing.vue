<template>
    <div class="min-h-screen bg-white font-sans text-gray-900 selection:bg-teal-100 selection:text-teal-900">
        <!-- Shared Header -->
        <LandingHeader />

        <!-- Page Content -->
        <slot />

        <!-- Scroll to Top -->
        <transition enter-active-class="transition duration-300 ease-out" enter-from-class="translate-y-10 opacity-0"
            enter-to-class="translate-y-0 opacity-100" leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-10 opacity-0">
            <button v-if="showScrollTop" @click="scrollToTop"
                class="fixed bottom-8 right-8 w-14 h-14 bg-teal-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-teal-700 hover:-translate-y-1 transition-all z-50">
                <ChevronUpIcon class="w-6 h-6" />
            </button>
        </transition>

        <!-- Shared Footer (hidden when the page provides its own) -->
        <LandingFooter v-if="!hideFooter" />

    </div>
</template>

<script setup>
import { ChevronUpIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const hideFooter = computed(() => !!route.meta.hideLayoutFooter)

const showScrollTop = ref(false)

onMounted(() => {
    window.addEventListener('scroll', () => {
        showScrollTop.value = window.scrollY > 400
    })
})

const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
