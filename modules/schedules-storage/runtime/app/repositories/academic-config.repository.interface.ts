import type { IUserAcademicConfig } from '../../shared/interfaces/academic-config'

export interface IAcademicConfigRepository {
  get(): Promise<IUserAcademicConfig | undefined>
  save(config: IUserAcademicConfig): Promise<void>
}
