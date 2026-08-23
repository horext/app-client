import type {
  IPlannedSubject,
  IPlannedSubjectCreate,
  IPlannedSubjectUpdate,
  ISubject,
  ISubjectSchedule,
  PlannedSubjectId,
} from '../types/subject'
import { Audit } from './audit'

export class BasePlannedSubject {
  protected _subject: ISubject
  protected _schedules: ISubjectSchedule[]
  protected _color: string
  protected _externalId?: PlannedSubjectId
  protected _revision?: number

  protected constructor(input: IPlannedSubjectCreate) {
    this._subject = structuredClone(input.subject)
    this._schedules = structuredClone(input.schedules)
    this._color = input.color
    this._externalId = input.externalId
    this._revision = input.revision
  }

  update(input: IPlannedSubjectUpdate): this {
    const subject = input.subject
      ? { ...this._subject, ...structuredClone(input.subject) }
      : this._subject
    const schedules = input.schedules
      ? structuredClone(input.schedules)
      : this._schedules
    this._subject = subject
    this._schedules = schedules
    if (input.color !== undefined) this._color = input.color
    if ('externalId' in input) this._externalId = input.externalId
    if ('revision' in input) this._revision = input.revision
    return this
  }

  get subject(): ISubject {
    return this._subject
  }
  get schedules(): ISubjectSchedule[] {
    return this._schedules
  }
  get color(): string {
    return this._color
  }
  get externalId(): PlannedSubjectId | undefined {
    return this._externalId
  }
  get revision(): number | undefined {
    return this._revision
  }
}

export class PlannedSubject extends BasePlannedSubject {
  private readonly _id: PlannedSubjectId
  private readonly _audit: Audit

  private constructor(input: IPlannedSubject) {
    super(input)
    this._id = input.id
    this._audit = Audit.reconstitute(input)
  }

  static create(input: IPlannedSubjectCreate): BasePlannedSubject {
    return new BasePlannedSubject(input)
  }
  static reconstitute(input: IPlannedSubject): PlannedSubject {
    return new PlannedSubject(input)
  }

  get id(): PlannedSubjectId {
    return this._id
  }
  get audit(): Audit {
    return this._audit
  }
}
