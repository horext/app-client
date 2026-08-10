import type {
  IAcademicConfig,
  IBaseAcademicConfig,
} from '#shared/domain/types/academic-config'

export interface IAcademicConfigService {
  getAcademicConfig(userId: string): Promise<IAcademicConfig | undefined>
  createAcademicConfig(
    userId: string,
    initial?: Partial<IBaseAcademicConfig>,
  ): Promise<IAcademicConfig>
  patch(
    userId: string,
    partial: Partial<IBaseAcademicConfig>,
  ): Promise<IAcademicConfig | undefined>
}
