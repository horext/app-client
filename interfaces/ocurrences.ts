import type Event from "~/model/Event"

export interface IOccurrence {
  type: string
  elementA: Event
  elementB: Event
}
