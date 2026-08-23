import type { IOrganizationReferenceResponse } from './organization'

export interface IAcademicPeriodResponse {
  id: number
}

export interface IAcademicPeriodOrganizationUnitResponse {
  id: number
  fromDate: string
  toDate: string
  academicPeriod: IAcademicPeriodResponse
  organizationUnit: IOrganizationReferenceResponse
}

export interface IHourlyLoadResponse {
  id: number
  name: string
  checkedAt: string
  updatedAt: string
  publishedAt: string
  academicPeriodOrganizationUnit: IAcademicPeriodOrganizationUnitResponse
}

export type IHourlyLoadReferenceResponse = Pick<IHourlyLoadResponse, 'id'>
