export type EventCategories = 'COURSE' | 'MY_EVENT'
export type Weekdays = 0 | 1 | 2 | 3 | 4 | 5 | 6
export interface IEvent {
  id?: string
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
