type WeekdaysResponse = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface ICourseResponse {
  id: string
  name: string
}

export interface ICourseTypeResponse {
  id: number
  name: string
  code: string
}

export interface IStudyPlanResponse {
  id: number
  fromDate: string
  code: string
  organizationUnit: {
    id: number
  }
}

export interface IClassroomResponse {
  id: number
  code: string
}

export interface ITeacherResponse {
  id: number
  fullName: string
}

export interface ISessionResponse {
  id: number
  schedule: {
    id: number
  }
  classroom: IClassroomResponse
  teacher: ITeacherResponse
  type: {
    id: number
    code: string
  }
  day: WeekdaysResponse
  startTime: string
  endTime: string
}

export interface ISubjectResponse {
  id: number
  course: ICourseResponse
  type: ICourseTypeResponse
  studyPlan: IStudyPlanResponse
  credits: number
  cycle: number | null
}

export interface IScheduleResponse {
  id: number
  section: {
    id: string
  }
  sessions: ISessionResponse[]
}

export interface ISubjectStudyPlanResponse extends ISubjectResponse {
  relationships: {
    subjectId: number
    relatedSubjectId: number
  }[]
}
