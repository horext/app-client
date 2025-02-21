import { z } from 'zod'
import { favoriteScheduleSchema } from '../../schemas/favorite-schedule.schema'
import { useMongoDB } from '../../provider/db.provider'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsedBody = favoriteScheduleSchema.parse(body)

  const db = await useMongoDB(event)
  const collection = db.collection('favoriteSchedules')

  await collection.insertOne(parsedBody)

  return {
    status: 'success',
    data: parsedBody,
  }
})
