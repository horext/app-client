import type { UUID } from 'crypto'
import type {
  IBaseSubjectSchedules,
  ISubjectSchedules,
} from '../interfaces/subject'
import type { IUserSubjectCreate, IUserSubjectUpdate } from './domain-helpers'
import { DomainError } from './domain-error'

export class UserSubject<
  T extends IBaseSubjectSchedules | ISubjectSchedules = ISubjectSchedules,
> {
  private constructor(private readonly snapshot: T) {}

  static create(input: IUserSubjectCreate): UserSubject<IBaseSubjectSchedules> {
    if (!input.subject || !Number.isFinite(input.subject.id))
      throw new DomainError(
        'invalid-reference',
        'The subject is invalid.',
        'subject',
      )
    return new UserSubject(input)
  }

  static restore(snapshot: ISubjectSchedules): UserSubject<ISubjectSchedules> {
    return new UserSubject(structuredClone(snapshot))
  }

  get id(): UUID {
    if (!('id' in this.snapshot))
      throw new Error('The entity has not been persisted.')
    return this.snapshot.id
  }

  update(
    this: UserSubject<ISubjectSchedules>,
    input: IUserSubjectUpdate,
  ): UserSubject<ISubjectSchedules> {
    return new UserSubject({
      ...this.snapshot,
      schedules: input.schedules ?? this.snapshot.schedules,
      color: input.color ?? this.snapshot.color,
    })
  }

  toSnapshot(): T {
    return structuredClone(this.snapshot)
  }
}
