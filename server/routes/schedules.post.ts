import { z } from 'zod'
import { ObjectId } from 'mongodb'
import { useMongoDB } from '../provider/mongodb.provider'
import { scheduleSchema } from '../schemas/schedule.schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsedBody = scheduleSchema.parse(body)

  const { db } = await useMongoDB()
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
