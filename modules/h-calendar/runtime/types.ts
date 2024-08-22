import type { Weekdays } from "./constants/week"

export interface ICalendarEvent {
  id: string
  weekDay: Weekdays
  start: string
  end: string
  name: string
}

export interface IEventEmitData<T extends ICalendarEvent> {
  event: T
  nativeEvent: MouseEvent
}

export type MouseEventTypes =
  | 'click'
  | 'dblclick'
  | 'mouseenter'
  | 'mouseleave'
  | 'mousemove'
  | 'mouseover'
  | 'mouseout'
  | 'mouseup'
  | 'mousedown'
