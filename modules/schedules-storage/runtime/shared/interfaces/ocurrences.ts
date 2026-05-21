import type { IBaseEvent } from './event'

export interface IIntersectionOccurrence {
  id: string
  name: string
  type: string
  eventTarget: IBaseEvent
  eventSource: IBaseEvent
}
