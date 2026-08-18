import type { BrandUUID } from './ids'
import type { ISubject, ISubjectSchedule } from './subject'

export type LocalHourlyLoadId = BrandUUID<'LocalHourlyLoadId'>

export interface IImportWarning {
  row: number
  message: string
}

export interface ILocalHourlyLoadDataset {
  id: LocalHourlyLoadId
  name: string
  importedAt: string
  sourceFileName: string
  facultyId: number
  specialityId: number
  subjects: ISubject[]
  schedulesBySubject: Record<string, ISubjectSchedule[]>
  sessionCount: number
  rejectedRowCount: number
  warnings: IImportWarning[]
}

export type ILocalHourlyLoadDraft = Omit<
  ILocalHourlyLoadDataset,
  'facultyId' | 'specialityId'
>

export interface ILocalHourlyLoadSummary {
  id: LocalHourlyLoadId
  name: string
  sourceFileName: string
  importedAt: string
  subjectCount: number
  sectionCount: number
  sessionCount: number
  rejectedRowCount: number
}
