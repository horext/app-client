import type { Weekdays } from './event'
import type { IScheduleSubject } from './schedule-subject'

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
  organizationUnit: {
    id: number
  }
}

export interface IClassroom {
  id: number
  code: string
}

export interface ITeacher {
  id: number
  fullName: string
}

export interface ISession {
  id: number
  schedule: {
    id: number
  }
  classroom: IClassroom
  teacher: ITeacher
  type: {
    id: number
    code: string
  }
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
}

export interface ISubjectSchedule {
  id: number
  section: {
    id: string
  }
  scheduleSubject: Pick<IScheduleSubject, 'id'>
  sessions: ISession[]
}

export interface ISelectedSubject extends ISubject {
  schedules: Pick<
    ISubjectSchedule,
    'id' | 'section' | 'scheduleSubject' | 'sessions'
  >[]
}

export interface ISubjectStudyPlan extends ISubject {
  relationships: {
    subjectId: number
    relatedSubjectId: number
  }[]
}
