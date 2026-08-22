import { isProxy, reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import { GeneratedSchedule } from '~~/shared/domain'
import { makeUUID } from '~~/shared/domain/types/ids'
import type { GeneratedScheduleId } from '~~/shared/domain'
import type { IBaseGeneratedSchedule } from '~/interfaces/schedule'
import { toDomainSchedule } from '../domain'

function expectNoProxy(value: unknown): void {
  if (!value || typeof value !== 'object') return
  expect(isProxy(value)).toBe(false)
  Object.values(value).forEach(expectNoProxy)
}

function makeSchedule(): IBaseGeneratedSchedule {
  return {
    scheduleSubjectKey: '6',
    schedulesSubject: [
      {
        id: 5,
        section: { id: 'A' },
        scheduleSubject: { id: 6 },
        sessions: [],
        subject: {
          id: 1,
          course: { id: 'MAT101', name: 'Mathematics' },
          type: { id: 2, name: 'Required', code: 'REQ' },
          studyPlan: {
            id: 3,
            fromDate: '2026-01-01',
            code: 'ENG',
            organizationUnit: { id: 4 },
          },
          credits: 4,
          cycle: 1,
        },
      },
    ],
    crossings: 0,
    events: [
      {
        id: 'event-1',
        title: 'Mathematics',
        day: 1,
        color: '#3F51B5',
        type: 'CLASS',
        startTime: '08:00',
        endTime: '09:00',
      },
    ],
  }
}

describe('schedule domain mapper', () => {
  it('detaches a deeply reactive schedule before entity cloning', () => {
    const mapped = toDomainSchedule(reactive(makeSchedule()))

    expectNoProxy(mapped)
    expect(() => structuredClone(mapped)).not.toThrow()
    expect(() => GeneratedSchedule.create(mapped)).not.toThrow()
  })

  it('keeps a persisted schedule identity', () => {
    const id = makeUUID<GeneratedScheduleId>()
    const mapped = toDomainSchedule(reactive({ ...makeSchedule(), id }))

    expect(mapped.id).toBe(id)
    expectNoProxy(mapped)
  })
})
