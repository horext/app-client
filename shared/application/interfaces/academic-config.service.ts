import type {
  IAcademicConfig,
  IBaseAcademicConfig,
} from '#shared/domain/types/academic-config'

export interface IAcademicConfigService {
  get(userId: string): Promise<IAcademicConfig | undefined>
  create(
    userId: string,
    initial?: Partial<IBaseAcademicConfig>,
  ): Promise<IAcademicConfig>
  patch(
    userId: string,
    value: Partial<IBaseAcademicConfig>,
  ): Promise<IAcademicConfig>
}
