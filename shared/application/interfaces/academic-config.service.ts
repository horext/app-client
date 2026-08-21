import type {
  IAcademicConfig,
  IAcademicConfigUpdate,
} from '#shared/domain/types/academic-config'

export interface IAcademicConfigService {
  get(userId: string): Promise<IAcademicConfig | undefined>
  create(
    userId: string,
    initial?: IAcademicConfigUpdate,
  ): Promise<IAcademicConfig>
  patch(userId: string, value: IAcademicConfigUpdate): Promise<IAcademicConfig>
}
