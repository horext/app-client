import { ISubject, ISubjectSchedule } from './subject'

export interface IScheduleSubject {
  id: number;
  subject: Pick<ISubject, 'id'>;
  hourlyLoad: {
    id: number;
  };
  schedule: Pick<ISubjectSchedule, 'id' | 'section'>;
}
