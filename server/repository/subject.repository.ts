import { Collection, Db, ObjectId } from "mongodb";
import { ISubject } from "~/interfaces/subject";

export interface ISubjectRepository {
    findAll(): Promise<ISubject[]>
    create(subject: ISubject): Promise<ISubject>
    deleteById(id: string): Promise<void>
}

export class SubjectRepository implements ISubjectRepository {
    private collectionName = 'subjects'
    private collection: Collection<ISubject & { createdAt: Date, updatedAt: Date }>
    constructor(private client: Db) {
        this.collection = this.client.collection(this.collectionName)
    }

    findAll(): Promise<ISubject[]> {
        return this.collection.find().toArray()
    }
    async create(subject: ISubject): Promise<ISubject> {
        const result = await this.collection.insertOne({
            ...subject,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        return {
            ...subject,
        }
    }

    async deleteById(id: string): Promise<void> {
        const result = await this.collection.deleteOne({ _id: new ObjectId(id) })

        if (result.deletedCount === 0) {
            throw createError({
                message: 'Subject not found',
                status: 404
            })
        }
    }
}