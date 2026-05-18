import type { IUserAcademicConfig } from '~/interfaces/academic-config'
import type { IHourlyLoad } from '~/interfaces/houly-load'

export interface IAcademicConfigService {
  getAcademicConfig(): Promise<IUserAcademicConfig | undefined>
  createAcademicConfig(): Promise<IUserAcademicConfig>
  patch(partial: Partial<Omit<IUserAcademicConfig, 'id'>>): Promise<void>
  updateHourlyLoad(hourlyLoad: IHourlyLoad | null): Promise<void>
}
