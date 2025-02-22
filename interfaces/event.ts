export type EventCategories = 'COURSE' | 'MY_EVENT'
export type Weekdays = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface IBaseEvent {
  id?: string
  title: string
  day: Weekdays
  description?: string
  location?: string
  color: string
  startTime: string
  endTime: string
}

export interface IEvent extends IBaseEvent {
  category?: EventCategories
  type: string
}
