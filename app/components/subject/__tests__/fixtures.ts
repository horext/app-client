import type { ISession, ISubjectSchedule } from '~/interfaces/subject'

export const makeSession = (id = 1): ISession => ({
  id,
  schedule: { id: 1 },
  classroom: { id: 1, code: 'A-101' },
  teacher: { id: 1, fullName: 'Teacher' },
  type: { id: 1, code: 'T' },
  day: 1,
  startTime: '08:00:00',
  endTime: '10:00:00',
})

export const makeSchedule = (
  id = 1,
  sectionId = '',
  sessions: ISession[] = [],
): ISubjectSchedule => ({
  id,
  sessions,
  section: { id: sectionId },
  scheduleSubject: { id: 0 },
})
