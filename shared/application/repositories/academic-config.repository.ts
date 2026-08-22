import type { AcademicConfig, BaseAcademicConfig } from '#shared/domain'

export interface IAcademicConfigRepository {
  get(userId: string): Promise<AcademicConfig | undefined>
  create(userId: string, config: BaseAcademicConfig): Promise<AcademicConfig>
  update(userId: string, config: AcademicConfig): Promise<AcademicConfig>
}
