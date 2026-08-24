import type {
  AcademicConfig,
  Activity,
  BaseAcademicConfig,
  BaseActivity,
  BaseGeneratedSchedule,
  BasePlannedSubject,
  BasePreferences,
  BaseProfile,
  BaseScheduleGeneration,
  GeneratedSchedule,
  PlannedSubject,
  Preferences,
  Profile,
  ScheduleGeneration,
  BaseScheduleFavorite,
  ScheduleFavorite,
} from '#shared/domain'
import type { IAcademicConfig } from '#shared/domain/types/academic-config'
import type { IActivity } from '#shared/domain/types/event'
import type {
  IGeneratedSchedule,
  IScheduleFavorite,
} from '#shared/domain/types/schedule'
import type { IPlannedSubject } from '#shared/domain/types/subject'
import type { IPreferences } from '#shared/domain/types/preferences'
import type { IProfile } from '#shared/domain/types/profile'
import type { IScheduleGeneration } from '#shared/domain/types/schedule-generation'

const audit = (value: {
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}) => ({
  createdAt: value.createdAt,
  updatedAt: value.updatedAt,
  createdBy: value.createdBy,
  updatedBy: value.updatedBy,
})

export const ActivityMapper = {
  toCreate: (value: BaseActivity) => ({
    title: value.title,
    description: value.description,
    location: value.location,
    color: value.color,
    allowOverlap: value.allowOverlap,
    sessions: structuredClone(value.sessions),
    externalId: value.externalId,
    revision: value.revision,
  }),
  toRecord: (value: Activity): IActivity => ({
    ...ActivityMapper.toCreate(value),
    id: value.id,
    ...audit(value.audit),
  }),
}
export const AcademicConfigMapper = {
  toCreate: (value: BaseAcademicConfig) => ({
    hourlyLoad: structuredClone(value.hourlyLoad),
    externalId: value.externalId,
    revision: value.revision,
  }),
  toRecord: (value: AcademicConfig): IAcademicConfig => ({
    ...AcademicConfigMapper.toCreate(value),
    id: value.id,
    ...audit(value.audit),
  }),
  toUpdate: (value: AcademicConfig) => ({
    ...AcademicConfigMapper.toRecord(value),
  }),
}
export const PreferencesMapper = {
  toCreate: (value: BasePreferences) => ({
    weekDays: [...value.weekDays],
    crossings: value.crossings,
    maxGenerationHistory: value.maxGenerationHistory,
    externalId: value.externalId,
    revision: value.revision,
  }),
  toRecord: (value: Preferences): IPreferences => ({
    ...PreferencesMapper.toCreate(value),
    id: value.id,
    ...audit(value.audit),
  }),
}
export const ProfileMapper = {
  toCreate: (value: BaseProfile) => ({
    facultyId: value.facultyId,
    specialityId: value.specialityId,
    studyPlanId: value.studyPlanId,
    setupCompleted: value.setupCompleted,
    externalId: value.externalId,
    revision: value.revision,
  }),
  toRecord: (value: Profile): IProfile => ({
    ...ProfileMapper.toCreate(value),
    id: value.id,
    ...audit(value.audit),
  }),
}
export const GeneratedScheduleMapper = {
  toCreate: (value: BaseGeneratedSchedule) => ({
    scheduleSubjectKey: value.scheduleSubjectKey,
    schedulesSubject: structuredClone(value.schedulesSubject),
    crossings: value.crossings,
    events: structuredClone(value.events),
    externalId: value.externalId,
    revision: value.revision,
  }),
  toRecord: (value: GeneratedSchedule): IGeneratedSchedule => ({
    ...GeneratedScheduleMapper.toCreate(value),
    id: value.id,
    ...audit(value.audit),
  }),
}
export const PlannedSubjectMapper = {
  toCreate: (value: BasePlannedSubject) => ({
    subject: structuredClone(value.subject),
    schedules: structuredClone(value.schedules),
    color: value.color,
    externalId: value.externalId,
    revision: value.revision,
  }),
  toRecord: (value: PlannedSubject): IPlannedSubject => ({
    ...PlannedSubjectMapper.toCreate(value),
    id: value.id,
    ...audit(value.audit),
  }),
}
export const ScheduleGenerationMapper = {
  toCreate: (value: BaseScheduleGeneration) => ({
    generatedAt: value.generatedAt,
    scheduleIds: [...value.scheduleIds],
    resultCount: value.resultCount,
    occurrences: structuredClone(value.occurrences),
    crossingsSetting: value.crossingsSetting,
    weekDays: [...value.weekDays],
    hourlyLoadId: value.hourlyLoadId,
    externalId: value.externalId,
    revision: value.revision,
  }),
  toRecord: (value: ScheduleGeneration): IScheduleGeneration => ({
    ...ScheduleGenerationMapper.toCreate(value),
    id: value.id,
    ...audit(value.audit),
  }),
}
export const ScheduleFavoriteMapper = {
  toCreate: (value: BaseScheduleFavorite) => ({
    id: value.id,
    externalId: value.externalId,
    revision: value.revision,
  }),
  toRecord: (value: ScheduleFavorite): IScheduleFavorite => ({
    ...ScheduleFavoriteMapper.toCreate(value),
    ...audit(value.audit),
  }),
}
