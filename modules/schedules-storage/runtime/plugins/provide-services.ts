import {
  SCHEDULES_REPOSITORY_KEY,
  FAVORITES_SCHEDULES_SERVICE_KEY,
  ACTIVITIES_SERVICE_KEY,
  PROFILE_SERVICE_KEY,
  ACADEMIC_CONFIG_SERVICE_KEY,
  PREFERENCES_SERVICE_KEY,
  GENERATION_SERVICE_KEY,
  SUBJECTS_SERVICE_KEY,
  LOCAL_HOURLY_LOAD_SERVICE_KEY,
} from '../app/context/keys'
import type { IAcademicConfigRepository } from '#shared/application/repositories/academic-config.repository'
import type { IActivitiesRepository } from '#shared/application/repositories/activities.repository'
import type { IGenerationRepository } from '#shared/application/repositories/generation.repository'
import type { IPreferencesRepository } from '#shared/application/repositories/preferences.repository'
import type { IProfileRepository } from '#shared/application/repositories/profile.repository'
import type {
  ISchedulesRepository,
  ISchedulesFavoritesRepository,
} from '#shared/application/repositories/schedules.repository'
import type { ISubjectsRepository } from '#shared/application/repositories/subjects.repository'
import type { ILocalHourlyLoadRepository } from '#shared/application/repositories/local-hourly-load.repository'
import { AcademicConfigService } from '#shared/application/services/academic-config.service'
import { ActivitiesService } from '#shared/application/services/activities.service'
import { FavoritesSchedulesService } from '#shared/application/services/favorites-schedules.service'
import { GenerationService } from '#shared/application/services/generation.service'
import { PreferencesService } from '#shared/application/services/preferences.service'
import { ProfileService } from '#shared/application/services/profile.service'
import { SubjectsService } from '#shared/application/services/subjects.service'
import { LocalHourlyLoadService } from '#shared/application/services/local-hourly-load.service'

interface SchedulesStorage {
  schedulesRepository: ISchedulesRepository
  activitiesRepository: IActivitiesRepository
  profileRepository: IProfileRepository
  academicConfigRepository: IAcademicConfigRepository
  preferencesRepository: IPreferencesRepository
  generationRepository: IGenerationRepository
  favoritesRepository: ISchedulesFavoritesRepository
  subjectsRepository: ISubjectsRepository
  localHourlyLoadRepository: ILocalHourlyLoadRepository
}

export default defineNuxtPlugin({
  name: 'schedules-storage:provide-services',
  dependsOn: ['schedules-storage:provide-repos'],
  order: 2,
  setup(nuxtApp) {
    const {
      schedulesRepository,
      activitiesRepository,
      profileRepository,
      academicConfigRepository,
      preferencesRepository,
      generationRepository,
      favoritesRepository,
      subjectsRepository,
      localHourlyLoadRepository,
    } = nuxtApp.$schedulesStorage as SchedulesStorage

    nuxtApp.vueApp.provide(SCHEDULES_REPOSITORY_KEY, schedulesRepository)
    nuxtApp.vueApp.provide(
      FAVORITES_SCHEDULES_SERVICE_KEY,
      new FavoritesSchedulesService(
        schedulesRepository,
        favoritesRepository,
        generationRepository,
      ),
    )
    nuxtApp.vueApp.provide(
      ACTIVITIES_SERVICE_KEY,
      new ActivitiesService(activitiesRepository),
    )
    nuxtApp.vueApp.provide(
      PROFILE_SERVICE_KEY,
      new ProfileService(profileRepository),
    )
    nuxtApp.vueApp.provide(
      ACADEMIC_CONFIG_SERVICE_KEY,
      new AcademicConfigService(academicConfigRepository),
    )
    nuxtApp.vueApp.provide(
      PREFERENCES_SERVICE_KEY,
      new PreferencesService(preferencesRepository),
    )
    nuxtApp.vueApp.provide(
      GENERATION_SERVICE_KEY,
      new GenerationService(
        generationRepository,
        schedulesRepository,
        favoritesRepository,
      ),
    )
    nuxtApp.vueApp.provide(
      SUBJECTS_SERVICE_KEY,
      new SubjectsService(subjectsRepository),
    )
    nuxtApp.vueApp.provide(
      LOCAL_HOURLY_LOAD_SERVICE_KEY,
      new LocalHourlyLoadService(localHourlyLoadRepository),
    )
  },
})
