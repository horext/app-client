import { Plugin } from '@nuxt/types'
import { NuxtStorage } from '@nuxtjs/universal-storage'
import { initializeStorage } from '~/utils/api'

export interface NuxtStorageExtended extends NuxtStorage {
  setLocalStorage(key: 'mySubjects', value: any[]): void;
  setLocalStorage(key: 'mySchedules', value: any[]): void;
  setLocalStorage(key: 'myFavoritesSchedules', value: any[]): void;
  setLocalStorage(key: 'myEvents', value: any[]): void;
  setUniversal(key: 'myFirstEntry', value: boolean): void;
  setUniversal(key: 'myCrossings', value: number): void;
  setUniversal(key: 'mySpeciality', value: any): void;
  setUniversal(key: 'myFaculty', value: any): void;
  setUniversal(key: 'myFirstEntry', value: any): void;
}
interface StorageExtended {
  $storage: NuxtStorageExtended;
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
