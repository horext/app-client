import type { IEvent } from './event'

export interface IIntersectionOccurrence {
  type: string
  elementA: IEvent
  elementB: IEvent
}
