import { createDbFactory, type DbFactory } from '../app/context/db'
import { IndexedDbAggregatePersistence } from '../app/persistence/indexed-db-aggregate-persistence'
import { schemaMigrations } from '../app/migrations/schema'
import { USER_ID_KEY, type ApplicationRepositories } from '../app/context'
import { IndexedDBAcademicConfigRepository } from '../app/repositories/indexed-db-academic-config.repository'
import { IndexedDBActivitiesRepository } from '../app/repositories/indexed-db-activities.repository'
import { IndexedDBGenerationRepository } from '../app/repositories/indexed-db-generation.repository'
import { IndexedDBPreferencesRepository } from '../app/repositories/indexed-db-preferences.repository'
import { IndexedDBProfileRepository } from '../app/repositories/indexed-db-profile.repository'
import {
  IndexedDBScheduleFavoritesRepository,
  IndexedDBSchedulesRepository,
} from '../app/repositories/indexed-db-schedules.repository'
import { IndexedDBSubjectsRepository } from '../app/repositories/indexed-db-subjects.repository'

const DB_NAME = 'horext-app:v1'
const ANONYMOUS_USER_ID = 'anonymous'
const SCHEMA_VERSION = Math.max(
  ...schemaMigrations.map((migration) => migration.version),
)

declare module '#app' {
  interface NuxtAppInjections {
    $schedulesDb: DbFactory
    $schedulesStorage: ApplicationRepositories
    $persistence: IndexedDbAggregatePersistence
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $schedulesDb: DbFactory
    $schedulesStorage: ApplicationRepositories
    $persistence: IndexedDbAggregatePersistence
  }
}

export {}

export default defineNuxtPlugin({
  name: 'schedules-storage:provide-repos',
  order: 1,
  setup(nuxtApp) {
    const dbFactory = createDbFactory(
      DB_NAME,
      SCHEMA_VERSION,
      (database, oldVersion, _newVersion, transaction) => {
        for (const migration of schemaMigrations) {
          if (oldVersion < migration.version)
            migration.up(database, transaction)
        }
      },
    )
    const persistence = new IndexedDbAggregatePersistence(dbFactory)
    const auth = useUserAuthStore()
    const userId = () => auth.user?.id ?? ANONYMOUS_USER_ID
    const storage = {
      db: dbFactory,
      schedulesRepository: new IndexedDBSchedulesRepository(persistence),
      activitiesRepository: new IndexedDBActivitiesRepository(persistence),
      profileRepository: new IndexedDBProfileRepository(persistence),
      academicConfigRepository: new IndexedDBAcademicConfigRepository(
        persistence,
      ),
      preferencesRepository: new IndexedDBPreferencesRepository(persistence),
      generationRepository: new IndexedDBGenerationRepository(persistence),
      favoritesRepository: new IndexedDBScheduleFavoritesRepository(
        persistence,
      ),
      subjectsRepository: new IndexedDBSubjectsRepository(persistence),
    }
    nuxtApp.vueApp.provide(USER_ID_KEY, userId)
    return {
      provide: {
        schedulesDb: dbFactory,
        schedulesStorage: {
          schedulesRepository: storage.schedulesRepository,
          activitiesRepository: storage.activitiesRepository,
          profileRepository: storage.profileRepository,
          academicConfigRepository: storage.academicConfigRepository,
          preferencesRepository: storage.preferencesRepository,
          generationRepository: storage.generationRepository,
          favoritesRepository: storage.favoritesRepository,
          subjectsRepository: storage.subjectsRepository,
        },
        persistence: persistence,
      },
    }
  },
})
