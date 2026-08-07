import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { EventNotification, CalendarEvent } from '../google'
import { EVENT_COLORS } from '~/constants/event'
import type { IEvent } from '~/interfaces/event'

function makeEvent(overrides: Partial<IEvent> = {}): IEvent {
  return {
    id: '1',
    title: 'CS101 A - Intro to CS',
    day: 1,
    description: 'A lecture',
    location: 'B201',
    color: EVENT_COLORS[0]!,
    category: 'COURSE',
    type: 'THEORY',
    startTime: '08:00',
    endTime: '10:00',
    ...overrides,
  }
}

describe('EventNotification', () => {
  it('uses default values when constructed with no arguments', () => {
    const n = new EventNotification()
    expect(n.minutes).toBe(15)
    expect(n.method).toBe('popup')
  })

  it('accepts custom minutes and method', () => {
    const n = new EventNotification(30, 'email')
    expect(n.minutes).toBe(30)
    expect(n.method).toBe('email')
  })

  it('accepts only minutes, defaulting method to "popup"', () => {
    const n = new EventNotification(5)
    expect(n.minutes).toBe(5)
    expect(n.method).toBe('popup')
  })
})

describe('CalendarEvent', () => {
  const dateStart = '2024-03-04'
  const dateEnd = '2024-06-30'

  beforeEach(() => {
    vi.stubGlobal('crypto', {
      randomUUID: vi.fn(() => 'mock-uuid-1234'),
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sets iCalUID from crypto.randomUUID', () => {
    const event = new CalendarEvent(makeEvent(), [], dateStart, dateEnd)
    expect(event.iCalUID).toBe('Horext-mock-uuid-1234')
  })

  it('sets summary from event title', () => {
    const event = new CalendarEvent(
      makeEvent({ title: 'My Course' }),
      [],
      dateStart,
      dateEnd,
    )
    expect(event.summary).toBe('My Course')
  })

  it('sets description from event', () => {
    const event = new CalendarEvent(
      makeEvent({ description: 'Desc text' }),
      [],
      dateStart,
      dateEnd,
    )
    expect(event.description).toBe('Desc text')
  })

  it('sets location from event', () => {
    const event = new CalendarEvent(
      makeEvent({ location: 'Room 101' }),
      [],
      dateStart,
      dateEnd,
    )
    expect(event.location).toBe('Room 101')
  })

  it('assigns start and end dateTime in ISO format', () => {
    const event = new CalendarEvent(makeEvent(), [], dateStart, dateEnd)
    expect(event.start.dateTime).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    expect(event.end.dateTime).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('sets timeZone to America/Lima', () => {
    const event = new CalendarEvent(makeEvent(), [], dateStart, dateEnd)
    expect(event.start.timeZone).toBe('America/Lima')
    expect(event.end.timeZone).toBe('America/Lima')
  })

  it('creates weekly recurrence rule from dateEnd', () => {
    const event = new CalendarEvent(makeEvent(), [], dateStart, dateEnd)
    expect(event.recurrence[0]).toMatch(/^RRULE:FREQ=WEEKLY;UNTIL=/)
  })

  it('maps a known EVENT_COLORS index to colorId', () => {
    const color = EVENT_COLORS[2]! // index 2 → colorId "3"
    const event = new CalendarEvent(
      makeEvent({ color }),
      [],
      dateStart,
      dateEnd,
    )
    expect(event.colorId).toBe('3')
  })

  it('falls back to colorId "11" when color is not in EVENT_COLORS', () => {
    const event = new CalendarEvent(
      makeEvent({ color: '#unknown-color' }),
      [],
      dateStart,
      dateEnd,
    )
    // color not found → index -1 → fallback 10 → colorId = "11"
    expect(event.colorId).toBe('11')
  })

  it('assigns supplied notifications to reminders.overrides', () => {
    const notifications = [new EventNotification(10, 'popup')]
    const event = new CalendarEvent(
      makeEvent(),
      notifications,
      dateStart,
      dateEnd,
    )
    expect(event.reminders.overrides).toEqual(notifications)
  })

  it('reminders.useDefault is false', () => {
    const event = new CalendarEvent(makeEvent(), [], dateStart, dateEnd)
    expect(event.reminders.useDefault).toBe(false)
  })

  it('source points to Horext', () => {
    const event = new CalendarEvent(makeEvent(), [], dateStart, dateEnd)
    expect(event.source.title).toBe('Horext')
    expect(event.source.url).toBe('https://horext.octatec.io')
  })

  it('maps Sunday (day 0) to ISO weekday 7', () => {
    const event = new CalendarEvent(
      makeEvent({ day: 0, startTime: '08:00', endTime: '09:00' }),
      [],
      dateStart,
      dateEnd,
    )
    // dateTime should still be a valid ISO string
    expect(event.start.dateTime).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('handles long time format (HH:mm:ss) in startTime/endTime', () => {
    const event = new CalendarEvent(
      makeEvent({ startTime: '08:00:00', endTime: '10:00:00' }),
      [],
      dateStart,
      dateEnd,
    )
    expect(event.start.dateTime).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('toRequest returns a plain object copy of the event', () => {
    const calEvent = new CalendarEvent(makeEvent(), [], dateStart, dateEnd)
    const req = calEvent.toRequest()
    expect(req.summary).toBe(calEvent.summary)
    expect(req.start).toEqual(calEvent.start)
    expect(req.recurrence).toEqual(calEvent.recurrence)
  })
})
