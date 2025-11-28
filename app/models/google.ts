import { DateTime } from 'luxon'
import { v4 } from 'uuid'
import { EVENT_COLORS } from '~/constants/event'
import type { IEvent } from '~/interfaces/event'

export class EventNotification {
  method: 'popup' | 'email'
  minutes: number
  constructor(minutes: number = 15, method: 'popup' | 'email' = 'popup') {
    this.method = method
    this.minutes = minutes
  }
}

export class CalendarEvent {
  iCalUID = 'Horext-' + v4()
  summary: string
  description?: string
  location?: string
  start: { dateTime: string; timeZone: string }
  end: { dateTime: string; timeZone: string }
  recurrence: string[]
  colorId: string
  source = {
    title: 'Horext',
    url: 'https://horext.octatec.io',
  }
  reminders: { useDefault: boolean; overrides: EventNotification[] } = {
    useDefault: false,
    overrides: [],
  }
  constructor(
    event: IEvent,
    notifications: EventNotification[],
    dateStart: string,
    dateEnd: string,
  ) {
    this.summary = event.title
    this.description = event.description
    this.location = event.location
    const format =
      event.startTime.length > 5 ? 'yyyy-MM-dd hh:mm:ss' : 'yyyy-MM-dd hh:mm'
    this.start = {
      dateTime: DateTime.fromFormat(dateStart + ' ' + event.startTime, format)
        .set({ weekday: event.day === 0 ? 7 : event.day })
        .toISO()!,
      timeZone: 'America/Lima',
    }

    this.end = {
      dateTime: DateTime.fromFormat(dateStart + ' ' + event.endTime, format)
        .set({ weekday: event.day === 0 ? 7 : event.day })
        .toISO()!,
      timeZone: 'America/Lima',
    }

    this.recurrence = [
      'RRULE:FREQ=WEEKLY;UNTIL=' +
        new Date(dateEnd).toISOString().substring(0, 10).split('-').join('') +
        'T000000Z',
    ]
    let color = EVENT_COLORS.findIndex((color) => event.color === color)
    if (color === -1) {
      color = 10
    }
    this.colorId = Number(color + 1).toString()
    this.reminders.overrides = notifications
  }

  toRequest() {
    return {
      ...this,
    }
  }
}
