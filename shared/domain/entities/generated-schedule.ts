import type {
  IBaseGeneratedSchedule,
  IGeneratedSchedule,
  IGeneratedScheduleCreate,
  IGeneratedScheduleUpdate,
  GeneratedScheduleId,
  GeneratedScheduleInput,
} from '../types/schedule'
import { DomainError } from '../errors/domain-error'
import type { IEntitySnapshot } from './snapshot'

export class GeneratedSchedule<
  T extends GeneratedScheduleInput = IGeneratedSchedule,
> implements IEntitySnapshot<T> {
  private constructor(private readonly snapshot: T) {}

  private static build<T extends GeneratedScheduleInput>(
    input: T,
  ): GeneratedSchedule<T> {
    if (!Number.isInteger(input.crossings) || input.crossings < 0)
      throw new DomainError(
        'invalid-limit',
        'GeneratedSchedule crossings cannot be negative.',
        'crossings',
      )
    return new GeneratedSchedule(structuredClone(input))
  }

  static create(
    input: IGeneratedScheduleCreate,
  ): GeneratedSchedule<IBaseGeneratedSchedule> {
    return GeneratedSchedule.build({
      ...(input.externalId ? { externalId: input.externalId } : {}),
      ...(input.revision !== undefined ? { revision: input.revision } : {}),
      scheduleSubjectKey: input.scheduleSubjectKey,
      schedulesSubject: structuredClone(input.schedulesSubject),
      crossings: input.crossings,
      events: structuredClone(input.events),
    })
  }

  static restore(
    snapshot: IGeneratedSchedule,
  ): GeneratedSchedule<IGeneratedSchedule> {
    return GeneratedSchedule.build(snapshot)
  }

  get id(): GeneratedScheduleId {
    if (!('id' in this.snapshot))
      throw new Error('The entity has not been persisted.')
    return this.snapshot.id
  }

  get scheduleSubjectKey(): string {
    return this.snapshot.scheduleSubjectKey
  }

  update(
    this: GeneratedSchedule<IGeneratedSchedule>,
    input: IGeneratedScheduleUpdate,
  ): GeneratedSchedule<IGeneratedSchedule> {
    return GeneratedSchedule.build({
      ...this.snapshot,
      ...structuredClone(input),
    })
  }

  toSnapshot(): T {
    return structuredClone(this.snapshot)
  }
}
