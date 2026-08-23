import {
  NoopAcademicConfigRepository,
  NoopActivitiesRepository,
  NoopGenerationRepository,
  NoopPreferencesRepository,
  NoopProfileRepository,
  NoopSchedulesFavoritesRepository,
  NoopSchedulesRepository,
  NoopSubjectsRepository,
  NoopLocalHourlyLoadRepository,
} from '../app/repositories/noop.repositories'
import {
  SCHEDULES_DB_KEY,
  SCHEDULES_RAW_REPOSITORIES_KEY,
  USER_ID_KEY,
} from '../app/context/keys'
import type { DbFactory } from '../app/context/db'

export default defineNuxtPlugin({
  name: 'schedules-storage:provide-repos',
  order: 1,
  setup(nuxtApp) {
    const storage = {
      db: (() =>
        Promise.reject(
          new Error('IndexedDB is unavailable on the server.'),
        )) as DbFactory,
      schedulesRepository: new NoopSchedulesRepository(),
      activitiesRepository: new NoopActivitiesRepository(),
      profileRepository: new NoopProfileRepository(),
      academicConfigRepository: new NoopAcademicConfigRepository(),
      preferencesRepository: new NoopPreferencesRepository(),
      generationRepository: new NoopGenerationRepository(),
      favoritesRepository: new NoopSchedulesFavoritesRepository(),
      subjectsRepository: new NoopSubjectsRepository(),
      localHourlyLoadRepository: new NoopLocalHourlyLoadRepository(),
    }
    nuxtApp.vueApp.provide(SCHEDULES_RAW_REPOSITORIES_KEY, storage)
    nuxtApp.vueApp.provide(SCHEDULES_DB_KEY, storage.db)
    nuxtApp.vueApp.provide(USER_ID_KEY, () => 'anonymous')
    return {
      provide: {
        schedulesDb: storage.db,
        schedulesUserId: () => 'anonymous',
        schedulesStorage: {
          schedulesRepository: storage.schedulesRepository,
          activitiesRepository: storage.activitiesRepository,
          profileRepository: storage.profileRepository,
          academicConfigRepository: storage.academicConfigRepository,
          preferencesRepository: storage.preferencesRepository,
          generationRepository: storage.generationRepository,
          favoritesRepository: storage.favoritesRepository,
          subjectsRepository: storage.subjectsRepository,
          localHourlyLoadRepository: storage.localHourlyLoadRepository,
        },
      },
    }
  },
})
