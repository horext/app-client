import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SnackbarOptions {
  content: string
  timeout?: number | null
  color?: string | null
}

export const useGlobalSnackbarStore = defineStore('global/snackbar', () => {
  const content = ref('')
  const timeout = ref<number | null | undefined>(-1)
  const color = ref<string | null | undefined>(null)
  const show = ref(false)

  const showMessage = (payload: SnackbarOptions) => {
    content.value = payload.content
    timeout.value = payload.timeout
    color.value = payload.color
    show.value = true
  }

  return {
    content,
    timeout,
    color,
    showMessage,
    show,
  }
})
