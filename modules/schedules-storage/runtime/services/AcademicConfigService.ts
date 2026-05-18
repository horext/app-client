import type { IUserAcademicConfig } from '~/interfaces/academic-config'
import type { IHourlyLoad } from '~/interfaces/houly-load'
import type { IAcademicConfigRepository } from '../interfaces/academic-config-repository'
import type { IAcademicConfigService } from '../interfaces/academic-config-service'

const DEFAULT_ACADEMIC_CONFIG: IUserAcademicConfig = {
  id: 'academic-config',
  hourlyLoad: null,
}

export class AcademicConfigService implements IAcademicConfigService {
  constructor(private readonly repo: IAcademicConfigRepository) {}

  async getAcademicConfig(): Promise<IUserAcademicConfig | undefined> {
    return this.repo.get()
  }

  async createAcademicConfig(): Promise<IUserAcademicConfig> {
    const existing = await this.repo.get()
    if (existing) return existing
    const defaultConfig = { ...DEFAULT_ACADEMIC_CONFIG }
    await this.repo.save(defaultConfig)
    return defaultConfig
  }

  async patch(partial: Partial<Omit<IUserAcademicConfig, 'id'>>): Promise<void> {
    const current = await this.repo.get()
    if (!current) return
    await this.repo.save({ ...current, ...partial })
  }

  async updateHourlyLoad(hourlyLoad: IHourlyLoad | null): Promise<void> {
    await this.patch({ hourlyLoad })
  }
}
