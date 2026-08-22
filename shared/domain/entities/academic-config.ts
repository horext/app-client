import type {
  AcademicConfigId,
  IAcademicConfig,
  IAcademicConfigCreate,
  IAcademicConfigUpdate,
} from '../types/academic-config'
import type { IHourlyLoad } from '../types/hourly-load'

export class BaseAcademicConfig {
  protected _hourlyLoad: IHourlyLoad | null
  protected _externalId?: AcademicConfigId
  protected _revision?: number

  protected constructor(input: IAcademicConfigCreate) {
    this._hourlyLoad = structuredClone(input.hourlyLoad)
    this._externalId = input.externalId
    this._revision = input.revision
  }

  update(input: IAcademicConfigUpdate): this {
    if ('hourlyLoad' in input)
      this._hourlyLoad = structuredClone(input.hourlyLoad ?? null)
    if ('externalId' in input) this._externalId = input.externalId
    if ('revision' in input) this._revision = input.revision
    return this
  }

  get hourlyLoad(): IHourlyLoad | null {
    return this._hourlyLoad
  }
  get externalId(): AcademicConfigId | undefined {
    return this._externalId
  }
  get revision(): number | undefined {
    return this._revision
  }
}

export class AcademicConfig extends BaseAcademicConfig {
  private readonly _id: AcademicConfigId
  private readonly _createdAt: string
  private readonly _updatedAt: string
  private readonly _createdBy: string
  private readonly _updatedBy: string

  private constructor(input: IAcademicConfig) {
    super(input)
    this._id = input.id
    this._createdAt = input.createdAt
    this._updatedAt = input.updatedAt
    this._createdBy = input.createdBy
    this._updatedBy = input.updatedBy
  }

  static create(input: IAcademicConfigCreate): BaseAcademicConfig {
    return new BaseAcademicConfig(input)
  }
  static reconstitute(input: IAcademicConfig): AcademicConfig {
    return new AcademicConfig(input)
  }

  get id(): AcademicConfigId {
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
