import { useContext } from '@nuxtjs/composition-api'

export const useStorage = () => {
  const { $storage } = useContext()
  return $storage
}
