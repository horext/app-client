export interface ICourse {
  id: string;
  name: string;
}

export interface ICourseType {
  id: number;
  name: string;
  code: string;
}

export interface IStudyPlan {
  id: number;
  fromDate: string;
  code: string;
  organizationUnit: {
    id: number;
  };
}

export interface IScheduleSubject {
  id: number;
}

export interface IClassroom {
  id: number;
  code: string;
}

export interface ITeacher {
  id: number;
  fullName: string;
}

export interface ISession {
  id: number;
  schedule: {
    id: number;
  };
  classroom: IClassroom;
  teacher: ITeacher;
  type: {
    id: number;
    code: string;
  };
  day: number;
  startTime: string;
  endTime: string;
}

export interface ISubjectSchedule {
  id: number;
  section: {
    id: string;
  };
  scheduleSubject: IScheduleSubject;
  sessions: ISession[];
}

export interface ISubject {
  id: number;
  course: ICourse;
  type: ICourseType;
  studyPlan: IStudyPlan;
  credits: number;
  cycle: number;
  schedules: ISubjectSchedule[];
}
