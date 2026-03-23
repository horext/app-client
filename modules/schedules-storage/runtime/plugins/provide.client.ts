import { createDbFactory, SCHEDULES_DB_KEY } from '../db'
import { schemaMigrations } from '../migrations/schema'
import { IndexedDBSchedulesRepository } from '../repositories/IndexedDBSchedulesRepository'
import { IndexedDBActivitiesRepository } from '../repositories/IndexedDBActivitiesRepository'
import { GeneratedSchedulesService } from '../services/GeneratedSchedulesService'
import { FavoritesSchedulesService } from '../services/FavoritesSchedulesService'
import { ActivitiesService } from '../services/ActivitiesService'
import {
  SCHEDULES_REPOSITORY_KEY,
  GENERATED_SCHEDULES_SERVICE_KEY,
  FAVORITES_SCHEDULES_SERVICE_KEY,
  ACTIVITIES_SERVICE_KEY,
} from '../keys'

const DB_NAME = 'horext'
const DB_VERSION = Math.max(...schemaMigrations.map((m) => m.version))

export default defineNuxtPlugin({
  name: 'schedules-storage:provide',
  setup(nuxtApp) {
    const dbFactory = createDbFactory(DB_NAME, DB_VERSION)
    const schedulesRepository = new IndexedDBSchedulesRepository(dbFactory)
    const activitiesRepository = new IndexedDBActivitiesRepository(dbFactory)

    nuxtApp.vueApp.provide(SCHEDULES_DB_KEY, dbFactory)
    nuxtApp.vueApp.provide(SCHEDULES_REPOSITORY_KEY, schedulesRepository)
    nuxtApp.vueApp.provide(GENERATED_SCHEDULES_SERVICE_KEY, new GeneratedSchedulesService(schedulesRepository))
    nuxtApp.vueApp.provide(FAVORITES_SCHEDULES_SERVICE_KEY, new FavoritesSchedulesService(schedulesRepository))
    nuxtApp.vueApp.provide(ACTIVITIES_SERVICE_KEY, new ActivitiesService(activitiesRepository))
  },
})
