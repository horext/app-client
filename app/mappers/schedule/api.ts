import type {
  IScheduleSubjectDetailResponse,
  IScheduleSubjectResponse,
} from '~~/modules/apis/runtime/interfaces/schedule-subject'
import type { IScheduleResponse } from '~~/modules/apis/runtime/interfaces/subject'
import type {
  IScheduleSubject,
  IScheduleSubjectDetail,
} from '~/interfaces/schedule-subject'
import { toAppSubject } from '~/mappers/subject/api'

function toAppSchedule(
  schedule: IScheduleResponse,
): IScheduleSubject['schedule'] {
  return {
    ...schedule,
    sessions: schedule.sessions.map((session) => ({
      ...session,
      classroom: {
        ...session.classroom,
        name: session.classroom.name ?? undefined,
      },
    })),
  }
}

export function toAppScheduleSubject(
  scheduleSubject: IScheduleSubjectResponse,
): IScheduleSubject {
  return {
    ...scheduleSubject,
    schedule: toAppSchedule(scheduleSubject.schedule),
  }
}

export function toAppScheduleSubjectDetail(
  scheduleSubject: IScheduleSubjectDetailResponse,
): IScheduleSubjectDetail {
  return Object.assign(toAppScheduleSubject(scheduleSubject), {
    subject: toAppSubject(scheduleSubject.subject),
  })
}
