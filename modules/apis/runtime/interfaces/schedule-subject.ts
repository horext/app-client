import type { ISubjectResponse, IScheduleResponse } from './subject'
import type { IHourlyLoadResponse } from './hourly-load'

export interface IScheduleSubjectResponse {
  id: number
  subject: Pick<ISubjectResponse, 'id'>
  hourlyLoad: Pick<IHourlyLoadResponse, 'id'>
  schedule: IScheduleResponse
}

export interface IScheduleSubjectDetailResponse extends IScheduleSubjectResponse {
  subject: ISubjectResponse
}
