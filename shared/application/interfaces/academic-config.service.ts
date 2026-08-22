import type {
  IAcademicConfig,
  IAcademicConfigUpdate,
} from '#shared/domain/types/academic-config'
import type { AcademicConfig } from '#shared/domain'

export interface IAcademicConfigService {
  get(userId: string): Promise<AcademicConfig<IAcademicConfig> | undefined>
  create(
    userId: string,
    initial?: IAcademicConfigUpdate,
  ): Promise<AcademicConfig<IAcademicConfig>>
  patch(
    userId: string,
    value: IAcademicConfigUpdate,
  ): Promise<AcademicConfig<IAcademicConfig>>
}
