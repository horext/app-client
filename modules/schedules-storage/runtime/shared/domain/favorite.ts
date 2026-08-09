import type { UUID } from 'crypto'
import type {
  IBaseFavoriteSchedule,
  IFavoriteSchedule,
} from '../interfaces/schedule'
import type { IFavoriteCreate, IFavoriteUpdate } from './domain-helpers'

export class Favorite<
  T extends IBaseFavoriteSchedule | IFavoriteSchedule = IFavoriteSchedule,
> {
  private constructor(private readonly snapshot: T) {}

  static create(input: IFavoriteCreate): Favorite<IBaseFavoriteSchedule> {
    return new Favorite({ id: input.scheduleId })
  }

  static restore(snapshot: IFavoriteSchedule): Favorite<IFavoriteSchedule> {
    return new Favorite({ ...snapshot })
  }

  get scheduleId(): UUID {
    return this.snapshot.id
  }

  update(input: IFavoriteUpdate): Favorite<IBaseFavoriteSchedule> {
    return Favorite.create(input)
  }

  toSnapshot(): T {
    return { ...this.snapshot }
  }
}
