import type { CloudChangeApplier } from '../ports/cloud-change-applier'
import { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type {
  SyncConflictRecord,
  RemoteCloudRecord,
  SyncOperationDto,
} from '~~/modules/synchronization/runtime/contracts'
import type { RemoteChange } from '../../domain/models/remote-change'
import type { AnonymousDataMigration } from '../ports/anonymous-data-migration'
import type { InitialSyncStrategy } from '../../domain/models/initial-sync-strategy'
import type {
  AggregateSyncRegistration,
  AggregateSyncUseCase,
} from '../ports/aggregate-sync-use-case'
import type { PendingOperation } from '../services/cloud-sync.service'

const RESOURCE_ORDER = [
  SyncResource.PROFILE,
  SyncResource.PREFERENCES,
  SyncResource.ACADEMIC_CONFIG,
  SyncResource.ACTIVITIES,
  SyncResource.SUBJECTS,
  SyncResource.SCHEDULES,
  SyncResource.GENERATIONS,
  SyncResource.FAVORITES,
] as const satisfies readonly SyncResource[]

const resourceOrderIsExhaustive: Exclude<
  SyncResource,
  (typeof RESOURCE_ORDER)[number]
> extends never
  ? true
  : never = true
void resourceOrderIsExhaustive

export type { InitialSyncStrategy } from '../../domain/models/initial-sync-strategy'

export interface SyncPushResult {
  pushed: number
  conflicts: number
}

interface CoordinatorSync {
  pending(userId: string): Promise<PendingOperation[]>
  push(userId: string): Promise<SyncPushResult>
  enqueue(userId: string, operation: SyncOperationDto): Promise<unknown>
  recordConflict(conflict: SyncConflictRecord): Promise<void>
}

export interface InitialSyncDependencies {
  sync: CoordinatorSync
  profile: AggregateSyncUseCase
  preferences: AggregateSyncUseCase
  academicConfig: AggregateSyncUseCase
  activities: AggregateSyncUseCase
  subjects: AggregateSyncUseCase
  schedules: AggregateSyncUseCase
  generations: AggregateSyncUseCase
  favorites: AggregateSyncUseCase
  anonymousData: AnonymousDataMigration
}

/** Coordinates the eight aggregate-specific synchronization use cases. */
export class InitialSyncCoordinator implements CloudChangeApplier {
  readonly profile: AggregateSyncUseCase
  readonly preferences: AggregateSyncUseCase
  readonly academicConfig: AggregateSyncUseCase
  readonly activities: AggregateSyncUseCase
  readonly subjects: AggregateSyncUseCase
  readonly schedules: AggregateSyncUseCase
  readonly generations: AggregateSyncUseCase
  readonly favorites: AggregateSyncUseCase

  constructor(private readonly dependencies: InitialSyncDependencies) {
    this.profile = dependencies.profile
    this.preferences = dependencies.preferences
    this.academicConfig = dependencies.academicConfig
    this.activities = dependencies.activities
    this.subjects = dependencies.subjects
    this.schedules = dependencies.schedules
    this.generations = dependencies.generations
    this.favorites = dependencies.favorites
  }

  /** The single ordered registry for all aggregate-wide initialization work. */
  private get aggregates(): AggregateSyncRegistration[] {
    const registrations = {
      [SyncResource.PROFILE]: this.profile,
      [SyncResource.PREFERENCES]: this.preferences,
      [SyncResource.ACADEMIC_CONFIG]: this.academicConfig,
      [SyncResource.ACTIVITIES]: this.activities,
      [SyncResource.SUBJECTS]: this.subjects,
      [SyncResource.SCHEDULES]: this.schedules,
      [SyncResource.GENERATIONS]: this.generations,
      [SyncResource.FAVORITES]: this.favorites,
    } satisfies Record<SyncResource, AggregateSyncUseCase>
    return RESOURCE_ORDER.map((resource) => ({
      resource,
      useCase: registrations[resource],
    }))
  }

  async applyCloudRecord(
    userId: string,
    record: RemoteCloudRecord,
    revision: number,
  ): Promise<void> {
    const registration = this.aggregates.find(
      ({ resource }) => resource === record.resource,
    )
    if (!registration)
      throw new Error(`Unknown synchronization resource: ${record.resource}.`)
    if (record.deletedAt) {
      return registration.useCase.applyDelete(userId, record.id)
    }
    if (record.data === null)
      throw new Error('Cloud upsert record must include data.')
    const data = withRevision(record.data, revision)
    return registration.useCase.applyUpsert(userId, data)
  }

  async hasLocalData(userId: string): Promise<boolean> {
    if (
      userId !== 'anonymous' &&
      (await this.dependencies.anonymousData.hasData())
    )
      return true
    for (const { useCase } of this.aggregates)
      if ((await useCase.localSnapshot(userId)).length) return true
    return false
  }

  async run(userId: string, strategy: InitialSyncStrategy): Promise<void> {
    if (strategy !== 'replace-local')
      await this.dependencies.anonymousData.stage(userId)
    if (strategy === 'replace-local') await this.replaceLocal(userId)
    else {
      if (strategy === 'replace-cloud') await this.replaceCloud(userId)
      else await this.merge(userId)
      while ((await this.dependencies.sync.pending(userId)).length)
        await this.dependencies.sync.push(userId)
    }
    await this.dependencies.anonymousData.cleanup()
  }

  private async replaceLocal(userId: string): Promise<void> {
    for (const { useCase } of this.aggregates)
      await useCase.replaceLocal(userId, await useCase.cloudSnapshot())
  }
  private async replaceCloud(userId: string): Promise<void> {
    for (const { useCase } of [...this.aggregates].reverse())
      for (const operation of await useCase.cloudDeletionOperations())
        await this.dependencies.sync.enqueue(userId, operation)
    for (const { useCase } of this.aggregates)
      await this.uploadAggregate(userId, useCase)
  }
  private async merge(userId: string): Promise<void> {
    for (const { useCase } of this.aggregates)
      await this.mergeAggregate(userId, useCase)
  }
  private async uploadAggregate(userId: string, useCase: AggregateSyncUseCase) {
    for (const item of await useCase.localSnapshot(userId))
      await this.dependencies.sync.enqueue(
        userId,
        item.revision === undefined
          ? useCase.create(item)
          : useCase.update(item),
      )
  }

  private async mergeAggregate(userId: string, useCase: AggregateSyncUseCase) {
    const remote = new Map(
      (await useCase.cloudSnapshot()).map((item) => [item.id, item]),
    )
    for (const local of await useCase.localSnapshot(userId)) {
      const cloud = remote.get(local.id)
      if (!cloud)
        await this.dependencies.sync.enqueue(userId, useCase.create(local))
      else if (JSON.stringify(local.data) !== JSON.stringify(cloud.data)) {
        if (cloud.revision === undefined)
          throw new Error('Cloud conflict record must include a revision.')
        // A cloud choice must have enough context to apply the record locally.
        await this.dependencies.sync.recordConflict({
          key: `${useCase.update(local).resource}:${local.id}`,
          operation: {
            ...useCase.update(local),
            userId: local.data.createdBy,
            key: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            sequence: 0,
          } as never,
          cloud: {
            id: cloud.id,
            resource: useCase.update(local).resource,
            data: cloud.data,
            revision: cloud.revision,
            deletedAt: null,
          },
          cloudRevision: cloud.revision,
          createdAt: new Date().toISOString(),
        })
      }
    }
  }
  async apply<R extends SyncResource>(
    userId: string,
    resource: R,
    change: RemoteChange<R>,
  ): Promise<void> {
    const registration = this.aggregates.find(
      (candidate) => candidate.resource === resource,
    )
    if (!registration)
      throw new Error(`Unknown synchronization resource: ${resource}.`)
    if (change.operation === 'delete') {
      return registration.useCase.applyDelete(userId, change.id)
    }
    await registration.useCase.applyUpsert(userId, {
      ...change.data,
      revision: change.revision,
    })
  }
}

interface RevisionMetadata {
  revision: number
}

function withRevision<T extends object>(
  data: T,
  revision: number,
): T & RevisionMetadata {
  return { ...data, revision }
}
