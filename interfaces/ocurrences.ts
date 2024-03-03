import type { IEvent } from './event'

export interface IOccurrence {
  type: string
  elementA: IEvent
  elementB: IEvent
}
