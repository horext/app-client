import type { InjectionKey } from 'vue'
import { useApiRegistry } from '../core/registry'

export function defineApi<T>(key: InjectionKey<T>, factory: () => T): () => T {
  return () => {
    const registry = useApiRegistry()
    const api = registry.get(key)

    if (!api) {
      const newApi = factory()
      registry.set(key, newApi)

      if (import.meta.env.DEV) {
        console.log(`🔌 "${key.description}" api installed 🆕`)
      }

      return newApi
    }

    return api
  }
}
