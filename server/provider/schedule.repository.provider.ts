import { IScheduleRepository, ScheduleRepository } from "../repository/schedule.repository"
import { useMongoDB } from "./db.provider"
import type { H3Event } from "h3"
import type { EventHandlerRequest } from 'h3'
import { createLazySingleton } from "./provider"

export const useScheduleRepository = createLazySingleton(
    async (event: H3Event<EventHandlerRequest>): Promise<IScheduleRepository> => {
        const db = await useMongoDB(event)
        return  new ScheduleRepository(db)
    },
)