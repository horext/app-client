import type { UUID } from 'crypto'
import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '../interfaces/schedule'
import type { IScheduleCreate, IScheduleUpdate } from './domain-helpers'
import { DomainError } from './domain-error'

export class Schedule<
  T extends IBaseScheduleGenerate | IScheduleGenerate = IScheduleGenerate,
> {
  private constructor(private readonly snapshot: T) {}

  private static build<T extends IBaseScheduleGenerate | IScheduleGenerate>(
    input: T,
  ): Schedule<T> {
    if (!Number.isInteger(input.crossings) || input.crossings < 0)
      throw new DomainError(
        'invalid-limit',
        'Schedule crossings cannot be negative.',
        'crossings',
      )
    return new Schedule(structuredClone(input))
  }

  static create(input: IScheduleCreate): Schedule<IBaseScheduleGenerate> {
    return Schedule.build({
      scheduleSubjectKey: input.scheduleSubjectKey,
      schedulesSubject: structuredClone(input.schedulesSubject),
      crossings: input.crossings,
      events: structuredClone(input.events),
    })
  }

  static restore(snapshot: IScheduleGenerate): Schedule<IScheduleGenerate> {
    return Schedule.build(snapshot)
  }

  get id(): UUID {
    if (!('id' in this.snapshot))
      throw new Error('The entity has not been persisted.')
    return this.snapshot.id
  }

  get scheduleSubjectKey(): string {
    return this.snapshot.scheduleSubjectKey
  }

  update(
    this: Schedule<IScheduleGenerate>,
    input: IScheduleUpdate,
  ): Schedule<IScheduleGenerate> {
    return Schedule.build({
      ...this.snapshot,
      ...structuredClone(input),
    })
  }

  toSnapshot(): T {
    return structuredClone(this.snapshot)
  }
}
