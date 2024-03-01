import { createStorage, type StorageValue, type Storage } from 'unstorage'
import localStorageDriver from 'unstorage/drivers/localstorage'

export const useLocalStorage = <T extends StorageValue>(): Storage<T> => {
  const storage = createStorage<T>()
  onMounted(() => {
    storage.mount('', localStorageDriver({}))
  })

  return storage
}
