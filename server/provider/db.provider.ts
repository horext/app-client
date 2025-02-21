import { MongoClient, Db } from 'mongodb'
import { useRuntimeConfig } from '#imports'
import type { H3Event, EventHandlerRequest } from 'h3'

let dbInstance: Db | null = null

export async function useMongoDB(event: H3Event<EventHandlerRequest>): Promise<Db> {
  if (dbInstance) {
    return dbInstance
  }
  const config = useRuntimeConfig(event)
  const client = new MongoClient(config.mongodb.uri)
  const clientConnected = await client.connect()
  const db = clientConnected.db(config.mongodb.dbName)
  dbInstance = db
  return db
}
