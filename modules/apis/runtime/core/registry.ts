import { type InjectionKey, inject } from 'vue'
import { API_REGISTRY_KEY } from './symbols'

export class ApiRegistry extends Map<InjectionKey<unknown>, unknown> {
  override get<T>(key: InjectionKey<T>): T | undefined {
    return super.get(key) as T | undefined
  }

  override set<T>(key: InjectionKey<T>, value: T): this {
    return super.set(key, value)
  }

  override has<T>(key: InjectionKey<T>): boolean {
    return super.has(key)
  }
}

export function useApiRegistry() {
  const registry = inject(API_REGISTRY_KEY)

  if (!registry) {
    throw new Error(
      'ApiRegistry not provided. Did you forget to register the plugin?',
    )
  }

  return registry
}
