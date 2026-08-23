import type {
  IPreferences,
  IPreferencesCreate,
  IPreferencesUpdate,
  PreferenceID,
} from '../types/preferences'
import type { Weekdays } from '../types/event'
import { DomainError } from '../errors/domain-error'
import { Audit } from './audit'

export class BasePreferences {
  protected _weekDays: Weekdays[]
  protected _crossings: number
  protected _maxGenerationHistory: number
  protected _externalId?: PreferenceID
  protected _revision?: number

  protected constructor(input: IPreferencesCreate) {
    BasePreferences.validate(input.maxGenerationHistory)
    this._weekDays = [...input.weekDays]
    this._crossings = input.crossings
    this._maxGenerationHistory = input.maxGenerationHistory
    this._externalId = input.externalId
    this._revision = input.revision
  }

  update(input: IPreferencesUpdate): this {
    const maxGenerationHistory =
      input.maxGenerationHistory ?? this._maxGenerationHistory
    BasePreferences.validate(maxGenerationHistory)
    if (input.weekDays !== undefined) this._weekDays = [...input.weekDays]
    if (input.crossings !== undefined) this._crossings = input.crossings
    this._maxGenerationHistory = maxGenerationHistory
    if ('externalId' in input) this._externalId = input.externalId
    if ('revision' in input) this._revision = input.revision
    return this
  }

  get weekDays(): Weekdays[] {
    return this._weekDays
  }
  get crossings(): number {
    return this._crossings
  }
  get maxGenerationHistory(): number {
    return this._maxGenerationHistory
  }
  get externalId(): PreferenceID | undefined {
    return this._externalId
  }
  get revision(): number | undefined {
    return this._revision
  }

  private static validate(maxGenerationHistory: number): void {
    if (maxGenerationHistory < 1)
      throw new DomainError(
        'invalid-limit',
        'ScheduleGeneration history must be positive.',
        'maxGenerationHistory',
      )
  }
}

export class Preferences extends BasePreferences {
  private readonly _id: PreferenceID
  private readonly _audit: Audit

  private constructor(input: IPreferences) {
    super(input)
    this._id = input.id
    this._audit = Audit.reconstitute(input)
  }

  static create(input: IPreferencesCreate): BasePreferences {
    return new BasePreferences(input)
  }
  static reconstitute(input: IPreferences): Preferences {
    return new Preferences(input)
  }

  get id(): PreferenceID {
    return this._id
  }
  get audit(): Audit {
    return this._audit
  }
}
