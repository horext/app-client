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
    category: EventCategories = 'MY_EVENT',
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
  constructor(
    day: Weekdays = 1,
    startTime = '08:00',
    endTime = '10:00',
    title = '',
    description = '',
    location = '',
    color = '#1976d2',
    id?: string,
  ) {
    super(
      day,
      startTime,
      endTime,
      title,
      description,
      location,
      color,
      'MY_EVENT',
      'MY_EVENT',
      id,
    )
  }

  buildFrom(event: IEvent) {
    return new Activity(
      event.day,
      event.startTime,
      event.endTime,
      event.title,
      event.description,
      event.location,
      event.color,
      event.id || v4(),
    )
  }
}
