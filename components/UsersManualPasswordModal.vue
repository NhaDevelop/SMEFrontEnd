<template>
    <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="$emit('close')" class="relative z-50">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black/25 backdrop-blur-sm" />
            </TransitionChild>

            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4">
                    <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <DialogPanel
                            class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <DialogTitle as="h3" class="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <KeyIcon class="w-6 h-6 text-cyan-600" />
                                Renew User Password
                            </DialogTitle>

                            <div class="mt-2 text-sm text-gray-500">
                                Directly set a new password for <span class="font-semibold text-gray-900">{{ userEmail
                                    }}</span>.
                                The user will be able to log in with this new password immediately.
                            </div>

                            <form @submit.prevent="handleSubmit" class="mt-6 space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <div class="relative">
                                        <input :type="showPassword ? 'text' : 'password'" v-model="password" required
                                            minlength="8"
                                            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none pr-10"
                                            placeholder="Minimum 8 characters" />
                                        <button type="button" @click="showPassword = !showPassword"
                                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                                            <EyeSlashIcon v-else class="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div class="mt-8 flex gap-3 justify-end">
                                    <button type="button" @click="$emit('close')"
                                        class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" :disabled="loading || password.length < 8"
                                        class="px-6 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                                        <span v-if="loading"
                                            class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
} from '@headlessui/vue'
import { KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
    isOpen: boolean
    userEmail: string
    loading: boolean
}>()

const emit = defineEmits(['close', 'confirm'])

const password = ref('')
const showPassword = ref(false)

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        password.value = ''
        showPassword.value = false
    }
})

const handleSubmit = () => {
    if (password.value.length >= 8) {
        emit('confirm', password.value)
    }
}
</script>
