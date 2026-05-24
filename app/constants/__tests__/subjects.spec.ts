import { describe, it, expect } from 'vitest'
import { SUBJECT_HEADERS } from '../subjects'

describe('SUBJECT_HEADERS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(SUBJECT_HEADERS)).toBe(true)
    expect(SUBJECT_HEADERS.length).toBeGreaterThan(0)
  })

  it('contains a course code column', () => {
    const values = SUBJECT_HEADERS.map((h) => h.value)
    expect(values).toContain('subject.course.id')
  })

  it('contains a course name column', () => {
    const values = SUBJECT_HEADERS.map((h) => h.value)
    expect(values).toContain('subject.course.name')
  })

  it('contains a sections column', () => {
    const values = SUBJECT_HEADERS.map((h) => h.value)
    expect(values).toContain('sections')
  })

  it('contains a credits column', () => {
    const values = SUBJECT_HEADERS.map((h) => h.value)
    expect(values).toContain('subject.credits')
  })

  it('contains an actions column', () => {
    const values = SUBJECT_HEADERS.map((h) => h.value)
    expect(values).toContain('actions')
  })

  it('each header has a title property', () => {
    for (const header of SUBJECT_HEADERS) {
      expect(typeof header.title).toBe('string')
    }
  })
})
