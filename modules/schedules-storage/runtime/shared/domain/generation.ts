import type { UUID } from 'crypto'
import type { IGenerationRecord } from '../interfaces/generation-record'
import type { IEntityMetadata } from '../interfaces/entity-metadata'
import type {
  IGenerationCreate,
  IGenerationUpdate,
  Clock,
  IdGenerator,
} from './domain-helpers'
import { DomainError } from './domain-error'
import {
  created,
  currentTime,
  generateUuid,
  restored,
  updated,
  validWeekday,
} from './domain-helpers'

export class Generation {
  private constructor(private readonly snapshot: IGenerationRecord) {}

  static create(
    input: IGenerationCreate,
    generateId: IdGenerator = generateUuid,
    clock: Clock = currentTime,
  ): Generation {
    return Generation.build(generateId(), input, created(clock))
  }

  private static build(
    id: UUID,
    input: IGenerationCreate,
    metadata: IEntityMetadata,
  ): Generation {
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
    return new Generation({ ...structuredClone(input), id, ...metadata })
  }

  static restore(snapshot: IGenerationRecord): Generation {
    return Generation.build(snapshot.id, snapshot, restored(snapshot))
  }

  get id(): UUID {
    return this.snapshot.id
  }

  get generatedAt(): string {
    return this.snapshot.generatedAt
  }

  get scheduleIds(): UUID[] {
    return [...this.snapshot.scheduleIds]
  }

  update(input: IGenerationUpdate, clock: Clock = currentTime): Generation {
    return Generation.build(this.id, input, updated(this.snapshot, clock))
  }

  toSnapshot(): IGenerationRecord {
    return structuredClone(this.snapshot)
  }
}
