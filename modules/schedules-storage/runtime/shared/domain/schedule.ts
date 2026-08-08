import type { UUID } from 'crypto'
import type { IScheduleGenerate } from '../interfaces/schedule'
import type { IEntityMetadata } from '../interfaces/entity-metadata'
import type {
  IScheduleCreate,
  IScheduleUpdate,
  IdGenerator,
  Clock,
} from './domain-helpers'
import {
  created,
  currentTime,
  generateUuid,
  required,
  restored,
  updated,
} from './domain-helpers'

export class Schedule {
  private constructor(private readonly snapshot: IScheduleGenerate) {}

  static create(
    input: IScheduleCreate,
    generateId: IdGenerator = generateUuid,
    clock: Clock = currentTime,
  ): Schedule {
    return Schedule.build(generateId(), input, created(clock))
  }

  private static build(
    id: UUID,
    input: IScheduleCreate,
    metadata: IEntityMetadata,
  ): Schedule {
    return new Schedule({
      id,
      scheduleSubjectKey: required(
        input.scheduleSubjectKey,
        'scheduleSubjectKey',
      ),
      schedulesSubject: structuredClone(input.schedulesSubject),
      crossings: input.crossings,
      events: structuredClone(input.events),
      ...metadata,
    })
  }

  static restore(snapshot: IScheduleGenerate): Schedule {
    return Schedule.build(snapshot.id, snapshot, restored(snapshot))
  }

  get id(): UUID {
    return this.snapshot.id
  }

  get scheduleSubjectKey(): string {
    return this.snapshot.scheduleSubjectKey
  }

  update(input: IScheduleUpdate, clock: Clock = currentTime): Schedule {
    return Schedule.build(this.id, input, updated(this.snapshot, clock))
  }

  toSnapshot(): IScheduleGenerate {
    return structuredClone(this.snapshot)
  }
}
