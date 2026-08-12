import type {
  IBaseScheduleGenerate,
  IScheduleGenerate,
  IScheduleCreate,
  IScheduleUpdate,
  ScheduleGenerateId,
} from '../types/schedule'
import { DomainError } from '../errors/domain-error'
import type { IEntitySnapshot } from './snapshot'

export class Schedule<
  T extends IBaseScheduleGenerate | IScheduleGenerate = IScheduleGenerate,
> implements IEntitySnapshot<T> {
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
      ...(input.externalId ? { externalId: input.externalId } : {}),
      ...(input.revision !== undefined ? { revision: input.revision } : {}),
      scheduleSubjectKey: input.scheduleSubjectKey,
      schedulesSubject: structuredClone(input.schedulesSubject),
      crossings: input.crossings,
      events: structuredClone(input.events),
    })
  }

  static restore(snapshot: IScheduleGenerate): Schedule<IScheduleGenerate> {
    return Schedule.build(snapshot)
  }

  get id(): ScheduleGenerateId {
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
