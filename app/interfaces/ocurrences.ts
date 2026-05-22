import type Event from "~/models/Event"

export interface IIntersectionOccurrence {
  id: string
  eventKey: string
  name: string
  type: string
  eventTarget: Event
  eventSource: Event
}
