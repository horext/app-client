import type {
  IAcademicConfig,
  IBaseAcademicConfig,
} from '#shared/domain/types/academic-config'
import type { IAcademicConfigRepository } from '#shared/application/repositories/academic-config.repository'
import type { IAcademicConfigService } from '../interfaces/academic-config.service'
import { AcademicConfig } from '#shared/domain'

export class AcademicConfigService implements IAcademicConfigService {
  constructor(private readonly repo: IAcademicConfigRepository) {}

  private async _load(
    userId: string,
  ): Promise<AcademicConfig<IAcademicConfig> | undefined> {
    return this.repo.get(userId)
  }

  private async _create(
    userId: string,
    config: AcademicConfig<IBaseAcademicConfig>,
  ): Promise<AcademicConfig<IAcademicConfig>> {
    return this.repo.create(userId, config)
  }

  private async _update(
    userId: string,
    config: AcademicConfig<IAcademicConfig>,
  ): Promise<AcademicConfig<IAcademicConfig>> {
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
    if (existing && initial?.revision !== undefined)
      return (
        await this._update(userId, existing.update(initial ?? {}))
      ).toSnapshot()
    if (existing) return existing.toSnapshot()
    const config = AcademicConfig.create({
      ...initial,
      hourlyLoad: initial?.hourlyLoad ?? null,
    })
    return (await this._create(userId, config)).toSnapshot()
  }

  async patch(
    userId: string,
    partial: Partial<IBaseAcademicConfig>,
  ): Promise<IAcademicConfig | undefined> {
    const config = await this._load(userId)
    if (!config) return undefined
    return (await this._update(userId, config.update(partial))).toSnapshot()
  }
}
