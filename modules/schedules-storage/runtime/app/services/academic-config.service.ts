import type { IUserAcademicConfig } from '../../shared/interfaces/academic-config'
import type { IAcademicConfigRepository } from '../repositories/academic-config.repository.interface'
import type { IAcademicConfigService } from './academic-config.service.interface'
import { UserAcademicConfig } from '../domain/UserAcademicConfig'

export class AcademicConfigService implements IAcademicConfigService {
  constructor(private readonly repo: IAcademicConfigRepository) {}

  private async _load(): Promise<UserAcademicConfig | undefined> {
    const data = await this.repo.get()
    return data ? UserAcademicConfig.from(data) : undefined
  }

  private async _save(config: UserAcademicConfig): Promise<void> {
    await this.repo.save(config.toData())
  }

  async getAcademicConfig(): Promise<IUserAcademicConfig | undefined> {
    return (await this._load())?.toData()
  }

  async createAcademicConfig(
    initial?: Partial<Omit<IUserAcademicConfig, 'id'>>,
  ): Promise<IUserAcademicConfig> {
    const existing = await this._load()
    if (existing) return existing.toData()
    const config = UserAcademicConfig.create(initial)
    await this._save(config)
    return config.toData()
  }

  async patch(
    partial: Partial<Omit<IUserAcademicConfig, 'id'>>,
  ): Promise<void> {
    const config = await this._load()
    if (!config) return
    await this._save(config.patch(partial))
  }
}
