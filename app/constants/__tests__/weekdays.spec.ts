import { describe, it, expect } from 'vitest'
import { WEEK_DAYS_NAMES, DEFAULT_CALENDAR_WEEK_DAYS } from '../weekdays'

describe('WEEK_DAYS_NAMES', () => {
  it('has 7 entries', () => {
    expect(WEEK_DAYS_NAMES.length).toBe(7)
  })

  it('starts with "Domingo" (index 0)', () => {
    expect(WEEK_DAYS_NAMES[0]).toBe('Domingo')
  })

  it('has "Lunes" at index 1', () => {
    expect(WEEK_DAYS_NAMES[1]).toBe('Lunes')
  })

  it('has "Martes" at index 2', () => {
    expect(WEEK_DAYS_NAMES[2]).toBe('Martes')
  })

  it('has "Miércoles" at index 3', () => {
    expect(WEEK_DAYS_NAMES[3]).toBe('Miércoles')
  })

  it('has "Jueves" at index 4', () => {
    expect(WEEK_DAYS_NAMES[4]).toBe('Jueves')
  })

  it('has "Viernes" at index 5', () => {
    expect(WEEK_DAYS_NAMES[5]).toBe('Viernes')
  })

  it('ends with "Sábado" (index 6)', () => {
    expect(WEEK_DAYS_NAMES[6]).toBe('Sábado')
  })
})

describe('DEFAULT_CALENDAR_WEEK_DAYS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(DEFAULT_CALENDAR_WEEK_DAYS)).toBe(true)
    expect(DEFAULT_CALENDAR_WEEK_DAYS.length).toBeGreaterThan(0)
  })

  it('contains Monday through Saturday (1-6)', () => {
    expect(DEFAULT_CALENDAR_WEEK_DAYS).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('does not include Sunday (0)', () => {
    expect(DEFAULT_CALENDAR_WEEK_DAYS).not.toContain(0)
  })
})
