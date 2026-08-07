import { describe, it, expect } from 'vitest'
import {
  weekdayToDatetime,
  weekdayToDate,
  getWeekdayName,
  getWeekdayISONames,
} from '../weekday'

describe('weekdayToDatetime', () => {
  it('returns a formatted datetime string for a non-Sunday weekday', () => {
    const result = weekdayToDatetime(1, '08:00')
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
  })

  it('returns the correct time portion for the given time string', () => {
    const result = weekdayToDatetime(3, '14:30')
    expect(result).toMatch(/14:30$/)
  })

  it('maps weekday 0 (Sunday) to ISO weekday 7', () => {
    const sunday = weekdayToDatetime(0, '10:00')
    const explicit7 = weekdayToDatetime(0, '10:00')
    expect(sunday).toBe(explicit7)
    expect(sunday).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)
  })

  it('maps each non-zero weekday to a distinct calendar day', () => {
    const monday = weekdayToDatetime(1, '09:00')
    const friday = weekdayToDatetime(5, '09:00')
    expect(monday).not.toBe(friday)
  })
})

describe('weekdayToDate', () => {
  it('returns a date string in yyyy-MM-dd format for weekday 1', () => {
    const result = weekdayToDate(1)
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('returns a date string for weekday 0 (Sunday treated as 7)', () => {
    const result = weekdayToDate(0)
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('returns different dates for different weekdays', () => {
    const monday = weekdayToDate(1)
    const friday = weekdayToDate(5)
    expect(monday).not.toBe(friday)
  })
})

describe('getWeekdayName', () => {
  it('returns "Domingo" for weekday 0', () => {
    expect(getWeekdayName(0)).toBe('Domingo')
  })

  it('returns "Lunes" for weekday 1', () => {
    expect(getWeekdayName(1)).toBe('Lunes')
  })

  it('returns "Martes" for weekday 2', () => {
    expect(getWeekdayName(2)).toBe('Martes')
  })

  it('returns "Miércoles" for weekday 3', () => {
    expect(getWeekdayName(3)).toBe('Miércoles')
  })

  it('returns "Jueves" for weekday 4', () => {
    expect(getWeekdayName(4)).toBe('Jueves')
  })

  it('returns "Viernes" for weekday 5', () => {
    expect(getWeekdayName(5)).toBe('Viernes')
  })

  it('returns "Sábado" for weekday 6', () => {
    expect(getWeekdayName(6)).toBe('Sábado')
  })
})

describe('getWeekdayISONames', () => {
  it('returns "Lunes" for ISO weekday 1', () => {
    expect(getWeekdayISONames(1)).toBe('Lunes')
  })

  it('returns "Martes" for ISO weekday 2', () => {
    expect(getWeekdayISONames(2)).toBe('Martes')
  })

  it('returns "Miércoles" for ISO weekday 3', () => {
    expect(getWeekdayISONames(3)).toBe('Miércoles')
  })

  it('returns "Jueves" for ISO weekday 4', () => {
    expect(getWeekdayISONames(4)).toBe('Jueves')
  })

  it('returns "Viernes" for ISO weekday 5', () => {
    expect(getWeekdayISONames(5)).toBe('Viernes')
  })

  it('returns "Sábado" for ISO weekday 6', () => {
    expect(getWeekdayISONames(6)).toBe('Sábado')
  })

  it('returns "Domingo" for ISO weekday 7 (7 % 7 = 0)', () => {
    expect(getWeekdayISONames(7)).toBe('Domingo')
  })
})
