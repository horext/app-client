import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { PreferencesService } from '../preferences.service'
import { UserPreferences } from '../../domain/UserPreferences'
import type { IPreferencesRepository } from '../../repositories/preferences-repository.interface'

describe('PreferencesService', () => {
  const makeRepo = (): Mocked<IPreferencesRepository> => ({
    get: vi.fn(),
    save: vi.fn(),
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
      const result = await service.getPreferences()
      expect(result).toBeUndefined()
    })

    it('returns preferences data when stored', async () => {
      const prefs = UserPreferences.create()
      repo.get.mockResolvedValue(prefs)
      const result = await service.getPreferences()
      expect(result).toBeDefined()
    })
  })

  describe('createPreferences', () => {
    it('returns existing preferences if already exists', async () => {
      const prefs = UserPreferences.create()
      repo.get.mockResolvedValue(prefs)
      const result = await service.createPreferences()
      expect(repo.save).not.toHaveBeenCalled()
      expect(result.id).toBe('preferences')
    })

    it('creates and saves new preferences when none exist', async () => {
      repo.get.mockResolvedValue(undefined)
      repo.save.mockResolvedValue(undefined)
      const result = await service.createPreferences()
      expect(repo.save).toHaveBeenCalledOnce()
      expect(result.id).toBe('preferences')
      expect(result.crossings).toBe(0)
    })
  })

  describe('patch', () => {
    it('does nothing when no preferences exist', async () => {
      repo.get.mockResolvedValue(undefined)
      await service.patch({ crossings: 2 })
      expect(repo.save).not.toHaveBeenCalled()
    })

    it('patches and saves when preferences exist', async () => {
      const prefs = UserPreferences.create()
      repo.get.mockResolvedValue(prefs)
      repo.save.mockResolvedValue(undefined)
      await service.patch({ crossings: 3 })
      expect(repo.save).toHaveBeenCalledOnce()
    })
  })
})
