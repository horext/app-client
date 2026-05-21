import type { IOrganizationResponse } from './organization'

export interface IAcademicPeriodResponse {
  id: number
}

export interface IAcademicPeriodOrganizationUnitResponse {
  id: number
  fromDate: string
  toDate: string
  academicPeriod: Pick<IAcademicPeriodResponse, 'id'>
  organizationUnit: Pick<IOrganizationResponse, 'id'>
}

export interface IHourlyLoadResponse {
  id: number
  name: string
  checkedAt: string
  updatedAt: string
  publishedAt: string
  academicPeriodOrganizationUnit: IAcademicPeriodOrganizationUnitResponse
}
