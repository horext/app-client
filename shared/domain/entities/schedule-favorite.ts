import type {
  GeneratedScheduleId,
  IScheduleFavorite,
  IScheduleFavoriteCreate,
} from '../types/schedule'
import { Audit } from './audit'

export class BaseScheduleFavorite {
  protected _id: GeneratedScheduleId
  protected _externalId?: GeneratedScheduleId
  protected _revision?: number

  protected constructor(input: IScheduleFavoriteCreate) {
    this._id = input.scheduleId
  }

  get id(): GeneratedScheduleId {
    return this._id
  }
  get externalId(): GeneratedScheduleId | undefined {
    return this._externalId
  }
  get revision(): number | undefined {
    return this._revision
  }
}

export class ScheduleFavorite extends BaseScheduleFavorite {
  private readonly _audit: Audit

  private constructor(input: IScheduleFavorite) {
    super({ scheduleId: input.id })
    this._externalId = input.externalId
    this._revision = input.revision
    this._audit = Audit.reconstitute(input)
  }

  static create(input: IScheduleFavoriteCreate): BaseScheduleFavorite {
    return new BaseScheduleFavorite(input)
  }
  static reconstitute(input: IScheduleFavorite): ScheduleFavorite {
    return new ScheduleFavorite(input)
  }

  get audit(): Audit {
    return this._audit
  }
}
