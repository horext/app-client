import type { UUID } from 'crypto'
import type { IAcademicConfig } from './academic-config'
import type { IPreferences } from './preferences'
import type { IProfile } from './profile'
import type { IScheduleGenerate, IScheduleSubjectGenerate } from './schedule'
import type { IBaseSubjectSchedules, ISubjectSchedulesUpdate } from './subject'
import type { IActivitySession } from './event'
import type { IBaseGenerationRecord } from './generation-record'
import type { IEntityMetadata } from './entity-metadata'
import { DomainError } from '../errors/domain-error'

export interface IActivityCreate {
  title: string
  description?: string
  location?: string
  color: string
  allowOverlap?: boolean
  sessions: IActivitySession[]
}

export type IActivityUpdate = Partial<IActivityCreate>

export type IUserSubjectCreate = {
  [Key in keyof IBaseSubjectSchedules]: IBaseSubjectSchedules[Key]
}
export type IUserSubjectUpdate = Partial<ISubjectSchedulesUpdate>

export interface IScheduleCreate {
  scheduleSubjectKey: string
  schedulesSubject: IScheduleSubjectGenerate[]
  crossings: number
  events: IScheduleGenerate['events']
}

export type IScheduleUpdate = Partial<IScheduleCreate>

export type IGenerationCreate = {
  [Key in keyof IBaseGenerationRecord]: IBaseGenerationRecord[Key]
}
export type IGenerationUpdate = Partial<IBaseGenerationRecord>

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

export function validateSessions(
  sessions: IActivitySession[],
): IActivitySession[] {
  return sessions.map((session, index) => {
    if (session.startTime >= session.endTime)
      throw new DomainError(
        'invalid-time-range',
        'The session start time must be before its end time.',
        `sessions.${index}`,
      )
    return { ...session }
  })
}
