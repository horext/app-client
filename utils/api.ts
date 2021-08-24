import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { NuxtStorage } from '@nuxtjs/universal-storage'
import { Repositories } from '~/plugins/api'

// eslint-disable-next-line import/no-mutable-exports
let $axios: NuxtAxiosInstance
export function initializeAxios (axiosInstance: NuxtAxiosInstance) {
  $axios = axiosInstance
}

export { $axios }

// eslint-disable-next-line import/no-mutable-exports
let $storage: NuxtStorage
export function initializeStorage (axiosInstance: NuxtStorage) {
  $storage = axiosInstance
}

export { $storage }

// eslint-disable-next-line import/no-mutable-exports
let $api: Repositories
export function initializeApi (axiosInstance: Repositories) {
  $api = axiosInstance
}

export { $api }
