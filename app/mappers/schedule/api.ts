import type {
  IScheduleSubjectDetailResponse,
  IScheduleSubjectResponse,
} from '~~/modules/apis/runtime/interfaces/schedule-subject'
import type { IScheduleResponse } from '~~/modules/apis/runtime/interfaces/subject'
import type {
  IScheduleSubject,
  IScheduleSubjectDetail,
} from '~/interfaces/schedule-subject'
import type { ISubjectSchedule } from '~/interfaces/subject'

function toAppSchedule(
  schedule: IScheduleResponse,
): Pick<ISubjectSchedule, 'id' | 'section' | 'sessions'> {
  return {
    id: schedule.id,
    section: {
      id: schedule.section.id,
    },
    sessions: schedule.sessions.map((session) => ({
      id: session.id,
      schedule: {
        id: session.schedule.id,
      },
      classroom: {
        id: session.classroom.id,
        code: session.classroom.code,
        name: session.classroom.name ?? undefined,
      },
      teacher: session.teacher,
      type: session.type,
      day: session.day,
      startTime: session.startTime,
      endTime: session.endTime,
    })),
  }
}

export function toAppScheduleSubject(
  scheduleSubject: IScheduleSubjectResponse,
): IScheduleSubject {
  return {
    id: scheduleSubject.id,
    subject: scheduleSubject.subject,
    hourlyLoad: scheduleSubject.hourlyLoad,
    schedule: toAppSchedule(scheduleSubject.schedule),
  }
}

export function toAppScheduleSubjectDetail(
  scheduleSubject: IScheduleSubjectDetailResponse,
): IScheduleSubjectDetail {
  return {
    ...toAppScheduleSubject(scheduleSubject),
    subject: scheduleSubject.subject,
  }
}
