import type { IUserAcademicConfig } from '~/interfaces/academic-config'

export interface IAcademicConfigService {
  getAcademicConfig(): Promise<IUserAcademicConfig | undefined>
  createAcademicConfig(initial?: Partial<Omit<IUserAcademicConfig, 'id'>>): Promise<IUserAcademicConfig>
  patch(partial: Partial<Omit<IUserAcademicConfig, 'id'>>): Promise<void>
}
