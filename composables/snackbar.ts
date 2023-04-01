import { useStore } from '@nuxtjs/composition-api'
import { ref } from 'vue'

export function useSnackbar () {
  const store = useStore()
  function showMessage (
    content: string,
    snackbarColor: string,
    snackbarTimeout: number
  ) {
    store.commit('modules/snackbar/showMessage', {
      content,
      color: snackbarColor,
      timeout: snackbarTimeout
    })
  }

  return {
    showMessage
  }
}

export const setupSnackbar = () => {
  const show = ref(false)
  const message = ref('')
  const timeout = ref(-1)
  const color = ref('')
  const store = useStore<any>()
  store.subscribe((mutation, state) => {
    if (mutation.type === 'modules/snackbar/showMessage') {
      message.value = state.modules.snackbar.content
      color.value = state.modules.snackbar.color
      timeout.value = state.modules.snackbar.timeout
      show.value = true

      if (timeout.value > 0) {
        setTimeout(() => {
          show.value = false
        }, timeout.value)
      }
    }
  })

  return {
    show,
    message,
    timeout,
    color
  }
}
