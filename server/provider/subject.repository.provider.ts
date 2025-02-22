import { ISubjectRepository, SubjectRepository } from "../repository/subject.repository"
import { useMongoDB } from "./db.provider"
import type { H3Event } from "h3"
import type { EventHandlerRequest } from 'h3'
import { createLazySingleton } from "./provider"

export const useSubjectRepository = createLazySingleton(
    async (event: H3Event<EventHandlerRequest>): Promise<ISubjectRepository> => {
        const db = await useMongoDB(event)
        const subjectRepository = new SubjectRepository(db)
        return subjectRepository
    }
)