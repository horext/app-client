import type { UUID } from 'crypto'
import type { IAcademicConfig } from '#shared/domain/types/academic-config'
import type { IActivity, IBaseActivity } from '#shared/domain/types/event'
import type {
  IBaseScheduleGeneration,
  IScheduleGeneration,
} from '#shared/domain/types/schedule-generation'
import type { IPreferences } from '#shared/domain/types/preferences'
import type { IProfile } from '#shared/domain/types/profile'
import type {
  IBaseGeneratedSchedule,
  IGeneratedSchedule,
} from '#shared/domain/types/schedule'
import type {
  IBasePlannedSubject,
  IPlannedSubject,
} from '#shared/domain/types/subject'
import type {
  IAcademicConfigCreate,
  IPreferencesCreate,
  IProfileCreate,
} from '#shared/domain'
function map<T>(value: unknown): T {
  return value as T
}

export const parseUuid = (value: unknown): UUID => map(value)

export const parseBaseActivity = (value: unknown): IBaseActivity => map(value)
export const parseActivity = (value: unknown): IActivity => map(value)

export const parseBaseSubject = (value: unknown): IBasePlannedSubject =>
  map(value)
export const parseSubject = (value: unknown): IPlannedSubject => map(value)

export const parseBaseSchedule = (value: unknown): IBaseGeneratedSchedule =>
  map(value)
export const parseSchedule = (value: unknown): IGeneratedSchedule => map(value)

export const parseBaseGeneration = (value: unknown): IBaseScheduleGeneration =>
  map(value)
export const parseGeneration = (value: unknown): IScheduleGeneration =>
  map(value)

export const parseProfile = (value: unknown): IProfile => map(value)
export const parseProfileCreate = (value: unknown): IProfileCreate => map(value)

export const parsePreferences = (value: unknown): IPreferences => map(value)
export const parsePreferencesCreate = (value: unknown): IPreferencesCreate =>
  map(value)

export const parseAcademicConfig = (value: unknown): IAcademicConfig =>
  map(value)
export const parseAcademicConfigCreate = (
  value: unknown,
): IAcademicConfigCreate => map(value)
