import type { UUID } from 'crypto'
import type { IAcademicConfig } from '../interfaces/academic-config'
import type { IPreferences } from '../interfaces/preferences'
import type { IProfile } from '../interfaces/profile'
import type {
  IScheduleGenerate,
  IScheduleSubjectGenerate,
} from '../interfaces/schedule'
import type {
  IBaseSubjectSchedules,
  ISubjectSchedulesUpdate,
} from '../interfaces/subject'
import type { IActivitySession, Weekdays } from '../interfaces/event'
import type { IBaseGenerationRecord } from '../interfaces/generation-record'
import type { IEntityMetadata } from '../interfaces/entity-metadata'
import { DomainError } from './domain-error'

export interface IActivityCreate {
  title: string
  description?: string
  location?: string
  color: string
  allowOverlap?: boolean
  sessions: IActivitySession[]
}

export type IActivityUpdate = {
  [Key in keyof IActivityCreate]: IActivityCreate[Key]
}

export type IUserSubjectCreate = {
  [Key in keyof IBaseSubjectSchedules]: IBaseSubjectSchedules[Key]
}
export type IUserSubjectUpdate = {
  [Key in keyof ISubjectSchedulesUpdate]: ISubjectSchedulesUpdate[Key]
}

export interface IScheduleCreate {
  scheduleSubjectKey: string
  schedulesSubject: IScheduleSubjectGenerate[]
  crossings: number
  events: IScheduleGenerate['events']
}

export type IScheduleUpdate = {
  [Key in keyof IScheduleCreate]: IScheduleCreate[Key]
}

export type IGenerationCreate = {
  [Key in keyof IBaseGenerationRecord]: IBaseGenerationRecord[Key]
}
export type IGenerationUpdate = {
  [Key in keyof IBaseGenerationRecord]: IBaseGenerationRecord[Key]
}

export type IProfileCreate = Omit<
  IProfile,
  'id' | keyof IEntityMetadata | 'setupCompleted'
> & {
  setupCompleted?: boolean
}
export type IProfileUpdate = Partial<IProfileCreate>

export type IPreferencesCreate = Omit<
  IPreferences,
  'id' | keyof IEntityMetadata
>
export type IPreferencesUpdate = Partial<IPreferencesCreate>

export type IAcademicConfigCreate = Omit<
  IAcademicConfig,
  'id' | keyof IEntityMetadata
>
export type IAcademicConfigUpdate = Partial<IAcademicConfigCreate>

export interface IFavoriteCreate {
  scheduleId: UUID
}
export type IFavoriteUpdate = {
  [Key in keyof IFavoriteCreate]: IFavoriteCreate[Key]
}

export function validWeekday(value: number): value is Weekdays {
  return Number.isInteger(value) && value >= 0 && value <= 6
}

export function validateSessions(
  sessions: IActivitySession[],
): IActivitySession[] {
  return sessions.map((session, index) => {
    if (!validWeekday(session.day))
      throw new DomainError(
        'invalid-weekday',
        'The session weekday is invalid.',
        `sessions.${index}.day`,
      )
    if (session.startTime >= session.endTime)
      throw new DomainError(
        'invalid-time-range',
        'The session start time must be before its end time.',
        `sessions.${index}`,
      )
    return { ...session }
  })
}
