import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { Profile } from '../../../shared/domain'
import type { AggregatePersistence } from '../../persistence/aggregate-persistence'
import { IndexedDBProfileRepository } from '../indexed-db-profile.repository'

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
    const profile = Profile.create({
      facultyId: 1,
      specialityId: 2,
      setupCompleted: false,
    })
    persistence.find.mockResolvedValue(profile.toSnapshot())
    expect((await repo.get('user-1'))?.toSnapshot()).toMatchObject({
      id: 'profile',
    })
  })
  it('returns undefined when nothing stored', async () => {
    persistence.find.mockResolvedValue(undefined)
    expect(await repo.get('user-1')).toBeUndefined()
  })
  it('resolves without error when saving', async () => {
    const profile = Profile.create({
      facultyId: 1,
      specialityId: 2,
      setupCompleted: false,
    })
    persistence.create.mockResolvedValue(profile.toSnapshot())
    await expect(repo.create('user-1', profile)).resolves.toBeDefined()
  })
})
