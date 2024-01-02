export interface ICalendarEvent {
  id: string
  weekDay: number
  start: string
  end: string
  name: string
}

export interface IEventEmitData<T extends ICalendarEvent> {
  event: T
  nativeEvent: MouseEvent
}
