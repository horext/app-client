import type { Fetch } from 'ofetch'
import type { ApiFactory } from './interfaces/registry'
import { APIS_REGISTRY } from './registry'
import type { BaseApi } from './resources/base'
import { provide, inject } from 'vue'
import type { InjectionKey } from 'vue'

export const FETCH_KEY: InjectionKey<Fetch> = Symbol('Fetch')

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
  for (const item of APIS_REGISTRY) {
    provideApi(item.provide, item.use)
  }
}

export const provideApi = <T extends BaseApi>(
  key: InjectionKey<T>,
  use: ApiFactory<T>,
) => {
  const fetch = inject(FETCH_KEY)
  if (!fetch) {
    throw new Error('Fetch not provided')
  }
  provide(key, new use(fetch))
}
