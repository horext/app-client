import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface SnackbarOptions {
  content: string
  timeout?: number
  color?: string
}

export const useGlobalSnackbarStore = defineStore('global/snackbar', () => {
  const content = ref('')
  const timeout = ref<number | undefined>(-1)
  const color = ref<string | undefined>()
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
