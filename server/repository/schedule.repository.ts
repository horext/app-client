import { Collection, Db, ObjectId } from "mongodb";
import { IScheduleGenerate } from "~/interfaces/schedule";

export type ScheduleCategory = 'GENARATED' | 'FAVORITE'

export interface ISchedule extends IScheduleGenerate {
    categories: ScheduleCategory[]
}

export interface IScheduleRepository {
    findAll(): Promise<ISchedule[]>
    findAllByCategory(category: ScheduleCategory): Promise<ISchedule[]>
    create(schedule: ISchedule): Promise<ISchedule>
    deleteById(id: string): Promise<void>
}

export class ScheduleRepository implements IScheduleRepository {
    private collectionName = 'schedules'
    private collection: Collection<ISchedule & { createdAt: Date, updatedAt: Date }>
    constructor(private client: Db) {
        this.collection = this.client.collection(this.collectionName)
    }

    findAll(): Promise<ISchedule[]> {
        return this.collection.find().toArray()
    }

    findAllByCategory(category: ScheduleCategory): Promise<ISchedule[]> {
        return this.collection.find({ categories: category }).toArray()
    }

    async create(schedule: ISchedule): Promise<ISchedule> {
        const result = await this.collection.insertOne({
            ...schedule,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        return {
            ...schedule,
        }
    }

    async deleteById(id: string): Promise<void> {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            throw createError({
                message: 'Schedule not found',
                status: 404
            })
        }
    }
}