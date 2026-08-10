import type { UUID } from 'crypto'
import type {
  IBaseGenerationRecord,
  IGenerationRecord,
  IGenerationCreate,
  IGenerationUpdate,
} from '../types/generation-record'
import { DomainError } from '../errors/domain-error'

export class Generation<
  T extends IBaseGenerationRecord | IGenerationRecord = IGenerationRecord,
> {
  private constructor(private readonly snapshot: T) {}

  private static build<T extends IBaseGenerationRecord | IGenerationRecord>(
    input: T,
  ): Generation<T> {
    if (input.resultCount < 0)
      throw new DomainError(
        'invalid-limit',
        'Result count cannot be negative.',
        'resultCount',
      )
    return new Generation(structuredClone(input))
  }

  static create(input: IGenerationCreate): Generation<IBaseGenerationRecord> {
    return Generation.build(input)
  }

  static restore(snapshot: IGenerationRecord): Generation<IGenerationRecord> {
    return Generation.build(snapshot)
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
    return Generation.build({ ...this.snapshot, ...structuredClone(input) })
  }

  toSnapshot(): T {
    return structuredClone(this.snapshot)
  }
}
