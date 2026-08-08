import type { UUID } from 'crypto'
import type { IFavoriteSchedule } from '../interfaces/schedule'
import type { IFavoriteCreate, IFavoriteUpdate, Clock } from './domain-helpers'
import { created, currentTime, restored, updated } from './domain-helpers'

export class Favorite {
  private constructor(private readonly snapshot: IFavoriteSchedule) {}

  static create(input: IFavoriteCreate, clock: Clock = currentTime): Favorite {
    return new Favorite({ id: input.scheduleId, ...created(clock) })
  }

  static restore(snapshot: IFavoriteSchedule): Favorite {
    return new Favorite({ ...snapshot, ...restored(snapshot) })
  }

  get scheduleId(): UUID {
    return this.snapshot.id
  }

  update(input: IFavoriteUpdate, clock: Clock = currentTime): Favorite {
    return new Favorite({
      id: input.scheduleId,
      ...updated(this.snapshot, clock),
    })
  }

  toSnapshot(): IFavoriteSchedule {
    return { ...this.snapshot }
  }
}
