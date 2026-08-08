import type { AcademicConfig } from '../../shared/domain'

export interface IAcademicConfigRepository {
  get(userId: string): Promise<AcademicConfig | undefined>
  create(userId: string, config: AcademicConfig): Promise<AcademicConfig>
  update(userId: string, config: AcademicConfig): Promise<AcademicConfig>
}
