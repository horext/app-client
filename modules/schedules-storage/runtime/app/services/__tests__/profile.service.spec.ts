import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { Profile } from '#shared/domain'
import { ProfileService } from '#shared/application/services/profile.service'
import type { IProfileRepository } from '#shared/application/repositories/profile.repository'
import { persistedSnapshot } from '../../../shared/__tests__/persisted-snapshot'

const makeProfile = (setupCompleted = false) =>
  Profile.reconstitute(
    persistedSnapshot({
      facultyId: 1,
      specialityId: 2,
      setupCompleted,
    }),
  )

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
      expect(await service.get('user-1')).toBeUndefined()
    })
    it('returns profile data when stored', async () => {
      const profile = Profile.reconstitute(
        persistedSnapshot({
          facultyId: 1,
          specialityId: 2,
          setupCompleted: false,
        }),
      )
      repo.get.mockResolvedValue(profile)
      expect(await service.get('user-1')).toMatchObject({
        id: profile.id,
      })
    })
  })
  describe('createProfile', () => {
    it('update when a profile already exists', async () => {
      const profile = makeProfile(true)
      repo.get.mockResolvedValue(profile)
      repo.update.mockResolvedValue(profile)
      await service.create('user-1', {
        facultyId: 5,
        specialityId: 6,
      })
      expect(repo.create).not.toHaveBeenCalled()
      expect(repo.update).toHaveBeenCalled()
    })
    it('creates and saves new profile when none exist', async () => {
      repo.get.mockResolvedValue(undefined)
      const profile = Profile.reconstitute(
        persistedSnapshot({
          facultyId: 3,
          specialityId: 4,
          setupCompleted: false,
        }),
      )
      repo.create.mockResolvedValue(profile)
      const result = await service.create('user-1', {
        facultyId: 3,
        specialityId: 4,
      })
      expect(repo.create).toHaveBeenCalledOnce()
      expect(result.facultyId).toBe(3)
      expect(result.setupCompleted).toBe(false)
    })
  })
  describe('patch', () => {
    it('throws when no profile exists', async () => {
      repo.get.mockResolvedValue(undefined)
      await expect(
        service.patch('user-1', { setupCompleted: true }),
      ).rejects.toThrow('The profile does not exist.')
      expect(repo.update).not.toHaveBeenCalled()
    })
    it('patches and saves when profile exists', async () => {
      const profile = makeProfile()
      repo.get.mockResolvedValue(profile)
      repo.update.mockResolvedValue(profile)
      await service.patch('user-1', { setupCompleted: true })
      expect(repo.update).toHaveBeenCalledOnce()
    })
  })
})
