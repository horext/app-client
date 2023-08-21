import { Context } from '@nuxt/types'
import type{ NuxtAxiosInstance } from '@nuxtjs/axios'
import { Repositories } from '~/plugins/api'
import { NuxtStorageExtended } from '~/plugins/storage-accessor'

// eslint-disable-next-line import/no-mutable-exports
let $axios: NuxtAxiosInstance
export function initializeAxios (axiosInstance: NuxtAxiosInstance) {
  $axios = axiosInstance
}

export { $axios }

// eslint-disable-next-line import/no-mutable-exports
let $storage:NuxtStorageExtended
export function initializeStorage (storage: NuxtStorageExtended) {
  $storage = storage
}

export { $storage }

// eslint-disable-next-line import/no-mutable-exports
let $api: Repositories
export function initializeApi (axiosInstance: Repositories) {
  $api = axiosInstance
}

export { $api }

// eslint-disable-next-line import/no-mutable-exports
let $snackbar: Context['$snackbar']
export function initializeSnackbar (snackbar: Context['$snackbar']) {
  $snackbar = snackbar
}

export { $snackbar }
