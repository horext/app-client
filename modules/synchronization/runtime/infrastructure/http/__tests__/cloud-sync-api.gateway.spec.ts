import { makeUUID } from '~~/shared/domain/types/ids'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SyncResource } from '~~/modules/synchronization/runtime/contracts'
import type { RemoteCloudRecord } from '~~/modules/synchronization/runtime/contracts'
import type { CloudChangeApplier } from '../../../application/ports/cloud-change-applier'
import type {
  ExplicitChangesFeed,
  RemoteChange,
} from '../../../domain/models/remote-change'
import { CloudSyncTransportGateway } from '../cloud-sync-api.gateway'
import { activitySnapshot, installFetchMock } from './http-test-fixtures'

class RecordingApplier implements CloudChangeApplier {
  readonly applied: Array<{ userId: string; resource: SyncResource }> = []
  readonly cloudRecords: RemoteCloudRecord[] = []

  async apply<R extends SyncResource>(
    userId: string,
    resource: R,
    _change: RemoteChange<R>,
  ) {
    this.applied.push({ userId, resource })
  }

  async applyCloudRecord(
    _userId: string,
    record: RemoteCloudRecord,
    _revision: number,
  ) {
    this.cloudRecords.push(record)
  }
}

afterEach(() => vi.unstubAllGlobals())

describe('CloudSyncTransportGateway', () => {
  it('Given a changes feed, when it is pulled, then every resource change is applied and counted', async () => {
    const { fetch } = installFetchMock()
    const activity = activitySnapshot()
    const change = {
      sequence: 1,
      id: activity.id,
      operation: 'upsert',
      revision: 2,
      changedAt: activity.updatedAt,
      data: activity,
    } satisfies RemoteChange<SyncResource.ACTIVITIES>
    const feed = {
      profile: [],
      preferences: [],
      academicConfig: [],
      activities: [change],
      subjects: [],
      schedules: [],
      generations: [],
      favorites: [],
      cursor: 'cursor-2',
      hasMore: false,
    } satisfies ExplicitChangesFeed
    fetch.mockResolvedValue(feed)
    const handler = new RecordingApplier()
    const gateway = new CloudSyncTransportGateway()

    await expect(
      gateway.changes('cursor-1', handler, 'user-1'),
    ).resolves.toEqual({
      applied: 1,
      cursor: 'cursor-2',
      hasMore: false,
    })
    expect(handler.applied).toEqual([
      { userId: 'user-1', resource: SyncResource.ACTIVITIES },
    ])
  })

  it('Given transport conflicts, when they are decoded, then numeric and ETag revisions are supported', () => {
    const gateway = new CloudSyncTransportGateway()
    expect(gateway.conflict({ status: 409, data: { revision: 7 } })).toEqual({
      status: 409,
      data: { current: undefined, revision: 7 },
    })
    expect(gateway.conflict({ status: 412, data: { etag: '"8"' } })).toEqual({
      status: 412,
      data: { current: undefined, revision: 8 },
    })
    expect(gateway.conflict(null)).toBeUndefined()
  })

  it('Given a cloud record, when it is applied, then application is delegated to the handler', async () => {
    const handler = new RecordingApplier()
    const record: RemoteCloudRecord<SyncResource.ACTIVITIES> = {
      id: makeUUID(),
      resource: SyncResource.ACTIVITIES,
      data: activitySnapshot(),
      revision: 3,
      deletedAt: null,
    }
    await new CloudSyncTransportGateway().applyCloudRecord(
      'user-1',
      handler,
      record,
      3,
    )
    expect(handler.cloudRecords).toEqual([record])
  })
})
