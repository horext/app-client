import { ObjectId } from 'mongodb'
import { useMongoDB } from '../../provider/db.provider'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const db = await useMongoDB(event)
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
