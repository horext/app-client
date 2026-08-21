import { describe, expect, it } from 'vitest'
import type { IScheduleSubjectResponse } from '~~/modules/apis/runtime/interfaces/schedule-subject'
import { toAppScheduleSubject } from '../api'

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
})
