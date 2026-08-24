import { CloudSyncTransportGateway } from '../infrastructure/http/cloud-sync-api.gateway'
import { IndexedDbReplicaRepository } from '../infrastructure/indexed-db/indexed-db-replica.repository'
import { AcademicConfigSyncApiGateway } from '../infrastructure/http/academic-config-sync-api.gateway'
import { ActivitiesSyncApiGateway } from '../infrastructure/http/activities-sync-api.gateway'
import { FavoritesSyncApiGateway } from '../infrastructure/http/favorites-sync-api.gateway'
import { GenerationsSyncApiGateway } from '../infrastructure/http/generations-sync-api.gateway'
import { PreferencesSyncApiGateway } from '../infrastructure/http/preferences-sync-api.gateway'
import { ProfileSyncApiGateway } from '../infrastructure/http/profile-sync-api.gateway'
import { SchedulesSyncApiGateway } from '../infrastructure/http/schedules-sync-api.gateway'
import { SubjectsSyncApiGateway } from '../infrastructure/http/subjects-sync-api.gateway'
import { IndexedDbSyncStateRepository } from '../infrastructure/indexed-db/indexed-db-sync-state.repository'
import { CloudSyncService } from '../application/services/cloud-sync.service'
import { SynchronizationFacade } from '../application/services/synchronization.facade'
import { AcademicConfigSyncUseCase } from '../application/use-cases/academic-config-sync.use-case'
import { ActivitiesSyncUseCase } from '../application/use-cases/activities-sync.use-case'
import { FavoritesSyncUseCase } from '../application/use-cases/favorites-sync.use-case'
import { GenerationsSyncUseCase } from '../application/use-cases/generations-sync.use-case'
import { InitialSyncCoordinator } from '../application/use-cases/initial-sync-coordinator'
import { PreferencesSyncUseCase } from '../application/use-cases/preferences-sync.use-case'
import { ProfileSyncUseCase } from '../application/use-cases/profile-sync.use-case'
import { SchedulesSyncUseCase } from '../application/use-cases/schedules-sync.use-case'
import { SubjectsSyncUseCase } from '../application/use-cases/subjects-sync.use-case'
import { StoresDB } from '~~/modules/schedules-storage/runtime/app/context/db'
import { createIndexedDbSyncOutboxes } from '../infrastructure/indexed-db/create-sync-outboxes'
import { SyncingAcademicConfigRepository } from '../infrastructure/repositories/syncing-academic-config.repository'
import { SyncingActivitiesRepository } from '../infrastructure/repositories/syncing-activities.repository'
import { SyncingFavoritesRepository } from '../infrastructure/repositories/syncing-favorites.repository'
import { SyncingGenerationsRepository } from '../infrastructure/repositories/syncing-generations.repository'
import { SyncingPreferencesRepository } from '../infrastructure/repositories/syncing-preferences.repository'
import { SyncingProfileRepository } from '../infrastructure/repositories/syncing-profile.repository'
import { SyncingSchedulesRepository } from '../infrastructure/repositories/syncing-schedules.repository'
import { SyncingSubjectsRepository } from '../infrastructure/repositories/syncing-subjects.repository'
import { CloudSyncOperationGateway } from '../infrastructure/http/cloud-sync-operation.gateway'
import { IndexedDbAnonymousDataRepository } from '../infrastructure/indexed-db/indexed-db-anonymous-data.repository'
import { MigrateAnonymousDataUseCase } from '../application/use-cases/migrate-anonymous-data.use-case'
import { ApiSyncOperationHandler } from '../infrastructure/http/sync-operation-handler'
import { CollectionApiSyncOperationHandler } from '../infrastructure/http/collection-api-sync-operation-handler'
import { SyncOperationHandlerRegistry } from '../infrastructure/http/sync-operation-handler-registry'
import { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { ApplicationRepositories } from '~~/modules/schedules-storage/runtime/app/context'

declare module '#app' {
  interface NuxtAppInjections {
    $synchronization: SynchronizationFacade
    $applicationRepositories: ApplicationRepositories
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $synchronization: SynchronizationFacade
    $applicationRepositories: ApplicationRepositories
  }
}

export default defineNuxtPlugin({
  name: 'synchronization:provide',
  dependsOn: ['schedules-storage:provide-repos'],
  order: 2,
  setup(nuxtApp) {
    const storage = nuxtApp.$schedulesStorage
    const db = nuxtApp.$schedulesDb
    const persistence = nuxtApp.$persistence
    const outboxes = createIndexedDbSyncOutboxes(db)
    const applicationRepositories: ApplicationRepositories = {
      schedulesRepository: new SyncingSchedulesRepository(
        storage.schedulesRepository,
        outboxes.schedules,
      ),
      activitiesRepository: new SyncingActivitiesRepository(
        storage.activitiesRepository,
        outboxes.activities,
      ),
      profileRepository: new SyncingProfileRepository(
        storage.profileRepository,
        outboxes.profile,
      ),
      academicConfigRepository: new SyncingAcademicConfigRepository(
        storage.academicConfigRepository,
        outboxes.academicConfig,
      ),
      preferencesRepository: new SyncingPreferencesRepository(
        storage.preferencesRepository,
        outboxes.preferences,
      ),
      generationRepository: new SyncingGenerationsRepository(
        storage.generationRepository,
        outboxes.generations,
      ),
      favoritesRepository: new SyncingFavoritesRepository(
        storage.favoritesRepository,
        outboxes.favorites,
      ),
      subjectsRepository: new SyncingSubjectsRepository(
        storage.subjectsRepository,
        outboxes.subjects,
      ),
    }
    const gateway = new CloudSyncTransportGateway()
    const profileApi = new ProfileSyncApiGateway()
    const preferencesApi = new PreferencesSyncApiGateway()
    const academicConfigApi = new AcademicConfigSyncApiGateway()
    const activitiesApi = new ActivitiesSyncApiGateway()
    const subjectsApi = new SubjectsSyncApiGateway()
    const schedulesApi = new SchedulesSyncApiGateway()
    const generationsApi = new GenerationsSyncApiGateway()
    const favoritesApi = new FavoritesSyncApiGateway()
    const handlers = new SyncOperationHandlerRegistry()
      .register(new ApiSyncOperationHandler(SyncResource.PROFILE, profileApi))
      .register(
        new ApiSyncOperationHandler(SyncResource.PREFERENCES, preferencesApi),
      )
      .register(
        new ApiSyncOperationHandler(
          SyncResource.ACADEMIC_CONFIG,
          academicConfigApi,
        ),
      )
      .register(
        new CollectionApiSyncOperationHandler(
          SyncResource.ACTIVITIES,
          activitiesApi,
        ),
      )
      .register(
        new CollectionApiSyncOperationHandler(
          SyncResource.SUBJECTS,
          subjectsApi,
        ),
      )
      .register(
        new CollectionApiSyncOperationHandler(
          SyncResource.SCHEDULES,
          schedulesApi,
        ),
      )
      .register(
        new CollectionApiSyncOperationHandler(
          SyncResource.GENERATIONS,
          generationsApi,
        ),
      )
      .register(
        new CollectionApiSyncOperationHandler(
          SyncResource.FAVORITES,
          favoritesApi,
        ),
      )
    const cloudSyncOperationGateway = new CloudSyncOperationGateway(handlers)
    const service: CloudSyncService = new CloudSyncService(
      gateway,
      cloudSyncOperationGateway,
      new IndexedDbSyncStateRepository(db),
    )
    const initialSync = new InitialSyncCoordinator({
      sync: service,
      anonymousData: new MigrateAnonymousDataUseCase(
        new IndexedDbAnonymousDataRepository(db),
      ),
      profile: new ProfileSyncUseCase(
        profileApi,
        applicationRepositories.profileRepository,
        new IndexedDbReplicaRepository(persistence, StoresDB.PROFILE),
      ),
      preferences: new PreferencesSyncUseCase(
        preferencesApi,
        applicationRepositories.preferencesRepository,
        new IndexedDbReplicaRepository(persistence, StoresDB.PREFERENCES),
      ),
      academicConfig: new AcademicConfigSyncUseCase(
        academicConfigApi,
        applicationRepositories.academicConfigRepository,
        new IndexedDbReplicaRepository(persistence, StoresDB.ACADEMIC_CONFIG),
      ),
      activities: new ActivitiesSyncUseCase(
        activitiesApi,
        applicationRepositories.activitiesRepository,
        new IndexedDbReplicaRepository(persistence, StoresDB.ACTIVITIES),
      ),
      subjects: new SubjectsSyncUseCase(
        subjectsApi,
        applicationRepositories.subjectsRepository,
        new IndexedDbReplicaRepository(persistence, StoresDB.SUBJECTS),
      ),
      schedules: new SchedulesSyncUseCase(
        schedulesApi,
        applicationRepositories.schedulesRepository,
        new IndexedDbReplicaRepository(persistence, StoresDB.SCHEDULES),
      ),
      generations: new GenerationsSyncUseCase(
        generationsApi,
        applicationRepositories.generationRepository,
        new IndexedDbReplicaRepository(persistence, StoresDB.GENERATIONS),
      ),
      favorites: new FavoritesSyncUseCase(
        favoritesApi,
        applicationRepositories.favoritesRepository,
        new IndexedDbReplicaRepository(persistence, StoresDB.FAVORITES),
      ),
    })
    const facade = new SynchronizationFacade(service, initialSync)
    return {
      provide: {
        applicationRepositories: applicationRepositories,
        synchronization: facade,
      },
    }
  },
})
