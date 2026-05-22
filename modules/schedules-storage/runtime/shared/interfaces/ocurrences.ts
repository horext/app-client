import type { IBaseEvent, IEvent } from './event'

export interface IBaseIntersectionOccurrence {
  eventKey: string
  name: string
  type: string
  eventTarget: IBaseEvent
  eventSource: IBaseEvent
}

export interface IIntersectionOccurrence extends IBaseIntersectionOccurrence {
  id: string
  eventTarget: IEvent,
  eventSource: IEvent,
}
