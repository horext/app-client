import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { IndexedDBAcademicConfigRepository } from '../indexed-db-academic-config.repository'
import { AcademicConfig } from '../../../shared/domain'
import type { AggregatePersistence } from '../../persistence/aggregate-persistence'

const config = AcademicConfig.create({ hourlyLoad: null })

const makePersistence = (): Mocked<AggregatePersistence> => ({
  findAll: vi.fn(),
  find: vi.fn(),
  findByIndex: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
})

describe('IndexedDBAcademicConfigRepository', () => {
  let persistence: ReturnType<typeof makePersistence>
  let repo: IndexedDBAcademicConfigRepository

  beforeEach(() => {
    persistence = makePersistence()
    repo = new IndexedDBAcademicConfigRepository(persistence)
  })

  describe('get', () => {
    it('returns the stored config', async () => {
      persistence.find.mockResolvedValue(config.toSnapshot())
      expect((await repo.get('user-1'))?.toSnapshot()).toMatchObject({
        id: 'academic-config',
      })
    })

    it('returns undefined when nothing stored', async () => {
      persistence.find.mockResolvedValue(undefined)
      expect(await repo.get('user-1')).toBeUndefined()
    })
  })

  describe('create', () => {
    it('resolves without error', async () => {
      persistence.create.mockResolvedValue(config.toSnapshot())
      await expect(repo.create('user-1', config)).resolves.toBeInstanceOf(
        AcademicConfig,
      )
    })
  })
})
