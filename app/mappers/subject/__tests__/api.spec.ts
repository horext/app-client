import { describe, expect, it } from 'vitest'
import type {
  IStudyPlanResponse,
  ISubjectStudyPlanResponse,
} from '~~/modules/apis/runtime/interfaces/subject'
import { toAppStudyPlan, toAppSubjectStudyPlan } from '../api'

const studyPlan = (
  organizationUnit: IStudyPlanResponse['organizationUnit'],
): IStudyPlanResponse => ({
  id: 1,
  fromDate: '2026-01-01',
  code: 'PLAN',
  name: 'Plan',
  organizationUnit,
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
})

describe('subject API mapper', () => {
  it('normalizes nullable organization labels to undefined', () => {
    expect(
      toAppStudyPlan(studyPlan({ id: 2, name: null, code: null }))
        .organizationUnit,
    ).toEqual({ id: 2, name: undefined, code: undefined })
  })

  it('preserves organization labels when the API returns them', () => {
    expect(
      toAppStudyPlan(studyPlan({ id: 2, name: 'Engineering', code: 'ENG' }))
        .organizationUnit,
    ).toEqual({ id: 2, name: 'Engineering', code: 'ENG' })
  })

  it('maps study-plan subjects and detaches their relationships', () => {
    const response: ISubjectStudyPlanResponse = {
      id: 3,
      course: { id: 'COURSE', name: 'Course' },
      type: { id: 4, name: 'Required', code: 'REQ' },
      studyPlan: studyPlan({ id: 2, name: null, code: null }),
      credits: 4,
      cycle: 1,
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      relationships: [{ subjectId: 3, relatedSubjectId: 5 }],
    }

    const result = toAppSubjectStudyPlan(response)

    expect(result.relationships).toEqual(response.relationships)
    expect(result.relationships).not.toBe(response.relationships)
    expect(result.relationships[0]).not.toBe(response.relationships[0])
  })
})
