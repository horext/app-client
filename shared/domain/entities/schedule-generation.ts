import type { UUID } from 'crypto'
import type {
  IBaseScheduleGeneration,
  IScheduleGeneration,
  IScheduleGenerationCreate,
  IScheduleGenerationUpdate,
} from '../types/schedule-generation'
import { DomainError } from '../errors/domain-error'
import type { IEntitySnapshot } from './snapshot'

export class ScheduleGeneration<
  T extends IBaseScheduleGeneration | IScheduleGeneration = IScheduleGeneration,
> implements IEntitySnapshot<T> {
  private constructor(private readonly snapshot: T) {}

  private static build<T extends IBaseScheduleGeneration | IScheduleGeneration>(
    input: T,
  ): ScheduleGeneration<T> {
    if (input.resultCount < 0)
      throw new DomainError(
        'invalid-limit',
        'Result count cannot be negative.',
        'resultCount',
      )
    return new ScheduleGeneration(structuredClone(input))
  }

  static create(
    input: IScheduleGenerationCreate,
  ): ScheduleGeneration<IBaseScheduleGeneration> {
    return ScheduleGeneration.build(input)
  }

  static restore(
    snapshot: IScheduleGeneration,
  ): ScheduleGeneration<IScheduleGeneration> {
    return ScheduleGeneration.build(snapshot)
  }

  get id(): UUID {
    if (!('id' in this.snapshot))
      throw new Error('The entity has not been persisted.')
    return this.snapshot.id
  }

  get generatedAt(): string {
    return this.snapshot.generatedAt
  }
  get scheduleIds(): UUID[] {
    return [...this.snapshot.scheduleIds]
  }

  update(
    this: ScheduleGeneration<IScheduleGeneration>,
    input: IScheduleGenerationUpdate,
  ): ScheduleGeneration<IScheduleGeneration> {
    return ScheduleGeneration.build({
      ...this.snapshot,
      ...structuredClone(input),
    })
  }

  toSnapshot(): T {
    return structuredClone(this.snapshot)
  }
}
