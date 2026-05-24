import { describe, it, expect } from 'vitest'
import { ViewMode } from '../ViewMode'

describe('ViewMode', () => {
  it('CALENDAR has value "calendar"', () => {
    expect(ViewMode.CALENDAR).toBe('calendar')
  })

  it('LIST has value "list"', () => {
    expect(ViewMode.LIST).toBe('list')
  })

  it('CALENDAR and LIST are distinct values', () => {
    expect(ViewMode.CALENDAR).not.toBe(ViewMode.LIST)
  })
})
