import type { AcademicConfig } from '../../shared/domain'
import type {
  IBaseAcademicConfig,
  IAcademicConfig,
} from '../../shared/interfaces/academic-config'

export interface IAcademicConfigRepository {
  get(userId: string): Promise<AcademicConfig<IAcademicConfig> | undefined>
  create(
    userId: string,
    config: AcademicConfig<IBaseAcademicConfig>,
  ): Promise<AcademicConfig<IAcademicConfig>>
  update(
    userId: string,
    config: AcademicConfig<IAcademicConfig>,
  ): Promise<AcademicConfig<IAcademicConfig>>
}
