import type { ISchedulesRepository, ISchedulesFavoritesRepository } from '../repositories/schedules-repository.interface'
import type { IActivitiesRepository } from '../repositories/activities.repository.interface'
import type { IProfileRepository } from '../repositories/profile-repository.interface'
import type { IAcademicConfigRepository } from '../repositories/academic-config.repository.interface'
import type { IPreferencesRepository } from '../repositories/preferences-repository.interface'
import type { IGenerationRepository } from '../repositories/generation.repository.interface'
import { FavoritesSchedulesService } from '../services/favorites-schedules.service'
import { ActivitiesService } from '../services/activities.service'
import { ProfileService } from '../services/profile.service'
import { AcademicConfigService } from '../services/academic-config.service'
import { PreferencesService } from '../services/preferences.service'
import { GenerationService } from '../services/generation.service'
import {
  SCHEDULES_REPOSITORY_KEY,
  FAVORITES_SCHEDULES_SERVICE_KEY,
  ACTIVITIES_SERVICE_KEY,
  PROFILE_SERVICE_KEY,
  ACADEMIC_CONFIG_SERVICE_KEY,
  PREFERENCES_SERVICE_KEY,
  GENERATION_SERVICE_KEY,
} from '../keys'

interface SchedulesStorage {
  schedulesRepository: ISchedulesRepository
  activitiesRepository: IActivitiesRepository
  profileRepository: IProfileRepository
  academicConfigRepository: IAcademicConfigRepository
  preferencesRepository: IPreferencesRepository
  generationRepository: IGenerationRepository
  favoritesRepository: ISchedulesFavoritesRepository
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
    } = nuxtApp.$schedulesStorage as SchedulesStorage

    nuxtApp.vueApp.provide(SCHEDULES_REPOSITORY_KEY, schedulesRepository)
    nuxtApp.vueApp.provide(
      FAVORITES_SCHEDULES_SERVICE_KEY,
      new FavoritesSchedulesService(schedulesRepository, favoritesRepository, generationRepository),
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
      new GenerationService(generationRepository, schedulesRepository, favoritesRepository),
    )
  },
})
