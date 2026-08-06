import type { UUID } from 'crypto'
import type {
  IActivity,
  IActivitySession,
  IBaseActivity,
} from '~/interfaces/event'

export class ActivityForm {
  id?: UUID
  title: string
  description?: string
  location?: string
  color: string
  allowOverlap: boolean
  sessions: IActivitySession[]

  constructor(activity?: IActivity) {
    this.id = activity?.id
    this.title = activity?.title ?? ''
    this.description = activity?.description ?? ''
    this.location = activity?.location ?? ''
    this.color = activity?.color ?? '#1976d2'
    this.allowOverlap = activity?.allowOverlap ?? true
    this.sessions = activity?.sessions.length
      ? activity.sessions.map((session) => ({ ...session }))
      : [{ day: 1, startTime: '08:00', endTime: '10:00' }]
  }

  toCreateRequest(): IBaseActivity {
    return {
      title: this.title,
      description: this.description,
      location: this.location,
      color: this.color,
      allowOverlap: this.allowOverlap,
      sessions: this.sessions.map((session) => ({
        day: session.day,
        startTime: session.startTime,
        endTime: session.endTime,
      })),
    }
  }

  toUpdateRequest(): IBaseActivity & { id: UUID } {
    if (!this.id) throw new Error('Cannot update an activity without an id')
    return { id: this.id, ...this.toCreateRequest() }
  }
}
