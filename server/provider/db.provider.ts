import type { Db} from 'mongodb';
import { MongoClient } from 'mongodb'
import { useRuntimeConfig } from '#imports'
import type { H3Event, EventHandlerRequest } from 'h3'
import { createLazySingleton } from './provider'

export const useMongoDB = createLazySingleton(
  async (event: H3Event<EventHandlerRequest>): Promise<Db> => {
    const { mongodb: dbConfig } = useRuntimeConfig(event)
    const client = new MongoClient(dbConfig.uri)
    await client.connect()
    return client.db(dbConfig.dbName)
  },
)
