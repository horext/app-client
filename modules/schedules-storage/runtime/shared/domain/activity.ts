import type { UUID } from 'crypto'
import type { IActivity, IBaseActivity } from '../interfaces/event'
import type { IActivityCreate, IActivityUpdate } from './domain-helpers'
import { validateSessions } from './domain-helpers'

export class Activity<T extends IBaseActivity | IActivity = IActivity> {
  private constructor(private readonly snapshot: T) {}

  static create(input: IActivityCreate): Activity<IBaseActivity> {
    return new Activity({
      title: input.title,
      description: input.description,
      location: input.location,
      color: input.color,
      allowOverlap: input.allowOverlap ?? false,
      sessions: validateSessions(input.sessions),
      category: 'MY_EVENT',
      type: 'MY_EVENT',
    })
  }

  static restore(snapshot: IActivity): Activity<IActivity> {
    return new Activity({
      ...snapshot,
      sessions: validateSessions(snapshot.sessions),
    })
  }

  get id(): UUID {
    if (!('id' in this.snapshot))
      throw new Error('The entity has not been persisted.')
    return this.snapshot.id
  }

  update(
    this: Activity<IActivity>,
    input: IActivityUpdate,
  ): Activity<IActivity> {
    return new Activity({
      ...this.snapshot,
      ...input,
      allowOverlap: input.allowOverlap ?? false,
      sessions: validateSessions(input.sessions),
    })
  }

  toSnapshot(): T {
    return {
      ...this.snapshot,
      sessions: this.snapshot.sessions.map((session) => ({ ...session })),
    }
  }
}
