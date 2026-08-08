import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import type { AggregatePersistence } from '../../persistence/aggregate-persistence'
import { IndexedDBPreferencesRepository } from '../indexed-db-preferences.repository'
import { Preferences } from '../../../shared/domain'

const makePersistence = (): Mocked<AggregatePersistence> => ({
  findAll: vi.fn(),
  find: vi.fn(),
  findByIndex: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
})

describe('IndexedDBPreferencesRepository', () => {
  let persistence: Mocked<AggregatePersistence>
  let repo: IndexedDBPreferencesRepository

  beforeEach(() => {
    persistence = makePersistence()
    repo = new IndexedDBPreferencesRepository(persistence)
  })

  describe('get', () => {
    it('returns a UserPreferences instance when data exists', async () => {
      const prefs = Preferences.create({
        weekDays: [1, 2],
        crossings: 0,
        maxGenerationHistory: 10,
      })
      persistence.find.mockResolvedValue(prefs.toSnapshot())
      const result = await repo.get('user-1')
      expect(result).toBeInstanceOf(Preferences)
      expect(result!.toSnapshot().crossings).toBe(0)
    })

    it('returns undefined when nothing stored', async () => {
      persistence.find.mockResolvedValue(undefined)
      expect(await repo.get('user-1')).toBeUndefined()
    })
  })

  describe('create', () => {
    it('resolves without error', async () => {
      const prefs = Preferences.create({
        weekDays: [1],
        crossings: 0,
        maxGenerationHistory: 10,
      })
      persistence.create.mockResolvedValue(prefs.toSnapshot())
      await expect(repo.create('user-1', prefs)).resolves.toBeInstanceOf(
        Preferences,
      )
    })
  })
})
