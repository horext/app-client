import type { IUserAcademicConfig } from '~/interfaces/academic-config'

export interface IAcademicConfigRepository {
  get(): Promise<IUserAcademicConfig | undefined>
  save(config: IUserAcademicConfig): Promise<void>
}
