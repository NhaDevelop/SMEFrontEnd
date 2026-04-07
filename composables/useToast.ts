import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

// Global state outside the composable so it's shared across all components
const toasts = ref<Toast[]>([])

export const useToast = () => {
  const DEFAULT_DURATION = 4000 // 4 seconds by default

  const remove = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const add = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { ...toast, id }
    
    toasts.value.push(newToast)

    const duration = toast.duration ?? DEFAULT_DURATION
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  const success = (message: string, duration?: number) => {
    add({ message, type: 'success', duration })
  }

  const error = (message: string, duration?: number) => {
    add({ message, type: 'error', duration })
  }

  const warning = (message: string, duration?: number) => {
    add({ message, type: 'warning', duration })
  }

  const info = (message: string, duration?: number) => {
    add({ message, type: 'info', duration })
  }

  return {
    toasts,
    add,
    remove,
    success,
    error,
    warning,
    info
  }
}
