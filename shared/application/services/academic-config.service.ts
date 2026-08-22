import type { IAcademicConfigUpdate } from '#shared/domain/types/academic-config'
import type { IAcademicConfigRepository } from '#shared/application/repositories/academic-config.repository'
import type { IAcademicConfigService } from '../interfaces/academic-config.service'
import { AcademicConfig } from '#shared/domain'

export class AcademicConfigService implements IAcademicConfigService {
  constructor(private readonly repo: IAcademicConfigRepository) {}

  private async _load(userId: string): Promise<AcademicConfig | undefined> {
    return this.repo.get(userId)
  }

  private async _create(
    userId: string,
    initial?: IAcademicConfigUpdate,
  ): Promise<AcademicConfig> {
    const config = AcademicConfig.create({
      ...initial,
      hourlyLoad: initial?.hourlyLoad ?? null,
    })
    return this.repo.create(userId, config)
  }

  private async _update(
    userId: string,
    config: AcademicConfig,
  ): Promise<AcademicConfig> {
    return this.repo.update(userId, config)
  }

  async get(userId: string): Promise<AcademicConfig | undefined> {
    return this._load(userId)
  }

  async create(
    userId: string,
    initial?: IAcademicConfigUpdate,
  ): Promise<AcademicConfig> {
    const existing = await this._load(userId)
    if (existing) {
      if (!initial) {
        return existing
      }
      existing.update(initial)
      return this._update(userId, existing)
    }
    return this._create(userId, initial)
  }

  async patch(
    userId: string,
    value: IAcademicConfigUpdate,
  ): Promise<AcademicConfig> {
    const existing = await this._load(userId)
    if (!existing) {
      return this._create(userId, value)
    }
    existing.update(value)
    return this._update(userId, existing)
  }
}
