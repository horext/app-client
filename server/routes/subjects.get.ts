import { ObjectId } from 'mongodb'
import { useMongoDB } from '../provider/mongodb.provider'

export default defineEventHandler(async (event) => {
  const { db } = await useMongoDB()
  const collection = db.collection('subjects')

  const subjects = await collection.find().toArray()

  return subjects.map((subject) => ({
    ...subject,
    _id: subject._id.toString(),
  }))
})
