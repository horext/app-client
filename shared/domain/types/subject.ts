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
  specialityCodes?: string[]
  recommended?: boolean
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

export type PlannedSubjectId = BrandUUID<'PlannedSubjectId'>

export interface IBasePlannedSubject extends ReplicationState<PlannedSubjectId> {
  subject: ISubject
  schedules: ISubjectSchedule[]
  color: string
}

export interface IPlannedSubject
  extends
    IBasePlannedSubject,
    IAuditable,
    ReplicatedIdentity<PlannedSubjectId> {}

export type IPlannedSubjectCreate = IBasePlannedSubject

export interface IPlannedSubjectUpdate extends ReplicationState<PlannedSubjectId> {
  subject?: ISubjectUpdate
  schedules?: ISubjectSchedule[]
  color?: string
}

export interface ISubjectStudyPlan extends ISubject {
  relationships: {
    subjectId: number
    relatedSubjectId: number
  }[]
}
