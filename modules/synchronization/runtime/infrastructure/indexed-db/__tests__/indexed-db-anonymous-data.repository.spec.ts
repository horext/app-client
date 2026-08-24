import { describe, expect, it } from 'vitest'
import { StoresDB } from '../../../../../schedules-storage/runtime/app/context/db'
import { IndexedDbAnonymousDataRepository } from '../indexed-db-anonymous-data.repository'
import { activityRecord, testDatabase } from './indexed-db-test-fixtures'

describe('IndexedDbAnonymousDataRepository', () => {
  it('Given anonymous records with a signed-in collision, when migration is staged, then collection identity is regenerated and cleanup removes anonymous data', async () => {
    const database = testDatabase('anonymous-data')
    const db = await database.factory()
    const anonymous = activityRecord('anonymous')
    const existing = { ...activityRecord('user-1'), id: anonymous.id }
    await db.put(StoresDB.ACTIVITIES, anonymous)
    await db.put(StoresDB.ACTIVITIES, existing)
    const repository = new IndexedDbAnonymousDataRepository(database.factory)

    await expect(repository.hasAnonymousData()).resolves.toBe(true)
    await repository.stageForUser('anonymous')
    await repository.stageForUser('user-1')

    const migrated = await db.getAllFromIndex(
      StoresDB.ACTIVITIES,
      'createdBy',
      IDBKeyRange.only('user-1'),
    )
    expect(migrated).toHaveLength(2)
    expect(migrated.some(({ id }) => id !== anonymous.id)).toBe(true)

    await repository.deleteAnonymousData()
    await expect(repository.hasAnonymousData()).resolves.toBe(false)
    await database.cleanup()
  })
})
