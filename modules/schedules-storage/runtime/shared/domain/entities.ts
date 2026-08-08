import type {
  IActivity,
  ISubjectSchedules,
  IScheduleGenerate,
  IGenerationRecord,
  IProfile,
  IPreferences,
  IAcademicConfig,
  IFavoriteSchedule,
} from '../domain-snapshots'
import type { Activity } from './activity'
import type { UserSubject } from './user-subject'
import type { Schedule } from './schedule'
import type { Generation } from './generation'
import type { Profile } from './profile'
import type { Preferences } from './preferences'
import type { AcademicConfig } from './academic-config'
import type { Favorite } from './favorite'

export type DomainEntity =
  | Activity
  | UserSubject
  | Schedule
  | Generation
  | Profile
  | Preferences
  | AcademicConfig
  | Favorite
export type DomainSnapshot =
  | IActivity
  | ISubjectSchedules
  | IScheduleGenerate
  | IGenerationRecord
  | IProfile
  | IPreferences
  | IAcademicConfig
  | IFavoriteSchedule
export type GenerationOccurrences =
  import('../interfaces/ocurrences').IIntersectionOccurrence[]
export type AcademicLoad = import('../interfaces/houly-load').IHourlyLoad

export * from './domain-helpers'
export * from './activity'
export * from './user-subject'
export * from './schedule'
export * from './generation'
export * from './profile'
export * from './preferences'
export * from './academic-config'
export * from './favorite'
