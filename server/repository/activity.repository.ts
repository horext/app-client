import type { Collection, Db } from 'mongodb'
import { ObjectId } from 'mongodb'
import type { IBaseEvent as IBaseActivity } from '~/interfaces/event'

export { IBaseActivity }

export interface IActivity extends IBaseActivity {
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface IActivityRepository {
  updateById(activityId: string, body: IBaseActivity, userId: string): Promise<IActivity | null>
  findAll(userId: string): Promise<IActivity[]>
  create(activity: IBaseActivity, userId: string): Promise<IActivity>
  deleteById(id: string, userId: string): Promise<boolean>
}

export class ActivityRepository implements IActivityRepository {
  private collectionName = 'activities'
  private collection: Collection<IActivity>
  constructor(private client: Pick<Db, 'collection'>) {
    this.collection = this.client.collection(this.collectionName)
  }


  findAll(userId: string): Promise<IActivity[]> {
    return this.collection.find({ userId }).toArray()
  }

  async create(activity: IBaseActivity, userId: string): Promise<IActivity> {
    const data = {
      ...activity,
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

  updateById(activityId: string, body: IBaseActivity, userId: string): Promise<IActivity | null> {
    const data = {
      ...body,
      updatedAt: new Date(),
    }

    return this.collection.findOneAndUpdate(
      {
        _id: new ObjectId(activityId),
        userId,
      },
      { $set: data },
      { returnDocument: 'after' },
    )

  }
}
