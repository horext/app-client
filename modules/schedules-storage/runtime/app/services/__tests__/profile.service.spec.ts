import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { ProfileService } from '../profile.service'
import type { IProfileRepository } from '../../repositories/profile-repository.interface'

describe('ProfileService', () => {
  const makeRepo = (): Mocked<IProfileRepository> => ({
    get: vi.fn(),
    save: vi.fn(),
  })

  let repo: Mocked<IProfileRepository>
  let service: ProfileService

  beforeEach(() => {
    repo = makeRepo()
    service = new ProfileService(repo)
  })

  describe('getProfile', () => {
    it('returns undefined when no profile stored', async () => {
      repo.get.mockResolvedValue(undefined)
      expect(await service.getProfile()).toBeUndefined()
    })

    it('returns profile data when stored', async () => {
      const profileData = {
        id: 'profile' as const,
        facultyId: 1,
        specialityId: 2,
        setupCompleted: false,
      }
      repo.get.mockResolvedValue(profileData)
      const result = await service.getProfile()
      expect(result).toEqual(profileData)
    })
  })

  describe('createProfile', () => {
    it('returns existing profile if already exists', async () => {
      const profileData = {
        id: 'profile' as const,
        facultyId: 1,
        specialityId: 2,
        setupCompleted: true,
      }
      repo.get.mockResolvedValue(profileData)
      const result = await service.createProfile({
        facultyId: 5,
        specialityId: 6,
      })
      expect(repo.save).not.toHaveBeenCalled()
      expect(result.facultyId).toBe(1)
    })

    it('creates and saves new profile when none exist', async () => {
      repo.get.mockResolvedValue(undefined)
      repo.save.mockResolvedValue(undefined)
      const result = await service.createProfile({
        facultyId: 3,
        specialityId: 4,
      })
      expect(repo.save).toHaveBeenCalledOnce()
      expect(result.facultyId).toBe(3)
      expect(result.setupCompleted).toBe(false)
    })
  })

  describe('patch', () => {
    it('does nothing when no profile exists', async () => {
      repo.get.mockResolvedValue(undefined)
      await service.patch({ setupCompleted: true })
      expect(repo.save).not.toHaveBeenCalled()
    })

    it('patches and saves when profile exists', async () => {
      const profileData = {
        id: 'profile' as const,
        facultyId: 1,
        specialityId: 2,
        setupCompleted: false,
      }
      repo.get.mockResolvedValue(profileData)
      repo.save.mockResolvedValue(undefined)
      await service.patch({ setupCompleted: true })
      expect(repo.save).toHaveBeenCalledOnce()
    })
  })
})
