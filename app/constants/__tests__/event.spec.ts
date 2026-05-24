import { describe, it, expect } from 'vitest'
import { EVENT_COLORS, EVENT_HEADERS } from '../event'

describe('EVENT_COLORS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(EVENT_COLORS)).toBe(true)
    expect(EVENT_COLORS.length).toBeGreaterThan(0)
  })

  it('contains only string values', () => {
    for (const color of EVENT_COLORS) {
      expect(typeof color).toBe('string')
    }
  })

  it('contains "indigo" as the first color', () => {
    expect(EVENT_COLORS[0]).toBe('indigo')
  })
})

describe('EVENT_HEADERS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(EVENT_HEADERS)).toBe(true)
    expect(EVENT_HEADERS.length).toBeGreaterThan(0)
  })

  it('contains a "color" column', () => {
    const values = EVENT_HEADERS.map((h) => h.value)
    expect(values).toContain('color')
  })

  it('contains a "title" column', () => {
    const values = EVENT_HEADERS.map((h) => h.value)
    expect(values).toContain('title')
  })

  it('contains an "actions" column', () => {
    const values = EVENT_HEADERS.map((h) => h.value)
    expect(values).toContain('actions')
  })

  it('each header has a title property', () => {
    for (const header of EVENT_HEADERS) {
      expect(typeof header.title).toBe('string')
    }
  })
})
