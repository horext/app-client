import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { Generation } from '../../../shared/domain'
import type { AggregatePersistence } from '../../persistence/aggregate-persistence'
import { IndexedDBGenerationsRepository } from '../indexed-db-generation.repository'

const makeGeneration = () =>
  Generation.create({
    generatedAt: '2024-01-01T00:00:00Z',
    scheduleIds: [],
    crossingsSetting: 0,
    weekDays: [1, 2, 3],
    hourlyLoadId: 1,
    resultCount: 0,
    occurrences: [],
  })
const makePersistence = (): Mocked<AggregatePersistence> => ({
  findAll: vi.fn(),
  find: vi.fn(),
  findByIndex: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
})
describe('IndexedDBGenerationsRepository', () => {
  let persistence: Mocked<AggregatePersistence>
  let repo: IndexedDBGenerationsRepository
  beforeEach(() => {
    persistence = makePersistence()
    repo = new IndexedDBGenerationsRepository(persistence)
  })
  it('returns all records', async () => {
    const value = makeGeneration()
    persistence.findAll.mockResolvedValue([value.toSnapshot()])
    expect(await repo.getAll('user-1')).toHaveLength(1)
  })
  it('returns empty array when store is empty', async () => {
    persistence.findAll.mockResolvedValue([])
    expect(await repo.getAll('user-1')).toEqual([])
  })
  it('returns record by id', async () => {
    const value = makeGeneration()
    persistence.find.mockResolvedValue(value.toSnapshot())
    expect(await repo.get('user-1', value.id)).toBeDefined()
  })
  it('returns undefined when not found', async () => {
    persistence.find.mockResolvedValue(undefined)
    expect(await repo.get('user-1', crypto.randomUUID())).toBeUndefined()
  })
  it('returns a created record', async () => {
    const value = makeGeneration()
    persistence.create.mockResolvedValue(value.toSnapshot())
    const result = await repo.create('user-1', value)
    expect(result.id).toBe(value.id)
  })
  it('resolves without error when deleting', async () => {
    await expect(
      repo.delete('user-1', crypto.randomUUID()),
    ).resolves.toBeUndefined()
  })
})
