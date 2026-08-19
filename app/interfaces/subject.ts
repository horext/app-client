import type { Weekdays } from './event'
import type { IScheduleSubject } from './schedule-subject'
import type { SubjectScheduleId } from '~~/shared/domain'

export interface ICourse {
  id: string
  name: string
}

export interface ICourseType {
  id: number
  name: string
  code: string
}

export interface IStudyPlan {
  id: number
  name?: string
  fromDate: string
  code: string
  organizationUnit: {
    id: number
  }
}

export interface IClassroom {
  id: number
  code: string
  name?: string | null
}

export interface ITeacher {
  id: number
  fullName: string
}

export interface ISessionType {
  id: number
  code: string
  name?: string
}
export interface ISession {
  id: number
  schedule: {
    id: number
  }
  classroom: IClassroom
  teacher?: ITeacher
  type: ISessionType
  day: Weekdays
  startTime: string
  endTime: string
}

export interface ISubject {
  id: number
  course: ICourse
  type: ICourseType
  studyPlan: IStudyPlan
  credits: number
  cycle: number | null
  specialityCodes?: string[]
  recommended?: boolean
}

export interface ISubjectSchedule {
  id: number
  section: {
    id: string
  }
  scheduleSubject: Pick<IScheduleSubject, 'id'>
  sessions: ISession[]
}

export interface IBaseSubjectSchedules {
  subject: ISubject
  schedules: ISubjectSchedule[]
  color?: string
}

export interface ISubjectSchedules extends IBaseSubjectSchedules {
  id: SubjectScheduleId
}

export interface ISubjectStudyPlan extends ISubject {
  relationships: {
    subjectId: number
    relatedSubjectId: number
  }[]
}
