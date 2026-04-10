<template>
  <TransitionRoot as="template" :show="state.isOpen">
    <Dialog as="div" class="relative z-[110]" @close="cancel">
      
      <!-- Backdrop -->
      <TransitionChild 
        as="template" 
        enter="ease-out duration-300" 
        enter-from="opacity-0" 
        enter-to="opacity-100" 
        leave="ease-in duration-200" 
        leave-from="opacity-100" 
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity blur-[1px]" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild 
            as="template" 
            enter="ease-out duration-300" 
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" 
            enter-to="opacity-100 translate-y-0 sm:scale-100" 
            leave="ease-in duration-200" 
            leave-from="opacity-100 translate-y-0 sm:scale-100" 
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-100">
              
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start text-center sm:text-left">
                  
                  <!-- Logo Section -->
                  <div class="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-12 sm:w-12 bg-white shadow-sm border border-gray-100">
                    <img src="/logo.png" alt="CAM INVESTMENT" class="h-full w-full object-cover rounded-full" />
                  </div>

                  <!-- Content Section -->
                  <div class="mt-3 sm:ml-4 sm:mt-0">
                    <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900 tracking-tight">
                      {{ state.title }}
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500 leading-relaxed">
                        {{ state.message }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Buttons Section -->
              <div class="bg-gray-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6 gap-3">
                <button 
                  type="button" 
                  :class="[
                    'inline-flex w-full justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm sm:w-auto transition-all',
                    state.type === 'danger' ? 'bg-red-600 hover:bg-red-500 focus-visible:outline-red-600' : 
                    'bg-primary-500 hover:bg-primary-600 focus-visible:outline-primary-600'
                  ]"
                  @click="confirm"
                >
                  {{ state.confirmText }}
                </button>
                <button 
                  type="button" 
                  class="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-all" 
                  @click="cancel" 
                  ref="cancelButtonRef"
                >
                  {{ state.cancelText }}
                </button>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { 
  Dialog, 
  DialogPanel, 
  DialogTitle, 
  TransitionChild, 
  TransitionRoot 
} from '@headlessui/vue'
import { 
  ExclamationTriangleIcon, 
  InformationCircleIcon 
} from '@heroicons/vue/24/outline'

const { state, confirm, cancel } = useConfirm()
</script>
