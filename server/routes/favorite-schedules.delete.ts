import { z } from 'zod'
import { getMongoClient } from '../provider/mongodb.provider'

export default defineEventHandler(async (event) => {
  const id = event.context.params.id
  const client = await getMongoClient()
  const db = client.db()
  const collection = db.collection('favoriteSchedules')

  const result = await collection.deleteOne({ id })

  if (result.deletedCount === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Favorite schedule not found',
    })
  }

  return {
    status: 'success',
    message: 'Favorite schedule deleted successfully',
  }
})
