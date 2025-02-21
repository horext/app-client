import { ISubjectRepository, SubjectRepository } from "../repository/subject.repository"
import { useMongoDB } from "./db.provider"
import type { H3Event } from "h3"
import type { EventHandlerRequest } from 'h3'
let subjectRepositoryInstance: SubjectRepository | null = null

export async function useSubjectRepository(event: H3Event<EventHandlerRequest>): Promise<ISubjectRepository> {
    if (subjectRepositoryInstance) {
        return subjectRepositoryInstance
    }
    const db = await useMongoDB(event)
    const subjectRepository = new SubjectRepository(db)
    subjectRepositoryInstance = subjectRepository
    return subjectRepository
}