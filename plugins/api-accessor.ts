import { Plugin } from '@nuxt/types'
import { initializeApi } from '~/utils/api'

const accessor: Plugin = ({ $api }) => {
  initializeApi($api)
}

export default accessor
