import type { IAcademicConfigUpdate } from '#shared/domain/types/academic-config'
import type { AcademicConfig } from '#shared/domain'

export interface IAcademicConfigService {
  get(userId: string): Promise<AcademicConfig | undefined>
  create(
    userId: string,
    initial?: IAcademicConfigUpdate,
  ): Promise<AcademicConfig>
  patch(userId: string, value: IAcademicConfigUpdate): Promise<AcademicConfig>
}
