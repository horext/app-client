import type { Collection, Db } from 'mongodb';
import { ObjectId } from 'mongodb'
import type { IScheduleGenerate } from '~/interfaces/schedule'

export type ScheduleCategory = 'GENARATED' | 'FAVORITE'

export interface IBaseSchedule extends IScheduleGenerate {
  categories: ScheduleCategory[]
}

export interface ISchedule extends IBaseSchedule {
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface IScheduleRepository {
  findAll(userId: string): Promise<ISchedule[]>
  findAllByCategory(
    category: ScheduleCategory,
    userId: string,
  ): Promise<ISchedule[]>
  create(schedule: IBaseSchedule, userId: string): Promise<ISchedule>
  partialUpdateById(
    id: string,
    schedule: Partial<IBaseSchedule>,
    userId: string,
  ): Promise<ISchedule>
  deleteById(id: string, userId: string): Promise<void>
}

export class ScheduleRepository implements IScheduleRepository {
  private collectionName = 'schedules'
  private collection: Collection<
    ISchedule
  >
  constructor(private client: Db) {
    this.collection = this.client.collection(this.collectionName)
  }

  findAll(): Promise<ISchedule[]> {
    return this.collection.find().toArray()
  }

  findAllByCategory(category: ScheduleCategory): Promise<ISchedule[]> {
    return this.collection.find({ categories: category }).toArray()
  }

  async create(schedule: IBaseSchedule, userId: string): Promise<ISchedule> {
    const data = {
      ...schedule,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId,
    }
    await this.collection.insertOne(data)
    return data
  }

  async deleteById(id: string, userId: string): Promise<void> {
    const result = await this.collection.deleteOne({
      _id: new ObjectId(id),
      userId,
    })

    if (result.deletedCount === 0) {
      throw createError({
        message: 'Schedule not found',
        status: 404,
      })
    }
  }

  async partialUpdateById(
    id: string,
    schedule: Partial<IBaseSchedule>,
    userId: string,
  ): Promise<ISchedule> {
    const result = await this.collection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
        userId: userId,
      },
      {
        $set: {
          ...schedule,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: 'after',
      },
    )

    if (!result) {
      throw createError({
        message: 'Schedule not found',
        status: 404,
      })
    }

    return result
  }
}
