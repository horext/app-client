import { Plugin } from '@nuxt/types'
import { NuxtStorage } from '@nuxtjs/universal-storage'
import { IEvent } from '~/interfaces/event'
import { IOrganization } from '~/interfaces/organization'
import { ISchedule } from '~/interfaces/schedule'
import { ISubject } from '~/interfaces/subject'
import { initializeStorage } from '~/utils/api'

export interface NuxtStorageExtended extends NuxtStorage {
  setLocalStorage(key: 'mySubjects', value: ISubject[]): void
  setLocalStorage(key: 'mySchedules', value: ISchedule[]): void
  setLocalStorage(key: 'myFavoritesSchedules', value: ISchedule[]): void
  setLocalStorage(key: 'myEvents', value: IEvent[]): void
  setUniversal(key: 'myFirstEntry', value: boolean): void
  setUniversal(key: 'myCrossings', value: number): void
  setUniversal(key: 'mySpeciality', value: IOrganization): void
  setUniversal(key: 'myFaculty', value: IOrganization): void
  setUniversal(key: 'myFirstEntry', value: boolean): void
}
interface StorageExtended {
  $storage: NuxtStorageExtended
}

declare module 'vue/types/vue' {
  // this.$myInjectedFunction inside Vue components
  interface Vue extends StorageExtended {}
}

declare module '@nuxt/types' {
  // nuxtContext.app.$myInjectedFunction inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions extends StorageExtended {}
  // nuxtContext.$myInjectedFunction
  interface Context extends StorageExtended {}
}

declare module 'vuex/types/index' {
  // this.$myInjectedFunction inside Vuex stores
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> extends StorageExtended {}
}

const accessor: Plugin = ({ $storage }) => {
  initializeStorage($storage)
}

export default accessor
