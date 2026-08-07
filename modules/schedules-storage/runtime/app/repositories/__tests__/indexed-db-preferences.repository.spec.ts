import { describe, it, expect, vi, beforeEach } from 'vitest'
import { IndexedDBPreferencesRepository } from '../indexed-db-preferences.repository'
import { UserPreferences } from '../../domain/UserPreferences'

const makeDb = () => ({
  get: vi.fn(),
  put: vi.fn(),
})

describe('IndexedDBPreferencesRepository', () => {
  let db: ReturnType<typeof makeDb>
  let repo: IndexedDBPreferencesRepository

  beforeEach(() => {
    db = makeDb()
    repo = new IndexedDBPreferencesRepository(() =>
      Promise.resolve(db as never),
    )
  })

  describe('get', () => {
    it('returns a UserPreferences instance when data exists', async () => {
      const prefs = UserPreferences.create()
      db.get.mockResolvedValue(prefs.toData())
      const result = await repo.get()
      expect(result).toBeInstanceOf(UserPreferences)
      expect(result!.crossings).toBe(0)
    })

    it('returns undefined when nothing stored', async () => {
      db.get.mockResolvedValue(undefined)
      expect(await repo.get()).toBeUndefined()
    })
  })

  describe('save', () => {
    it('resolves without error', async () => {
      db.put.mockResolvedValue(undefined)
      await expect(repo.save(UserPreferences.create())).resolves.toBeUndefined()
    })
  })
})
