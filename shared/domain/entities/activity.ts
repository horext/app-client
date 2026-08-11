import type { UUID } from 'crypto'
import type {
  IActivity,
  IBaseActivity,
  IActivityCreate,
  IActivityUpdate,
} from '../types/event'
import { validateSessions } from '../types/event'
import type { IEntitySnapshot } from './snapshot'

export class Activity<
  T extends IBaseActivity | IActivity = IActivity,
> implements IEntitySnapshot<T> {
  private constructor(private readonly snapshot: T) {}

  private static build<T extends IBaseActivity | IActivity>(
    snapshot: T,
  ): Activity<T> {
    return new Activity({
      ...snapshot,
      allowOverlap: snapshot.allowOverlap ?? false,
      sessions: validateSessions(snapshot.sessions),
    })
  }

  static create(input: IActivityCreate): Activity<IBaseActivity> {
    return Activity.build(input)
  }

  static restore(snapshot: IActivity): Activity<IActivity> {
    return Activity.build(snapshot)
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
    return Activity.build({
      ...this.snapshot,
      ...input,
      allowOverlap: input.allowOverlap ?? this.snapshot.allowOverlap,
      sessions: input.sessions ?? this.snapshot.sessions,
    })
  }

  toSnapshot(): T {
    return {
      ...this.snapshot,
      sessions: this.snapshot.sessions.map((session) => ({ ...session })),
    }
  }
}
