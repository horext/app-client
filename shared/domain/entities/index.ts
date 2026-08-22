import type { IHourlyLoad } from '../types/hourly-load'
import type { IIntersectionOccurrence } from '../types/occurrences'

export type GenerationOccurrences = IIntersectionOccurrence[]
export type AcademicLoad = IHourlyLoad

export * from './activity'
export * from './planned-subject'
export * from './generated-schedule'
export * from './generation'
export * from './profile'
export * from './preferences'
export * from './academic-config'
export * from './schedule-favorite'
