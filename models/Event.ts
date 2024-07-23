import { v4 } from 'uuid'
import type { EventCategories, IEvent, Weekdays } from '~/interfaces/event'
import { convertToDate } from '~/utils/weekday'

export default class Event {
  id: string
  day: Weekdays
  startTime: string
  endTime: string

  title: string = ''
  description?: string
  location?: string
  color: string

  category?: EventCategories
  type: string

  constructor(
    day: Weekdays,
    startTime: string,
    endTime: string,
    title: string,
    description: string = '',
    location: string = '',
    color: string,
    type: string,
    category?: EventCategories,
    id: string = v4(),
  ) {
    this.day = day
    this.startTime = startTime
    this.endTime = endTime
    this.title = title
    this.description = description
    this.location = location
    this.color = color
    this.category = category
    this.type = type
    this.id = id
  }

  get start() {
    return convertToDate(this.day, this.startTime)
  }

  get end() {
    return convertToDate(this.day, this.endTime)
  }

  static buildFrom(event: IEvent) {
    return new Event(
      event.day,
      event.startTime,
      event.endTime,
      event.title,
      event.description,
      event.location,
      event.color,
      event.type,
      event.category,
      event.id,
    )
  }
}

export class Activity extends Event {
  constructor() {
    super(1, '08:00', '10:00', '', '', '', '#1976d2', 'MY_EVENT')
  }
}
