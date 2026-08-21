import { describe, expect, it } from 'vitest'
import { formatSearchLocation, getSubjectSearchScope } from '../subject-search'

describe('subject search helpers', () => {
  it.each([
    [null, null, { facultyId: 1 }],
    [2, null, { specialityId: 2 }],
    [2, 3, { studyPlanId: 3 }],
  ] as const)(
    'uses exactly one scope for speciality %s and plan %s',
    (specialityId, studyPlanId, expected) => {
      expect(getSubjectSearchScope(1, specialityId, studyPlanId)).toEqual(
        expected,
      )
    },
  )

  it('formats faculty, speciality, and plan locations', () => {
    expect(formatSearchLocation()).toBe('toda la facultad')
    expect(formatSearchLocation('Ingeniería')).toBe('Ingeniería')
    expect(formatSearchLocation('Ingeniería', 'Malla 2026')).toBe(
      'Ingeniería · Malla 2026',
    )
  })
})
