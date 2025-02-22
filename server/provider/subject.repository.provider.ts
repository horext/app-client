import type {
  ISubjectRepository} from '../repository/subject.repository';
import {
  SubjectRepository,
} from '../repository/subject.repository'
import { useMongoDB } from './db.provider'
import type { H3Event, EventHandlerRequest  } from 'h3'
import { createLazySingleton } from './provider'

export const useSubjectRepository = createLazySingleton(
  async (event: H3Event<EventHandlerRequest>): Promise<ISubjectRepository> => {
    const db = await useMongoDB(event)
    return new SubjectRepository(db)
  },
)
