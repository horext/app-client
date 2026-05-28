import type { UUID } from 'crypto'

export type EventCategories = 'COURSE' | 'MY_EVENT'
export type Weekdays = 0 | 1 | 2 | 3 | 4 | 5 | 6
export interface IBaseEvent {
  title: string
  day: Weekdays
  description?: string
  location?: string
  color: string
  category?: EventCategories
  type: string
  startTime: string
  endTime: string
}

export interface IEvent extends IBaseEvent {
  id: string
}

export interface IBaseActivity {
  title: string
  day: Weekdays
  description?: string
  location?: string
  color: string
  startTime: string
  endTime: string
}

export interface IActivity extends IEvent {
  id: UUID
  category: 'MY_EVENT'
  type: 'MY_EVENT'
  allowOverlap?: boolean
}
