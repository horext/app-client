import { bench, describe } from 'vitest'
import { getSchedules } from '../core'
import type { IBaseSubjectSchedules } from '~/interfaces/subject'
import type { IActivity } from '~/interfaces/event'
import type { UUID } from 'crypto'

function makeSubject(
  id: number,
  sessions: Array<{
    id: number
    day: number
    start: string
    end: string
    type?: string
  }>,
): IBaseSubjectSchedules {
  return {
    subject: {
      id,
      course: { id: `C${id}`, name: `Course ${id}` },
      credits: 3,
      cycle: null,
      studyPlan: {
        id: 1,
        code: 'SP',
        fromDate: '2020-01-01',
        organizationUnit: { id: 1 },
      },
      type: { id: 1, code: 'COURSE', name: 'Course' },
    },
    schedules: sessions.map((s, idx) => ({
      id: id * 100 + idx,
      section: { id: `S${id}-${idx}` },
      scheduleSubject: { id: id * 100 + idx },
      sessions: [
        {
          id: s.id,
          schedule: { id: id * 100 + idx },
          classroom: { id: 1, code: 'A101' },
          teacher: { id: 1, fullName: 'Teacher' },
          type: { id: 1, code: s.type ?? 'T' },
          day: s.day as 0 | 1 | 2 | 3 | 4 | 5 | 6,
          startTime: s.start,
          endTime: s.end,
        },
      ],
    })),
  }
}

function makeActivity(
  id: UUID,
  day: number,
  start: string,
  end: string,
): IActivity {
  return {
    id,
    title: `Act ${id}`,
    day: day as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    color: '#f00',
    type: 'MY_EVENT',
    category: 'MY_EVENT',
    startTime: start,
    endTime: end,
  }
}

const T = (h: number) => `${String(h).padStart(2, '0')}:00:00`

// ── fixtures ────────────────────────────────────────────────────────────────

// 3 subjects × 3 schedules = 27 combos, no conflicts
const small: IBaseSubjectSchedules[] = [1, 2, 3].map((id) =>
  makeSubject(
    id,
    [1, 2, 3].map((d) => ({
      id: id * 10 + d,
      day: d,
      start: T(8),
      end: T(10),
    })),
  ),
)

// 5 subjects × 4 schedules = 1 024 combos, no conflicts
const medium: IBaseSubjectSchedules[] = [1, 2, 3, 4, 5].map((id) =>
  makeSubject(
    id,
    [1, 2, 3, 4].map((d) => ({
      id: id * 10 + d,
      day: d,
      start: T(8 + (id % 3) * 2),
      end: T(10 + (id % 3) * 2),
    })),
  ),
)

// 6 subjects × 4 schedules = 4 096 combos, no conflicts
const large: IBaseSubjectSchedules[] = [1, 2, 3, 4, 5, 6].map((id) =>
  makeSubject(
    id,
    [1, 2, 3, 4].map((d) => ({
      id: id * 10 + d,
      day: d,
      start: T(8 + (id % 4) * 2),
      end: T(10 + (id % 4) * 2),
    })),
  ),
)

// 5 subjects × 4 schedules with many time conflicts → most combos rejected early
const withConflicts: IBaseSubjectSchedules[] = [1, 2, 3, 4, 5].map((id) =>
  makeSubject(
    id,
    [1, 2, 3, 4].map((d) => ({
      id: id * 10 + d,
      day: 1,
      start: T(8),
      end: T(10),
    })),
  ),
)

const activities: IActivity[] = [
  makeActivity('00000000-0000-0000-0000-000000000001' as UUID, 1, T(8), T(10)),
]

// ── benchmarks ──────────────────────────────────────────────────────────────

describe('small — 3×3 = 27 combos, no conflicts', () => {
  bench('getSchedules', () => {
    getSchedules(small, [], { crossingSubjects: 0 })
  })
})

describe('medium — 5×4 = 1 024 combos, no conflicts', () => {
  bench('getSchedules', () => {
    getSchedules(medium, [], { crossingSubjects: 0 })
  })
})

describe('large — 6×4 = 4 096 combos, no conflicts', () => {
  bench('getSchedules', () => {
    getSchedules(large, [], { crossingSubjects: 0 })
  })
})

describe('conflicts — 5×4 = 1 024 combos, all same-day overlap', () => {
  bench('getSchedules', () => {
    getSchedules(withConflicts, [], { crossingSubjects: 0 })
  })
})

describe('medium + 1 base activity', () => {
  bench('getSchedules', () => {
    getSchedules(medium, activities, { crossingSubjects: 0 })
  })
})
