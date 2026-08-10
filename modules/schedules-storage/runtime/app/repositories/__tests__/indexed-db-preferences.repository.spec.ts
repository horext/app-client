import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import type { AggregatePersistence } from '../../persistence/aggregate-persistence'
import { IndexedDBPreferencesRepository } from '../indexed-db-preferences.repository'
import { Preferences } from '#shared/domain'
import type { IPreferences } from '#shared/domain/types/preferences'

const persistedPreferences: IPreferences = {
  weekDays: [1, 2],
  crossings: 0,
  maxGenerationHistory: 10,
  id: crypto.randomUUID(),
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

describe('IndexedDBPreferencesRepository', () => {
  let persistence: Mocked<AggregatePersistence>
  let repo: IndexedDBPreferencesRepository

  beforeEach(() => {
    persistence = makePersistence()
    repo = new IndexedDBPreferencesRepository(persistence)
  })

  describe('get', () => {
    it('returns a UserPreferences instance when data exists', async () => {
      persistence.findAll.mockResolvedValue([persistedPreferences])
      const result = await repo.get('user-1')
      expect(result).toBeInstanceOf(Preferences)
      expect(result!.toSnapshot().crossings).toBe(0)
    })

    it('returns undefined when nothing stored', async () => {
      persistence.findAll.mockResolvedValue([])
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
      persistence.create.mockResolvedValue(persistedPreferences)
      await expect(repo.create('user-1', prefs)).resolves.toBeInstanceOf(
        Preferences,
      )
    })
  })
})
