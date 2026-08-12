import type {
  IBaseSubjectSchedules,
  ISubjectSchedules,
  IUserSubjectCreate,
  IUserSubjectUpdate,
  SubjectScheduleId,
} from '../types/subject'
import type { IEntitySnapshot } from './snapshot'

export class UserSubject<
  T extends IBaseSubjectSchedules | ISubjectSchedules = ISubjectSchedules,
> implements IEntitySnapshot<T> {
  private constructor(private readonly snapshot: T) {}

  private static build<T extends IBaseSubjectSchedules | ISubjectSchedules>(
    input: T,
  ): UserSubject<T> {
    return new UserSubject(structuredClone(input))
  }

  static create(input: IUserSubjectCreate): UserSubject<IBaseSubjectSchedules> {
    return UserSubject.build(input)
  }

  static restore(snapshot: ISubjectSchedules): UserSubject<ISubjectSchedules> {
    return UserSubject.build(snapshot)
  }

  get id(): SubjectScheduleId {
    if (!('id' in this.snapshot))
      throw new Error('The entity has not been persisted.')
    return this.snapshot.id
  }

  update(
    this: UserSubject<ISubjectSchedules>,
    input: IUserSubjectUpdate,
  ): UserSubject<ISubjectSchedules> {
    return UserSubject.build({
      ...this.snapshot,
      schedules: input.schedules ?? this.snapshot.schedules,
      color: input.color ?? this.snapshot.color,
    })
  }

  toSnapshot(): T {
    return structuredClone(this.snapshot)
  }
}
