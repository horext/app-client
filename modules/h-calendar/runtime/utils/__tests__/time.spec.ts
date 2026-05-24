import { describe, it, expect } from 'vitest'
import { timeToHours, formatedTimeToMinutes, formatTime } from '../time'

describe('timeToHours', () => {
  it('converts "08:00" to 8.0', () => {
    expect(timeToHours('08:00')).toBe(8)
  })

  it('converts "08:30" to 8.5', () => {
    expect(timeToHours('08:30')).toBe(8.5)
  })

  it('converts "00:00" to 0', () => {
    expect(timeToHours('00:00')).toBe(0)
  })

  it('converts "23:45" correctly', () => {
    expect(timeToHours('23:45')).toBe(23.75)
  })
})

describe('formatedTimeToMinutes', () => {
  it('converts "08:00" to 480 minutes', () => {
    expect(formatedTimeToMinutes('08:00')).toBe(480)
  })

  it('converts "00:30" to 30 minutes', () => {
    expect(formatedTimeToMinutes('00:30')).toBe(30)
  })

  it('converts "01:15" to 75 minutes', () => {
    expect(formatedTimeToMinutes('01:15')).toBe(75)
  })

  it('converts "00:00" to 0', () => {
    expect(formatedTimeToMinutes('00:00')).toBe(0)
  })
})

describe('formatTime', () => {
  it('formats 480 minutes to "08:00"', () => {
    expect(formatTime(480)).toBe('08:00')
  })

  it('formats 0 to "00:00"', () => {
    expect(formatTime(0)).toBe('00:00')
  })

  it('formats 90 minutes to "01:30"', () => {
    expect(formatTime(90)).toBe('01:30')
  })

  it('formats 75 minutes to "01:15"', () => {
    expect(formatTime(75)).toBe('01:15')
  })

  it('formats 1439 minutes to "23:59"', () => {
    expect(formatTime(1439)).toBe('23:59')
  })
})
