import { describe, expect, it, vi } from 'vitest'
import { StoresDB } from '../../../../../schedules-storage/runtime/app/context/db'
import type { RemoteAggregatePersistence } from '../../../../../schedules-storage/runtime/app/persistence/aggregate-persistence'
import { IndexedDbReplicaRepository } from '../indexed-db-replica.repository'
import { activityRecord } from './indexed-db-test-fixtures'

describe('IndexedDbReplicaRepository', () => {
  it('Given remote replica changes, when they are applied, then each operation uses persistence without an outbox', async () => {
    const persistence: RemoteAggregatePersistence = {
      saveRemote: vi.fn<RemoteAggregatePersistence['saveRemote']>(),
      remove: vi.fn<RemoteAggregatePersistence['remove']>(),
      replace: vi.fn<RemoteAggregatePersistence['replace']>(),
    }
    const repository = new IndexedDbReplicaRepository(
      persistence,
      StoresDB.ACTIVITIES,
    )
    const activity = activityRecord()
    const snapshots = [{ id: activity.id, data: activity }]

    await repository.upsert('user-1', activity)
    await repository.delete('user-1', activity.id)
    await repository.replace('user-1', snapshots)

    expect(persistence.saveRemote).toHaveBeenCalledWith(
      StoresDB.ACTIVITIES,
      activity,
      'user-1',
    )
    expect(persistence.remove).toHaveBeenCalledWith(
      StoresDB.ACTIVITIES,
      'user-1',
      activity.id,
    )
    expect(persistence.replace).toHaveBeenCalledWith(
      StoresDB.ACTIVITIES,
      'user-1',
      snapshots,
    )
  })
})
