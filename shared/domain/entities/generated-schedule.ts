import type {
  GeneratedScheduleId,
  IGeneratedSchedule,
  IGeneratedScheduleCreate,
  IGeneratedScheduleSubject,
  IGeneratedScheduleUpdate,
} from '../types/schedule'
import type { IEvent } from '../types/event'
import { DomainError } from '../errors/domain-error'
import { Audit } from './audit'

export class BaseGeneratedSchedule {
  protected _scheduleSubjectKey: string
  protected _schedulesSubject: IGeneratedScheduleSubject[]
  protected _crossings: number
  protected _events: IEvent[]
  protected _externalId?: GeneratedScheduleId
  protected _revision?: number

  protected constructor(input: IGeneratedScheduleCreate) {
    BaseGeneratedSchedule.validate(input.crossings)
    this._scheduleSubjectKey = input.scheduleSubjectKey
    this._schedulesSubject = structuredClone(input.schedulesSubject)
    this._crossings = input.crossings
    this._events = structuredClone(input.events)
    this._externalId = input.externalId
    this._revision = input.revision
  }

  update(input: IGeneratedScheduleUpdate): this {
    const crossings = input.crossings ?? this._crossings
    BaseGeneratedSchedule.validate(crossings)
    if (input.scheduleSubjectKey !== undefined)
      this._scheduleSubjectKey = input.scheduleSubjectKey
    if (input.schedulesSubject !== undefined)
      this._schedulesSubject = structuredClone(input.schedulesSubject)
    this._crossings = crossings
    if (input.events !== undefined) this._events = structuredClone(input.events)
    if ('externalId' in input) this._externalId = input.externalId
    if ('revision' in input) this._revision = input.revision
    return this
  }

  get scheduleSubjectKey(): string {
    return this._scheduleSubjectKey
  }
  get schedulesSubject(): IGeneratedScheduleSubject[] {
    return this._schedulesSubject
  }
  get crossings(): number {
    return this._crossings
  }
  get events(): IEvent[] {
    return this._events
  }
  get externalId(): GeneratedScheduleId | undefined {
    return this._externalId
  }
  get revision(): number | undefined {
    return this._revision
  }

  private static validate(crossings: number): void {
    if (!Number.isInteger(crossings) || crossings < 0)
      throw new DomainError(
        'invalid-limit',
        'GeneratedSchedule crossings cannot be negative.',
        'crossings',
      )
  }
}

export class GeneratedSchedule extends BaseGeneratedSchedule {
  private readonly _id: GeneratedScheduleId
  private readonly _audit: Audit

  private constructor(input: IGeneratedSchedule) {
    super(input)
    this._id = input.id
    this._audit = Audit.reconstitute(input)
  }

  static create(input: IGeneratedScheduleCreate): BaseGeneratedSchedule {
    return new BaseGeneratedSchedule(input)
  }
  static reconstitute(input: IGeneratedSchedule): GeneratedSchedule {
    return new GeneratedSchedule(input)
  }

  get id(): GeneratedScheduleId {
    return this._id
  }
  get audit(): Audit {
    return this._audit
  }
}
