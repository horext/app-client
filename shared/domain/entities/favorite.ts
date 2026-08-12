import type {
  IBaseFavoriteSchedule,
  IFavoriteSchedule,
  IFavoriteCreate,
  ScheduleGenerateId,
} from '../types/schedule'
import type { IEntitySnapshot } from './snapshot'

export class Favorite<
  T extends IBaseFavoriteSchedule | IFavoriteSchedule = IFavoriteSchedule,
> implements IEntitySnapshot<T> {
  private constructor(private readonly snapshot: T) {}

  static create(input: IFavoriteCreate): Favorite<IBaseFavoriteSchedule> {
    return new Favorite({ id: input.scheduleId })
  }

  static restore(snapshot: IFavoriteSchedule): Favorite<IFavoriteSchedule> {
    return new Favorite({ ...snapshot })
  }

  get id(): ScheduleGenerateId {
    return this.snapshot.id
  }

  toSnapshot(): T {
    return { ...this.snapshot }
  }
}
