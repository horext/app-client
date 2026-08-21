import type { IOrganizationReference } from './organization'

export interface IAcademicPeriod {
  id: number
  name: string
  code: string
}

export type IAcademicPeriodReference = Pick<IAcademicPeriod, 'id'>

export interface IAcademicPeriodOrganizationUnit {
  id: number
  fromDate: string
  toDate: string
  academicPeriod: IAcademicPeriodReference
  organizationUnit: IOrganizationReference
}

export interface IHourlyLoad {
  id: number
  name: string
  checkedAt: string
  updatedAt: string
  publishedAt: string
  academicPeriodOrganizationUnit: IAcademicPeriodOrganizationUnit
}

export type IHourlyLoadReference = Pick<IHourlyLoad, 'id'>
