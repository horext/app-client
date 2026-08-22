import type {
  IBaseScheduleFavorite,
  IScheduleFavorite,
  IScheduleFavoriteCreate,
  GeneratedScheduleId,
} from '../types/schedule'
import type { IEntitySnapshot } from './snapshot'

export class ScheduleFavorite<
  T extends IBaseScheduleFavorite | IScheduleFavorite = IScheduleFavorite,
> implements IEntitySnapshot<T> {
  private constructor(private readonly snapshot: T) {}

  static create(
    input: IScheduleFavoriteCreate,
  ): ScheduleFavorite<IBaseScheduleFavorite> {
    return new ScheduleFavorite({ id: input.scheduleId })
  }

  static restore(
    snapshot: IScheduleFavorite,
  ): ScheduleFavorite<IScheduleFavorite> {
    return new ScheduleFavorite({ ...snapshot })
  }

  get id(): GeneratedScheduleId {
    return this.snapshot.id
  }

  toSnapshot(): T {
    return { ...this.snapshot }
  }
}
