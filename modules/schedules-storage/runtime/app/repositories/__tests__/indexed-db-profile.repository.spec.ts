import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { Profile } from '#shared/domain'
import type { AggregatePersistence } from '../../persistence/aggregate-persistence'
import { IndexedDBProfileRepository } from '../indexed-db-profile.repository'
import type { IProfile } from '#shared/domain/types/profile'

const persistedProfile: IProfile = {
  facultyId: 1,
  specialityId: 2,
  setupCompleted: false,
  id: crypto.randomUUID(),
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdBy: 'user-1',
  updatedBy: 'user-1',
}

const makePersistence = (): Mocked<AggregatePersistence> => ({
  find: vi.fn(),
  findAll: vi.fn(),
  findByIndex: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
})
describe('IndexedDBProfileRepository', () => {
  let persistence: Mocked<AggregatePersistence>
  let repo: IndexedDBProfileRepository
  beforeEach(() => {
    persistence = makePersistence()
    repo = new IndexedDBProfileRepository(persistence)
  })
  it('returns the stored profile', async () => {
    persistence.findAll.mockResolvedValue([persistedProfile])
    expect((await repo.get('user-1'))?.toSnapshot()).toMatchObject({
      id: persistedProfile.id,
    })
  })
  it('returns undefined when nothing stored', async () => {
    persistence.findAll.mockResolvedValue([])
    expect(await repo.get('user-1')).toBeUndefined()
  })
  it('resolves without error when saving', async () => {
    const profile = Profile.create({
      facultyId: 1,
      specialityId: 2,
      setupCompleted: false,
    })
    persistence.create.mockResolvedValue(persistedProfile)
    await expect(repo.create('user-1', profile)).resolves.toBeDefined()
  })
})
