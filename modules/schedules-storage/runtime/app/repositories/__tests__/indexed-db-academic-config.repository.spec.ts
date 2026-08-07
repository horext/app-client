import { describe, it, expect, vi, beforeEach } from 'vitest'
import { IndexedDBAcademicConfigRepository } from '../indexed-db-academic-config.repository'
import type { IUserAcademicConfig } from '../../../shared/interfaces/academic-config'

const config: IUserAcademicConfig = { id: 'academic-config', hourlyLoad: null }

const makeDb = () => ({
  get: vi.fn(),
  put: vi.fn(),
})

describe('IndexedDBAcademicConfigRepository', () => {
  let db: ReturnType<typeof makeDb>
  let repo: IndexedDBAcademicConfigRepository

  beforeEach(() => {
    db = makeDb()
    repo = new IndexedDBAcademicConfigRepository(() =>
      Promise.resolve(db as never),
    )
  })

  describe('get', () => {
    it('returns the stored config', async () => {
      db.get.mockResolvedValue(config)
      expect(await repo.get()).toEqual(config)
    })

    it('returns undefined when nothing stored', async () => {
      db.get.mockResolvedValue(undefined)
      expect(await repo.get()).toBeUndefined()
    })
  })

  describe('save', () => {
    it('resolves without error', async () => {
      db.put.mockResolvedValue(undefined)
      await expect(repo.save(config)).resolves.toBeUndefined()
    })
  })
})
