import { ObjectId } from 'mongodb'
import { useMongoDB } from '../provider/mongodb.provider'

export default defineEventHandler(async (event) => {
  const { db } = await useMongoDB()
  const collection = db.collection('schedules')

  const schedules = await collection.find().toArray()

  return schedules.map((schedule) => ({
    ...schedule,
    _id: schedule._id.toString(),
  }))
})
