import { createStorage, type StorageValue, type Storage } from 'unstorage'
import localStorageDriver from 'unstorage/drivers/localstorage'

export const useLocalStorage = <T extends StorageValue>(
  prefix = '',
): Storage<T> => {
  const storage = createStorage<T>()
  if (import.meta.client) {
    storage.mount(prefix, localStorageDriver({}))
  }

  return storage
}
