import { convertToDate } from '~/utils/weekday'

export default class Event {
  id?: string
  day: number
  startTime: string
  endTime: string

  title: string = ''
  description?: string
  location?: string
  color: string

  category?: string
  type: string

  constructor(
    day: number,
    startTime: string,
    endTime: string,
    title: string,
    description: string,
    location: string = '',
    color: string,
    category: string,
    type: string,
    id?: string
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
}
