import type {
  IBasePlannedSubject,
  IPlannedSubject,
  IPlannedSubjectUpdate,
  PlannedSubjectId,
} from '#shared/domain/types/subject'
import type { PlannedSubject } from '#shared/domain'

export interface ISubjectsService {
  getAll(userId: string): Promise<PlannedSubject<IPlannedSubject>[]>
  get(
    userId: string,
    id: PlannedSubjectId,
  ): Promise<PlannedSubject<IPlannedSubject> | undefined>
  create(
    userId: string,
    subject: IBasePlannedSubject,
  ): Promise<PlannedSubject<IPlannedSubject>>
  delete(
    userId: string,
    id: PlannedSubjectId,
    expectedRevision?: number,
  ): Promise<void>
  patch(
    userId: string,
    id: PlannedSubjectId,
    subject: IPlannedSubjectUpdate,
  ): Promise<PlannedSubject<IPlannedSubject>>
}
