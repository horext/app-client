import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { AcademicConfigService } from '../academic-config.service'
import type { IAcademicConfigRepository } from '../../repositories/academic-config.repository.interface'

describe('AcademicConfigService', () => {
  const makeRepo = (): Mocked<IAcademicConfigRepository> => ({
    get: vi.fn(),
    save: vi.fn(),
  })

  let repo: Mocked<IAcademicConfigRepository>
  let service: AcademicConfigService

  beforeEach(() => {
    repo = makeRepo()
    service = new AcademicConfigService(repo)
  })

  describe('getAcademicConfig', () => {
    it('returns undefined when no config stored', async () => {
      repo.get.mockResolvedValue(undefined)
      expect(await service.getAcademicConfig()).toBeUndefined()
    })

    it('returns config data when stored', async () => {
      repo.get.mockResolvedValue({ id: 'academic-config', hourlyLoad: null })
      const result = await service.getAcademicConfig()
      expect(result).toEqual({ id: 'academic-config', hourlyLoad: null })
    })
  })

  describe('createAcademicConfig', () => {
    it('returns existing config if already exists', async () => {
      repo.get.mockResolvedValue({ id: 'academic-config', hourlyLoad: null })
      const result = await service.createAcademicConfig()
      expect(repo.save).not.toHaveBeenCalled()
      expect(result.id).toBe('academic-config')
    })

    it('creates and saves new config when none exist', async () => {
      repo.get.mockResolvedValue(undefined)
      repo.save.mockResolvedValue(undefined)
      const result = await service.createAcademicConfig()
      expect(repo.save).toHaveBeenCalledOnce()
      expect(result.hourlyLoad).toBeNull()
    })

    it('creates config with initial values', async () => {
      repo.get.mockResolvedValue(undefined)
      repo.save.mockResolvedValue(undefined)
      const hourlyLoad = {
        id: 1,
        name: 'HL',
        year: 2024,
        semester: 1,
        facultyId: 1,
        checkedAt: '',
        updatedAt: '',
        publishedAt: '',
        academicPeriodOrganizationUnit: {
          id: 0,
          fromDate: '',
          toDate: '',
          academicPeriod: { id: 0 },
          organizationUnit: { id: 0 },
        },
      }
      const result = await service.createAcademicConfig({ hourlyLoad })
      expect(result.hourlyLoad).toEqual(hourlyLoad)
    })
  })

  describe('patch', () => {
    it('does nothing when no config exists', async () => {
      repo.get.mockResolvedValue(undefined)
      await service.patch({ hourlyLoad: null })
      expect(repo.save).not.toHaveBeenCalled()
    })

    it('patches and saves when config exists', async () => {
      repo.get.mockResolvedValue({ id: 'academic-config', hourlyLoad: null })
      repo.save.mockResolvedValue(undefined)
      const hourlyLoad = {
        id: 2,
        name: 'HL',
        year: 2024,
        semester: 1,
        facultyId: 1,
        checkedAt: '',
        updatedAt: '',
        publishedAt: '',
        academicPeriodOrganizationUnit: {
          id: 0,
          fromDate: '',
          toDate: '',
          academicPeriod: { id: 0 },
          organizationUnit: { id: 0 },
        },
      }
      await service.patch({ hourlyLoad })
      expect(repo.save).toHaveBeenCalledOnce()
    })
  })
})
