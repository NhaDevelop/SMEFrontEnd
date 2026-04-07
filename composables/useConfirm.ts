import { ref, reactive } from 'vue'

export type ConfirmType = 'danger' | 'info' | 'warning' | 'success'

export interface ConfirmOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: ConfirmType
}

interface ConfirmState {
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  type: ConfirmType
  resolve: ((val: boolean) => void) | null
}

const state = reactive<ConfirmState>({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  type: 'info',
  resolve: null
})

export const useConfirm = () => {
  const ask = (options: ConfirmOptions): Promise<boolean> => {
    state.title = options.title
    state.message = options.message
    state.confirmText = options.confirmText || 'Confirm'
    state.cancelText = options.cancelText || 'Cancel'
    state.type = options.type || 'info'
    state.isOpen = true

    return new Promise((resolve) => {
      state.resolve = resolve
    })
  }

  const confirm = () => {
    if (state.resolve) {
      state.resolve(true)
    }
    close()
  }

  const cancel = () => {
    if (state.resolve) {
      state.resolve(false)
    }
    close()
  }

  const close = () => {
    state.isOpen = false
    state.resolve = null
  }

  return {
    state,
    ask,
    confirm,
    cancel
  }
}
