import { describe, expect, it } from 'vitest'
import { isProxy, reactive } from 'vue'
import { SubjectSchedules } from '../subject-schedules'
import type { ISubject } from '~/interfaces/subject'

describe('SubjectSchedules.toCreateRequest', () => {
  it('converts a reactive subject into a structured-cloneable value', () => {
    const subject = reactive<ISubject>({
      id: 1,
      course: { id: 'CS101', name: 'Computer Science' },
      type: { id: 2, name: 'Required', code: 'R' },
      studyPlan: {
        id: 3,
        fromDate: '2026-01-01',
        code: 'PLAN-1',
        organizationUnit: { id: 4 },
      },
      credits: 4,
      cycle: 1,
    })
    const model = new SubjectSchedules(undefined, subject, [])

    const request = model.toCreateRequest()

    expect(isProxy(request.subject)).toBe(false)
    expect(isProxy(request.subject.course)).toBe(false)
    expect(() => structuredClone(request)).not.toThrow()
    expect(request.subject).toEqual(subject)
  })
})
