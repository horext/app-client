import { describe, it, expect } from 'vitest'
import {
  DATE_FORMAT,
  DATE_TIME_FORMAT_SHORT,
  DATE_TIME_FORMAT_LONG,
} from '../date'

describe('date constants', () => {
  it('DATE_FORMAT is "yyyy-MM-dd"', () => {
    expect(DATE_FORMAT).toBe('yyyy-MM-dd')
  })

  it('DATE_TIME_FORMAT_SHORT combines date format with HH:mm', () => {
    expect(DATE_TIME_FORMAT_SHORT).toBe('yyyy-MM-dd HH:mm')
  })

  it('DATE_TIME_FORMAT_LONG combines date format with HH:mm:ss', () => {
    expect(DATE_TIME_FORMAT_LONG).toBe('yyyy-MM-dd HH:mm:ss')
  })

  it('DATE_TIME_FORMAT_LONG is longer than DATE_TIME_FORMAT_SHORT', () => {
    expect(DATE_TIME_FORMAT_LONG.length).toBeGreaterThan(
      DATE_TIME_FORMAT_SHORT.length,
    )
  })
})
