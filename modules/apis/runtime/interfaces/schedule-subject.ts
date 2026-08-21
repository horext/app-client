import type {
  IScheduleResponse,
  ISubjectReferenceResponse,
  ISubjectResponse,
} from './subject'
import type { IHourlyLoadReferenceResponse } from './hourly-load'

export interface IScheduleSubjectResponse {
  id: number
  subject: ISubjectReferenceResponse
  hourlyLoad: IHourlyLoadReferenceResponse
  schedule: IScheduleResponse
}

export interface IScheduleSubjectDetailResponse extends IScheduleSubjectResponse {
  subject: ISubjectResponse
}
