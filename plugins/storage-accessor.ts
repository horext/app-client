import { Plugin } from '@nuxt/types'
import { initializeStorage } from '~/utils/api'

const accessor: Plugin = ({ $storage }) => {
  initializeStorage($storage)
}

export default accessor
