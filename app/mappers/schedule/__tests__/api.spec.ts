import { describe, expect, it } from 'vitest'
import type {
  IScheduleSubjectDetailResponse,
  IScheduleSubjectResponse,
} from '~~/modules/apis/runtime/interfaces/schedule-subject'
import { toAppScheduleSubject, toAppScheduleSubjectDetail } from '../api'

describe('schedule API mapper', () => {
  it('normalizes a nullable classroom name to undefined', () => {
    const response: IScheduleSubjectResponse = {
      id: 40,
      subject: { id: 10 },
      hourlyLoad: { id: 50 },
      schedule: {
        id: 60,
        section: { id: 'A' },
        sessions: [
          {
            id: 70,
            schedule: { id: 60 },
            classroom: { id: 80, code: 'R-1', name: null },
            teacher: { id: 90, fullName: 'Teacher' },
            type: { id: 100, code: 'CLASS' },
            day: 1,
            startTime: '08:00',
            endTime: '09:00',
          },
        ],
      },
    }

    const result = toAppScheduleSubject(response)

    expect(result.schedule.sessions[0]?.classroom.name).toBeUndefined()
  })

  it('adds the complete subject to the freshly mapped schedule detail', () => {
    const response: IScheduleSubjectDetailResponse = {
      id: 40,
      subject: {
        id: 10,
        course: { id: 'MAT101', name: 'Mathematics' },
        type: { id: 20, name: 'Required', code: 'REQ' },
        studyPlan: {
          id: 30,
          fromDate: '2026-01-01',
          code: 'ENG',
          name: 'Engineering',
          organizationUnit: { id: 31, name: null, code: null },
          createdAt: '2026-01-01',
          updatedAt: '2026-01-01',
        },
        credits: 4,
        cycle: 1,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      hourlyLoad: { id: 50 },
      schedule: {
        id: 60,
        section: { id: 'A' },
        sessions: [
          {
            id: 70,
            schedule: { id: 60 },
            classroom: { id: 80, code: 'R-1', name: null },
            teacher: { id: 90, fullName: 'Teacher' },
            type: { id: 100, code: 'CLASS' },
            day: 1,
            startTime: '08:00',
            endTime: '09:00',
          },
        ],
      },
    }

    const result = toAppScheduleSubjectDetail(response)

    expect(result.subject).toBe(response.subject)
    expect(result.schedule.sessions[0]?.classroom.name).toBeUndefined()
  })
})
