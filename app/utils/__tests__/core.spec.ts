import { describe, it, expect } from 'vitest'
import { getSchedules } from '../core'
import type { IEvent } from '~/interfaces/event'
import type { IBaseSubjectSchedules } from '~/interfaces/subject'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal ISubjectEntry from a flat list of schedule descriptors. */
function makeSubject(
  id: number,
  schedules: Array<{
    scheduleId: number
    sessions: Array<{
      id: number
      day: 0 | 1 | 2 | 3 | 4 | 5 | 6
      startTime: string
      endTime: string
      typeCode: string
    }>
  }>,
): IBaseSubjectSchedules {
  return {
    subject: {
      id,
      course: { id: `COURSE_${id}`, name: `Course ${id}` },
      credits: 3,
      cycle: null,
      studyPlan: {
        id: 1,
        code: 'SP2020',
        fromDate: '2020-01-01',
        organizationUnit: { id: 1 },
      },
      type: {
        id: 1,
        code: 'COURSE',
        name: 'Course',
      },
    },
    schedules: schedules.map(({ scheduleId, sessions }) => ({
      id: scheduleId,
      section: { id: `SEC_${scheduleId}` },
      scheduleSubject: { id: scheduleId },
      sessions: sessions.map((s) => ({
        id: s.id,
        schedule: { id: scheduleId },
        classroom: { id: 1, code: 'A101' },
        teacher: { id: 1, fullName: 'Teacher A' },
        type: { id: 1, code: s.typeCode },
        day: s.day,
        startTime: s.startTime,
        endTime: s.endTime,
      })),
    })),
  }
}

function makeEvent(
  id: string,
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  startTime: string,
  endTime: string,
  type = 'MY_EVENT',
): IEvent {
  return {
    id,
    title: `Event ${id}`,
    day,
    color: '#ff0000',
    type,
    startTime,
    endTime,
  }
}

// Reusable time constants — full ISO so DateTime.fromISO parses them reliably
const MON = 1
const TUE = 2
const THU = 4

const T_08_10 = {
  startTime: '2024-01-01T08:00:00',
  endTime: '2024-01-01T10:00:00',
}
const T_09_11 = {
  startTime: '2024-01-01T09:00:00',
  endTime: '2024-01-01T11:00:00',
}
const T_10_12 = {
  startTime: '2024-01-01T10:00:00',
  endTime: '2024-01-01T12:00:00',
}
const T_14_16 = {
  startTime: '2024-01-01T14:00:00',
  endTime: '2024-01-01T16:00:00',
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('getSchedules', () => {
  describe('empty inputs', () => {
    it('returns empty results when subjects is empty', () => {
      const result = getSchedules([], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(0)
      expect(result.occurrences).toHaveLength(0)
    })

    it('returns empty results when the only subject has no schedules', () => {
      const subject = makeSubject(1, [])
      const result = getSchedules([subject], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(0)
    })
  })

  describe('single subject', () => {
    it('returns exactly one combination', () => {
      const subject = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const result = getSchedules([subject], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(1)
      expect(result.combinations[0]!.crossings).toBe(0)
      expect(result.occurrences).toHaveLength(0)
    })

    it('includes base events in every combination', () => {
      const subject = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const baseEvent = makeEvent('e1', THU, T_08_10.startTime, T_08_10.endTime)
      const result = getSchedules([subject], [baseEvent], {
        crossingSubjects: 0,
      })
      expect(result.combinations).toHaveLength(1)
      // base event is on a different day — no crossing
      expect(result.combinations[0]!.crossings).toBe(0)
    })
  })

  describe('two subjects — no overlap', () => {
    it('produces one combination with zero crossings', () => {
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 2, day: MON, ...T_10_12, typeCode: 'T' }],
        },
      ])
      const result = getSchedules([s1, s2], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(1)
      expect(result.combinations[0]!.crossings).toBe(0)
      expect(result.occurrences).toHaveLength(0)
    })

    it('produces one combination when sessions are on different days', () => {
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 2, day: TUE, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const result = getSchedules([s1, s2], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(1)
      expect(result.combinations[0]!.crossings).toBe(0)
    })
  })

  describe('two subjects — overlapping theory sessions', () => {
    it('rejects the combination and records CROSSING_BASIS when crossingSubjects=0', () => {
      // The first crossing within the per-event counter is recorded as CROSSING_BASIS;
      // the combination is rejected afterwards because crossingCombination > crossingSubjects.
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 2, day: MON, ...T_09_11, typeCode: 'T' }],
        },
      ])
      const result = getSchedules([s1, s2], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(0)
      expect(result.occurrences.some((o) => o.type === 'CROSSING_BASIS')).toBe(
        true,
      )
    })

    it('records CROSSING_EXCEEDED when one event overlaps more than crossingSubjects+1 others', () => {
      // s1 session on Mon 09-11 will intersect s2 (Mon 08-10) AND s3 (Mon 10-12 — wait, end=10 is not overlap)
      // Use s3 Mon 09-11 to guarantee a second intersection in the same restScheduleEvents pass
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_09_11, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 2, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s3 = makeSubject(3, [
        {
          scheduleId: 30,
          sessions: [{ id: 3, day: MON, ...T_09_11, typeCode: 'T' }],
        },
      ])
      // crossingSubjects=0: first intersection (s1 vs s2) → CROSSING_BASIS (within limit 0);
      // second (s1 vs s3) → CROSSING_EXCEEDED (0+1 > 0)
      const result = getSchedules([s1, s2, s3], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(0)
      expect(
        result.occurrences.some((o) => o.type === 'CROSSING_EXCEEDED'),
      ).toBe(true)
    })

    it('accepts the combination and records CROSSING_BASIS when crossingSubjects=1', () => {
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 2, day: MON, ...T_09_11, typeCode: 'T' }],
        },
      ])
      const result = getSchedules([s1, s2], [], { crossingSubjects: 1 })
      expect(result.combinations).toHaveLength(1)
      expect(result.combinations[0]!.crossings).toBe(1)
      expect(result.occurrences.some((o) => o.type === 'CROSSING_BASIS')).toBe(
        true,
      )
    })
  })

  describe('practice session crossings', () => {
    it('rejects and records CROSSING_NOT_AVAILABLE when both are P type and crossPractices=false', () => {
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'P' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 2, day: MON, ...T_09_11, typeCode: 'P' }],
        },
      ])
      const result = getSchedules([s1, s2], [], {
        crossingSubjects: 1,
        crossPractices: false,
      })
      expect(result.combinations).toHaveLength(0)
      expect(
        result.occurrences.some((o) => o.type === 'CROSSING_NOT_AVAILABLE'),
      ).toBe(true)
    })

    it('accepts the combination when both are P type and crossPractices=true', () => {
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'P' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 2, day: MON, ...T_09_11, typeCode: 'P' }],
        },
      ])
      const result = getSchedules([s1, s2], [], {
        crossingSubjects: 1,
        crossPractices: true,
      })
      expect(result.combinations).toHaveLength(1)
      expect(result.occurrences.some((o) => o.type === 'CROSSING_BASIS')).toBe(
        true,
      )
    })

    it('treats a T vs P crossing as CROSSING_BASIS (not a forbidden crossing)', () => {
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 2, day: MON, ...T_09_11, typeCode: 'P' }],
        },
      ])
      const result = getSchedules([s1, s2], [], {
        crossingSubjects: 1,
        crossPractices: false,
      })
      // Only P+P is forbidden — T+P should be allowed
      expect(result.combinations).toHaveLength(1)
      expect(result.occurrences.some((o) => o.type === 'CROSSING_BASIS')).toBe(
        true,
      )
    })
  })

  describe('base event crossings', () => {
    it('rejects a combination when a session overlaps a base event (crossingSubjects=0)', () => {
      const subject = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      // Base event overlaps with the session
      const baseEvent = makeEvent(
        'e1',
        MON,
        T_09_11.startTime,
        T_09_11.endTime,
        'T',
      )
      const result = getSchedules([subject], [baseEvent], {
        crossingSubjects: 0,
      })
      expect(result.combinations).toHaveLength(0)
    })

    it('accepts a combination when base event is on a different day', () => {
      const subject = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const baseEvent = makeEvent(
        'e1',
        TUE,
        T_08_10.startTime,
        T_08_10.endTime,
        'T',
      )
      const result = getSchedules([subject], [baseEvent], {
        crossingSubjects: 0,
      })
      expect(result.combinations).toHaveLength(1)
      expect(result.combinations[0]!.crossings).toBe(0)
    })
  })

  describe('cartesian product correctness', () => {
    it('generates all combinations for 2 subjects × 2 schedules', () => {
      // s1: schedule A (Mon 08-10), schedule B (Tue 08-10)
      // s2: schedule C (Mon 09-11 — overlaps A), schedule D (Thu 14-16 — no overlap)
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
        {
          scheduleId: 11,
          sessions: [{ id: 2, day: TUE, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 3, day: MON, ...T_09_11, typeCode: 'T' }],
        },
        {
          scheduleId: 21,
          sessions: [{ id: 4, day: THU, ...T_14_16, typeCode: 'T' }],
        },
      ])
      const result = getSchedules([s1, s2], [], { crossingSubjects: 0 })
      // (A,C) → cross; (A,D) → ok; (B,C) → ok; (B,D) → ok → 3 valid
      expect(result.combinations).toHaveLength(3)
      result.combinations.forEach((c) => expect(c.crossings).toBe(0))
    })

    it('each combination contains events from all subjects plus base events', () => {
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 2, day: TUE, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const baseEvent = makeEvent(
        'e1',
        THU,
        T_08_10.startTime,
        T_08_10.endTime,
        'T',
      )
      const result = getSchedules([s1, s2], [baseEvent], {
        crossingSubjects: 0,
      })
      expect(result.combinations).toHaveLength(1)
      // events = 1 (s1 session) + 1 (s2 session) + 1 (base event) = 3
      expect(result.combinations[0]!.events).toHaveLength(3)
    })
  })

  describe('single subject with multiple schedules', () => {
    it('returns one combination per schedule', () => {
      const subject = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
        {
          scheduleId: 11,
          sessions: [{ id: 2, day: TUE, ...T_08_10, typeCode: 'T' }],
        },
        {
          scheduleId: 12,
          sessions: [{ id: 3, day: THU, ...T_14_16, typeCode: 'T' }],
        },
      ])
      const result = getSchedules([subject], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(3)
      result.combinations.forEach((c) => expect(c.crossings).toBe(0))
    })
  })

  describe('schedule with multiple sessions', () => {
    it('includes all sessions as events in the combination', () => {
      // One schedule with a Mon lecture + Wed lab
      const subject = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [
            { id: 1, day: MON, ...T_08_10, typeCode: 'T' },
            { id: 2, day: TUE, ...T_14_16, typeCode: 'LAB' },
          ],
        },
      ])
      const result = getSchedules([subject], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(1)
      // 2 sessions + 0 base events = 2 events
      expect(result.combinations[0]!.events).toHaveLength(2)
    })

    it('detects a crossing from a multi-session schedule against another subject', () => {
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [
            { id: 1, day: MON, ...T_08_10, typeCode: 'T' }, // no overlap
            { id: 2, day: TUE, ...T_08_10, typeCode: 'T' }, // overlaps s2's session
          ],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 3, day: TUE, ...T_09_11, typeCode: 'T' }],
        },
      ])
      const result = getSchedules([s1, s2], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(0)
      expect(result.occurrences.length).toBeGreaterThan(0)
    })
  })

  describe('multi-subject: one subject has no schedules', () => {
    it('returns zero combinations when any subject has an empty schedule list', () => {
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, []) // no schedules
      const result = getSchedules([s1, s2], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(0)
      expect(result.occurrences).toHaveLength(0)
    })
  })

  describe('crossing accumulation across subject pairs', () => {
    it('rejects combination when two separate crossing pairs exceed the limit', () => {
      // s1 Mon 09-11, s2 Mon 08-10 (cross #1), s3 Mon 09-11 (cross #2)
      // crossingSubjects=1: the total 2 crossings exceeds the limit
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_09_11, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 2, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s3 = makeSubject(3, [
        {
          scheduleId: 30,
          sessions: [{ id: 3, day: MON, ...T_09_11, typeCode: 'T' }],
        },
      ])
      const result = getSchedules([s1, s2, s3], [], { crossingSubjects: 1 })
      expect(result.combinations).toHaveLength(0)
    })

    it('accepts combination when crossings are exactly at the limit', () => {
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 2, day: MON, ...T_09_11, typeCode: 'T' }],
        },
      ])
      // crossingSubjects=1, exactly 1 crossing — must be accepted
      const result = getSchedules([s1, s2], [], { crossingSubjects: 1 })
      expect(result.combinations).toHaveLength(1)
      expect(result.combinations[0]!.crossings).toBe(1)
    })
  })

  describe('3-subject cartesian product (advanceIndex depth)', () => {
    it('enumerates all 8 combinations for 3 subjects × 2 schedules each', () => {
      // All sessions on different days so no crossings — every combo is valid
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
        {
          scheduleId: 11,
          sessions: [{ id: 2, day: MON, ...T_14_16, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 3, day: TUE, ...T_08_10, typeCode: 'T' }],
        },
        {
          scheduleId: 21,
          sessions: [{ id: 4, day: TUE, ...T_14_16, typeCode: 'T' }],
        },
      ])
      const s3 = makeSubject(3, [
        {
          scheduleId: 30,
          sessions: [{ id: 5, day: THU, ...T_08_10, typeCode: 'T' }],
        },
        {
          scheduleId: 31,
          sessions: [{ id: 6, day: THU, ...T_14_16, typeCode: 'T' }],
        },
      ])
      const result = getSchedules([s1, s2, s3], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(8)
      result.combinations.forEach((c) => expect(c.crossings).toBe(0))
    })
  })

  describe('occurrences deduplication', () => {
    it('records each unique pair only once in the occurrences map', () => {
      // 2 subjects × 2 schedules — the overlapping pair (id 1, id 3) appears
      // in multiple combinations but should be recorded once per type
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
        {
          scheduleId: 11,
          sessions: [{ id: 2, day: TUE, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 3, day: MON, ...T_09_11, typeCode: 'T' }],
        },
        {
          scheduleId: 21,
          sessions: [{ id: 4, day: THU, ...T_14_16, typeCode: 'T' }],
        },
      ])
      const result = getSchedules([s1, s2], [], { crossingSubjects: 0 })
      // Only sessions 1 and 3 overlap — one CROSSING_EXCEEDED occurrence
      const ids = result.occurrences.map((o) => o.eventKey)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length) // no duplicate ids
    })
  })

  describe('same-subject sessions are never cross-checked', () => {
    it('does not detect overlapping sessions within the same schedule as a crossing', () => {
      // Both sessions belong to the same subject/schedule — the inner loop only
      // compares subject j against subjects j+1…n, so intra-subject overlaps are ignored.
      const subject = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [
            { id: 1, day: MON, ...T_08_10, typeCode: 'T' },
            { id: 2, day: MON, ...T_09_11, typeCode: 'T' }, // overlaps session 1
          ],
        },
      ])
      const result = getSchedules([subject], [], { crossingSubjects: 0 })
      // Intra-subject overlap is invisible — combination is still valid
      expect(result.combinations).toHaveLength(1)
      expect(result.combinations[0]!.crossings).toBe(0)
      expect(result.occurrences).toHaveLength(0)
    })
  })

  describe('crossEvent option behavior', () => {
    it('does NOT prevent a T-session from crossing a MY_EVENT base event (crossEvent=false)', () => {
      // The crossEvent condition requires BOTH events to have type MY_EVENT.
      // A schedule session has type 'T'/'P'/etc., so the condition never fires
      // for a session vs. a user base event — the crossing is treated as CROSSING_BASIS.
      const subject = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const baseEvent = makeEvent(
        'e1',
        MON,
        T_09_11.startTime,
        T_09_11.endTime,
        'MY_EVENT',
      )
      const result = getSchedules([subject], [baseEvent], {
        crossingSubjects: 1,
        crossEvent: false,
      })
      // Crossing is allowed (crossingSubjects=1) and NOT marked NOT_AVAILABLE
      expect(result.combinations).toHaveLength(1)
      expect(result.occurrences.some((o) => o.type === 'CROSSING_BASIS')).toBe(
        true,
      )
      expect(
        result.occurrences.some((o) => o.type === 'CROSSING_NOT_AVAILABLE'),
      ).toBe(false)
    })
  })

  describe('crossingSubjects large enough to absorb all crossings', () => {
    it('accepts all combinations when the limit is higher than any possible crossing count', () => {
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 2, day: MON, ...T_09_11, typeCode: 'T' }],
        },
      ])
      const s3 = makeSubject(3, [
        {
          scheduleId: 30,
          sessions: [{ id: 3, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const result = getSchedules([s1, s2, s3], [], { crossingSubjects: 99 })
      // Every combination passes regardless of crossings
      expect(result.combinations).toHaveLength(1)
      expect(result.combinations[0]!.crossings).toBeGreaterThan(0)
    })
  })

  describe('combination output structure', () => {
    it('scheduleSubjectIds contains the picked scheduleSubject.id for each subject', () => {
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 2, day: TUE, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const result = getSchedules([s1, s2], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(1)
      // scheduleSubject.id is the scheduleId we passed in makeSubject
      expect(result.combinations[0]!.scheduleSubjectIds).toEqual(
        expect.arrayContaining([10, 20]),
      )
    })

    it('occurrence has correct id, name, eventTarget and eventSource', () => {
      const s1 = makeSubject(1, [
        {
          scheduleId: 10,
          sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
        },
      ])
      const s2 = makeSubject(2, [
        {
          scheduleId: 20,
          sessions: [{ id: 2, day: MON, ...T_09_11, typeCode: 'T' }],
        },
      ])
      const result = getSchedules([s1, s2], [], { crossingSubjects: 1 })
      expect(result.occurrences).toHaveLength(1)
      const occ = result.occurrences[0]!
      // id is the sorted session ids joined with '-'
      expect(occ.eventKey).toBe('1-2')
      expect(typeof occ.name).toBe('string')
      expect(occ.name.length).toBeGreaterThan(0)
      expect(occ.eventTarget).toBeDefined()
      expect(occ.eventSource).toBeDefined()
      expect(occ.type).toBe('CROSSING_BASIS')
    })
  })
})
