import type { IEvent } from './event'

export interface IIntersectionOccurrence {
  id: string
  name: string
  type: string
  eventTarget: IEvent
  eventSource: IEvent
  category: string
}
