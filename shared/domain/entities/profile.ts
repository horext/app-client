import type {
  IProfile,
  IProfileCreate,
  IProfileUpdate,
  ProfileId,
} from '../types/profile'

export class BaseProfile {
  protected _facultyId: number
  protected _specialityId: number
  protected _studyPlanId?: number
  protected _setupCompleted: boolean
  protected _externalId?: ProfileId
  protected _revision?: number

  protected constructor(input: IProfileCreate) {
    this._facultyId = input.facultyId
    this._specialityId = input.specialityId
    this._studyPlanId = input.studyPlanId
    this._setupCompleted = input.setupCompleted ?? false
    this._externalId = input.externalId
    this._revision = input.revision
  }

  update(input: IProfileUpdate): this {
    if (input.facultyId !== undefined) this._facultyId = input.facultyId
    if (input.specialityId !== undefined)
      this._specialityId = input.specialityId
    if ('studyPlanId' in input) this._studyPlanId = input.studyPlanId
    if (input.setupCompleted !== undefined)
      this._setupCompleted = input.setupCompleted
    if ('externalId' in input) this._externalId = input.externalId
    if ('revision' in input) this._revision = input.revision
    return this
  }

  get facultyId(): number {
    return this._facultyId
  }
  get specialityId(): number {
    return this._specialityId
  }
  get studyPlanId(): number | undefined {
    return this._studyPlanId
  }
  get setupCompleted(): boolean {
    return this._setupCompleted
  }
  get externalId(): ProfileId | undefined {
    return this._externalId
  }
  get revision(): number | undefined {
    return this._revision
  }
}

export class Profile extends BaseProfile {
  private readonly _id: ProfileId
  private readonly _createdAt: string
  private readonly _updatedAt: string
  private readonly _createdBy: string
  private readonly _updatedBy: string

  private constructor(input: IProfile) {
    super(input)
    this._id = input.id
    this._createdAt = input.createdAt
    this._updatedAt = input.updatedAt
    this._createdBy = input.createdBy
    this._updatedBy = input.updatedBy
  }

  static create(input: IProfileCreate): BaseProfile {
    return new BaseProfile(input)
  }

  static reconstitute(input: IProfile): Profile {
    return new Profile(input)
  }

  get id(): ProfileId {
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
