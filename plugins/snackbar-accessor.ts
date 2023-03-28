import { Plugin } from '@nuxt/types'
import { initializeSnackbar } from '~/utils/api'

const accessor: Plugin = ({ $snackbar }) => {
  initializeSnackbar($snackbar)
}

export default accessor
