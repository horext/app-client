import type { DbFactory } from '~~/modules/schedules-storage/runtime/app/context/db'
import type { RawSchedulesRepositories } from '~~/modules/schedules-storage/runtime/app/context/keys'

declare module '#app' {
  interface NuxtApp {
    $schedulesDb: DbFactory
    $schedulesStorage: RawSchedulesRepositories
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $schedulesDb: DbFactory
    $schedulesStorage: RawSchedulesRepositories
  }
}

export {}
