import type { Collection, Db } from 'mongodb'
import { ObjectId } from 'mongodb'
import type { ISubject as IBaseSubject } from '~/interfaces/subject'

export interface ISubject extends IBaseSubject {
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface ISubjectRepository {
  findAll(userId: string): Promise<ISubject[]>
  create(subject: IBaseSubject, userId: string): Promise<ISubject>
  deleteById(id: string, userId: string): Promise<boolean>
}

export class SubjectRepository implements ISubjectRepository {
  private collectionName = 'subjects'
  private collection: Collection<ISubject>
  constructor(private client: Pick<Db, 'collection'>) {
    this.collection = this.client.collection(this.collectionName)
  }

  findAll(userId: string): Promise<ISubject[]> {
    return this.collection.find({ userId }).toArray()
  }
  async create(subject: IBaseSubject, userId: string): Promise<ISubject> {
    const data = {
      ...subject,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await this.collection.insertOne(data)

    return data
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    const result = await this.collection.deleteOne({
      _id: new ObjectId(id),
      userId,
    })

    return result.deletedCount > 0 
  }
}
