import type { IUserAcademicConfig } from '../../shared/interfaces/academic-config'
import type { IHourlyLoad } from '../../shared/interfaces/houly-load'

export class UserAcademicConfig {
  private constructor(
    readonly id: IUserAcademicConfig['id'],
    readonly hourlyLoad: IHourlyLoad | null,
  ) {}

  patch(partial: Partial<Omit<IUserAcademicConfig, 'id'>>): UserAcademicConfig {
    return new UserAcademicConfig(
      this.id,
      partial.hourlyLoad !== undefined ? partial.hourlyLoad : this.hourlyLoad,
    )
  }

  toData(): IUserAcademicConfig {
    return {
      id: this.id,
      hourlyLoad: this.hourlyLoad,
    }
  }

  static create(
    initial?: Partial<Omit<IUserAcademicConfig, 'id'>>,
  ): UserAcademicConfig {
    const base = new UserAcademicConfig('academic-config', null)
    return initial ? base.patch(initial) : base
  }

  static from(data: IUserAcademicConfig): UserAcademicConfig {
    return new UserAcademicConfig(data.id, data.hourlyLoad)
  }
}
