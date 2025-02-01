import { ObjectId } from 'mongodb'
import { useMongoDB } from '../provider/mongodb.provider'

export default defineEventHandler(async (event) => {
  const { id } = event.context.params
  const { db } = await useMongoDB()
  const collection = db.collection('schedules')

  const result = await collection.deleteOne({ _id: new ObjectId(id) })

  if (result.deletedCount === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Schedule not found',
    })
  }

  return {
    message: 'Schedule deleted successfully',
  }
})
