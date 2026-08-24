import {
  NoopAcademicConfigRepository,
  NoopActivitiesRepository,
  NoopGenerationRepository,
  NoopPreferencesRepository,
  NoopProfileRepository,
  NoopSchedulesFavoritesRepository,
  NoopSchedulesRepository,
  NoopSubjectsRepository,
} from '../app/repositories/noop.repositories'
import { USER_ID_KEY } from '../app/context'
import type { DbFactory } from '../app/context/db'
import { IndexedDbAggregatePersistence } from '../app/persistence/indexed-db-aggregate-persistence'

export default defineNuxtPlugin({
  name: 'schedules-storage:provide-repos',
  order: 1,
  setup(nuxtApp) {
    const db: DbFactory = () =>
      Promise.reject(new Error('IndexedDB is unavailable on the server.'))
    const persistence = new IndexedDbAggregatePersistence(db)
    const repositories = {
      schedulesRepository: new NoopSchedulesRepository(),
      activitiesRepository: new NoopActivitiesRepository(),
      profileRepository: new NoopProfileRepository(),
      academicConfigRepository: new NoopAcademicConfigRepository(),
      preferencesRepository: new NoopPreferencesRepository(),
      generationRepository: new NoopGenerationRepository(),
      favoritesRepository: new NoopSchedulesFavoritesRepository(),
      subjectsRepository: new NoopSubjectsRepository(),
    }
    nuxtApp.vueApp.provide(USER_ID_KEY, () => 'anonymous')
    return {
      provide: {
        schedulesDb: db,
        schedulesUserId: () => 'anonymous',
        schedulesStorage: repositories,
        persistence: persistence,
      },
    }
  },
})
