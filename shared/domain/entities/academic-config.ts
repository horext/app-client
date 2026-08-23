import type {
  AcademicConfigId,
  IAcademicConfig,
  IAcademicConfigCreate,
  IAcademicConfigUpdate,
} from '../types/academic-config'
import { Audit } from './audit'
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
  private readonly _audit: Audit

  private constructor(input: IAcademicConfig) {
    super(input)
    this._id = input.id
    this._audit = Audit.reconstitute(input)
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
  get audit(): Audit {
    return this._audit
  }
}
