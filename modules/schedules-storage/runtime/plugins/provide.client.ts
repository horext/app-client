import { createDbFactory, SCHEDULES_DB_KEY } from '../db'
import { schemaMigrations } from '../migrations/schema'
import { IndexedDBSchedulesRepository } from '../repositories/indexed-db-schedules.repository'
import { IndexedDBActivitiesRepository } from '../repositories/indexed-db-activities.repository'
import { IndexedDBProfileRepository } from '../repositories/indexed-db-profile.repository'
import { IndexedDBAcademicConfigRepository } from '../repositories/indexed-db-academic-config.repository'
import { IndexedDBPreferencesRepository } from '../repositories/indexed-db-preferences.repository'
import { IndexedDBGenerationRepository } from '../repositories/indexed-db-generation.repository'
import { GeneratedSchedulesService } from '../services/generated-schedules.service'
import { FavoritesSchedulesService } from '../services/favorites-schedules.service'
import { ActivitiesService } from '../services/activities.service'
import { ProfileService } from '../services/profile.service'
import { AcademicConfigService } from '../services/academic-config.service'
import { PreferencesService } from '../services/preferences.service'
import { GenerationService } from '../services/generation.service'
import {
  SCHEDULES_REPOSITORY_KEY,
  GENERATED_SCHEDULES_SERVICE_KEY,
  FAVORITES_SCHEDULES_SERVICE_KEY,
  ACTIVITIES_SERVICE_KEY,
  PROFILE_SERVICE_KEY,
  ACADEMIC_CONFIG_SERVICE_KEY,
  PREFERENCES_SERVICE_KEY,
  GENERATION_SERVICE_KEY,
} from '../keys'

const DB_NAME = 'horext'
const DB_VERSION = Math.max(...schemaMigrations.map((m) => m.version))

export default defineNuxtPlugin({
  name: 'schedules-storage:provide',
  setup(nuxtApp) {
    const dbFactory = createDbFactory(DB_NAME, DB_VERSION)
    const schedulesRepository = new IndexedDBSchedulesRepository(dbFactory)
    const activitiesRepository = new IndexedDBActivitiesRepository(dbFactory)
    const profileRepository = new IndexedDBProfileRepository(dbFactory)
    const academicConfigRepository = new IndexedDBAcademicConfigRepository(
      dbFactory,
    )
    const preferencesRepository = new IndexedDBPreferencesRepository(dbFactory)
    const generationRepository = new IndexedDBGenerationRepository(dbFactory)

    nuxtApp.vueApp.provide(SCHEDULES_DB_KEY, dbFactory)
    nuxtApp.vueApp.provide(SCHEDULES_REPOSITORY_KEY, schedulesRepository)
    nuxtApp.vueApp.provide(
      GENERATED_SCHEDULES_SERVICE_KEY,
      new GeneratedSchedulesService(generationRepository, schedulesRepository),
    )
    nuxtApp.vueApp.provide(
      FAVORITES_SCHEDULES_SERVICE_KEY,
      new FavoritesSchedulesService(schedulesRepository, generationRepository),
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
      new GenerationService(generationRepository, schedulesRepository),
    )
  },
})
