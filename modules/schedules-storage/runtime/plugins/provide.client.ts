import { createDbFactory, SCHEDULES_DB_KEY } from '../context/db'
import { schemaMigrations } from '../migrations/schema'
import { IndexedDBScheduleFavoritesRepository, IndexedDBSchedulesRepository } from '../repositories/indexed-db-schedules.repository'
import { IndexedDBActivitiesRepository } from '../repositories/indexed-db-activities.repository'
import { IndexedDBProfileRepository } from '../repositories/indexed-db-profile.repository'
import { IndexedDBAcademicConfigRepository } from '../repositories/indexed-db-academic-config.repository'
import { IndexedDBPreferencesRepository } from '../repositories/indexed-db-preferences.repository'
import { IndexedDBGenerationRepository } from '../repositories/indexed-db-generation.repository'

const DB_NAME = 'horext'
const DB_VERSION = Math.max(...schemaMigrations.map((m) => m.version))

export default defineNuxtPlugin({
  name: 'schedules-storage:provide-repos',
  order: 1,
  setup(nuxtApp) {
    const dbFactory = createDbFactory(DB_NAME, DB_VERSION)
    const schedulesRepository = new IndexedDBSchedulesRepository(dbFactory)
    const activitiesRepository = new IndexedDBActivitiesRepository(dbFactory)
    const profileRepository = new IndexedDBProfileRepository(dbFactory)
    const academicConfigRepository = new IndexedDBAcademicConfigRepository(dbFactory)
    const preferencesRepository = new IndexedDBPreferencesRepository(dbFactory)
    const generationRepository = new IndexedDBGenerationRepository(dbFactory)
    const favoritesRepository = new IndexedDBScheduleFavoritesRepository(dbFactory)

    nuxtApp.vueApp.provide(SCHEDULES_DB_KEY, dbFactory)

    return {
      provide: {
        schedulesStorage: {
          schedulesRepository,
          activitiesRepository,
          profileRepository,
          academicConfigRepository,
          preferencesRepository,
          generationRepository,
          favoritesRepository,
        },
      },
    }
  },
})
