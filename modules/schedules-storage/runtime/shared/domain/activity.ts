import type { UUID } from 'crypto'
import type { IActivity } from '../interfaces/event'
import type { IEntityMetadata } from '../interfaces/entity-metadata'
import type {
  IActivityCreate,
  IActivityUpdate,
  IdGenerator,
  Clock,
} from './domain-helpers'
import {
  created,
  currentTime,
  generateUuid,
  optional,
  required,
  restored,
  updated,
  validateSessions,
} from './domain-helpers'

export class Activity {
  private constructor(private readonly snapshot: IActivity) {}

  static create(
    input: IActivityCreate,
    generateId: IdGenerator = generateUuid,
    clock: Clock = currentTime,
  ): Activity {
    return Activity.build(generateId(), input, created(clock))
  }

  private static build(
    id: UUID,
    input: IActivityCreate,
    metadata: IEntityMetadata,
  ): Activity {
    return new Activity({
      id,
      title: required(input.title, 'title'),
      description: optional(input.description),
      location: optional(input.location),
      color: required(input.color, 'color'),
      allowOverlap: input.allowOverlap ?? false,
      sessions: validateSessions(input.sessions),
      category: 'MY_EVENT',
      type: 'MY_EVENT',
      ...metadata,
    })
  }

  static restore(snapshot: IActivity): Activity {
    return Activity.build(snapshot.id, snapshot, restored(snapshot))
  }

  get id(): UUID {
    return this.snapshot.id
  }

  update(input: IActivityUpdate, clock: Clock = currentTime): Activity {
    return Activity.build(this.id, input, updated(this.snapshot, clock))
  }

  toSnapshot(): IActivity {
    return {
      ...this.snapshot,
      sessions: this.snapshot.sessions.map((x) => ({ ...x })),
    }
  }
}
