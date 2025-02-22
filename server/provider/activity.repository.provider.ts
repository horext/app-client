import type { IActivityRepository } from '../repository/activity.repository'
import { ActivityRepository } from '../repository/activity.repository'
import { useMongoDB } from './db.provider'
import type { H3Event, EventHandlerRequest } from 'h3'
import { createLazySingleton } from './provider'

export const useActivityRepository = createLazySingleton(
  async (event: H3Event<EventHandlerRequest>): Promise<IActivityRepository> => {
    const db = await useMongoDB(event)
    const activityRepository = new ActivityRepository(db)
    return activityRepository
  },
)
