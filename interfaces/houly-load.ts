import { IOrganization } from './organization'

export interface IAcademicPeriod {
  id: number
  name: string
  code: string
}

export interface IAcademicPeriodOrganizationUnit {
  id: number
  fromDate: string
  toDate: string
  academicPeriod: Pick<IAcademicPeriod, 'id'>
  organizationUnit: Pick<IOrganization, 'id'>
}

export interface IHourlyLoad {
  id: number
  name: string
  checkedAt: string
  updatedAt: string
  publishedAt: string
  academicPeriodOrganizationUnit: IAcademicPeriodOrganizationUnit
}
