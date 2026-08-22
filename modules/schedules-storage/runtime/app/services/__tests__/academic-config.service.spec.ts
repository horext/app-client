import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { AcademicConfig } from '#shared/domain'
import type { IHourlyLoad } from '#shared/domain/types/hourly-load'
import { AcademicConfigService } from '#shared/application/services/academic-config.service'
import type { IAcademicConfigRepository } from '#shared/application/repositories/academic-config.repository'
import { persistedSnapshot } from '../../../shared/__tests__/persisted-snapshot'

const hourlyLoad: IHourlyLoad = {
  id: 1,
  name: 'HL',
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
const makeConfig = (value: IHourlyLoad | null = null) =>
  AcademicConfig.restore(persistedSnapshot({ hourlyLoad: value }))
describe('AcademicConfigService', () => {
  const makeRepo = (): Mocked<IAcademicConfigRepository> => ({
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
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
      expect(await service.get('user-1')).toBeUndefined()
    })
    it('returns config data when stored', async () => {
      const config = makeConfig()
      repo.get.mockResolvedValue(config)
      expect((await service.get('user-1'))?.toSnapshot()).toMatchObject({
        id: config.id,
        hourlyLoad: null,
      })
    })
  })
  describe('createAcademicConfig', () => {
    it('update when config already exists', async () => {
      const config = makeConfig()
      repo.get.mockResolvedValue(config)
      repo.update.mockResolvedValue(config)
      await service.create('user-1', {})
      expect(repo.update).toHaveBeenCalled()
    })
    it('creates and saves new config when none exist', async () => {
      repo.get.mockResolvedValue(undefined)
      const config = makeConfig()
      repo.create.mockResolvedValue(config)
      const result = await service.create('user-1')
      expect(repo.create).toHaveBeenCalledOnce()
      expect(result.toSnapshot().hourlyLoad).toBeNull()
    })
    it('creates config with initial values', async () => {
      repo.get.mockResolvedValue(undefined)
      const config = makeConfig(hourlyLoad)
      repo.create.mockResolvedValue(config)
      const result = await service.create('user-1', {
        hourlyLoad,
      })
      expect(result.toSnapshot().hourlyLoad).toEqual(hourlyLoad)
    })
  })
  describe('patch', () => {
    it('create when no config exists', async () => {
      repo.get.mockResolvedValue(undefined)
      const config = makeConfig()
      repo.create.mockResolvedValue(config)
      await service.patch('user-1', { hourlyLoad: null })
      expect(repo.create).toHaveBeenCalled()
    })
    it('patches and saves when config exists', async () => {
      const config = makeConfig()
      repo.get.mockResolvedValue(config)
      repo.update.mockResolvedValue(config)
      await service.patch('user-1', { hourlyLoad })
      expect(repo.update).toHaveBeenCalledOnce()
    })
  })
})
