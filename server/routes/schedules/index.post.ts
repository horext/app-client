import { readBody } from 'h3'
import { useMongoDB } from '../../provider/db.provider'
import { scheduleSchema } from '../../schemas/schedule.schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsedBody = scheduleSchema.parse(body)
  const db = await useMongoDB(event)
  const collection = db.collection('schedules')

  const result = await collection.insertOne({
    ...parsedBody,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return {
    _id: result.insertedId,
    ...parsedBody,
  }
})
