import { describe, it, expect, vi, beforeEach, type Mocked } from 'vitest'
import { AcademicConfig } from '../../../shared/domain'
import type { IHourlyLoad } from '../../../shared/interfaces/houly-load'
import { AcademicConfigService } from '../academic-config.service'
import type { IAcademicConfigRepository } from '../../repositories/academic-config.repository.interface'
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
      expect(await service.getAcademicConfig('user-1')).toBeUndefined()
    })
    it('returns config data when stored', async () => {
      const config = makeConfig()
      repo.get.mockResolvedValue(config)
      expect(await service.getAcademicConfig('user-1')).toMatchObject({
        id: config.id,
        hourlyLoad: null,
      })
    })
  })
  describe('createAcademicConfig', () => {
    it('returns existing config if already exists', async () => {
      repo.get.mockResolvedValue(makeConfig())
      const result = await service.createAcademicConfig('user-1')
      expect(repo.create).not.toHaveBeenCalled()
      expect(result.id).toBeDefined()
    })
    it('creates and saves new config when none exist', async () => {
      repo.get.mockResolvedValue(undefined)
      const config = makeConfig()
      repo.create.mockResolvedValue(config)
      const result = await service.createAcademicConfig('user-1')
      expect(repo.create).toHaveBeenCalledOnce()
      expect(result.hourlyLoad).toBeNull()
    })
    it('creates config with initial values', async () => {
      repo.get.mockResolvedValue(undefined)
      const config = makeConfig(hourlyLoad)
      repo.create.mockResolvedValue(config)
      const result = await service.createAcademicConfig('user-1', {
        hourlyLoad,
      })
      expect(result.hourlyLoad).toEqual(hourlyLoad)
    })
  })
  describe('patch', () => {
    it('does nothing when no config exists', async () => {
      repo.get.mockResolvedValue(undefined)
      await service.patch('user-1', { hourlyLoad: null })
      expect(repo.update).not.toHaveBeenCalled()
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
