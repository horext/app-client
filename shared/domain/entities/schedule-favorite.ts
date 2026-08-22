import type {
  GeneratedScheduleId,
  IScheduleFavorite,
  IScheduleFavoriteCreate,
} from '../types/schedule'

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
  private readonly _createdAt: string
  private readonly _updatedAt: string
  private readonly _createdBy: string
  private readonly _updatedBy: string

  private constructor(input: IScheduleFavorite) {
    super({ scheduleId: input.id })
    this._externalId = input.externalId
    this._revision = input.revision
    this._createdAt = input.createdAt
    this._updatedAt = input.updatedAt
    this._createdBy = input.createdBy
    this._updatedBy = input.updatedBy
  }

  static create(input: IScheduleFavoriteCreate): BaseScheduleFavorite {
    return new BaseScheduleFavorite(input)
  }
  static reconstitute(input: IScheduleFavorite): ScheduleFavorite {
    return new ScheduleFavorite(input)
  }

  get createdAt(): string {
    return this._createdAt
  }
  get updatedAt(): string {
    return this._updatedAt
  }
  get createdBy(): string {
    return this._createdBy
  }
  get updatedBy(): string {
    return this._updatedBy
  }
}
