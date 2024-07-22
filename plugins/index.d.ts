import type Repositories from '~/repositories'

declare module '#app' {
  interface NuxtApp {
    $api: Repositories
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $api: Repositories
  }
}

export {}
