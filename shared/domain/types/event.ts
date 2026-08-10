import type { UUID } from 'crypto'
import type { IAuditable } from './entity-metadata'
import type { ReplicatedIdentity } from './replicated-identity'
import { DomainError } from '../errors/domain-error'

export type EventCategories = 'COURSE' | 'MY_EVENT'
export type Weekdays = 0 | 1 | 2 | 3 | 4 | 5 | 6
export interface IActivitySession {
  day: Weekdays
  startTime: string
  endTime: string
}
export interface IBaseEvent {
  title: string
  day: Weekdays
  description?: string
  location?: string
  color: string
  category?: EventCategories
  type: string
  startTime: string
  endTime: string
}

export interface IEvent extends IBaseEvent {
  id: string
}

export interface IBaseActivity {
  externalId?: UUID
  revision?: number
  title: string
  description?: string
  location?: string
  color: string
  allowOverlap?: boolean
  sessions: IActivitySession[]
}

export interface IActivity
  extends IBaseActivity, IAuditable, ReplicatedIdentity {}

export type IActivityCreate = IBaseActivity
export type IActivityUpdate = Partial<IActivityCreate>

export function validateSessions(
  sessions: IActivitySession[],
): IActivitySession[] {
  return sessions.map((session, index) => {
    if (session.startTime >= session.endTime)
      throw new DomainError(
        'invalid-time-range',
        'The session start time must be before its end time.',
        `sessions.${index}`,
      )
    return { ...session }
  })
}
