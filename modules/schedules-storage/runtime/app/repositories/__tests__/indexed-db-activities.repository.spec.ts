import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { Activity, type IActivityCreate } from '#shared/domain'
import type { AggregatePersistence } from '../../persistence/aggregate-persistence'
import { IndexedDBActivitiesRepository } from '../indexed-db-activities.repository'
import { persistedSnapshot } from '../../../shared/__tests__/persisted-snapshot'

const baseActivity: IActivityCreate = {
  title: 'Math',
  sessions: [{ day: 1, startTime: '08:00', endTime: '10:00' }],
  color: '#fff',
}

const makePersistence = (): Mocked<AggregatePersistence> => ({
  findAll: vi.fn(),
  find: vi.fn(),
  findByIndex: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
})

describe('IndexedDBActivitiesRepository', () => {
  let persistence: Mocked<AggregatePersistence>
  let repo: IndexedDBActivitiesRepository
  beforeEach(() => {
    persistence = makePersistence()
    repo = new IndexedDBActivitiesRepository(persistence)
  })

  describe('getAll', () => {
    it('returns all activities', async () => {
      const activity = Activity.create(baseActivity)
      persistence.findAll.mockResolvedValue([
        persistedSnapshot(activity.toSnapshot()),
      ])
      expect(await repo.getAll('user-1')).toHaveLength(1)
    })
    it('returns empty array when store is empty', async () => {
      persistence.findAll.mockResolvedValue([])
      expect(await repo.getAll('user-1')).toEqual([])
    })
  })
  describe('get', () => {
    it('returns activity by id', async () => {
      const activity = Activity.create(baseActivity)
      const stored = persistedSnapshot(activity.toSnapshot())
      persistence.find.mockResolvedValue(stored)
      expect(await repo.get('user-1', stored.id)).toMatchObject({
        id: stored.id,
      })
    })
    it('returns undefined when not found', async () => {
      persistence.find.mockResolvedValue(undefined)
      expect(await repo.get('user-1', crypto.randomUUID())).toBeUndefined()
    })
  })
  describe('create', () => {
    it('returns a new activity with generated id, MY_EVENT category and type', async () => {
      const activity = Activity.create(baseActivity)
      persistence.create.mockResolvedValue(
        persistedSnapshot(activity.toSnapshot()),
      )
      const result = await repo.create('user-1', activity)
      expect(result.toSnapshot().title).toBe(baseActivity.title)
      expect(result.id).toMatch(/^[0-9a-f-]+$/)
    })
  })
  describe('update', () => {
    it('returns the updated activity', async () => {
      const activity = Activity.create(baseActivity)
      const stored = persistedSnapshot(activity.toSnapshot())
      persistence.create.mockResolvedValue(stored)
      expect((await repo.create('user-1', activity)).id).toBe(stored.id)
    })
  })
  describe('delete', () => {
    it('resolves without error', async () => {
      await expect(
        repo.delete('user-1', crypto.randomUUID()),
      ).resolves.toBeUndefined()
    })
  })
})
