import { MongoClient, Db } from 'mongodb'
import { useRuntimeConfig } from '#imports'

let cachedDb: Db | null = null

export async function useMongoDB() {
  if (cachedDb) {
    return { db: cachedDb }
  }

  const config = useRuntimeConfig()
  const client = new MongoClient(config.mongodb.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  await client.connect()
  const db = client.db(config.mongodb.dbName)
  cachedDb = db

  return { db }
}
