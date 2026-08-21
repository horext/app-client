import { isProxy, reactive } from 'vue'
import { describe, expect, it } from 'vitest'
import { UserSubject } from '~~/shared/domain'
import { makeUUID } from '~~/shared/domain/types/ids'
import type { SubjectScheduleId } from '~~/shared/domain'
import type { IBaseSubjectSchedules } from '~/interfaces/subject'
import { toDomainSubjectSchedules, toDomainSubjectUpdate } from '../domain'

function expectNoProxy(value: unknown): void {
  if (!value || typeof value !== 'object') return
  expect(isProxy(value)).toBe(false)
  Object.values(value).forEach(expectNoProxy)
}

function makeSubject(): IBaseSubjectSchedules {
  return {
    color: '#3F51B5',
    subject: {
      id: 1,
      course: { id: 'MAT101', name: 'Mathematics' },
      type: { id: 2, name: 'Required', code: 'REQ' },
      studyPlan: {
        id: 3,
        name: 'Engineering',
        fromDate: '2026-01-01',
        code: 'ENG',
        organizationUnit: { id: 4 },
      },
      credits: 4,
      cycle: 1,
    },
    schedules: [
      {
        id: 5,
        section: { id: 'A' },
        scheduleSubject: { id: 6 },
        sessions: [
          {
            id: 7,
            schedule: { id: 5 },
            classroom: { id: 8, code: 'R-1' },
            teacher: { id: 9, fullName: 'Teacher' },
            type: { id: 10, code: 'CLASS', name: 'Class' },
            day: 1,
            startTime: '08:00',
            endTime: '09:00',
          },
        ],
      },
    ],
  }
}

describe('subject domain mapper', () => {
  it('detaches a deeply reactive subject before entity cloning', () => {
    const mapped = toDomainSubjectSchedules(reactive(makeSubject()))

    expectNoProxy(mapped)
    expect(mapped.schedules[0]?.sessions[0]?.classroom.name).toBeUndefined()
    expect(() => structuredClone(mapped)).not.toThrow()
    expect(() => UserSubject.create(mapped)).not.toThrow()
  })

  it('projects a reactive patch without mutable identifiers', () => {
    const saved = toDomainSubjectSchedules(makeSubject())
    const id = makeUUID<SubjectScheduleId>()
    const entity = UserSubject.restore({
      ...saved,
      id,
      createdAt: '2026-08-21T00:00:00.000Z',
      updatedAt: '2026-08-21T00:00:00.000Z',
      createdBy: 'test-user',
      updatedBy: 'test-user',
    })
    const patch = toDomainSubjectUpdate(
      reactive({ id, subject: { ...makeSubject().subject, credits: 5 } }),
    )

    expect(patch.subject).not.toHaveProperty('id')
    expectNoProxy(patch)
    expect(() => entity.update(patch)).not.toThrow()
  })
})
