import { useMongoDB } from '../../provider/db.provider'

export default defineEventHandler(async (event) => {
  const db = await useMongoDB(event)
  const collection = db.collection('favoriteSchedules')

  const favoriteSchedules = await collection.find().toArray()

  return {
    status: 'success',
    data: favoriteSchedules,
  }
})
