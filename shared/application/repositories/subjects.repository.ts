import type { PlannedSubject } from '#shared/domain'
import type {
  IBasePlannedSubject,
  IPlannedSubject,
  PlannedSubjectId,
} from '#shared/domain/types/subject'

export interface ISubjectsRepository {
  findAll(userId: string): Promise<PlannedSubject[]>
  findById(
    userId: string,
    id: PlannedSubjectId,
  ): Promise<PlannedSubject | undefined>
  create(
    userId: string,
    subject: PlannedSubject<IBasePlannedSubject>,
  ): Promise<PlannedSubject<IPlannedSubject>>
  update(
    userId: string,
    subject: PlannedSubject<IPlannedSubject>,
  ): Promise<PlannedSubject<IPlannedSubject>>
  delete(
    userId: string,
    id: PlannedSubjectId,
    expectedRevision?: number,
  ): Promise<void>
}
