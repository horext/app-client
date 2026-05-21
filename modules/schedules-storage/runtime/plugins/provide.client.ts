import { createDbFactory, SCHEDULES_DB_KEY } from "../app/context/db"
import { schemaMigrations } from "../app/migrations/schema"
import { IndexedDBAcademicConfigRepository } from "../app/repositories/indexed-db-academic-config.repository"
import { IndexedDBActivitiesRepository } from "../app/repositories/indexed-db-activities.repository"
import { IndexedDBGenerationRepository } from "../app/repositories/indexed-db-generation.repository"
import { IndexedDBPreferencesRepository } from "../app/repositories/indexed-db-preferences.repository"
import { IndexedDBProfileRepository } from "../app/repositories/indexed-db-profile.repository"
import { IndexedDBScheduleFavoritesRepository, IndexedDBSchedulesRepository } from "../app/repositories/indexed-db-schedules.repository"
import { IndexedDBSubjectsRepository } from "../app/repositories/indexed-db-subjects.repository"

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
    const subjectsRepository = new IndexedDBSubjectsRepository(dbFactory)

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
          subjectsRepository,
        },
      },
    }
  },
})
