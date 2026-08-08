import type {
  IAcademicConfig,
  IBaseAcademicConfig,
} from '../../shared/interfaces/academic-config'
import type { IAcademicConfigRepository } from '../repositories/academic-config.repository.interface'
import type { IAcademicConfigService } from './academic-config.service.interface'
import { AcademicConfig } from '../../shared/domain'

export class AcademicConfigService implements IAcademicConfigService {
  constructor(private readonly repo: IAcademicConfigRepository) {}

  private async _load(userId: string): Promise<AcademicConfig | undefined> {
    return this.repo.get(userId)
  }

  private async _create(
    userId: string,
    config: AcademicConfig,
  ): Promise<AcademicConfig> {
    return this.repo.create(userId, config)
  }

  private async _update(
    userId: string,
    config: AcademicConfig,
  ): Promise<AcademicConfig> {
    return this.repo.update(userId, config)
  }

  async getAcademicConfig(
    userId: string,
  ): Promise<IAcademicConfig | undefined> {
    return (await this._load(userId))?.toSnapshot()
  }

  async createAcademicConfig(
    userId: string,
    initial?: Partial<IBaseAcademicConfig>,
  ): Promise<IAcademicConfig> {
    const existing = await this._load(userId)
    if (existing) return existing.toSnapshot()
    const config = AcademicConfig.create({
      hourlyLoad: initial?.hourlyLoad ?? null,
    })
    return (await this._create(userId, config)).toSnapshot()
  }

  async patch(
    userId: string,
    partial: Partial<IBaseAcademicConfig>,
  ): Promise<void> {
    const config = await this._load(userId)
    if (!config) return
    await this._update(userId, config.update(partial))
  }
}
