import type { IEvent } from "./event"

export interface IBaseIntersectionOccurrence {
  id: string
  eventKey: string
  name: string
  type: string
  eventTarget: IEvent
  eventSource: IEvent
}

export interface IIntersectionOccurrence extends IBaseIntersectionOccurrence {
  eventTarget: IEvent
  eventSource: IEvent
}
