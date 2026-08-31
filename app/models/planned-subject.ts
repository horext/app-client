import type {
  ISession,
  ISubject,
  ISubjectSchedule,
  PlannedSubjectWithCurrentSchedules,
} from '~/interfaces/subject'
import type { PlannedSubjectId } from '~~/shared/domain'

export interface SessionFieldChange {
  field: 'classroom' | 'teacher' | 'type'
  before: string
  after: string
}

export interface PlannedSubjectChanges {
  addedSchedules: ISubjectSchedule[]
  removedSchedules: ISubjectSchedule[]
  removedSessions: number
  modifiedSessions: number
}

const findSchedule = (
  schedules: readonly ISubjectSchedule[],
  schedule: ISubjectSchedule,
) => schedules.find((item) => item.section.id === schedule.section.id)

const hasSameSessionSlot = (first: ISession, second: ISession) =>
  first.day === second.day &&
  first.startTime === second.startTime &&
  first.endTime === second.endTime

const hasSessionChanges = (first: ISession, second: ISession) => {
  if (!hasSameSessionSlot(first, second)) return true
  return [
    [first.classroom?.id, second.classroom?.id],
    [first.teacher?.id, second.teacher?.id],
    [first.type?.id, second.type?.id],
  ].some(
    ([before, after]) =>
      before !== undefined && after !== undefined && before !== after,
  )
}

const addFieldChange = (
  changes: SessionFieldChange[],
  field: SessionFieldChange['field'],
  beforeId: number | undefined,
  afterId: number | undefined,
  before: string | undefined,
  after: string | undefined,
) => {
  if (beforeId === undefined || afterId === undefined || beforeId === afterId)
    return
  changes.push({ field, before: before ?? '', after: after ?? '' })
}

export class PlannedSubjectSchedule {
  readonly current: ISubjectSchedule
  readonly saved?: ISubjectSchedule
  selected: boolean

  constructor(
    current: ISubjectSchedule,
    saved?: ISubjectSchedule,
    selected = Boolean(saved),
  ) {
    this.current = current
    this.saved = saved
    this.selected = selected
  }

  get sectionId() {
    return this.current.section.id
  }

  get wasSelected() {
    return Boolean(this.saved)
  }

  get selectionChange(): 'added' | 'removed' | undefined {
    if (this.selected && !this.wasSelected) return 'added'
    if (!this.selected && this.wasSelected) return 'removed'
    return undefined
  }

  sessionChanges(sessionId: number) {
    const current = this.current.sessions.find(({ id }) => id === sessionId)
    const saved = this.saved?.sessions.find(
      (session) => current && hasSameSessionSlot(session, current),
    )
    if (!current || !saved) return []

    const changes: SessionFieldChange[] = []
    addFieldChange(
      changes,
      'classroom',
      saved.classroom?.id,
      current.classroom?.id,
      saved.classroom?.name ?? saved.classroom?.code,
      current.classroom?.name ?? current.classroom?.code,
    )
    addFieldChange(
      changes,
      'teacher',
      saved.teacher?.id,
      current.teacher?.id,
      saved.teacher?.fullName,
      current.teacher?.fullName,
    )
    addFieldChange(
      changes,
      'type',
      saved.type?.id,
      current.type?.id,
      saved.type?.name ?? saved.type?.code,
      current.type?.name ?? current.type?.code,
    )
    return changes
  }

  isSessionModified(sessionId: number) {
    return this.sessionChanges(sessionId).length > 0
  }
}

const convertSubject = (subject: ISubject): ISubject => ({
  id: subject.id,
  course: {
    id: subject.course.id,
    name: subject.course.name,
  },
  type: {
    id: subject.type.id,
    name: subject.type.name,
    code: subject.type.code,
  },
  studyPlan: {
    id: subject.studyPlan.id,
    fromDate: subject.studyPlan.fromDate,
    code: subject.studyPlan.code,
    organizationUnit: {
      id: subject.studyPlan.organizationUnit.id,
    },
  },
  credits: subject.credits,
  cycle: subject.cycle,
})

const convertSchedule = (s: ISubjectSchedule): ISubjectSchedule => ({
  id: s.id,
  scheduleSubject: {
    id: s.scheduleSubject.id,
  },
  section: {
    id: s.section.id,
  },
  sessions: s.sessions.map((session) => ({
    schedule: {
      id: session.schedule.id,
    },
    classroom: {
      id: session.classroom.id,
      code: session.classroom.code,
      name: session.classroom?.name,
    },
    teacher: session.teacher
      ? {
          id: session.teacher.id,
          fullName: session.teacher.fullName,
        }
      : undefined,
    type: {
      id: session.type.id,
      code: session.type.code,
    },
    day: session.day,
    startTime: session.startTime,
    endTime: session.endTime,
    id: session.id,
  })),
})
export class PlannedSubject<
  ID extends PlannedSubjectId | undefined = PlannedSubjectId,
> {
  id: ID
  subject: ISubject
  readonly savedSchedules: readonly ISubjectSchedule[]
  scheduleOptions: PlannedSubjectSchedule[]
  color: string

  constructor(
    id: ID,
    subject: ISubject,
    schedules: ISubjectSchedule[],
    color: string,
    savedSchedules: ISubjectSchedule[] = schedules,
  ) {
    this.id = id
    this.subject = subject
    this.savedSchedules = [...savedSchedules]
    this.scheduleOptions = schedules.map((schedule) => {
      const saved = findSchedule(savedSchedules, schedule)
      return new PlannedSubjectSchedule(schedule, saved, true)
    })
    this.color = color
  }

  get schedules() {
    return this.scheduleOptions
      .filter(({ selected }) => selected)
      .map(({ current }) => current)
  }

  set schedules(schedules: ISubjectSchedule[]) {
    const selectedIds = new Set(schedules.map(({ section }) => section.id))
    const availableIds = new Set(
      this.scheduleOptions.map(({ sectionId }) => sectionId),
    )
    this.scheduleOptions.forEach((option) => {
      option.selected = selectedIds.has(option.sectionId)
    })
    schedules.forEach((schedule) => {
      if (availableIds.has(schedule.section.id)) return
      const saved = findSchedule(this.savedSchedules, schedule)
      this.scheduleOptions.push(
        new PlannedSubjectSchedule(schedule, saved, true),
      )
    })
  }

  updateAvailableSchedules(availableSchedules: ISubjectSchedule[]) {
    const selectedIds = new Set(
      this.scheduleOptions
        .filter(({ selected }) => selected)
        .map(({ sectionId }) => sectionId),
    )
    this.scheduleOptions = availableSchedules.map((schedule) => {
      const saved = findSchedule(this.savedSchedules, schedule)
      return new PlannedSubjectSchedule(
        schedule,
        saved,
        selectedIds.has(schedule.section.id),
      )
    })
  }

  initializeAvailableSchedules(availableSchedules: ISubjectSchedule[]) {
    const selectedIds = new Set(
      this.scheduleOptions.map(({ sectionId }) => sectionId),
    )
    this.scheduleOptions = availableSchedules.map((schedule) => {
      const saved = findSchedule(this.savedSchedules, schedule)
      return new PlannedSubjectSchedule(
        schedule,
        saved,
        selectedIds.has(schedule.section.id),
      )
    })
  }

  toCreateRequest() {
    return {
      subject: convertSubject(this.subject),
      schedules: this.schedules.map(convertSchedule),
      color: this.color,
    }
  }
  toUpdateRequest() {
    return {
      id: this.id,
      schedules: this.schedules.map(convertSchedule),
      color: this.color,
    }
  }

  isScheduleSelected(schedule: ISubjectSchedule) {
    return this.scheduleOptions.some(
      ({ sectionId, selected }) =>
        selected && sectionId === schedule.section.id,
    )
  }

  changesFrom(originalSchedules: ISubjectSchedule[]): PlannedSubjectChanges {
    const addedSchedules = this.schedules.filter(
      (schedule) => !findSchedule(originalSchedules, schedule),
    )
    const removedSchedules = originalSchedules.filter(
      (schedule) => !findSchedule(this.schedules, schedule),
    )
    const previouslySelected = this.schedules.filter((schedule) =>
      findSchedule(originalSchedules, schedule),
    )

    const removedSessions = originalSchedules.reduce((total, original) => {
      const current = findSchedule(this.schedules, original)
      if (!current) return total
      return (
        total +
        original.sessions.filter(
          (session) =>
            !current.sessions.some((item) => hasSameSessionSlot(item, session)),
        ).length
      )
    }, 0)

    const modifiedSessions = previouslySelected.reduce((total, schedule) => {
      const original = findSchedule(originalSchedules, schedule)!
      return (
        total +
        schedule.sessions.filter((session) => {
          const previous = original.sessions.find((item) =>
            hasSameSessionSlot(item, session),
          )
          return previous ? hasSessionChanges(previous, session) : false
        }).length
      )
    }, 0)

    return {
      addedSchedules,
      removedSchedules,
      removedSessions,
      modifiedSessions,
    }
  }

  static buildFrom(
    data: PlannedSubjectWithCurrentSchedules,
  ): PlannedSubject<PlannedSubjectId> | PlannedSubject<undefined> {
    if ('id' in data) {
      return new PlannedSubject(
        data.id,
        data.subject,
        data.currentSchedules,
        data.color,
        data.schedules,
      )
    }
    return new PlannedSubject(
      undefined,
      data.subject,
      data.currentSchedules,
      data.color,
      data.schedules,
    )
  }
}
