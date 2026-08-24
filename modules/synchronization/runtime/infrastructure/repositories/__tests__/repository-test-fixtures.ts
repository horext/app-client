import { makeUUID } from '~~/shared/domain/types/ids'
import {
  AcademicConfig,
  Activity,
  GeneratedSchedule,
  ScheduleFavorite,
  ScheduleGeneration,
  Preferences,
  PlannedSubject,
  Profile,
} from '#shared/domain'
import type { IAcademicConfig } from '#shared/domain/types/academic-config'
import type { IActivity } from '#shared/domain/types/event'
import type { IScheduleGeneration } from '#shared/domain/types/schedule-generation'
import type { IPreferences } from '#shared/domain/types/preferences'
import type { IProfile } from '#shared/domain/types/profile'
import type {
  IScheduleFavorite,
  IGeneratedSchedule,
} from '#shared/domain/types/schedule'
import type { IPlannedSubject } from '#shared/domain/types/subject'

const timestamp = '2026-01-01T00:00:00.000Z'
const audit = () => ({
  createdAt: timestamp,
  updatedAt: timestamp,
  createdBy: 'user-1',
  updatedBy: 'user-1',
})

export function activity() {
  const snapshot: IActivity = {
    id: makeUUID(),
    title: 'Study',
    color: '#fff',
    allowOverlap: false,
    sessions: [],
    ...audit(),
  }
  return Activity.reconstitute(snapshot)
}

export function profile() {
  const snapshot: IProfile = {
    id: makeUUID(),
    facultyId: 1,
    specialityId: 2,
    setupCompleted: true,
    ...audit(),
  }
  return Profile.reconstitute(snapshot)
}

export function preferences() {
  const snapshot: IPreferences = {
    id: makeUUID(),
    weekDays: [1, 2, 3, 4, 5],
    crossings: 0,
    maxGenerationHistory: 5,
    ...audit(),
  }
  return Preferences.reconstitute(snapshot)
}

export function academicConfig() {
  const snapshot: IAcademicConfig = {
    id: makeUUID(),
    hourlyLoad: null,
    ...audit(),
  }
  return AcademicConfig.reconstitute(snapshot)
}

export function schedule() {
  const snapshot: IGeneratedSchedule = {
    id: makeUUID(),
    scheduleSubjectKey: 'key',
    schedulesSubject: [],
    crossings: 0,
    events: [],
    ...audit(),
  }
  return GeneratedSchedule.reconstitute(snapshot)
}

export function favorite() {
  const snapshot: IScheduleFavorite = { id: makeUUID(), ...audit() }
  return ScheduleFavorite.reconstitute(snapshot)
}

export function generation() {
  const snapshot: IScheduleGeneration = {
    id: makeUUID(),
    generatedAt: timestamp,
    scheduleIds: [],
    crossingsSetting: 0,
    weekDays: [1],
    hourlyLoadId: 1,
    resultCount: 0,
    occurrences: [],
    ...audit(),
  }
  return ScheduleGeneration.reconstitute(snapshot)
}

export function subject() {
  const snapshot: IPlannedSubject = {
    id: makeUUID(),
    subject: {
      id: 1,
      course: { id: 'course', name: 'Course' },
      type: { id: 1, name: 'Lecture', code: 'L' },
      studyPlan: {
        id: 1,
        fromDate: timestamp,
        code: 'P',
        organizationUnit: { id: 1 },
      },
      credits: 3,
      cycle: 1,
    },
    schedules: [],
    color: '#fff',
    ...audit(),
  }
  return PlannedSubject.reconstitute(snapshot)
}
