import { bench, describe } from 'vitest'
import { getSchedules } from '../core'
import type { ScheduleOptions } from '../core'
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

// 9 subjects × 3-4 schedules each ≈ 82 944 raw combos, several conflicts
// Mirrors a realistic semester: mixed time slots across Mon-Fri, some overlap
const large: IBaseSubjectSchedules[] = [
  // ── 4-section subjects ───────────────────────────────────────────────────
  makeSubject(1, [
    { id: 1001, day: 1, start: T(8),  end: T(10) },
    { id: 1002, day: 2, start: T(10), end: T(12) },
    { id: 1003, day: 3, start: T(8),  end: T(10) },
    { id: 1004, day: 4, start: T(14), end: T(16) },
  ]),
  makeSubject(2, [
    { id: 2001, day: 1, start: T(10), end: T(12) },
    { id: 2002, day: 2, start: T(8),  end: T(10) },
    { id: 2003, day: 3, start: T(14), end: T(16) },
    { id: 2004, day: 5, start: T(8),  end: T(10) },
  ]),
  makeSubject(3, [
    { id: 3001, day: 1, start: T(8),  end: T(10) }, // conflicts s1-1001
    { id: 3002, day: 2, start: T(12), end: T(14) },
    { id: 3003, day: 4, start: T(10), end: T(12) },
    { id: 3004, day: 5, start: T(14), end: T(16) },
  ]),
  makeSubject(4, [
    { id: 4001, day: 1, start: T(14), end: T(16) },
    { id: 4002, day: 3, start: T(10), end: T(12) },
    { id: 4003, day: 4, start: T(8),  end: T(10) },
    { id: 4004, day: 5, start: T(10), end: T(12) },
  ]),
  makeSubject(5, [
    { id: 5001, day: 2, start: T(10), end: T(12) }, // conflicts s1-1002
    { id: 5002, day: 3, start: T(16), end: T(18) },
    { id: 5003, day: 4, start: T(12), end: T(14) },
    { id: 5004, day: 5, start: T(16), end: T(18) },
  ]),
  // ── 3-section subjects ───────────────────────────────────────────────────
  makeSubject(6, [
    { id: 6001, day: 1, start: T(12), end: T(14) },
    { id: 6002, day: 3, start: T(10), end: T(12) }, // conflicts s4-4002
    { id: 6003, day: 5, start: T(8),  end: T(10) }, // conflicts s2-2004
  ]),
  makeSubject(7, [
    { id: 7001, day: 2, start: T(14), end: T(16) },
    { id: 7002, day: 3, start: T(12), end: T(14) },
    { id: 7003, day: 4, start: T(16), end: T(18) },
  ]),
  makeSubject(8, [
    { id: 8001, day: 1, start: T(16), end: T(18) },
    { id: 8002, day: 2, start: T(8),  end: T(10) }, // conflicts s2-2002
    { id: 8003, day: 5, start: T(12), end: T(14) },
  ]),
  makeSubject(9, [
    { id: 9001, day: 1, start: T(10), end: T(12) }, // conflicts s2-2001
    { id: 9002, day: 3, start: T(8),  end: T(10) }, // conflicts s1-1003
    { id: 9003, day: 5, start: T(14), end: T(16) }, // conflicts s3-3004
  ]),
]

const largeActivities: IActivity[] = [
  makeActivity('00000000-0000-0000-0000-000000000010' as UUID, 3, T(14), T(16)),
  makeActivity('00000000-0000-0000-0000-000000000011' as UUID, 5, T(10), T(12)),
]

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

const DEFAULT_OPTIONS: ScheduleOptions = { crossingSubjects: 0 }

describe('small — 3×3 = 27 combos, no conflicts', () => {
  bench('getSchedules', () => {
    getSchedules(small, [], DEFAULT_OPTIONS)
  })
})

describe('medium — 5×4 = 1024 combos, no conflicts', () => {
  bench('getSchedules', () => {
    getSchedules(medium, [], DEFAULT_OPTIONS)
  })
})

describe('large — 9×3-4 = ~82944 combos, some conflicts', () => {
  bench('getSchedules', () => {
    getSchedules(large, largeActivities, DEFAULT_OPTIONS)
  })
})

describe('conflicts — 5×4 = 1024 combos, all same-slot overlap', () => {
  bench('getSchedules', () => {
    getSchedules(withConflicts, [], DEFAULT_OPTIONS)
  })
})

describe('medium — 5×4 = 1024 combos, 1 activity', () => {
  bench('getSchedules', () => {
    getSchedules(medium, activities, DEFAULT_OPTIONS)
  })
})
