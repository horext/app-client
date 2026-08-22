import type {
  IScheduleGeneration,
  IScheduleGenerationCreate,
  IScheduleGenerationUpdate,
  ScheduleGenerationId,
} from '../types/schedule-generation'
import type { GeneratedScheduleId } from '../types/schedule'
import type { IIntersectionOccurrence } from '../types/occurrences'
import type { Weekdays } from '../types/event'
import { DomainError } from '../errors/domain-error'

export class BaseScheduleGeneration {
  protected _generatedAt: string
  protected _scheduleIds: GeneratedScheduleId[]
  protected _resultCount: number
  protected _occurrences: IIntersectionOccurrence[]
  protected _crossingsSetting: number
  protected _weekDays: Weekdays[]
  protected _hourlyLoadId: number
  protected _externalId?: ScheduleGenerationId
  protected _revision?: number

  protected constructor(input: IScheduleGenerationCreate) {
    BaseScheduleGeneration.validate(input.resultCount)
    this._generatedAt = input.generatedAt
    this._scheduleIds = [...input.scheduleIds]
    this._resultCount = input.resultCount
    this._occurrences = structuredClone(input.occurrences)
    this._crossingsSetting = input.crossingsSetting
    this._weekDays = [...input.weekDays]
    this._hourlyLoadId = input.hourlyLoadId
    this._externalId = input.externalId
    this._revision = input.revision
  }

  update(input: IScheduleGenerationUpdate): this {
    const resultCount = input.resultCount ?? this._resultCount
    BaseScheduleGeneration.validate(resultCount)
    if (input.generatedAt !== undefined) this._generatedAt = input.generatedAt
    if (input.scheduleIds !== undefined)
      this._scheduleIds = [...input.scheduleIds]
    this._resultCount = resultCount
    if (input.occurrences !== undefined)
      this._occurrences = structuredClone(input.occurrences)
    if (input.crossingsSetting !== undefined)
      this._crossingsSetting = input.crossingsSetting
    if (input.weekDays !== undefined) this._weekDays = [...input.weekDays]
    if (input.hourlyLoadId !== undefined)
      this._hourlyLoadId = input.hourlyLoadId
    if ('externalId' in input) this._externalId = input.externalId
    if ('revision' in input) this._revision = input.revision
    return this
  }

  get generatedAt(): string {
    return this._generatedAt
  }
  get scheduleIds(): GeneratedScheduleId[] {
    return this._scheduleIds
  }
  get resultCount(): number {
    return this._resultCount
  }
  get occurrences(): IIntersectionOccurrence[] {
    return this._occurrences
  }
  get crossingsSetting(): number {
    return this._crossingsSetting
  }
  get weekDays(): Weekdays[] {
    return this._weekDays
  }
  get hourlyLoadId(): number {
    return this._hourlyLoadId
  }
  get externalId(): ScheduleGenerationId | undefined {
    return this._externalId
  }
  get revision(): number | undefined {
    return this._revision
  }

  private static validate(resultCount: number): void {
    if (resultCount < 0)
      throw new DomainError(
        'invalid-limit',
        'Result count cannot be negative.',
        'resultCount',
      )
  }
}

export class ScheduleGeneration extends BaseScheduleGeneration {
  private readonly _id: ScheduleGenerationId
  private readonly _createdAt: string
  private readonly _updatedAt: string
  private readonly _createdBy: string
  private readonly _updatedBy: string

  private constructor(input: IScheduleGeneration) {
    super(input)
    this._id = input.id
    this._createdAt = input.createdAt
    this._updatedAt = input.updatedAt
    this._createdBy = input.createdBy
    this._updatedBy = input.updatedBy
  }

  static create(input: IScheduleGenerationCreate): BaseScheduleGeneration {
    return new BaseScheduleGeneration(input)
  }
  static reconstitute(input: IScheduleGeneration): ScheduleGeneration {
    return new ScheduleGeneration(input)
  }

  get id(): ScheduleGenerationId {
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
