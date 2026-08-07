import { describe, it, expect, vi, beforeEach } from 'vitest'
import { IndexedDBProfileRepository } from '../indexed-db-profile.repository'
import type { IUserProfile } from '../../../shared/interfaces/profile'

const profile: IUserProfile = {
  id: 'profile',
  facultyId: 1,
  specialityId: 2,
  setupCompleted: false,
}

const makeDb = () => ({
  get: vi.fn(),
  put: vi.fn(),
})

describe('IndexedDBProfileRepository', () => {
  let db: ReturnType<typeof makeDb>
  let repo: IndexedDBProfileRepository

  beforeEach(() => {
    db = makeDb()
    repo = new IndexedDBProfileRepository(() => Promise.resolve(db as never))
  })

  describe('get', () => {
    it('returns the stored profile', async () => {
      db.get.mockResolvedValue(profile)
      expect(await repo.get()).toEqual(profile)
    })

    it('returns undefined when nothing stored', async () => {
      db.get.mockResolvedValue(undefined)
      expect(await repo.get()).toBeUndefined()
    })
  })

  describe('save', () => {
    it('resolves without error', async () => {
      db.put.mockResolvedValue(undefined)
      await expect(repo.save(profile)).resolves.toBeUndefined()
    })
  })
})
