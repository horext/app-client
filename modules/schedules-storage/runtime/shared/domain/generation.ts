import type { UUID } from 'crypto'
import type {
  IBaseGenerationRecord,
  IGenerationRecord,
} from '../interfaces/generation-record'
import type { IGenerationCreate, IGenerationUpdate } from './domain-helpers'
import { DomainError } from './domain-error'
import { validWeekday } from './domain-helpers'

export class Generation<
  T extends IBaseGenerationRecord | IGenerationRecord = IGenerationRecord,
> {
  private constructor(private readonly snapshot: T) {}

  static create(input: IGenerationCreate): Generation<IBaseGenerationRecord> {
    if (input.resultCount < 0)
      throw new DomainError(
        'invalid-limit',
        'Result count cannot be negative.',
        'resultCount',
      )
    if (!input.weekDays.every(validWeekday))
      throw new DomainError(
        'invalid-weekday',
        'A generation weekday is invalid.',
        'weekDays',
      )
    return new Generation(structuredClone(input))
  }

  static restore(snapshot: IGenerationRecord): Generation<IGenerationRecord> {
    return new Generation(structuredClone(snapshot))
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
    this: Generation<IGenerationRecord>,
    input: IGenerationUpdate,
  ): Generation<IGenerationRecord> {
    return new Generation({ ...this.snapshot, ...structuredClone(input) })
  }

  toSnapshot(): T {
    return structuredClone(this.snapshot)
  }
}
