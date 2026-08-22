import type {
  IBasePlannedSubject,
  IPlannedSubject,
  IPlannedSubjectCreate,
  IPlannedSubjectUpdate,
  PlannedSubjectId,
} from '../types/subject'
import type { IEntitySnapshot } from './snapshot'

export class PlannedSubject<
  T extends IBasePlannedSubject | IPlannedSubject = IPlannedSubject,
> implements IEntitySnapshot<T> {
  private constructor(private readonly snapshot: T) {}

  private static build<T extends IBasePlannedSubject | IPlannedSubject>(
    input: T,
  ): PlannedSubject<T> {
    return new PlannedSubject(structuredClone(input))
  }

  static create(
    input: IPlannedSubjectCreate,
  ): PlannedSubject<IBasePlannedSubject> {
    return PlannedSubject.build(input)
  }

  static restore(snapshot: IPlannedSubject): PlannedSubject<IPlannedSubject> {
    return PlannedSubject.build(snapshot)
  }

  get id(): PlannedSubjectId {
    if (!('id' in this.snapshot))
      throw new Error('The entity has not been persisted.')
    return this.snapshot.id
  }

  update(
    this: PlannedSubject<IPlannedSubject>,
    input: IPlannedSubjectUpdate,
  ): PlannedSubject<IPlannedSubject> {
    return PlannedSubject.build({
      ...this.snapshot,
      subject: input.subject
        ? { ...this.snapshot.subject, ...input.subject }
        : this.snapshot.subject,
      schedules: input.schedules ?? this.snapshot.schedules,
      color: input.color ?? this.snapshot.color,
    })
  }

  toSnapshot(): T {
    return structuredClone(this.snapshot)
  }
}
