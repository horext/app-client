import {
  NoopSchedulesRepository,
  NoopSchedulesFavoritesRepository,
  NoopActivitiesRepository,
  NoopProfileRepository,
  NoopAcademicConfigRepository,
  NoopPreferencesRepository,
  NoopGenerationRepository,
} from '../repositories/noop.repositories'

export default defineNuxtPlugin({
  name: 'schedules-storage:provide-repos',
  order: 1,
  setup() {
    return {
      provide: {
        schedulesStorage: {
          schedulesRepository: new NoopSchedulesRepository(),
          activitiesRepository: new NoopActivitiesRepository(),
          profileRepository: new NoopProfileRepository(),
          academicConfigRepository: new NoopAcademicConfigRepository(),
          preferencesRepository: new NoopPreferencesRepository(),
          generationRepository: new NoopGenerationRepository(),
          favoritesRepository: new NoopSchedulesFavoritesRepository(),
        },
      },
    }
  },
})
