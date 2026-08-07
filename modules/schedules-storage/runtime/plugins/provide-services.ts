import {
  SCHEDULES_REPOSITORY_KEY,
  FAVORITES_SCHEDULES_SERVICE_KEY,
  ACTIVITIES_SERVICE_KEY,
  PROFILE_SERVICE_KEY,
  ACADEMIC_CONFIG_SERVICE_KEY,
  PREFERENCES_SERVICE_KEY,
  GENERATION_SERVICE_KEY,
  SUBJECTS_SERVICE_KEY,
} from '../app/context/keys'
import type { IAcademicConfigRepository } from '../app/repositories/academic-config.repository.interface'
import type { IActivitiesRepository } from '../app/repositories/activities.repository.interface'
import type { IGenerationRepository } from '../app/repositories/generation.repository.interface'
import type { IPreferencesRepository } from '../app/repositories/preferences-repository.interface'
import type { IProfileRepository } from '../app/repositories/profile-repository.interface'
import type {
  ISchedulesRepository,
  ISchedulesFavoritesRepository,
} from '../app/repositories/schedules-repository.interface'
import type { ISubjectsRepository } from '../app/repositories/subjects-repository.interface'
import { AcademicConfigService } from '../app/services/academic-config.service'
import { ActivitiesService } from '../app/services/activities.service'
import { FavoritesSchedulesService } from '../app/services/favorites-schedules.service'
import { GenerationService } from '../app/services/generation.service'
import { PreferencesService } from '../app/services/preferences.service'
import { ProfileService } from '../app/services/profile.service'
import { SubjectsService } from '../app/services/subjects.service'

interface SchedulesStorage {
  schedulesRepository: ISchedulesRepository
  activitiesRepository: IActivitiesRepository
  profileRepository: IProfileRepository
  academicConfigRepository: IAcademicConfigRepository
  preferencesRepository: IPreferencesRepository
  generationRepository: IGenerationRepository
  favoritesRepository: ISchedulesFavoritesRepository
  subjectsRepository: ISubjectsRepository
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
  },
})
