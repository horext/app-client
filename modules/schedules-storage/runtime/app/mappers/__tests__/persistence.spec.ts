import { describe, expect, it } from 'vitest'
import type { IAcademicConfig } from '#shared/domain/types/academic-config'
import type { IActivity } from '#shared/domain/types/event'
import type { IPreferences } from '#shared/domain/types/preferences'
import type { IProfile } from '#shared/domain/types/profile'
import type {
  IGeneratedSchedule,
  IScheduleFavorite,
} from '#shared/domain/types/schedule'
import type { IScheduleGeneration } from '#shared/domain/types/schedule-generation'
import type { IPlannedSubject } from '#shared/domain/types/subject'
import { makeUUID } from '~~/shared/domain/types/ids'
import {
  AcademicConfigPersistenceMapper,
  ActivityPersistenceMapper,
  GeneratedSchedulePersistenceMapper,
  PlannedSubjectPersistenceMapper,
  PreferencesPersistenceMapper,
  ProfilePersistenceMapper,
  ScheduleFavoritePersistenceMapper,
  ScheduleGenerationPersistenceMapper,
} from '../persistence'

const audit = {
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
  createdBy: 'user-1',
  updatedBy: 'user-2',
}

describe('persistence mappers', () => {
  it('round-trips a profile record', () => {
    const record: IProfile = {
      id: makeUUID(),
      facultyId: 1,
      specialityId: 2,
      studyPlanId: 3,
      setupCompleted: true,
      revision: 4,
      ...audit,
    }
    expect(
      ProfilePersistenceMapper.toRecord(
        ProfilePersistenceMapper.fromRecord(record),
      ),
    ).toEqual(record)
  })

  it('round-trips preferences with defensive collection mapping', () => {
    const record: IPreferences = {
      id: makeUUID(),
      weekDays: [1, 2, 3],
      crossings: 2,
      maxGenerationHistory: 10,
      revision: 2,
      ...audit,
    }
    const entity = PreferencesPersistenceMapper.fromRecord(record)
    const mapped = PreferencesPersistenceMapper.toRecord(entity)

    expect(mapped).toEqual(record)
    mapped.weekDays.push(4)
    expect(entity.weekDays).toEqual([1, 2, 3])
  })

  it('round-trips academic configuration', () => {
    const record: IAcademicConfig = {
      id: makeUUID(),
      hourlyLoad: null,
      revision: 1,
      ...audit,
    }
    expect(
      AcademicConfigPersistenceMapper.toRecord(
        AcademicConfigPersistenceMapper.fromRecord(record),
      ),
    ).toEqual(record)
  })

  it('round-trips an activity with sessions', () => {
    const record: IActivity = {
      id: makeUUID(),
      title: 'Study',
      description: 'Notes',
      color: '#112233',
      allowOverlap: false,
      sessions: [{ day: 1, startTime: '08:00', endTime: '09:00' }],
      revision: 3,
      ...audit,
    }
    expect(
      ActivityPersistenceMapper.toRecord(
        ActivityPersistenceMapper.fromRecord(record),
      ),
    ).toEqual(record)
  })

  it('round-trips a planned subject', () => {
    const record: IPlannedSubject = {
      id: makeUUID(),
      subject: {
        id: 1,
        course: { id: 'CS101', name: 'Computer Science' },
        type: { id: 1, name: 'Required', code: 'REQ' },
        studyPlan: {
          id: 1,
          fromDate: '2026-01-01',
          code: 'PLAN',
          organizationUnit: { id: 1 },
        },
        credits: 3,
        cycle: 1,
      },
      schedules: [],
      color: '#112233',
      revision: 1,
      ...audit,
    }
    expect(
      PlannedSubjectPersistenceMapper.toRecord(
        PlannedSubjectPersistenceMapper.fromRecord(record),
      ),
    ).toEqual(record)
  })

  it('round-trips a generated schedule', () => {
    const record: IGeneratedSchedule = {
      id: makeUUID(),
      scheduleSubjectKey: 'key',
      schedulesSubject: [],
      crossings: 0,
      events: [],
      revision: 1,
      ...audit,
    }
    expect(
      GeneratedSchedulePersistenceMapper.toRecord(
        GeneratedSchedulePersistenceMapper.fromRecord(record),
      ),
    ).toEqual(record)
  })

  it('round-trips a generation record', () => {
    const record: IScheduleGeneration = {
      id: makeUUID(),
      generatedAt: '2026-01-01T00:00:00.000Z',
      scheduleIds: [makeUUID()],
      resultCount: 1,
      occurrences: [],
      crossingsSetting: 0,
      weekDays: [1, 2, 3],
      hourlyLoadId: 1,
      revision: 1,
      ...audit,
    }
    expect(
      ScheduleGenerationPersistenceMapper.toRecord(
        ScheduleGenerationPersistenceMapper.fromRecord(record),
      ),
    ).toEqual(record)
  })

  it('round-trips a favorite record', () => {
    const record: IScheduleFavorite = {
      id: makeUUID(),
      revision: 1,
      ...audit,
    }
    expect(
      ScheduleFavoritePersistenceMapper.toRecord(
        ScheduleFavoritePersistenceMapper.fromRecord(record),
      ),
    ).toEqual(record)
  })
})
