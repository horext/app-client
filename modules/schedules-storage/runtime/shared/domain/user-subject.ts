import type { UUID } from 'crypto'
import type { ISubjectSchedules } from '../interfaces/subject'
import type { IEntityMetadata } from '../interfaces/entity-metadata'
import type {
  IUserSubjectCreate,
  IUserSubjectUpdate,
  IdGenerator,
  Clock,
} from './domain-helpers'
import { DomainError } from './domain-error'
import {
  created,
  currentTime,
  generateUuid,
  optional,
  restored,
  updated,
} from './domain-helpers'

export class UserSubject {
  private constructor(private readonly snapshot: ISubjectSchedules) {}

  static create(
    input: IUserSubjectCreate,
    generateId: IdGenerator = generateUuid,
    clock: Clock = currentTime,
  ): UserSubject {
    return UserSubject.build(generateId(), input, created(clock))
  }

  private static build(
    id: UUID,
    input: IUserSubjectCreate,
    metadata: IEntityMetadata,
  ): UserSubject {
    if (!input.subject || !Number.isFinite(input.subject.id))
      throw new DomainError(
        'invalid-reference',
        'The subject is invalid.',
        'subject',
      )
    return new UserSubject({
      id,
      subject: input.subject,
      schedules: input.schedules,
      color: optional(input.color),
      ...metadata,
    })
  }

  static restore(snapshot: ISubjectSchedules): UserSubject {
    return UserSubject.build(snapshot.id, snapshot, restored(snapshot))
  }

  get id(): UUID {
    return this.snapshot.id
  }

  update(input: IUserSubjectUpdate, clock: Clock = currentTime): UserSubject {
    return UserSubject.build(
      this.id,
      {
        subject: this.snapshot.subject,
        schedules: input.schedules ?? this.snapshot.schedules,
        color: input.color ?? this.snapshot.color,
      },
      updated(this.snapshot, clock),
    )
  }

  toSnapshot(): ISubjectSchedules {
    return structuredClone(this.snapshot)
  }
}
