<template>
  <!-- Fixed container at the bottom-right for the toasts -->
  <div 
    aria-live="assertive" 
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-[100]"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end mt-16 sm:mt-0">
      <TransitionGroup 
        name="toast-slide" 
        tag="div" 
        class="flex flex-col gap-3 items-end w-full"
      >
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div class="p-4">
            <div class="flex items-start">
              
              <!-- Icon based on type -->
              <div class="flex-shrink-0">
                <CheckCircleIcon v-if="toast.type === 'success'" class="h-6 w-6 text-primary-400" aria-hidden="true" />
                <XCircleIcon v-else-if="toast.type === 'error'" class="h-6 w-6 text-red-500" aria-hidden="true" />
                <ExclamationTriangleIcon v-else-if="toast.type === 'warning'" class="h-6 w-6 text-amber-500" aria-hidden="true" />
                <InformationCircleIcon v-else class="h-6 w-6 text-cyan-500" aria-hidden="true" />
              </div>
              
              <!-- Content -->
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">
                  {{ getTitle(toast.type) }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  {{ toast.message }}
                </p>
              </div>
              
              <!-- Close button -->
              <div class="ml-4 flex flex-shrink-0">
                <button 
                  type="button" 
                  @click="remove(toast.id)"
                  class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  <span class="sr-only">Close</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  InformationCircleIcon, 
  ExclamationTriangleIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline'

const { toasts, remove } = useToast()

const getTitle = (type: string) => {
  switch (type) {
    case 'success': return 'Success'
    case 'error': return 'Error'
    case 'warning': return 'Warning'
    default: return 'Information'
  }
}
</script>

<style scoped>
/* Vue Transition Group animations */
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s ease;
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
  /* Ensure smooth stacking when one leafes */
  margin-top: -100px; 
}
</style>
