import type { IBaseEvent } from "~~/modules/schedules-storage/runtime/shared/interfaces/event"
import type { IEvent } from "./event"

export interface IBaseIntersectionOccurrence {
  id: string
  eventKey: string
  name: string
  type: string
  eventTarget: IBaseEvent
  eventSource: IBaseEvent
}

export interface IIntersectionOccurrence extends IBaseIntersectionOccurrence {
  eventTarget: IEvent
  eventSource: IEvent
}
