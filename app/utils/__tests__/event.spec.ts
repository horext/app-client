import { describe, it, expect } from 'vitest'
import { isIntersects, scheduleToEvents } from '../event'
import type { IInterval } from '~/interfaces/interval'
import type { IScheduleSubjectGenerate } from '~/interfaces/schedule'

function makeSchedule(
  sessions: Array<{
    id: number
    day: 0 | 1 | 2 | 3 | 4 | 5 | 6
    startTime: string
    endTime: string
    typeCode: string
    teacherName?: string
    classroomCode?: string
  }>,
): IScheduleSubjectGenerate {
  return {
    id: 1,
    section: { id: 'A' },
    scheduleSubject: { id: 1 },
    subject: {
      id: 10,
      course: { id: 'CS101', name: 'Intro to CS' },
      credits: 3,
      cycle: null,
      studyPlan: {
        id: 1,
        fromDate: '2020-01-01',
        code: 'SP2020',
        organizationUnit: { id: 1 },
      },
      type: {
        id: 1,
        code: 'COURSE',
        name: 'Course',
      },
    },
    sessions: sessions.map(
      ({
        id,
        day,
        startTime,
        endTime,
        typeCode,
        teacherName,
        classroomCode,
      }) => ({
        id,
        day,
        startTime,
        endTime,
        type: { id: 1, code: typeCode },
        schedule: { id: 1 },
        teacher: teacherName ? { id: 1, fullName: teacherName } : undefined,
        classroom: classroomCode
          ? { id: 1, code: classroomCode }
          : {
              id: 0,
              code: '',
            },
      }),
    ),
  }
}

describe('isIntersects', () => {
  it('returns true when events fully overlap', () => {
    const a: IInterval = { start: '08:00', end: '10:00' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(true)
  })

  it('returns true when target partially overlaps the start of source', () => {
    const a: IInterval = { start: '07:00', end: '09:00' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(true)
  })

  it('returns true when target partially overlaps the end of source', () => {
    const a: IInterval = { start: '09:00', end: '11:00' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(true)
  })

  it('returns true when target is fully contained within source', () => {
    const a: IInterval = { start: '08:30', end: '09:30' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(true)
  })

  it('returns false when target ends exactly when source starts (adjacent, no overlap)', () => {
    const a: IInterval = { start: '06:00', end: '08:00' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(false)
  })

  it('returns false when source ends exactly when target starts (adjacent, no overlap)', () => {
    const a: IInterval = { start: '10:00', end: '12:00' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(false)
  })

  it('returns false when events are completely separate (target before source)', () => {
    const a: IInterval = { start: '06:00', end: '07:00' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(false)
  })

  it('returns false when events are completely separate (target after source)', () => {
    const a: IInterval = { start: '11:00', end: '12:00' }
    const b: IInterval = { start: '08:00', end: '10:00' }
    expect(isIntersects(a, b)).toBe(false)
  })
})

describe('scheduleToEvents', () => {
  it('returns an empty array when there are no sessions', () => {
    const schedule = makeSchedule([])
    expect(scheduleToEvents(schedule, '#fff')).toEqual([])
  })

  it('returns one Event per session', () => {
    const schedule = makeSchedule([
      {
        id: 1,
        day: 1,
        startTime: '08:00',
        endTime: '10:00',
        typeCode: 'THEORY',
        teacherName: 'Dr. Smith',
        classroomCode: 'B201',
      },
      {
        id: 2,
        day: 3,
        startTime: '10:00',
        endTime: '12:00',
        typeCode: 'LAB',
        teacherName: 'Dr. Jones',
        classroomCode: 'LAB1',
      },
    ])
    const events = scheduleToEvents(schedule, '#ff0000')
    expect(events).toHaveLength(2)
  })

  it('maps session fields correctly onto the Event', () => {
    const schedule = makeSchedule([
      {
        id: 42,
        day: 2,
        startTime: '09:00',
        endTime: '11:00',
        typeCode: 'THEORY',
        teacherName: 'Dr. Smith',
        classroomCode: 'B201',
      },
    ])
    const [event] = scheduleToEvents(schedule, '#123456')

    expect(event!.day).toBe(2)
    expect(event!.startTime).toBe('09:00')
    expect(event!.endTime).toBe('11:00')
    expect(event!.color).toBe('#123456')
    expect(event!.type).toBe('THEORY')
    expect(event!.category).toBe('COURSE')
    expect(event!.id).toBe('42')
  })

  it('builds the title as "<courseId> <sectionId> - <courseName>"', () => {
    const schedule = makeSchedule([
      {
        id: 1,
        day: 0,
        startTime: '08:00',
        endTime: '09:00',
        typeCode: 'THEORY',
        teacherName: 'Prof. X',
      },
    ])
    const [event] = scheduleToEvents(schedule, '#000')
    expect(event!.title).toBe('CS101 A - Intro to CS')
  })

  it('builds the description with teacher, course and section info', () => {
    const schedule = makeSchedule([
      {
        id: 1,
        day: 0,
        startTime: '08:00',
        endTime: '09:00',
        typeCode: 'THEORY',
        teacherName: 'Prof. X',
        classroomCode: 'R100',
      },
    ])
    const [event] = scheduleToEvents(schedule, '#000')
    expect(event!.description).toContain('Prof. X')
    expect(event!.description).toContain('CS101')
    expect(event!.description).toContain('Intro to CS')
    expect(event!.description).toContain('A')
  })

  it('sets the location to the classroom code', () => {
    const schedule = makeSchedule([
      {
        id: 1,
        day: 0,
        startTime: '08:00',
        endTime: '09:00',
        typeCode: 'THEORY',
        classroomCode: 'ROOM_42',
      },
    ])
    const [event] = scheduleToEvents(schedule, '#000')
    expect(event!.location).toBe('ROOM_42')
  })

  it('handles a missing teacher gracefully', () => {
    const schedule = makeSchedule([
      {
        id: 1,
        day: 0,
        startTime: '08:00',
        endTime: '09:00',
        typeCode: 'THEORY',
      },
    ])
    expect(() => scheduleToEvents(schedule, '#000')).not.toThrow()
    const [event] = scheduleToEvents(schedule, '#000')
    expect(event!.description).toContain('undefined')
  })

  it('handles a missing classroom gracefully', () => {
    const schedule = makeSchedule([
      {
        id: 1,
        day: 0,
        startTime: '08:00',
        endTime: '09:00',
        typeCode: 'THEORY',
        teacherName: 'Dr. A',
      },
    ])
    expect(() => scheduleToEvents(schedule, '#000')).not.toThrow()
    const [event] = scheduleToEvents(schedule, '#000')
    // Event constructor defaults location to '' when no classroom is provided
    expect(event!.location).toBe('')
  })

  it('handles a nullish schedule (no sessions property) gracefully', () => {
    const schedule = makeSchedule([])
    // @ts-expect-error – simulate incomplete data arriving at runtime
    delete schedule.sessions
    expect(scheduleToEvents(schedule, '#000')).toEqual([])
  })
})
