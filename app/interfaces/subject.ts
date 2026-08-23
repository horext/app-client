import type {
  ISubject,
  ISubjectSchedule,
  PlannedSubjectId,
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

export type { PlannedSubjectId }

export interface IBasePlannedSubject {
  subject: ISubject
  schedules: ISubjectSchedule[]
  color: string
}

export interface IPlannedSubject extends IBasePlannedSubject {
  id: PlannedSubjectId
}

export interface IPlannedSubjectUpdate {
  id: PlannedSubjectId
  subject?: ISubject
  schedules?: ISubjectSchedule[]
  color?: string
}

export type PlannedSubjectWithCurrentSchedules =
  | (IBasePlannedSubject & { currentSchedules: ISubjectSchedule[] })
  | (IPlannedSubject & { currentSchedules: ISubjectSchedule[] })
