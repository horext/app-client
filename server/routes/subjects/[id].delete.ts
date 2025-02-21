import { ObjectId } from 'mongodb'
import { useMongoDB } from '../../provider/mongodb.provider'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
    const db = await useMongoDB(event)
  const collection = db.collection('subjects')

  const result = await collection.deleteOne({ _id: new ObjectId(id) })

  if (result.deletedCount === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Subject not found',
    })
  }

  return {
    message: 'Subject deleted successfully',
  }
})
