import type { UUID } from 'crypto'
import type { IActivitySession } from '~~/shared/domain/types/event'

export type {
  EventCategories,
  IActivitySession,
  IEvent,
  Weekdays,
} from '~~/shared/domain/types/event'

export interface IBaseActivity {
  title: string
  description?: string
  location?: string
  color: string
  allowOverlap?: boolean
  sessions: IActivitySession[]
}

export interface IActivity extends IBaseActivity {
  id: UUID
}
