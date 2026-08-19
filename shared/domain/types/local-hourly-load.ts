import type { BrandUUID } from './ids'
import type { ISubject, ISubjectSchedule } from './subject'

export type LocalHourlyLoadId = BrandUUID<'LocalHourlyLoadId'>

export interface IImportWarning {
  row: number
  message: string
  courseCode?: string
  courseName?: string
  section?: string
  day?: string
  startTime?: string
  endTime?: string
}

export interface ILocalHourlyLoadDataset {
  id: LocalHourlyLoadId
  name: string
  importedAt: string
  sourceFileName: string
  subjects: ISubject[]
  schedulesBySubject: Record<string, ISubjectSchedule[]>
  sessionCount: number
  rejectedRowCount: number
  warnings: IImportWarning[]
}

export type ILocalHourlyLoadDraft = ILocalHourlyLoadDataset

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
