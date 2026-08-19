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
    initial?: Partial<IBaseAcademicConfig>,
  ): Promise<AcademicConfig<IAcademicConfig>> {
    const config = AcademicConfig.create({
      ...initial,
      hourlyLoad: initial?.hourlyLoad ?? null,
    })
    return this.repo.create(userId, config)
  }

  private async _update(
    userId: string,
    config: AcademicConfig<IAcademicConfig>,
  ): Promise<AcademicConfig<IAcademicConfig>> {
    return this.repo.update(userId, config)
  }

  async get(userId: string): Promise<IAcademicConfig | undefined> {
    return (await this._load(userId))?.toSnapshot()
  }

  async create(
    userId: string,
    initial?: Partial<IBaseAcademicConfig>,
  ): Promise<IAcademicConfig> {
    const existing = await this._load(userId)
    if (existing) {
      if (!initial) {
        return existing.toSnapshot()
      }
      ;(await this._update(userId, existing.update(initial))).toSnapshot()
    }
    return (await this._create(userId, initial)).toSnapshot()
  }

  async patch(
    userId: string,
    value: Partial<IBaseAcademicConfig>,
  ): Promise<IAcademicConfig> {
    const existing = await this._load(userId)
    if (!existing) {
      return (await this._create(userId, value)).toSnapshot()
    }
    return (await this._update(userId, existing.update(value))).toSnapshot()
  }
}
