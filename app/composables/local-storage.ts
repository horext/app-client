import { createStorage, type StorageValue, type Storage } from 'unstorage'
import localStorageDriver from 'unstorage/drivers/localstorage'

export const useLocalStorage = <T extends StorageValue>(): Pick<
  Storage<T>,
  'getItem' | 'setItem'
> => {
  const storage = createStorage<T>()
  if (import.meta.client) {
    storage.mount('', localStorageDriver({}))
  }

  return storage
}
