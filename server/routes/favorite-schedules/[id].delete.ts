import { useMongoDB } from '../../provider/mongodb.provider'

export default defineEventHandler(async (event) => {
  const id =  getRouterParams(event).id
  const db = await useMongoDB(event)
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
