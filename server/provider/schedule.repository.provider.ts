import { IScheduleRepository, ScheduleRepository } from "../repository/schedule.repository"
import { useMongoDB } from "./db.provider"
import type { H3Event } from "h3"
import type { EventHandlerRequest } from 'h3'
let scheduleRepositoryInstance: ScheduleRepository | null = null

export async function useScheduleRepository(event: H3Event<EventHandlerRequest>): Promise<IScheduleRepository> {
    if (scheduleRepositoryInstance) {
        return scheduleRepositoryInstance
    }
    const db = await useMongoDB(event)
    const scheduleRepository = new ScheduleRepository(db)
    scheduleRepositoryInstance = scheduleRepository
    return scheduleRepository
}