import type {
  ActivityID,
  IActivity,
  IActivityCreate,
  IActivitySession,
  IActivityUpdate,
} from '../types/event'
import { validateSessions } from '../types/event'

export class BaseActivity {
  protected _title: string
  protected _description?: string
  protected _location?: string
  protected _color: string
  protected _allowOverlap: boolean
  protected _sessions: IActivitySession[]
  protected _externalId?: ActivityID
  protected _revision?: number

  protected constructor(input: IActivityCreate) {
    this._title = input.title
    this._description = input.description
    this._location = input.location
    this._color = input.color
    this._allowOverlap = input.allowOverlap ?? false
    this._sessions = validateSessions(input.sessions)
    this._externalId = input.externalId
    this._revision = input.revision
  }

  update(input: IActivityUpdate): this {
    const sessions = validateSessions(input.sessions ?? this._sessions)
    if (input.title !== undefined) this._title = input.title
    if ('description' in input) this._description = input.description
    if ('location' in input) this._location = input.location
    if (input.color !== undefined) this._color = input.color
    if (input.allowOverlap !== undefined)
      this._allowOverlap = input.allowOverlap
    this._sessions = sessions
    if ('externalId' in input) this._externalId = input.externalId
    if ('revision' in input) this._revision = input.revision
    return this
  }

  get title(): string {
    return this._title
  }
  get description(): string | undefined {
    return this._description
  }
  get location(): string | undefined {
    return this._location
  }
  get color(): string {
    return this._color
  }
  get allowOverlap(): boolean {
    return this._allowOverlap
  }
  get sessions(): IActivitySession[] {
    return this._sessions
  }
  get externalId(): ActivityID | undefined {
    return this._externalId
  }
  get revision(): number | undefined {
    return this._revision
  }
}

export class Activity extends BaseActivity {
  private readonly _id: ActivityID
  private readonly _createdAt: string
  private readonly _updatedAt: string
  private readonly _createdBy: string
  private readonly _updatedBy: string

  private constructor(input: IActivity) {
    super(input)
    this._id = input.id
    this._createdAt = input.createdAt
    this._updatedAt = input.updatedAt
    this._createdBy = input.createdBy
    this._updatedBy = input.updatedBy
  }

  static create(input: IActivityCreate): BaseActivity {
    return new BaseActivity(input)
  }
  static reconstitute(input: IActivity): Activity {
    return new Activity(input)
  }

  get id(): ActivityID {
    return this._id
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
