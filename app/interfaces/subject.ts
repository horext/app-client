import type {
  ISubject,
  ISubjectSchedule,
  SubjectScheduleId,
} from '~~/shared/domain/types/subject'

export type {
  IClassroom,
  ICourse,
  ICourseType,
  ISession,
  ISessionType,
  IStudyPlan,
  ISubject,
  ISubjectSchedule,
  ISubjectStudyPlan,
  ITeacher,
} from '~~/shared/domain/types/subject'

export interface IBaseSubjectSchedules {
  subject: ISubject
  schedules: ISubjectSchedule[]
  color: string
}

export interface ISubjectSchedules extends IBaseSubjectSchedules {
  id: SubjectScheduleId
}

export interface ISubjectSchedulesUpdate {
  id: SubjectScheduleId
  subject?: ISubject
  schedules?: ISubjectSchedule[]
  color?: string
}
