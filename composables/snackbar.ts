import { storeToRefs } from 'pinia'
import {
  SnackbarOptions,
  useGlobalSnackbarStore,
} from '~/stores/global-snackbar'

export function useSnackbar() {
  const store = useGlobalSnackbarStore()
  function showMessage(payload: SnackbarOptions) {
    store.showMessage(payload)
  }

  return {
    showMessage,
  }
}

export const setupSnackbar = () => {
  const store = useGlobalSnackbarStore()
  const { color, content, timeout, show } = storeToRefs(store)
  return { color, message: content, timeout, show }
}
