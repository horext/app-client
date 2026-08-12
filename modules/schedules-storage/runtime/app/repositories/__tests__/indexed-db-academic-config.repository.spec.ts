import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { IndexedDBAcademicConfigRepository } from '../indexed-db-academic-config.repository'
import { AcademicConfig } from '#shared/domain'
import type { AggregatePersistence } from '../../persistence/aggregate-persistence'
import type { IAcademicConfig } from '#shared/domain/types/academic-config'
import { makeUUID } from '~~/shared/domain/types/ids'

const config = AcademicConfig.create({ hourlyLoad: null })
const persistedConfig: IAcademicConfig = {
  ...config.toSnapshot(),
  id: makeUUID(),
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdBy: 'user-1',
  updatedBy: 'user-1',
}

const makePersistence = (): Mocked<AggregatePersistence> => ({
  findAll: vi.fn(),
  find: vi.fn(),
  findByIndex: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  findAllByIndex: vi.fn(),
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
      persistence.findAll.mockResolvedValue([persistedConfig])
      expect((await repo.get('user-1'))?.toSnapshot()).toMatchObject({
        id: persistedConfig.id,
      })
    })

    it('returns undefined when nothing stored', async () => {
      persistence.findAll.mockResolvedValue([])
      expect(await repo.get('user-1')).toBeUndefined()
    })
  })

  describe('create', () => {
    it('resolves without error', async () => {
      persistence.create.mockResolvedValue(persistedConfig)
      await expect(repo.create('user-1', config)).resolves.toBeInstanceOf(
        AcademicConfig,
      )
    })
  })
})
