import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { Preferences } from '#shared/domain'
import { PreferencesService } from '#shared/application/services/preferences.service'
import type { IPreferencesRepository } from '#shared/application/repositories/preferences.repository'
import { persistedSnapshot } from '../../../shared/__tests__/persisted-snapshot'

const makePreferences = () =>
  Preferences.reconstitute(
    persistedSnapshot({
      weekDays: [1, 2, 3],
      crossings: 0,
      maxGenerationHistory: 10,
    }),
  )
describe('PreferencesService', () => {
  const makeRepo = (): Mocked<IPreferencesRepository> => ({
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  })
  let repo: Mocked<IPreferencesRepository>
  let service: PreferencesService
  beforeEach(() => {
    repo = makeRepo()
    service = new PreferencesService(repo)
  })
  describe('getPreferences', () => {
    it('returns undefined when no preferences stored', async () => {
      repo.get.mockResolvedValue(undefined)
      expect(await service.get('user-1')).toBeUndefined()
    })
    it('returns preferences data when stored', async () => {
      const prefs = makePreferences()
      repo.get.mockResolvedValue(prefs)
      expect(await service.get('user-1')).toMatchObject({
        id: prefs.id,
      })
    })
  })
  describe('createPreferences', () => {
    it('rejects creation when preferences already exist', async () => {
      repo.get.mockResolvedValue(makePreferences())
      await expect(service.create('user-1')).rejects.toThrow(
        'El recurso preferences ya existe.',
      )
      expect(repo.create).not.toHaveBeenCalled()
    })
    it('creates and saves new preferences when none exist', async () => {
      repo.get.mockResolvedValue(undefined)
      const prefs = makePreferences()
      repo.create.mockResolvedValue(prefs)
      const result = await service.create('user-1')
      expect(repo.create).toHaveBeenCalledOnce()
      expect(result.id).toBe(prefs.id)
      expect(result.crossings).toBe(0)
    })
  })
  describe('patch', () => {
    it('throws when no preferences exist', async () => {
      repo.get.mockResolvedValue(undefined)
      await expect(service.patch('user-1', { crossings: 2 })).rejects.toThrow(
        'The preferences does not exist.',
      )
      expect(repo.update).not.toHaveBeenCalled()
    })
    it('patches and saves when preferences exist', async () => {
      const prefs = makePreferences()
      repo.get.mockResolvedValue(prefs)
      repo.update.mockResolvedValue(prefs)
      await service.patch('user-1', { crossings: 3 })
      expect(repo.update).toHaveBeenCalledOnce()
    })
  })
})
