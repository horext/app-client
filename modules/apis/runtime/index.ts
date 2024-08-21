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

export const createApis = () => {
  const registry = APIS_REGISTRY
  const instances = new Map<InjectionKey<BaseApi>, BaseApi>()
  for (const item of registry) {
    const instance = provideApi(item.provide, item.use)
    instances.set(item.provide, instance)
  }
  return instances
}

export const provideApi = <T extends BaseApi>(
  key: InjectionKey<T>,
  use: ApiFactory<T>,
) => {
  const fetch = inject(FETCH_KEY)
  if (!fetch) {
    throw new Error('Fetch not provided')
  }
  const instance = new use(fetch)
  provide(key, instance)
  return instance
}
