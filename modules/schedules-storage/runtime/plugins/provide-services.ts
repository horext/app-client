import {
  ACADEMIC_CONFIG_SERVICE_KEY,
  ACTIVITIES_SERVICE_KEY,
  FAVORITES_SCHEDULES_SERVICE_KEY,
  GENERATION_SERVICE_KEY,
  PREFERENCES_SERVICE_KEY,
  PROFILE_SERVICE_KEY,
  SCHEDULES_REPOSITORY_KEY,
  SUBJECTS_SERVICE_KEY,
} from '../app/context'
import { AcademicConfigService } from '#shared/application/services/academic-config.service'
import { ActivitiesService } from '#shared/application/services/activities.service'
import { FavoritesSchedulesService } from '#shared/application/services/favorites-schedules.service'
import { GenerationService } from '#shared/application/services/generation.service'
import { PreferencesService } from '#shared/application/services/preferences.service'
import { ProfileService } from '#shared/application/services/profile.service'
import { SubjectsService } from '#shared/application/services/subjects.service'

export default defineNuxtPlugin({
  name: 'schedules-storage:provide-services',
  dependsOn: ['synchronization:provide'],
  order: 3,
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
    } = nuxtApp.$applicationRepositories

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
