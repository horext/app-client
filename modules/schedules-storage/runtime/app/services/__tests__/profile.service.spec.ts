import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { Profile } from '../../../shared/domain'
import { ProfileService } from '../profile.service'
import type { IProfileRepository } from '../../repositories/profile-repository.interface'

describe('ProfileService', () => {
  const makeRepo = (): Mocked<IProfileRepository> => ({
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
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
      expect(await service.getProfile('user-1')).toBeUndefined()
    })
    it('returns profile data when stored', async () => {
      const profile = Profile.create({
        facultyId: 1,
        specialityId: 2,
        setupCompleted: false,
      })
      repo.get.mockResolvedValue(profile)
      expect(await service.getProfile('user-1')).toMatchObject({
        id: 'profile',
      })
    })
  })
  describe('createProfile', () => {
    it('returns existing profile if already exists', async () => {
      const profile = Profile.create({
        facultyId: 1,
        specialityId: 2,
        setupCompleted: true,
      })
      repo.get.mockResolvedValue(profile)
      const result = await service.createProfile('user-1', {
        facultyId: 5,
        specialityId: 6,
      })
      expect(repo.create).not.toHaveBeenCalled()
      expect(result.facultyId).toBe(1)
    })
    it('creates and saves new profile when none exist', async () => {
      repo.get.mockResolvedValue(undefined)
      const profile = Profile.create({
        facultyId: 3,
        specialityId: 4,
        setupCompleted: false,
      })
      repo.create.mockResolvedValue(profile)
      const result = await service.createProfile('user-1', {
        facultyId: 3,
        specialityId: 4,
      })
      expect(repo.create).toHaveBeenCalledOnce()
      expect(result.facultyId).toBe(3)
      expect(result.setupCompleted).toBe(false)
    })
  })
  describe('patch', () => {
    it('does nothing when no profile exists', async () => {
      repo.get.mockResolvedValue(undefined)
      await service.patch('user-1', { setupCompleted: true })
      expect(repo.update).not.toHaveBeenCalled()
    })
    it('patches and saves when profile exists', async () => {
      const profile = Profile.create({
        facultyId: 1,
        specialityId: 2,
        setupCompleted: false,
      })
      repo.get.mockResolvedValue(profile)
      repo.update.mockResolvedValue(profile)
      await service.patch('user-1', { setupCompleted: true })
      expect(repo.update).toHaveBeenCalledOnce()
    })
  })
})
