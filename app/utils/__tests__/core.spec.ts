import { describe, it, expect } from 'vitest'
import { getSchedules } from '../core'
import type { IActivity } from '~/interfaces/event'
import type { IBaseSubjectSchedules } from '~/interfaces/subject'
import type { UUID } from 'crypto'

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

function makeActivity(
  id: UUID,
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6,
  startTime: string,
  endTime: string,
): IActivity {
  return {
    id,
    title: `Event ${id}`,
    day,
    color: '#ff0000',
    type: 'MY_EVENT',
    category: 'MY_EVENT',
    startTime,
    endTime,
  }
}

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

describe('getSchedules', () => {

  describe('given an empty subject list', () => {
    it('should return no combinations and no occurrences', () => {
      const result = getSchedules([], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(0)
      expect(result.occurrences).toHaveLength(0)
    })
  })

  describe('given a subject with no available schedules', () => {
    it('should return no combinations', () => {
      const subject = makeSubject(1, [])
      const result = getSchedules([subject], [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(0)
    })

    describe('and other subjects do have schedules', () => {
      it('should still return no combinations', () => {
        const s1 = makeSubject(1, [
          {
            scheduleId: 10,
            sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
          },
        ])
        const s2 = makeSubject(2, [])
        const result = getSchedules([s1, s2], [], { crossingSubjects: 0 })
        expect(result.combinations).toHaveLength(0)
        expect(result.occurrences).toHaveLength(0)
      })
    })
  })

  describe('given a single subject with one schedule', () => {
    it('should return exactly one combination with zero crossings', () => {
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

    describe('and a base activity on a different day', () => {
      it('should include the base activity in the combination with zero crossings', () => {
        const subject = makeSubject(1, [
          {
            scheduleId: 10,
            sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
          },
        ])
        const baseEvent = makeActivity(
          '00000000-0000-0000-0000-000000000001' as UUID,
          THU,
          T_08_10.startTime,
          T_08_10.endTime,
        )
        const result = getSchedules([subject], [baseEvent], {
          crossingSubjects: 0,
        })
        expect(result.combinations).toHaveLength(1)
        expect(result.combinations[0]!.crossings).toBe(0)
      })
    })
  })

  describe('given a single subject with multiple schedules', () => {
    it('should return one combination per schedule', () => {
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

  describe('given a schedule with multiple sessions', () => {
    it('should include all sessions as events in the combination', () => {
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
      expect(result.combinations[0]!.events).toHaveLength(2)
    })

    describe('when one of those sessions overlaps a session from another subject', () => {
      it('should reject the combination and record an occurrence', () => {
        const s1 = makeSubject(1, [
          {
            scheduleId: 10,
            sessions: [
              { id: 1, day: MON, ...T_08_10, typeCode: 'T' },
              { id: 2, day: TUE, ...T_08_10, typeCode: 'T' },
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

    describe('when both overlapping sessions belong to the same schedule', () => {
      it('should not count intra-schedule overlap as a crossing', () => {
        const subject = makeSubject(1, [
          {
            scheduleId: 10,
            sessions: [
              { id: 1, day: MON, ...T_08_10, typeCode: 'T' },
              { id: 2, day: MON, ...T_09_11, typeCode: 'T' },
            ],
          },
        ])
        const result = getSchedules([subject], [], { crossingSubjects: 0 })
        expect(result.combinations).toHaveLength(1)
        expect(result.combinations[0]!.crossings).toBe(0)
        expect(result.occurrences).toHaveLength(0)
      })
    })
  })

  describe('given two subjects with two schedules each', () => {
    it('should generate the full cartesian product of valid combinations', () => {
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
      expect(result.combinations).toHaveLength(3)
      result.combinations.forEach((c) => expect(c.crossings).toBe(0))
    })

    it('should include events from all subjects and base activities in each combination', () => {
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
      const baseEvent = makeActivity(
        '00000000-0000-0000-0000-000000000001' as UUID,
        THU,
        T_08_10.startTime,
        T_08_10.endTime,
      )
      const result = getSchedules([s1, s2], [baseEvent], {
        crossingSubjects: 0,
      })
      expect(result.combinations).toHaveLength(1)
      expect(result.combinations[0]!.events).toHaveLength(3)
    })
  })

  describe('given three subjects with two schedules each', () => {
    it('should enumerate all 8 combinations when no sessions overlap', () => {
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

  describe('given two subjects whose sessions do not overlap', () => {
    it('should produce one combination with zero crossings when sessions are adjacent', () => {
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

    it('should produce one combination with zero crossings when sessions are on different days', () => {
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

  describe('given two subjects with overlapping theory sessions', () => {
    describe('when crossingSubjects is 0', () => {
      it('should reject the combination and record a CROSSING_BASIS occurrence', () => {
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
        expect(
          result.occurrences.some((o) => o.type === 'CROSSING_BASIS'),
        ).toBe(true)
      })
    })

    describe('when crossingSubjects is 1', () => {
      it('should accept the combination and record a CROSSING_BASIS occurrence', () => {
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
        expect(
          result.occurrences.some((o) => o.type === 'CROSSING_BASIS'),
        ).toBe(true)
      })
    })

    describe('when a single session overlaps more events than crossingSubjects allows', () => {
      it('should record a CROSSING_EXCEEDED occurrence for the extra intersection', () => {
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
        const result = getSchedules([s1, s2, s3], [], { crossingSubjects: 0 })
        expect(result.combinations).toHaveLength(0)
        expect(
          result.occurrences.some((o) => o.type === 'CROSSING_EXCEEDED'),
        ).toBe(true)
      })
    })
  })

  describe('given three subjects all overlapping on the same slot', () => {
    describe('when crossingSubjects is 1', () => {
      it('should reject the combination because total crossings (2) exceed the limit', () => {
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
    })

    describe('when crossingSubjects is exactly equal to the total crossing count', () => {
      it('should accept the combination', () => {
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
      })
    })

    describe('when crossingSubjects is large enough to absorb every crossing', () => {
      it('should accept all combinations regardless of overlap count', () => {
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
        expect(result.combinations).toHaveLength(1)
        expect(result.combinations[0]!.crossings).toBeGreaterThan(0)
      })
    })
  })

  describe('given two subjects with overlapping practice sessions', () => {
    describe('when crossPractices is false', () => {
      it('should reject the combination and record CROSSING_NOT_AVAILABLE', () => {
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

      describe('and the crossing limit is already full when the second P-type overlap is evaluated', () => {
        it('should record CROSSING_NOT_AVAILABLE via the EXCEEDED branch', () => {
          const s1 = makeSubject(1, [
            {
              scheduleId: 10,
              sessions: [{ id: 1, day: MON, ...T_09_11, typeCode: 'P' }],
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
              sessions: [{ id: 3, day: MON, ...T_09_11, typeCode: 'P' }],
            },
          ])
          const result = getSchedules([s1, s2, s3], [], {
            crossingSubjects: 0,
            crossPractices: false,
          })
          expect(result.combinations).toHaveLength(0)
          expect(
            result.occurrences.some((o) => o.type === 'CROSSING_NOT_AVAILABLE'),
          ).toBe(true)
        })
      })
    })

    describe('when crossPractices is true', () => {
      it('should accept the combination and record CROSSING_BASIS', () => {
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
        expect(
          result.occurrences.some((o) => o.type === 'CROSSING_BASIS'),
        ).toBe(true)
      })
    })

    describe('when the two overlapping sessions have different types (T vs P)', () => {
      it('should treat the crossing as CROSSING_BASIS regardless of crossPractices', () => {
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
        expect(result.combinations).toHaveLength(1)
        expect(
          result.occurrences.some((o) => o.type === 'CROSSING_BASIS'),
        ).toBe(true)
      })
    })
  })

  describe('given a session that overlaps a user activity (base event)', () => {
    describe('when crossingSubjects is 0', () => {
      it('should reject the combination', () => {
        const subject = makeSubject(1, [
          {
            scheduleId: 10,
            sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
          },
        ])
        const baseEvent = makeActivity(
          crypto.randomUUID(),
          MON,
          T_09_11.startTime,
          T_09_11.endTime,
        )
        const result = getSchedules([subject], [baseEvent], {
          crossingSubjects: 0,
        })
        expect(result.combinations).toHaveLength(0)
      })
    })

    describe('when the base event is on a different day', () => {
      it('should accept the combination with zero crossings', () => {
        const subject = makeSubject(1, [
          {
            scheduleId: 10,
            sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
          },
        ])
        const baseEvent = makeActivity(
          '00000000-0000-0000-0000-000000000001' as UUID,
          TUE,
          T_08_10.startTime,
          T_08_10.endTime,
        )
        const result = getSchedules([subject], [baseEvent], {
          crossingSubjects: 0,
        })
        expect(result.combinations).toHaveLength(1)
        expect(result.combinations[0]!.crossings).toBe(0)
      })
    })
  })

  describe('given a session of type T that overlaps a MY_EVENT base activity', () => {
    describe('when crossEvent is false', () => {
      it('should treat the crossing as CROSSING_BASIS because only MY_EVENT+MY_EVENT is forbidden', () => {
        const subject = makeSubject(1, [
          {
            scheduleId: 10,
            sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'T' }],
          },
        ])
        const baseEvent = makeActivity(
          '00000000-0000-0000-0000-000000000001' as UUID,
          MON,
          T_09_11.startTime,
          T_09_11.endTime,
        )
        const result = getSchedules([subject], [baseEvent], {
          crossingSubjects: 1,
          crossEvent: false,
        })
        expect(result.combinations).toHaveLength(1)
        expect(
          result.occurrences.some((o) => o.type === 'CROSSING_BASIS'),
        ).toBe(true)
        expect(
          result.occurrences.some((o) => o.type === 'CROSSING_NOT_AVAILABLE'),
        ).toBe(false)
      })
    })
  })

  describe('given a session of type MY_EVENT that overlaps a MY_EVENT base activity', () => {
    describe('when crossEvent is false', () => {
      it('should record CROSSING_NOT_AVAILABLE and reject the combination (within-limit path)', () => {
        const subject = makeSubject(1, [
          {
            scheduleId: 10,
            sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'MY_EVENT' }],
          },
        ])
        const baseEvent = makeActivity(
          '00000000-0000-0000-0000-000000000002' as UUID,
          MON,
          T_09_11.startTime,
          T_09_11.endTime,
        )
        const result = getSchedules([subject], [baseEvent], {
          crossingSubjects: 1,
          crossEvent: false,
        })
        expect(result.combinations).toHaveLength(0)
        expect(
          result.occurrences.some((o) => o.type === 'CROSSING_NOT_AVAILABLE'),
        ).toBe(true)
      })

      describe('and the crossing limit is already full when the activity overlap is evaluated', () => {
        it('should record CROSSING_NOT_AVAILABLE via the EXCEEDED branch', () => {
          const s1 = makeSubject(1, [
            {
              scheduleId: 10,
              sessions: [{ id: 1, day: MON, ...T_08_10, typeCode: 'MY_EVENT' }],
            },
          ])
          const s2 = makeSubject(2, [
            {
              scheduleId: 20,
              sessions: [{ id: 2, day: MON, ...T_09_11, typeCode: 'T' }],
            },
          ])
          const baseEvent = makeActivity(
            '00000000-0000-0000-0000-000000000003' as UUID,
            MON,
            T_09_11.startTime,
            T_09_11.endTime,
          )
          const result = getSchedules([s1, s2], [baseEvent], {
            crossingSubjects: 0,
            crossEvent: false,
          })
          expect(result.combinations).toHaveLength(0)
          expect(
            result.occurrences.some((o) => o.type === 'CROSSING_NOT_AVAILABLE'),
          ).toBe(true)
        })
      })
    })
  })

  describe('given a fixed session that participates in every combination', () => {
    it('should record each overlapping event pair only once across all combinations', () => {
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
        {
          scheduleId: 21,
          sessions: [{ id: 3, day: THU, ...T_14_16, typeCode: 'T' }],
        },
      ])
      const baseEvent = makeActivity(
        '00000000-0000-0000-0000-000000000004' as UUID,
        MON,
        T_09_11.startTime,
        T_09_11.endTime,
      )
      const result = getSchedules([s1, s2], [baseEvent], {
        crossingSubjects: 1,
      })
      expect(result.combinations).toHaveLength(2)
      const keys = result.occurrences.map((o) => o.eventKey)
      expect(new Set(keys).size).toBe(keys.length)
    })

    it('should record each unique pair only once even when the same pair appears in multiple schedule combinations', () => {
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
      const ids = result.occurrences.map((o) => o.eventKey)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('given a valid accepted combination', () => {
    it('should expose the picked scheduleSubject.id for each subject', () => {
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
      expect(
        result.combinations[0]!.schedulesSubject.map((s) => s.id),
      ).toEqual(expect.arrayContaining([10, 20]))
    })
  })

  describe('given a recorded occurrence', () => {
    it('should contain the correct eventKey, name, eventTarget, eventSource and type', () => {
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
      expect(occ.eventKey).toBe('1-2')
      expect(typeof occ.name).toBe('string')
      expect(occ.name.length).toBeGreaterThan(0)
      expect(occ.eventTarget).toBeDefined()
      expect(occ.eventSource).toBeDefined()
      expect(occ.type).toBe('CROSSING_BASIS')
    })
  })

  describe('given more subjects than entries in the EVENT_COLORS palette', () => {
    it('should fall back to #000000 for subjects beyond the 18th', () => {
      const TIME_BANDS = [T_08_10, T_14_16, T_10_12] as const
      const subjects = Array.from({ length: 19 }, (_, i) =>
        makeSubject(i + 1, [
          {
            scheduleId: 300 + i,
            sessions: [
              {
                id: 300 + i,
                day: (i % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6,
                startTime: TIME_BANDS[Math.floor(i / 7)]!.startTime,
                endTime: TIME_BANDS[Math.floor(i / 7)]!.endTime,
                typeCode: 'T',
              },
            ],
          },
        ]),
      )
      const result = getSchedules(subjects, [], { crossingSubjects: 0 })
      expect(result.combinations).toHaveLength(1)
      expect(result.combinations[0]!.crossings).toBe(0)
    })
  })
})

