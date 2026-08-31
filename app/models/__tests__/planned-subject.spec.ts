import { describe, expect, it } from 'vitest'
import { isProxy, reactive } from 'vue'
import { PlannedSubject, PlannedSubjectSchedule } from '../planned-subject'
import type { ISession, ISubject, ISubjectSchedule } from '~/interfaces/subject'
import { DEFAULT_SUBJECT_COLOR } from '~/constants/event'

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
    const model = new PlannedSubject(
      undefined,
      subject,
      [],
      DEFAULT_SUBJECT_COLOR,
    )

    const request = model.toCreateRequest()

    expect(isProxy(request.subject)).toBe(false)
    expect(isProxy(request.subject.course)).toBe(false)
    expect(() => structuredClone(request)).not.toThrow()
    expect(request.subject).toEqual(subject)
  })
})

const makeSession = (overrides: Partial<ISession> = {}): ISession => ({
  id: 1,
  schedule: { id: 10 },
  classroom: { id: 20, code: 'A' },
  teacher: { id: 30, fullName: 'Teacher' },
  type: { id: 40, code: 'CL' },
  day: 1,
  startTime: '08:00:00',
  endTime: '10:00:00',
  ...overrides,
})

const makeSchedule = (
  sectionId: string,
  sessions: ISession[],
): ISubjectSchedule => ({
  id: Number(sectionId),
  section: { id: sectionId },
  scheduleSubject: { id: 1 },
  sessions,
})

describe('PlannedSubject schedule comparison', () => {
  it('keeps all available schedules as options but exposes only selections', () => {
    const saved = makeSchedule('101', [makeSession()])
    const other = makeSchedule('102', [makeSession({ id: 2 })])
    const model = new PlannedSubject(
      undefined,
      {} as ISubject,
      [saved],
      DEFAULT_SUBJECT_COLOR,
      [saved],
    )

    model.initializeAvailableSchedules([saved, other])

    expect(model.scheduleOptions).toHaveLength(2)
    expect(model.schedules).toEqual([saved])
    expect(model.scheduleOptions[0]?.selectionChange).toBeUndefined()

    model.scheduleOptions[1]!.selected = true

    expect(model.schedules).toEqual([saved, other])
    expect(model.scheduleOptions[1]?.selectionChange).toBe('added')
  })

  it('preserves explicit selections when available schedules update', () => {
    const first = makeSchedule('101', [makeSession()])
    const second = makeSchedule('102', [makeSession({ id: 2 })])
    const model = new PlannedSubject(
      undefined,
      {} as ISubject,
      [],
      DEFAULT_SUBJECT_COLOR,
    )

    model.initializeAvailableSchedules([first])
    model.scheduleOptions[0]!.selected = true
    model.updateAvailableSchedules([first, second])

    expect(model.schedules).toEqual([first])
    expect(model.scheduleOptions[0]?.selectionChange).toBe('added')
    expect(model.scheduleOptions[1]?.selected).toBe(false)
  })

  it('owns section selection changes without replacing its options', () => {
    const schedule = makeSchedule('101', [makeSession()])
    const model = new PlannedSubject(
      undefined,
      {} as ISubject,
      [],
      DEFAULT_SUBJECT_COLOR,
      [],
    )
    model.initializeAvailableSchedules([schedule])
    const option = model.scheduleOptions[0]

    model.setScheduleSelected('101', true)

    expect(model.scheduleOptions[0]).toBe(option)
    expect(option?.selected).toBe(true)
    expect(model.schedules).toEqual([schedule])
  })

  it('keeps session comparison inside its previously selected option', () => {
    const saved = makeSchedule('101', [makeSession()])
    const current = makeSchedule('101', [
      makeSession({ id: 99, classroom: { id: 21, code: 'B' } }),
    ])
    const model = new PlannedSubject(
      undefined,
      {} as ISubject,
      [current],
      DEFAULT_SUBJECT_COLOR,
      [saved],
    )

    expect(model.scheduleOptions[0]?.sessionChanges(99)).toEqual([
      { field: 'classroom', before: 'A', after: 'B' },
    ])
  })

  it('matches a saved schedule to its available option by section', () => {
    const available = makeSchedule('101', [makeSession()])
    const saved = makeSchedule('101', [])
    const model = new PlannedSubject(
      undefined,
      {} as ISubject,
      [available],
      DEFAULT_SUBJECT_COLOR,
      [saved],
    )

    expect(model.scheduleOptions[0]?.saved).toBe(saved)
    expect(model.scheduleOptions[0]?.wasSelected).toBe(true)
  })

  it('compares session contents while ignoring the session id', () => {
    const unchanged = new PlannedSubjectSchedule(
      makeSchedule('101', [makeSession({ id: 99 })]),
      makeSchedule('101', [makeSession({ id: 1 })]),
    )
    const changed = new PlannedSubjectSchedule(
      makeSchedule('101', [
        makeSession({ id: 99, classroom: { id: 21, code: 'B' } }),
      ]),
      makeSchedule('101', [makeSession()]),
    )

    expect(unchanged.isSessionModified(99)).toBe(false)
    expect(changed.isSessionModified(99)).toBe(true)
  })

  it('reports changed fields only for a previously selected section', () => {
    const original = makeSchedule('101', [makeSession()])
    const changed = makeSchedule('101', [
      makeSession({
        id: 99,
        classroom: { id: 21, code: 'B' },
        type: { id: 41, code: 'P' },
      }),
    ])

    expect(
      new PlannedSubjectSchedule(changed, original).sessionChanges(99),
    ).toEqual([
      { field: 'classroom', before: 'A', after: 'B' },
      { field: 'type', before: 'CL', after: 'P' },
    ])
    expect(
      new PlannedSubjectSchedule(
        makeSchedule('102', changed.sessions),
      ).sessionChanges(99),
    ).toEqual([])
  })

  it('does not invent a change when an API id is unavailable', () => {
    const original = makeSchedule('101', [
      makeSession({ classroom: undefined }),
    ])
    const current = makeSchedule('101', [makeSession({ id: 99 })])

    const option = new PlannedSubjectSchedule(current, original)

    expect(option.sessionChanges(99)).toEqual([])
    expect(option.isSessionModified(99)).toBe(false)
  })

  it('preserves labels supplied by the API', () => {
    const original = makeSchedule('101', [
      makeSession({ classroom: { id: 20, code: 'Sin aula' } }),
    ])
    const current = makeSchedule('101', [
      makeSession({ id: 99, classroom: { id: 21, code: 'S4-110' } }),
    ])

    expect(
      new PlannedSubjectSchedule(current, original).sessionChanges(99),
    ).toEqual([{ field: 'classroom', before: 'Sin aula', after: 'S4-110' }])
  })
})
