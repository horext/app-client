import type { UUID } from 'crypto'
import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
} from '../interfaces/schedule'
import type { IScheduleCreate, IScheduleUpdate } from './domain-helpers'

export class Schedule<
  T extends IBaseScheduleGenerate | IScheduleGenerate = IScheduleGenerate,
> {
  private constructor(private readonly snapshot: T) {}

  static create(input: IScheduleCreate): Schedule<IBaseScheduleGenerate> {
    return new Schedule({
      scheduleSubjectKey: input.scheduleSubjectKey,
      schedulesSubject: structuredClone(input.schedulesSubject),
      crossings: input.crossings,
      events: structuredClone(input.events),
    })
  }

  static restore(snapshot: IScheduleGenerate): Schedule<IScheduleGenerate> {
    return new Schedule(structuredClone(snapshot))
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
    return new Schedule({
      ...this.snapshot,
      ...structuredClone(input),
    })
  }

  toSnapshot(): T {
    return structuredClone(this.snapshot)
  }
}
