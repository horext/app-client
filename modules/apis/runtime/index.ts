import { APIS_REGISTRY } from './registry'

export const createApis = () => {
  const fetch = $fetch.create({
    baseURL: '/api',
  })

  for (const item of APIS_REGISTRY) {
    const instance = new item.use(fetch)
    provide(item.provide, instance)
  }
}
