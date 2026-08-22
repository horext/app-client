import type { BasePlannedSubject, PlannedSubject } from '#shared/domain'
import type { PlannedSubjectId } from '#shared/domain/types/subject'

export interface ISubjectsRepository {
  findAll(userId: string): Promise<PlannedSubject[]>
  findById(
    userId: string,
    id: PlannedSubjectId,
  ): Promise<PlannedSubject | undefined>
  create(userId: string, subject: BasePlannedSubject): Promise<PlannedSubject>
  update(userId: string, subject: PlannedSubject): Promise<PlannedSubject>
  delete(
    userId: string,
    id: PlannedSubjectId,
    expectedRevision?: number,
  ): Promise<void>
}
