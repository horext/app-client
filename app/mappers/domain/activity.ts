import type { Activity } from '~~/shared/domain'
import type { IActivity } from '~/interfaces/event'

export function toActivityDto(entity: Activity): IActivity {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    location: entity.location,
    color: entity.color,
    allowOverlap: entity.allowOverlap,
    sessions: structuredClone(entity.sessions),
  }
}
