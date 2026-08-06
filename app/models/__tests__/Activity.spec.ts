import { describe, expect, it } from 'vitest'
import { isProxy, reactive } from 'vue'
import { ActivityForm } from '../Activity'
import type { IActivity } from '~/interfaces/event'

describe('ActivityForm requests', () => {
  it('creates a structured-cloneable request from reactive sessions', () => {
    const form = reactive(new ActivityForm())
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

    expect(new ActivityForm(activity).toUpdateRequest().id).toBe(activity.id)
  })
})
