import { useContext } from '@nuxtjs/composition-api'

export const useApi = () => {
  const { $api } = useContext()
  return $api
}
