import type { Weekdays } from './event'
import type { IScheduleSubjectReference } from './schedule-subject'
import type { IAuditable } from './entity-metadata'
import type {
  ReplicatedIdentity,
  ReplicationState,
} from './replicated-identity'
import type { BrandUUID } from './ids'

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
  fromDate: string
  code: string
  name?: string
  createdAt?: string
  updatedAt?: string
  organizationUnit: {
    id: number
  }
}

export interface IClassroom {
  id: number
  code: string
  name?: string
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
  createdAt?: string
  updatedAt?: string
}

export type ISubjectUpdate = Omit<ISubject, 'id'>

export interface ISubjectSchedule {
  id: number
  section: {
    id: string
  }
  scheduleSubject: IScheduleSubjectReference
  sessions: ISession[]
}

export type SubjectScheduleId = BrandUUID<'SubjectScheduleId'>

export interface IBaseSubjectSchedules extends ReplicationState<SubjectScheduleId> {
  subject: ISubject
  schedules: ISubjectSchedule[]
  color: string
}

export interface ISubjectSchedulesUpdate {
  subject?: ISubjectUpdate
  schedules: ISubjectSchedule[]
  color: string
}

export interface ISubjectSchedules
  extends
    IBaseSubjectSchedules,
    IAuditable,
    ReplicatedIdentity<SubjectScheduleId> {}

export type IUserSubjectCreate = IBaseSubjectSchedules
export type IUserSubjectUpdate = Partial<ISubjectSchedulesUpdate> &
  ReplicationState<SubjectScheduleId>

export interface ISubjectStudyPlan extends ISubject {
  relationships: {
    subjectId: number
    relatedSubjectId: number
  }[]
}
