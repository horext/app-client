import { z } from 'zod'
import { favoriteScheduleSchema } from '../schemas/favorite-schedule.schema'
import { getMongoClient } from '../provider/mongodb.provider'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsedBody = favoriteScheduleSchema.parse(body)

  const client = await getMongoClient()
  const db = client.db()
  const collection = db.collection('favoriteSchedules')

  await collection.insertOne(parsedBody)

  return {
    status: 'success',
    data: parsedBody,
  }
})
