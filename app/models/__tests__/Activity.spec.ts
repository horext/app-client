import { describe, expect, it } from 'vitest'
import { isProxy, reactive } from 'vue'
import { Activity } from '../Activity'
import { ActivitySessionEvent } from '../Event'
import type { IActivity } from '~/interfaces/event'

describe('Activity requests', () => {
  it('creates a structured-cloneable request from reactive sessions', () => {
    const form = reactive(new Activity())
    form.title = 'Study'
    form.sessions.push({ day: 3, startTime: '14:00', endTime: '16:00' })

    const request = form.toCreateRequest()

    expect(isProxy(request)).toBe(false)
    expect(isProxy(request.sessions)).toBe(false)
    expect(isProxy(request.sessions[0])).toBe(false)
    expect(() => structuredClone(request)).not.toThrow()
  })

  it('includes the activity id in an update request', () => {
    const activity = {
      id: crypto.randomUUID(),
      title: 'Study',
      color: '#1976d2',
      sessions: [{ day: 1, startTime: '08:00', endTime: '10:00' }],
      category: 'MY_EVENT',
      type: 'MY_EVENT',
    } satisfies IActivity

    expect(new Activity(activity).toUpdateRequest().id).toBe(activity.id)
  })

  it('generates a distinct UUID event for every session', () => {
    const activity = {
      id: crypto.randomUUID(),
      title: 'Study',
      color: '#1976d2',
      sessions: [
        { day: 1, startTime: '08:00', endTime: '10:00' },
        { day: 3, startTime: '14:00', endTime: '16:00' },
      ],
      category: 'MY_EVENT',
      type: 'MY_EVENT',
    } satisfies IActivity

    const events = ActivitySessionEvent.buildActivitiesFrom(activity)
    const ids = events.map((event) => event.id)

    expect(ids).toHaveLength(2)
    expect(new Set(ids).size).toBe(2)
    expect(ids.every((id) => /^[0-9a-f-]{36}$/.test(id))).toBe(true)
  })
})
