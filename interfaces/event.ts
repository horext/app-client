export type EventCategories = 'COURSE' | 'MY_EVENT'
export interface IEvent {
  id?: string
  title: string
  day: number
  description?: string
  location?: string
  color: string
  category?: EventCategories
  type: string
  startTime: string
  endTime: string
}
