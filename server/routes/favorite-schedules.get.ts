import { getMongoClient } from '../provider/mongodb.provider'

export default defineEventHandler(async (event) => {
  const client = await getMongoClient()
  const db = client.db()
  const collection = db.collection('favoriteSchedules')

  const favoriteSchedules = await collection.find().toArray()

  return {
    status: 'success',
    data: favoriteSchedules,
  }
})
