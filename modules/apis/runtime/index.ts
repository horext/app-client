import type { $Fetch } from 'nitropack'
import type { ApiFactory } from './interfaces/registry'
import { APIS_REGISTRY } from './registry'
import type { BaseApi } from './resources/base'
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

export const FETCH_KEY: InjectionKey<$Fetch> = Symbol('Fetch')

export const createFetchApi = () => {
  const fetch = $fetch.create({
    baseURL: '/api',
  })
  return fetch
}

export const provideFetch = () => {
  const fetch = createFetchApi()
  provide(FETCH_KEY, fetch)
}

export const provideApis = (registry = APIS_REGISTRY) => {
  type ProvidedType =
    (typeof registry)[number]['provide'] extends InjectionKey<infer T>
      ? T
      : never
  const instances: Map<InjectionKey<ProvidedType>, ProvidedType> = new Map()
  for (const item of registry) {
    const instance = provideApi<ProvidedType>(item.provide, item.use)
    instances.set(item.provide, instance)
  }

  return {
    get: <T extends ProvidedType>(key: InjectionKey<T>) => {
      const instance = instances.get(key)
      if (!instance) {
        throw new Error('Api not provided')
      }
      return instance as T
    },
  }
}

export const provideApi = <R, T extends BaseApi & R = BaseApi & R>(
  key: InjectionKey<R>,
  use: ApiFactory<T>,
) => {
  const fetch = inject(FETCH_KEY)
  if (!fetch) {
    throw new Error('Fetch not provided')
  }
  const instance = new use(fetch)
  provide(key, instance)
  return instance as T
}
