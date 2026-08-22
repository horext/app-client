import type { PlannedSubject } from '~~/shared/domain'
import type { IPlannedSubject } from '~/interfaces/subject'

export function toPlannedSubjectDto(entity: PlannedSubject): IPlannedSubject {
  return {
    id: entity.id,
    subject: structuredClone(entity.subject),
    schedules: structuredClone(entity.schedules),
    color: entity.color,
  }
}
