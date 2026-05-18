import type { IUserAcademicConfig } from '~/interfaces/academic-config'

export interface IAcademicConfigService {
  getAcademicConfig(): Promise<IUserAcademicConfig | undefined>
  createAcademicConfig(): Promise<IUserAcademicConfig>
  patch(partial: Partial<Omit<IUserAcademicConfig, 'id'>>): Promise<void>
}
